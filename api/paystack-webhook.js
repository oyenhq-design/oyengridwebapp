import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Helper to parse raw body for signature verification in serverless environments
async function getRawBody(req) {
  if (req.body && typeof req.body !== "string" && !Buffer.isBuffer(req.body)) {
    // Already parsed by Vercel bodyParser
    return JSON.stringify(req.body);
  }
  return req.body;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "PAYSTACK_SECRET_KEY is not configured" }));
      return;
    }

    const payload = await getRawBody(req);
    const signature = req.headers["x-paystack-signature"];

    if (!signature) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Signature header missing" }));
      return;
    }

    // Verify HMAC SHA512 signature
    const hash = crypto.createHmac("sha512", paystackSecret)
      .update(payload)
      .digest("hex");

    if (hash !== signature) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid signature verification failed" }));
      return;
    }

    // Parse event body
    const eventData = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const reference = eventData.data?.reference;

    if (!reference) {
      res.statusCode = 200; // Accept to avoid retries
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "No transaction reference in payload" }));
      return;
    }

    // Initialize Supabase Client (bypassing RLS with service role key if available)
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch matching transaction
    const { data: txn, error: txnFetchError } = await supabase
      .from("payment_transactions")
      .select("id, status")
      .eq("transaction_reference", reference)
      .single();

    if (txnFetchError || !txn) {
      console.warn(`No transaction found matching reference: ${reference}`);
      // Return 200 to acknowledge webhook event receipt
    }

    // 2. Check if transaction is already marked as successful (avoid duplicate processing)
    if (txn && txn.status === "successful") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: true, message: "Transaction already processed as successful" }));
      return;
    }

    // 3. Log event into payment_gateway_events table
    const { error: eventErr } = await supabase
      .from("payment_gateway_events")
      .insert([{
        transaction_id: txn ? txn.id : null,
        gateway: "Paystack",
        event_type: eventData.event,
        status: "processed",
        received_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
        payload: eventData
      }]);

    if (eventErr) {
      console.error("Failed to log payment event:", eventErr);
    }

    // 4. Update transaction status based on Paystack event
    if (eventData.event === "charge.success") {
      const channel = eventData.data?.channel || eventData.data?.authorization?.channel || "card";
      const gatewayTxId = eventData.data?.id ? String(eventData.data.id) : reference;

      const { error: updateError } = await supabase
        .from("payment_transactions")
        .update({
          status: "successful",
          paid_at: eventData.data?.paid_at || new Date().toISOString(),
          gateway_transaction_id: gatewayTxId,
          gateway_response: eventData,
          payment_method: channel
        })
        .eq("transaction_reference", reference);

      if (updateError) {
        throw updateError;
      }
    } else if (eventData.event === "charge.failed") {
      const { error: updateError } = await supabase
        .from("payment_transactions")
        .update({
          status: "failed",
          failed_at: new Date().toISOString(),
          failure_reason: eventData.data?.gateway_response || "Payment transaction failed on gateway",
          gateway_response: eventData
        })
        .eq("transaction_reference", reference);

      if (updateError) {
        throw updateError;
      }
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, message: "Webhook processed successfully" }));
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err.message }));
  }
}
