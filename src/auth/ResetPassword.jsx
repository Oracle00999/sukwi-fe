// pages/ResetPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  LockClosedIcon,
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
      <linearGradient id="resetWeb3LedgerGold" x1="8" y1="8" x2="52" y2="52">
        <stop offset="0%" stopColor="#F0C040" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
      <linearGradient id="resetWeb3LedgerCyan" x1="12" y1="12" x2="48" y2="48">
        <stop offset="0%" stopColor="#5CE1E6" />
        <stop offset="100%" stopColor="#8EB1CE" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="52" height="52" rx="14" fill="transparent" />
    <path
      d="M12 16H22L26 38L31 21L36 38L41 16H48"
      stroke="url(#resetWeb3LedgerGold)"
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
      stroke="url(#resetWeb3LedgerCyan)"
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

const strengthStyles = {
  strong: { label: "Strong", color: "#4ADE80", width: "100%" },
  medium: { label: "Medium", color: "#F59E0B", width: "66%" },
  weak: { label: "Weak", color: "#EF4444", width: "33%" },
};

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [focused, setFocused] = useState({});

  const checkPasswordStrength = (password) => {
    if (!password) return "";

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    let score = 0;
    if (length >= 8) score++;
    if (hasLower) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (score >= 5) return "strong";
    if (score >= 3) return "medium";
    return "weak";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === "resetCode" ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (name === "newPassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!formData.resetCode.trim()) {
      setError("Please enter the reset code from your email");
      return;
    }

    if (formData.resetCode.length !== 8) {
      setError("Reset code must be 8 characters");
      return;
    }

    if (!formData.newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const strength = checkPasswordStrength(formData.newPassword);
    if (strength === "weak") {
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://sukwi-be.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            resetCode: formData.resetCode.trim().toUpperCase(),
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({
          email: "",
          resetCode: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordStrength("");
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = ({
    icon: Icon,
    label,
    name,
    type = "text",
    placeholder,
    autoComplete,
    maxLength,
    inputMode,
    extraStyle = {},
  }) => (
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
        {label}
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
          <Icon
            style={{
              width: 16,
              height: 16,
              color: focused[name] ? "#C9A84C" : "#2E4A60",
            }}
          />
        </div>
        <input
          name={name}
          type={type}
          required
          value={formData[name]}
          onChange={handleInputChange}
          onFocus={() => setFocused((p) => ({ ...p, [name]: true }))}
          onBlur={() => setFocused((p) => ({ ...p, [name]: false }))}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          style={{
            ...baseInput,
            ...(focused[name] ? focusStyle : {}),
            ...extraStyle,
          }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#04090F" }}>
      <div style={{ paddingTop: 96, paddingBottom: 64 }}>
        <div style={{ maxWidth: 460, margin: "0 auto", padding: "0 1rem" }}>
          <Link
            to="/forgot-password"
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
            Get Reset Code
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
                  Reset Password
                </h1>
                <p style={{ fontSize: 13, color: "#3D5A70", margin: 0 }}>
                  Enter the reset code from your email and set a new password
                </p>
              </div>

              {success ? (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      margin: "0 auto 16px",
                      background: "rgba(74,222,128,0.08)",
                      border: "1px solid rgba(74,222,128,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircleIcon
                      style={{ width: 28, height: 28, color: "#4ADE80" }}
                    />
                  </div>
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "white",
                      margin: "0 0 8px",
                    }}
                  >
                    Password Reset Successful
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#8EB1CE",
                      lineHeight: 1.6,
                      margin: "0 0 24px",
                    }}
                  >
                    Your password has been updated. You can now sign in with
                    your new password.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Link
                      to="/login"
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
                      Go to Login
                    </Link>
                    <Link
                      to="/"
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
                      Back to Home
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  {renderInput({
                    icon: EnvelopeIcon,
                    label: "Email Address",
                    name: "email",
                    type: "email",
                    placeholder: "you@example.com",
                    autoComplete: "email",
                  })}

                  <div>
                    {renderInput({
                      icon: KeyIcon,
                      label: "Reset Code",
                      name: "resetCode",
                      placeholder: "Enter 8-character code",
                      maxLength: 8,
                      inputMode: "text",
                      extraStyle: {
                        fontFamily: "monospace",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      },
                    })}
                    <p
                      style={{
                        fontSize: 11,
                        color: "#2E4A60",
                        margin: "6px 0 0",
                      }}
                    >
                      Use the 8-character reset code sent to your email.
                    </p>
                  </div>

                  <div>
                    {renderInput({
                      icon: LockClosedIcon,
                      label: "New Password",
                      name: "newPassword",
                      type: "password",
                      placeholder: "Enter new password",
                      autoComplete: "new-password",
                    })}

                    {formData.newPassword && (
                      <div style={{ marginTop: 8 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ fontSize: 11, color: "#3D5A70" }}>
                            Password strength
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: strengthStyles[passwordStrength]?.color,
                            }}
                          >
                            {strengthStyles[passwordStrength]?.label}
                          </span>
                        </div>
                        <div
                          style={{
                            height: 4,
                            borderRadius: 999,
                            background: "rgba(201,168,76,0.1)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: strengthStyles[passwordStrength]?.width,
                              height: "100%",
                              background: strengthStyles[passwordStrength]?.color,
                              transition: "width 0.25s",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {renderInput({
                      icon: LockClosedIcon,
                      label: "Confirm New Password",
                      name: "confirmPassword",
                      type: "password",
                      placeholder: "Confirm new password",
                      autoComplete: "new-password",
                    })}
                    {formData.confirmPassword &&
                      formData.newPassword !== formData.confirmPassword && (
                        <p
                          style={{
                            fontSize: 11,
                            color: "#EF4444",
                            margin: "6px 0 0",
                          }}
                        >
                          Passwords do not match
                        </p>
                      )}
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
                    {loading ? "Resetting Password..." : "Reset Password"}
                  </button>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                      paddingTop: 2,
                    }}
                  >
                    <Link
                      to="/forgot-password"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#C9A84C",
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      <ArrowLeftIcon style={{ width: 14, height: 14 }} />
                      Get Reset Code
                    </Link>
                    <Link
                      to="/login"
                      style={{
                        color: "#8EB1CE",
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Back to Login
                    </Link>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      paddingTop: 10,
                      borderTop: "1px solid rgba(201,168,76,0.08)",
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
                      Use at least 8 characters with uppercase, lowercase, and
                      a number. Special characters are recommended.
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

export default ResetPassword;
