// pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// ── Web3 Ledger Logo: WL monogram with circuit detail ──
const Web3LedgerLogo = ({ size = 60 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="signinWeb3LedgerBorder"
        x1="0"
        y1="0"
        x2="60"
        y2="60"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#F0C040" />
      </linearGradient>
      <linearGradient id="signinWeb3LedgerGold" x1="8" y1="8" x2="52" y2="52">
        <stop offset="0%" stopColor="#F0C040" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
      <linearGradient id="signinWeb3LedgerCyan" x1="12" y1="12" x2="48" y2="48">
        <stop offset="0%" stopColor="#5CE1E6" />
        <stop offset="100%" stopColor="#8EB1CE" />
      </linearGradient>
    </defs>
    <rect
      x="4"
      y="4"
      width="52"
      height="52"
      rx="14"
      fill="transparent"
    />
    <path
      d="M12 16H22L26 38L31 21L36 38L41 16H48"
      stroke="url(#signinWeb3LedgerGold)"
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
      stroke="url(#signinWeb3LedgerCyan)"
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

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [focused, setFocused] = useState({});
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: "", message: "" });

    try {
      const response = await fetch(
        "https://sukwi-be.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setNotification({
          type: "success",
          message: "Login successful! Redirecting…",
        });

        if (data.data?.token) localStorage.setItem("token", data.data.token);
        if (data.data?.user)
          localStorage.setItem("user", JSON.stringify(data.data.user));

        setTimeout(() => {
          navigate(
            data.data?.user?.role === "admin"
              ? "/admindashboard"
              : "/dashboard",
          );
        }, 1500);
      } else {
        setNotification({
          type: "error",
          message:
            data.message || "Login failed. Please check your credentials.",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "Network error. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#04090F" }}>
      {/* <Navbar /> */}

      <div style={{ paddingTop: 96, paddingBottom: 64 }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 1rem" }}>
          {/* Back link */}
          <Link
            to="/"
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
            Back to Home
          </Link>

          {/* Card */}
          <div
            style={{
              background: "linear-gradient(160deg, #0C1C36 0%, #070F1C 100%)",
              border: "1px solid rgba(201,168,76,0.18)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 0 60px rgba(201,168,76,0.06)",
            }}
          >
            {/* Top gold hairline */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, #C9A84C, transparent)",
              }}
            />

            <div style={{ padding: "2rem 2rem 2.5rem" }}>
              {/* Logo + header */}
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
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "white",
                    margin: "0 0 6px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Welcome Back
                </h2>
                <p style={{ fontSize: 13, color: "#3D5A70", margin: 0 }}>
                  Sign in to your Web3 Ledger account
                </p>
              </div>

              {/* Notification */}
              {notification.message && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    borderRadius: 12,
                    marginBottom: 24,
                    background:
                      notification.type === "success"
                        ? "rgba(74,222,128,0.06)"
                        : "rgba(239,68,68,0.06)",
                    border: `1px solid ${notification.type === "success" ? "rgba(74,222,128,0.25)" : "rgba(239,68,68,0.25)"}`,
                    color:
                      notification.type === "success" ? "#4ADE80" : "#EF4444",
                    fontSize: 13,
                  }}
                >
                  {notification.type === "success" ? (
                    <CheckCircleIcon
                      style={{ width: 16, height: 16, flexShrink: 0 }}
                    />
                  ) : (
                    <XCircleIcon
                      style={{ width: 16, height: 16, flexShrink: 0 }}
                    />
                  )}
                  {notification.message}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Email */}
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
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
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

                {/* Password */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#4A6E8A",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      style={{
                        fontSize: 12,
                        color: "#C9A84C",
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#F0C040")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#C9A84C")
                      }
                    >
                      Forgot password?
                    </Link>
                  </div>
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
                      <LockClosedIcon
                        style={{
                          width: 16,
                          height: 16,
                          color: focused.password ? "#C9A84C" : "#2E4A60",
                        }}
                      />
                    </div>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() =>
                        setFocused((p) => ({ ...p, password: true }))
                      }
                      onBlur={() =>
                        setFocused((p) => ({ ...p, password: false }))
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      style={{
                        ...baseInput,
                        ...(focused.password ? focusStyle : {}),
                        paddingRight: 44,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#2E4A60",
                        padding: 0,
                        display: "flex",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#C9A84C")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#2E4A60")
                      }
                    >
                      {showPassword ? (
                        <EyeSlashIcon style={{ width: 16, height: 16 }} />
                      ) : (
                        <EyeIcon style={{ width: 16, height: 16 }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      cursor: "pointer",
                      accentColor: "#C9A84C",
                      border: "1px solid rgba(201,168,76,0.2)",
                      background: "#04090F",
                    }}
                  />
                  <label
                    htmlFor="remember-me"
                    style={{
                      fontSize: 13,
                      color: "#3D5A70",
                      cursor: "pointer",
                    }}
                  >
                    Remember this device
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 12,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    background: loading
                      ? "rgba(201,168,76,0.1)"
                      : "linear-gradient(135deg, #C9A84C, #F0C040)",
                    color: loading ? "rgba(201,168,76,0.3)" : "#07111F",
                    transition: "all 0.3s",
                    marginTop: 4,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading)
                      e.currentTarget.style.boxShadow =
                        "0 0 28px rgba(201,168,76,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {loading ? (
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
                          width: 16,
                          height: 16,
                          border: "2px solid rgba(201,168,76,0.3)",
                          borderTopColor: "#C9A84C",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          display: "inline-block",
                        }}
                      />
                      Signing in…
                    </span>
                  ) : (
                    "Sign In to Your Account"
                  )}
                </button>
              </form>

              {/* Divider + signup link */}
              <div
                style={{
                  marginTop: 28,
                  paddingTop: 24,
                  borderTop: "1px solid rgba(201,168,76,0.08)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 13, color: "#2E4A60", margin: 0 }}>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    style={{
                      color: "#C9A84C",
                      fontWeight: 700,
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F0C040")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#C9A84C")
                    }
                  >
                    Create account here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
