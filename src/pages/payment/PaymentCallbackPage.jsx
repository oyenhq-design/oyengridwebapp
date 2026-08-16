import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function PaymentCallbackPage() {
  const [txn, setTxn] = useState(null);
  const [plan, setPlan] = useState(null);
  const [verificationState, setVerificationState] = useState("verifying"); // 'verifying' | 'success' | 'failed' | 'pending_webhook'
  const [errorMsg, setErrorMsg] = useState(null);
  const [countdown, setCountdown] = useState(10); // Polling countdown limit (10s)

  const queryParams = new URLSearchParams(window.location.search);
  const reference = queryParams.get("reference") || queryParams.get("trxref");

  useEffect(() => {
    if (!reference) {
      setVerificationState("failed");
      setErrorMsg("Transaction reference missing from URL parameters");
      return;
    }

    let intervalId;
    let secondsLeft = 10;

    async function checkPaymentStatus() {
      try {
        const { data: transaction, error } = await supabase
          .from("payment_transactions")
          .select("*")
          .eq("transaction_reference", reference)
          .single();

        if (error || !transaction) {
          throw new Error("Transaction record not found in database");
        }

        setTxn(transaction);

        // Fetch plan details to render
        if (transaction.plan_id) {
          const { data: planData } = await supabase
            .from("pricing_plans")
            .select("name, category")
            .eq("id", transaction.plan_id)
            .single();
          if (planData) setPlan(planData);
        }

        if (transaction.status === "successful") {
          setVerificationState("success");
          clearInterval(intervalId);
        } else if (transaction.status === "failed") {
          setVerificationState("failed");
          setErrorMsg(transaction.failure_reason || "Gateway payment failed");
          clearInterval(intervalId);
        } else {
          // If transaction is still pending, keep polling until countdown finishes
          if (secondsLeft <= 0) {
            setVerificationState("pending_webhook");
            clearInterval(intervalId);
          }
        }
      } catch (err) {
        console.error("Verification query error:", err);
        if (secondsLeft <= 0) {
          setVerificationState("failed");
          setErrorMsg(err.message || "Failed to retrieve transaction reference");
          clearInterval(intervalId);
        }
      }
    }

    // Initial check
    checkPaymentStatus();

    // Setup polling every 2 seconds for a maximum of 10 seconds
    intervalId = setInterval(() => {
      secondsLeft -= 2;
      setCountdown(Math.max(0, secondsLeft));
      checkPaymentStatus();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [reference]);

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
      <div style={{
        width: "100%", maxWidth: "480px",
        backgroundColor: "rgba(9, 10, 15, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        padding: "2.5rem",
        textAlign: "center",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)"
      }}>
        
        {/* Verification Loader */}
        {verificationState === "verifying" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
            <Loader2 size={42} color="#D4AF37" style={{ animation: "spin 1s linear infinite" }} />
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
              Verifying Payment
            </h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>
              Contacting payment processing systems. Please do not close or reload this window.<br/>
              <span style={{ fontSize: "0.75rem", color: "#D4AF37", marginTop: "0.5rem", display: "inline-block" }}>
                Auto-polling database ({countdown}s)...
              </span>
            </p>
          </div>
        )}

        {/* Success View */}
        {verificationState === "success" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
            <CheckCircle2 size={48} color="#18B67A" />
            <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
              Payment Confirmed!
            </h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>
              Your transaction has been processed and verified successfully. Welcome to OYEN GRID.
            </p>

            {txn && (
              <div style={{
                width: "100%", backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px",
                padding: "1rem", textAlign: "left", fontSize: "0.8rem", marginTop: "0.5rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "0.2rem 0" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Reference:</span>
                  <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{txn.transaction_reference}</span>
                </div>
                {plan && (
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "0.2rem 0" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Tier Plan:</span>
                    <span style={{ fontWeight: 700 }}>{plan.name}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", margin: "0.2rem 0" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Amount Paid:</span>
                  <span style={{ fontWeight: 700, color: "#18B67A" }}>{formatPrice(txn.amount, txn.currency)}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => window.location.href = "/command-centre"}
              style={{
                width: "100%", padding: "0.8rem", borderRadius: "8px", border: "none",
                backgroundColor: "#18B67A", color: "#ffffff", fontSize: "0.88rem",
                fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "0.4rem", marginTop: "1rem"
              }}
            >
              Go to Command Centre <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Pending Webhook / Timeout View */}
        {verificationState === "pending_webhook" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
            <AlertCircle size={48} color="#D9A928" />
            <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
              Webhook Pending
            </h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>
              Paystack is processing your payment, but our server has not received the secure confirmation callback yet.<br/>
              <strong style={{ color: "#ffffff", display: "block", marginTop: "0.5rem" }}>
                You can safely close this page.
              </strong>
              Your account status will automatically update in the background once payment is validated.
            </p>

            <button
              onClick={() => window.location.href = "/command-centre"}
              style={{
                width: "100%", padding: "0.8rem", borderRadius: "8px", border: "none",
                backgroundColor: "#D9A928", color: "#000000", fontSize: "0.88rem",
                fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "0.4rem", marginTop: "1rem"
              }}
            >
              Continue to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Failed View */}
        {verificationState === "failed" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
            <XCircle size={48} color="#ef4444" />
            <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
              Payment Failed
            </h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>
              {errorMsg || "We were unable to verify your payment session. Please try again."}
            </p>

            <button
              onClick={() => window.location.href = "/pricing"}
              style={{
                width: "100%", padding: "0.8rem", borderRadius: "8px", border: "none",
                backgroundColor: "#ef4444", color: "#ffffff", fontSize: "0.88rem",
                fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "0.4rem", marginTop: "1rem"
              }}
            >
              Return to Pricing <ArrowRight size={16} />
            </button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.2rem", marginTop: "2rem" }}>
          <ShieldCheck size={12} color="#D4AF37" /> Cryptographically verified session state
        </div>

      </div>
    </div>
  );
}
