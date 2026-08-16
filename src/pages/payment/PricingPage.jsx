import React, { useState, useEffect } from "react";
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Users, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Bootcamps & Training");

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("pricing_plans")
          .select("*")
          .eq("is_active", true)
          .eq("status", "published")
          .order("display_order", { ascending: true });

        if (error) throw error;
        setPlans(data || []);
      } catch (err) {
        console.error("Failed to load plans:", err);
        setError("Unable to load pricing options. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const formatPrice = (amount, currency) => {
    const symbol = currency === "NGN" ? "₦" : currency === "USD" ? "$" : `${currency} `;
    return `${symbol}${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
  };

  const categories = Array.from(new Set(plans.map((p) => p.category || "General")));

  const filteredPlans = plans.filter(
    (p) => (p.category || "General") === selectedCategory
  );

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#090a0f",
      color: "#ffffff",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "3rem 2rem",
      boxSizing: "border-box"
    }}>
      {/* Brand Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "3rem", cursor: "pointer" }} onClick={() => window.location.href = "/"}>
        <div style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.03em", fontFamily: "'Outfit', sans-serif" }}>
          OYEN <span style={{ color: "#D4AF37" }}>GRID</span>
        </div>
      </div>

      {/* Headline */}
      <div style={{ textAlign: "center", maxWidth: "680px", marginBottom: "3rem" }}>
        <h1 style={{
          fontSize: "2.8rem",
          fontWeight: 850,
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: "-0.03em",
          margin: "0 0 1rem",
          background: "linear-gradient(135deg, #ffffff 30%, #a3a3a3 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Flexible Pricing for Scale
        </h1>
        <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.7)", lineHeight: "1.5" }}>
          Choose the right plan designed to manage your bootcamps, webinar hosts, and global training operations securely.
        </p>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div style={{
          display: "flex",
          gap: "0.5rem",
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          padding: "0.3rem",
          marginBottom: "3rem"
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "0.6rem 1.4rem",
                borderRadius: "6px",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.25s ease",
                backgroundColor: selectedCategory === cat ? "#D4AF37" : "transparent",
                color: selectedCategory === cat ? "#000000" : "rgba(255,255,255,0.6)"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Plans List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginTop: "4rem" }}>
          <Loader2 size={36} color="#D4AF37" style={{ animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>Loading plans...</span>
        </div>
      ) : error ? (
        <div style={{ color: "#ef4444", marginTop: "4rem", textAlign: "center" }}>{error}</div>
      ) : filteredPlans.length === 0 ? (
        <div style={{ color: "rgba(255,255,255,0.5)", marginTop: "4rem" }}>No active plans available for this category.</div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 340px))",
          gap: "2rem",
          width: "100%",
          maxWidth: "1100px",
          justifyContent: "center",
          alignItems: "stretch"
        }}>
          {filteredPlans.map((plan) => {
            const isEnterprise = plan.badge?.toLowerCase() === "enterprise" || plan.price >= 10000;
            return (
              <div
                key={plan.id}
                style={{
                  backgroundColor: "rgba(9, 10, 15, 0.65)",
                  backdropFilter: "blur(8px)",
                  border: plan.is_popular ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "2.2rem 2rem",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: plan.is_popular ? "0 10px 30px rgba(212,175,55,0.05)" : "none"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "#D4AF37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = plan.is_popular ? "#D4AF37" : "rgba(255,255,255,0.08)";
                }}
              >
                {/* Popular / Custom Badge */}
                {plan.badge && (
                  <span style={{
                    position: "absolute",
                    top: "1.2rem",
                    right: "1.2rem",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                    backgroundColor: plan.is_popular ? "#D4AF37" : "rgba(255,255,255,0.08)",
                    color: plan.is_popular ? "#000000" : "#ffffff",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "4px",
                    textTransform: "uppercase"
                  }}>
                    {plan.badge}
                  </span>
                )}

                {/* Card Title & Desc */}
                <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.35rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                  {plan.name}
                </h3>
                <p style={{ margin: "0 0 1.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", minHeight: "2.5rem", lineHeight: "1.4" }}>
                  {plan.description}
                </p>

                {/* Price Display */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.2rem", marginBottom: "2rem" }}>
                  <span style={{ fontSize: "2.4rem", fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: "#ffffff" }}>
                    {formatPrice(plan.monthly_price || plan.price, plan.currency)}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                    / {plan.billing_period || "month"}
                  </span>
                </div>

                {/* Features List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "2.5rem", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.75)" }}>
                    <CheckCircle2 size={14} color="#D4AF37" />
                    <span>Access to category solutions</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.75)" }}>
                    <CheckCircle2 size={14} color="#D4AF37" />
                    <span>Real-time facilitator dashboard</span>
                  </div>
                  {plan.trial_days > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.75)" }}>
                      <Zap size={14} color="#D4AF37" />
                      <span style={{ color: "#D4AF37", fontWeight: 700 }}>{plan.trial_days}-Day Free Trial Included</span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    window.location.href = `/checkout?plan_id=${plan.id}`;
                  }}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    transition: "all 0.25s ease",
                    backgroundColor: plan.is_popular ? "#D4AF37" : "rgba(255,255,255,0.06)",
                    color: plan.is_popular ? "#000000" : "#ffffff"
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.is_popular) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.is_popular) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  <span>{plan.cta_button_label || "Select Plan"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div style={{ marginTop: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem", width: "100%", maxWidth: "1100px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <ShieldCheck size={14} color="#D4AF37" /> Secure 256-bit encrypted checkout via Paystack.
        </div>
        <div>All prices shown in database values. Subject to updates.</div>
      </div>
    </div>
  );
}
