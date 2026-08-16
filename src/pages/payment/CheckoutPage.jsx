import React, { useState, useEffect } from "react";
import { CreditCard, Shield, ArrowRight, Loader2, ArrowLeft, Building, Mail, Phone } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function CheckoutPage() {
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [errorPlan, setErrorPlan] = useState(null);

  // Form Inputs
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const queryParams = new URLSearchParams(window.location.search);
  const planId = queryParams.get("plan_id");

  useEffect(() => {
    if (!planId) {
      setErrorPlan("No plan selected. Please go back to the pricing page.");
      setLoadingPlan(false);
      return;
    }

    async function loadPlanDetails() {
      try {
        setLoadingPlan(true);
        const { data, error } = await supabase
          .from("pricing_plans")
          .select("*")
          .eq("id", planId)
          .single();

        if (error || !data) {
          throw new Error("Plan details not found");
        }
        setPlan(data);
      } catch (err) {
        console.error("Failed to load plan details:", err);
        setErrorPlan("Pricing plan details not found. Select a valid plan.");
      } finally {
        setLoadingPlan(false);
      }
    }
    loadPlanDetails();
  }, [planId]);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutError(null);

    // Client-side validations
    if (!customerEmail.trim()) {
      setCheckoutError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.trim())) {
      setCheckoutError("Invalid customer email address");
      return;
    }

    if (!plan || !plan.is_active || plan.status !== "published") {
      setCheckoutError("The selected plan is currently inactive or unavailable");
      return;
    }

    const supportedCurrencies = ["NGN", "USD"];
    if (!supportedCurrencies.includes(plan.currency)) {
      setCheckoutError(`Currency ${plan.currency} is not supported`);
      return;
    }

    try {
      setCheckoutLoading(true);

      const orgNameRef = organizationId.trim();
      const orgSlugRef = orgNameRef ? orgNameRef.toLowerCase().replace(/[^a-z0-9]/g, "-") : `org-${Math.floor(10000 + Math.random() * 90000)}`;

      const payload = {
        customerEmail: customerEmail.trim(),
        planId: plan.id,
        organizationId: orgSlugRef,
        callbackUrl: `${window.location.origin}/payment/callback`,
        metadata: {
          customer_phone: customerPhone.trim(),
          organization_name: orgNameRef || "Default Organization"
        }
      };

      // Safely preserve organization registration states locally to support onboarding/command-centre integrations
      localStorage.setItem("oyen_org_name", orgNameRef || "Default Organization");
      localStorage.setItem("oyen_owner_email", customerEmail.trim());

      const response = await fetch("/api/paystack-initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success && result.authorization_url) {
        // Redirect to Paystack Checkout authorization URL
        window.location.href = result.authorization_url;
      } else {
        throw new Error(result.error || "Initialization failed");
      }
    } catch (err) {
      console.error("Checkout process failed:", err);
      setCheckoutError(err.message || "Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatPrice = (amount, currency) => {
    const symbol = currency === "NGN" ? "₦" : currency === "USD" ? "$" : `${currency} `;
    return `${symbol}${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#090a0f",
      color: "#ffffff",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      boxSizing: "border-box"
    }}>
      {/* Back Button */}
      <button 
        onClick={() => window.location.href = "/pricing"}
        style={{
          position: "absolute", top: "2rem", left: "2rem",
          display: "flex", alignItems: "center", gap: "0.4rem",
          background: "none", border: "none", color: "rgba(255,255,255,0.6)",
          fontSize: "0.85rem", cursor: "pointer", fontWeight: 700
        }}
      >
        <ArrowLeft size={16} /> Back to Pricing
      </button>

      {/* Main Container Card */}
      <div style={{
        width: "100%", maxWidth: "840px",
        display: "grid", gridTemplateColumns: "1.2fr 1fr",
        backgroundColor: "rgba(9, 10, 15, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px", overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)"
      }}>
        {/* Left Side: Checkout Form */}
        <div style={{ padding: "2.5rem" }}>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.45rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            Secure Checkout
          </h2>
          <p style={{ margin: "0 0 2rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>
            Provide your email and organization reference to initialize payment.
          </p>

          {loadingPlan ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#D4AF37" }}>
              <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "0.85rem" }}>Retrieving plan matrix...</span>
            </div>
          ) : errorPlan ? (
            <div style={{ color: "#ef4444", fontSize: "0.85rem" }}>{errorPlan}</div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
                  Customer Admin Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    style={{
                      width: "100%", padding: "0.75rem 0.8rem 0.75rem 2.2rem",
                      borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)",
                      backgroundColor: "rgba(255,255,255,0.02)", color: "#ffffff",
                      fontSize: "0.85rem", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
                  Phone Number
                </label>
                <div style={{ position: "relative" }}>
                  <Phone size={16} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                  <input
                    type="tel"
                    placeholder="+234 (80) 1234 5678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{
                      width: "100%", padding: "0.75rem 0.8rem 0.75rem 2.2rem",
                      borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)",
                      backgroundColor: "rgba(255,255,255,0.02)", color: "#ffffff",
                      fontSize: "0.85rem", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* Organization ID */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
                  Organization Code / Name
                </label>
                <div style={{ position: "relative" }}>
                  <Building size={16} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                  <input
                    type="text"
                    placeholder="e.g. ABC Energy"
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    style={{
                      width: "100%", padding: "0.75rem 0.8rem 0.75rem 2.2rem",
                      borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)",
                      backgroundColor: "rgba(255,255,255,0.02)", color: "#ffffff",
                      fontSize: "0.85rem", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>
                  Optional. If left blank, a random OYEN reference code will be generated.
                </span>
              </div>

              {/* Errors */}
              {checkoutError && (
                <div style={{ color: "#ef4444", fontSize: "0.82rem", fontWeight: 600 }}>
                  {checkoutError}
                </div>
              )}

              {/* Submit Checkout */}
              <button
                type="submit"
                disabled={checkoutLoading}
                style={{
                  width: "100%", padding: "0.85rem", borderRadius: "8px", border: "none",
                  backgroundColor: "#D4AF37", color: "#000000", fontSize: "0.9rem",
                  fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.5rem", marginTop: "1rem",
                  transition: "opacity 0.2s"
                }}
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Initializing Checkout...
                  </>
                ) : (
                  <>
                    Proceed to Payment <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "2.5rem 2rem",
          display: "flex", flexDirection: "column", justify: "space-between"
        }}>
          <div>
            <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.03em", color: "rgba(255,255,255,0.7)" }}>
              Order Summary
            </h3>

            {plan && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 700 }}>{plan.name}</div>
                  <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", marginTop: "0.2rem" }}>{plan.category}</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: "0.5rem", lineHeight: "1.4" }}>
                    {plan.description}
                  </div>
                </div>

                <div style={{ borderTop: "1px dashed rgba(255,255,255,0.1)", borderBottom: "1px dashed rgba(255,255,255,0.1)", padding: "1rem 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>Monthly Price:</span>
                    <span>{formatPrice(plan.monthly_price || plan.price, plan.currency)}</span>
                  </div>
                  {plan.annual_price > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>Annual Price:</span>
                      <span>{formatPrice(plan.annual_price, plan.currency)}</span>
                    </div>
                  )}
                  {plan.setup_fee > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>Setup Fee:</span>
                      <span>{formatPrice(plan.setup_fee, plan.currency)}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>Due Today ({plan.billing_period || "month"}):</span>
                  <span style={{ fontSize: "1.45rem", fontWeight: 900, color: "#D4AF37", fontFamily: "'Outfit', sans-serif" }}>
                    {formatPrice(plan.monthly_price || plan.price, plan.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", marginTop: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Shield size={12} color="#D4AF37" /> Verified Secure Checkout
            </div>
            <div>Test mode active. Use test card details to process transaction simulation.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
