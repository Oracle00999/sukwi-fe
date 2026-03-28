// components/CardCreation.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  CreditCardIcon,
  UserIcon,
  MapPinIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import cardImage from "../assets/card-image.png";

const baseInput = {
  width: "100%",
  background: "#04090F",
  border: "1px solid rgba(201,168,76,0.15)",
  borderRadius: 12,
  color: "white",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
  padding: "0.85rem 1rem 0.85rem 2.75rem",
};
const disabledInput = { ...baseInput, opacity: 0.4, cursor: "not-allowed" };
const focusStyle = { borderColor: "rgba(201,168,76,0.55)" };

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Nigeria",
  "South Africa",
  "Other",
];

const CardCreation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [focused, setFocused] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    country: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await fetch("https://sukwi-be.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const total = data.data.user.wallet?.totalValue || 0;
          setUserBalance(total);
          if (total < 3000) setInsufficientBalance(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (insufficientBalance) return;
    setSubmitting(true);
    setTimeout(() => {
      setShowSuccess(true);
      setFormData({ name: "", address: "", country: "" });
      setSubmitting(false);
      setTimeout(() => setShowSuccess(false), 3500);
    }, 1000);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 320,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              width: 56,
              height: 56,
              margin: "0 auto 16px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3px solid rgba(201,168,76,0.1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "#C9A84C",
                animation: "spin 0.9s linear infinite",
              }}
            />
          </div>
          <p style={{ fontSize: 13, color: "#3D5A70", fontWeight: 500 }}>
            Loading card creation…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    );
  }

  const balancePct = Math.min((userBalance / 3000) * 100, 100);
  const isDisabled = submitting || insufficientBalance;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingBottom: 80 }}>
      {/* ── Success toast ── */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 60,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderRadius: 14,
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <CheckCircleIcon
              style={{ width: 18, height: 18, color: "#4ADE80", flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#4ADE80" }}>
              Card details submitted successfully!
            </span>
          </div>
        </div>
      )}

      {/* ── Back + header ── */}
      <div style={{ marginBottom: 24 }}>
        <Link
          to="/account"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            color: "#3D5A70",
            fontSize: 13,
            fontWeight: 500,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#3D5A70")}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            <ArrowLeftIcon
              style={{ width: 14, height: 14, color: "#C9A84C" }}
            />
          </div>
          Back to Account
        </Link>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "black",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Create Your QFS Ledger Card
        </h1>
        <p style={{ fontSize: 12, color: "#3D5A70", margin: "4px 0 0" }}>
          Fill in your details to request a quantum-secure payment card
        </p>
      </div>

      {/* ── Insufficient balance warning ── */}
      {insufficientBalance && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 14,
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.2)",
            marginBottom: 20,
          }}
        >
          <ExclamationTriangleIcon
            style={{
              width: 18,
              height: 18,
              color: "#EF4444",
              flexShrink: 0,
              marginTop: 1,
            }}
          />
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#EF4444",
                margin: "0 0 4px",
              }}
            >
              Insufficient Balance
            </p>
            <p
              style={{
                fontSize: 12,
                color: "#EF4444",
                margin: "0 0 10px",
                lineHeight: 1.5,
                opacity: 0.8,
              }}
            >
              You need a minimum balance of $3,000. Your current balance is $
              {userBalance.toLocaleString()}.
            </p>
            <Link to="/deposit" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "7px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(239,68,68,0.3)",
                  background: "rgba(239,68,68,0.08)",
                  color: "#EF4444",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Go to Deposit →
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Card image ── */}
      <div style={{ marginBottom: 20, borderRadius: 16, overflow: "hidden" }}>
        <img
          src={cardImage}
          alt="QFS Card Preview"
          style={{ width: "100%", height: "auto", display: "block" }}
          onError={(e) => {
            e.target.style.display = "none";
            const parent = e.target.parentElement;
            parent.innerHTML = `
              <div style="width:100%;aspect-ratio:1.6;borderRadius:16px;background:linear-gradient(135deg,#0C1E38,#1A3558);border:1px solid rgba(201,168,76,0.25);display:flex;align-items:center;justify-content:center;flexDirection:column;gap:12px;padding:24px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/><circle cx="17" cy="15" r="1.5" fill="#F0C040"/></svg>
                <p style="color:#C9A84C;fontWeight:800;fontSize:16px;margin:0;letterSpacing:0.1em">QFS LEDGER CARD</p>
                <p style="color:#4A6E8A;fontSize:11px;margin:0">Quantum Secure Payment Card</p>
              </div>
            `;
          }}
        />
      </div>

      {/* ── Form card ── */}
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(160deg,#0C1C36 0%,#070F1C 100%)",
          border: "1px solid rgba(201,168,76,0.18)",
          boxShadow: "0 0 50px rgba(201,168,76,0.06)",
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,#C9A84C,transparent)",
          }}
        />

        {/* Card header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(201,168,76,0.08)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "white",
                margin: 0,
              }}
            >
              Card Details Form
            </p>
            <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
              Enter your information to personalise your card
            </p>
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            <CreditCardIcon
              style={{ width: 18, height: 18, color: "#C9A84C" }}
            />
          </div>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* Balance status */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(201,168,76,0.03)",
              border: "1px solid rgba(201,168,76,0.08)",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 12, color: "#3D5A70" }}>
                Current Balance
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: insufficientBalance ? "#EF4444" : "#4ADE80",
                }}
              >
                ${userBalance.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "rgba(201,168,76,0.1)",
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: `${balancePct}%`,
                  height: "100%",
                  borderRadius: 2,
                  background: insufficientBalance ? "#EF4444" : "#4ADE80",
                  transition: "width 0.5s",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: 11,
                  color: insufficientBalance ? "#EF4444" : "#4ADE80",
                  fontWeight: 600,
                }}
              >
                {insufficientBalance
                  ? "❌ Insufficient balance"
                  : "✓ Balance sufficient"}
              </span>
              <span style={{ fontSize: 11, color: "#3D5A70" }}>
                Min. required: $3,000
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            {/* Full Name */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4A6E8A",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <UserIcon
                    style={{
                      width: 16,
                      height: 16,
                      color: focused.name ? "#C9A84C" : "#2E4A60",
                    }}
                  />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused((p) => ({ ...p, name: true }))}
                  onBlur={() => setFocused((p) => ({ ...p, name: false }))}
                  disabled={insufficientBalance}
                  placeholder="Enter your full name"
                  style={{
                    ...(insufficientBalance
                      ? disabledInput
                      : { ...baseInput, ...(focused.name ? focusStyle : {}) }),
                  }}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4A6E8A",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Address
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 14,
                    pointerEvents: "none",
                  }}
                >
                  <MapPinIcon
                    style={{
                      width: 16,
                      height: 16,
                      color: focused.address ? "#C9A84C" : "#2E4A60",
                    }}
                  />
                </div>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => setFocused((p) => ({ ...p, address: true }))}
                  onBlur={() => setFocused((p) => ({ ...p, address: false }))}
                  disabled={insufficientBalance}
                  rows={3}
                  placeholder="Enter your complete address"
                  style={{
                    ...(insufficientBalance
                      ? disabledInput
                      : {
                          ...baseInput,
                          ...(focused.address ? focusStyle : {}),
                        }),
                    resize: "none",
                    lineHeight: 1.6,
                    paddingTop: "0.85rem",
                  }}
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4A6E8A",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Country
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <GlobeAltIcon
                    style={{
                      width: 16,
                      height: 16,
                      color: focused.country ? "#C9A84C" : "#2E4A60",
                    }}
                  />
                </div>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  onFocus={() => setFocused((p) => ({ ...p, country: true }))}
                  onBlur={() => setFocused((p) => ({ ...p, country: false }))}
                  disabled={insufficientBalance}
                  style={{
                    ...(insufficientBalance
                      ? disabledInput
                      : {
                          ...baseInput,
                          ...(focused.country ? focusStyle : {}),
                        }),
                    appearance: "none",
                    paddingRight: 36,
                  }}
                >
                  <option value="" style={{ background: "#07111F" }}>
                    Select your country
                  </option>
                  {countries.map((c) => (
                    <option key={c} value={c} style={{ background: "#07111F" }}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 14,
                    height: 14,
                    color: "#3D5A70",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isDisabled}
              style={{
                marginTop: 4,
                padding: "14px",
                borderRadius: 12,
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                cursor: isDisabled ? "not-allowed" : "pointer",
                background: isDisabled
                  ? "rgba(201,168,76,0.1)"
                  : "linear-gradient(135deg,#C9A84C,#F0C040)",
                color: isDisabled ? "rgba(201,168,76,0.3)" : "#07111F",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (!isDisabled)
                  e.currentTarget.style.boxShadow =
                    "0 0 26px rgba(201,168,76,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {submitting ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 15,
                      height: 15,
                      border: "2px solid rgba(201,168,76,0.3)",
                      borderTopColor: "#C9A84C",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Submitting…
                </span>
              ) : insufficientBalance ? (
                "Minimum $3,000 Required"
              ) : (
                "Create Quantum-Secure Card"
              )}
            </button>
          </form>

          {/* Security note */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid rgba(201,168,76,0.08)",
            }}
          >
            <ShieldCheckIcon
              style={{
                width: 18,
                height: 18,
                color: "#C9A84C",
                flexShrink: 0,
                marginTop: 1,
              }}
            />
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 4px",
                }}
              >
                Security Guarantee
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "#3D5A70",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                All your card details are protected with quantum-resistant
                encryption. Your personal information is securely encrypted and
                will only be used for card issuance and verification purposes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>
    </div>
  );
};

export default CardCreation;
