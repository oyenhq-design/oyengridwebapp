import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // CORS Headers for API requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  try {
    const { customerEmail, planId, organizationId, callbackUrl, metadata } = req.body;

    if (!customerEmail || !planId) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "customerEmail and planId are required" }));
      return;
    }

    // Initialize Supabase Client (bypassing RLS with service role key if available)
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Validate the plan_id & retrieve details
    const { data: plan, error: planError } = await supabase
      .from("pricing_plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Plan not found" }));
      return;
    }

    // 2. Confirm the plan is active
    if (!plan.is_active || plan.status !== "published") {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Plan is currently inactive or not published" }));
      return;
    }

    // 3. Retrieve actual price & currency from database
    const planPrice = plan.monthly_price || plan.price;
    const planCurrency = plan.currency || "USD";

    // 4. Calculate amount in kobo/cents (multiply by 100 for Paystack unit constraints)
    const amountInLowestUnit = Math.round(Number(planPrice) * 100);

    // 5. Generate a unique transaction reference
    const txnRef = `TXN-${Math.floor(100000 + Math.random() * 900000)}-${Date.now()}`;

    // Helper to check if string is a valid UUID
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    
    const orgUUID = organizationId && isUUID(organizationId) ? organizationId : null;
    const orgCode = organizationId && !isUUID(organizationId) ? organizationId : null;

    // 6. Store pending transaction in payment_transactions
    const { data: txn, error: txnError } = await supabase
      .from("payment_transactions")
      .insert([{
        transaction_reference: txnRef,
        plan_id: planId,
        amount: planPrice,
        currency: planCurrency,
        gateway: "Paystack",
        status: "pending",
        organization_id: orgUUID,
        customer_id: null,
        metadata: {
          customer_email: customerEmail,
          organization_code: orgCode,
          ...(metadata || {})
        }
      }])
      .select();

    if (txnError) {
      console.warn("Supabase pending txn save failed (proceeding without local db record):", txnError.message);
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Failed to register transaction in database" }));
        return;
      }
    }

    // 7. Securely initialize Paystack transaction
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "PAYSTACK_SECRET_KEY environment variable is not configured" }));
      return;
    }

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecret}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: customerEmail,
        amount: amountInLowestUnit,
        currency: planCurrency,
        reference: txnRef,
        callback_url: callbackUrl,
        metadata: {
          plan_id: planId,
          transaction_reference: txnRef,
          organization_id: organizationId,
          customer_email: customerEmail,
          ...(metadata || {})
        }
      })
    });

    const paystackResult = await paystackResponse.json();

    if (paystackResponse.ok && paystackResult.status) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: true,
        authorization_url: paystackResult.data.authorization_url,
        access_code: paystackResult.data.access_code,
        reference: txnRef
      }));
    } else {
      // Mark transaction as failed
      await supabase
        .from("payment_transactions")
        .update({ status: "failed", failure_reason: paystackResult.message || "Paystack initialization failed" })
        .eq("transaction_reference", txnRef);

      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: paystackResult.message || "Paystack transaction initialization failed" }));
    }
  } catch (err) {
    console.error("Initialize transaction error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err.message }));
  }
}
