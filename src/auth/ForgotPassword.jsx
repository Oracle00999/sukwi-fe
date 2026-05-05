// pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Web3 Ledger Logo: WL monogram with circuit detail
const Web3LedgerLogo = ({ size = 60 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="forgotWeb3LedgerGold" x1="8" y1="8" x2="52" y2="52">
        <stop offset="0%" stopColor="#F0C040" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
      <linearGradient id="forgotWeb3LedgerCyan" x1="12" y1="12" x2="48" y2="48">
        <stop offset="0%" stopColor="#5CE1E6" />
        <stop offset="100%" stopColor="#8EB1CE" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="52" height="52" rx="14" fill="transparent" />
    <path
      d="M12 16H22L26 38L31 21L36 38L41 16H48"
      stroke="url(#forgotWeb3LedgerGold)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M42 18V42H51"
      stroke="#F7E4A5"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 45H27M27 45V39M47 14H53M53 14V21M13 23H7M7 23V31"
      stroke="url(#forgotWeb3LedgerCyan)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="27" cy="45" r="2.4" fill="#5CE1E6" />
    <circle cx="53" cy="21" r="2.4" fill="#5CE1E6" />
    <circle cx="7" cy="31" r="2.4" fill="#5CE1E6" />
  </svg>
);

const baseInput = {
  width: "100%",
  padding: "0.75rem 1rem 0.75rem 2.75rem",
  background: "#04090F",
  border: "1px solid rgba(201,168,76,0.15)",
  borderRadius: 12,
  color: "white",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
};
const focusStyle = { borderColor: "rgba(201,168,76,0.55)" };

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://sukwi-be.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmittedEmail(email.trim());
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.message || "Failed to send reset code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#04090F" }}>
      <div style={{ paddingTop: 96, paddingBottom: 64 }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 1rem" }}>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#3D5A70",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              marginBottom: 32,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#3D5A70")}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowLeftIcon style={{ width: 13, height: 13 }} />
            </div>
            Back to Login
          </Link>

          <div
            style={{
              background: "linear-gradient(160deg, #0C1C36 0%, #070F1C 100%)",
              border: "1px solid rgba(201,168,76,0.18)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 0 60px rgba(201,168,76,0.06)",
            }}
          >
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, #C9A84C, transparent)",
              }}
            />

            <div style={{ padding: "2rem 2rem 2.5rem" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      filter: "drop-shadow(0 0 16px rgba(201,168,76,0.3))",
                    }}
                  >
                    <Web3LedgerLogo size={60} />
                  </div>
                </div>
                <h1
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "white",
                    margin: "0 0 6px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Forgot Password
                </h1>
                <p style={{ fontSize: 13, color: "#3D5A70", margin: 0 }}>
                  Request a secure reset code for your Web3 Ledger account
                </p>
              </div>

              {success ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "14px 16px",
                      borderRadius: 14,
                      background: "rgba(74,222,128,0.06)",
                      border: "1px solid rgba(74,222,128,0.25)",
                    }}
                  >
                    <CheckCircleIcon
                      style={{
                        width: 20,
                        height: 20,
                        color: "#4ADE80",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: "#4ADE80",
                          margin: "0 0 4px",
                        }}
                      >
                        Reset code sent
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#8EB1CE",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        Check your email for the 8-character reset code
                        {submittedEmail ? ` sent to ${submittedEmail}` : ""}.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 16,
                      borderRadius: 14,
                      background: "rgba(201,168,76,0.04)",
                      border: "1px solid rgba(201,168,76,0.1)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#C9A84C",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        margin: "0 0 10px",
                      }}
                    >
                      Next Steps
                    </p>
                    {[
                      "Open your inbox and copy the reset code.",
                      "Go to the reset password page.",
                      "Enter your email, reset code, and new password.",
                    ].map((item) => (
                      <div
                        key={item}
                        style={{ display: "flex", gap: 8, marginBottom: 8 }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "#C9A84C",
                            flexShrink: 0,
                            marginTop: 6,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 12,
                            color: "#8EB1CE",
                            lineHeight: 1.5,
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Link
                      to="/reset-password"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "0.85rem 1rem",
                        borderRadius: 12,
                        border: "none",
                        background: "linear-gradient(135deg,#C9A84C,#F0C040)",
                        color: "#07111F",
                        fontSize: 14,
                        fontWeight: 800,
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                    >
                      Go to Reset Password Page
                    </Link>
                    <Link
                      to="/login"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "0.85rem 1rem",
                        borderRadius: 12,
                        border: "1px solid rgba(201,168,76,0.22)",
                        background: "rgba(201,168,76,0.05)",
                        color: "#C9A84C",
                        fontSize: 14,
                        fontWeight: 700,
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#4A6E8A",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 6,
                      }}
                    >
                      Email Address
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
                        <EnvelopeIcon
                          style={{
                            width: 16,
                            height: 16,
                            color: focused.email ? "#C9A84C" : "#2E4A60",
                          }}
                        />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        onFocus={() => setFocused((p) => ({ ...p, email: true }))}
                        onBlur={() => setFocused((p) => ({ ...p, email: false }))}
                        placeholder="you@example.com"
                        autoComplete="email"
                        style={{
                          ...baseInput,
                          ...(focused.email ? focusStyle : {}),
                        }}
                      />
                    </div>
                  </div>

                  {error && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "rgba(239,68,68,0.06)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#EF4444",
                        fontSize: 13,
                      }}
                    >
                      <XCircleIcon
                        style={{ width: 16, height: 16, flexShrink: 0 }}
                      />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: 12,
                      border: "none",
                      background: loading
                        ? "rgba(201,168,76,0.16)"
                        : "linear-gradient(135deg,#C9A84C,#F0C040)",
                      color: loading ? "rgba(201,168,76,0.45)" : "#07111F",
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Sending Reset Code..." : "Send Reset Code"}
                  </button>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      paddingTop: 4,
                    }}
                  >
                    <ShieldCheckIcon
                      style={{
                        width: 14,
                        height: 14,
                        color: "#2E4A60",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    />
                    <p
                      style={{
                        fontSize: 11,
                        color: "#2E4A60",
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      A reset code will be sent to your email. The code expires
                      after a limited time for account security.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
