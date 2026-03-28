// pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  UserIcon,
  KeyIcon,
  PhoneIcon,
  GlobeAltIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";

// ── Same QFS logo as Navbar ──
const QFSLogo = ({ size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="spBorder"
        x1="0"
        y1="0"
        x2="60"
        y2="60"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#F0C040" />
      </linearGradient>
      <linearGradient id="spChip" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F0C040" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
    </defs>
    <rect
      x="1.5"
      y="1.5"
      width="57"
      height="57"
      rx="14"
      fill="#07111F"
      stroke="url(#spBorder)"
      strokeWidth="1.5"
    />
    <rect
      x="5"
      y="5"
      width="50"
      height="50"
      rx="11"
      fill="none"
      stroke="rgba(201,168,76,0.08)"
      strokeWidth="0.75"
    />
    <text
      x="25"
      y="43"
      fontSize="38"
      fontWeight="900"
      fontFamily="system-ui,-apple-system,sans-serif"
      fill="#F0C040"
      textAnchor="middle"
      letterSpacing="-1"
    >
      Q
    </text>
    <rect x="35" y="36" width="19" height="15" rx="4" fill="url(#spChip)" />
    <text
      x="44.5"
      y="47"
      fontSize="9"
      fontWeight="800"
      fontFamily="system-ui,-apple-system,sans-serif"
      fill="#07111F"
      textAnchor="middle"
      letterSpacing="0.5"
    >
      FS
    </text>
  </svg>
);

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Mexico",
  "South Africa",
  "United Arab Emirates",
  "Singapore",
  "Switzerland",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "New Zealand",
  "South Korea",
  "Italy",
  "Spain",
  "Portugal",
  "Ireland",
  "Belgium",
  "Austria",
  "Poland",
  "Russia",
  "Saudi Arabia",
  "Turkey",
  "Israel",
  "Egypt",
  "Nigeria",
  "Kenya",
  "Ghana",
  "Argentina",
  "Chile",
  "Colombia",
  "Peru",
  "Venezuela",
  "Costa Rica",
  "Panama",
  "Dominican Republic",
  "Jamaica",
  "Bahamas",
  "Barbados",
  "Trinidad and Tobago",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "Jordan",
  "Lebanon",
  "Malaysia",
  "Thailand",
  "Vietnam",
  "Philippines",
  "Indonesia",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Nepal",
  "Bhutan",
  "Maldives",
  "Mauritius",
  "Seychelles",
  "Other",
];

// ── Shared input style helpers ──
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
const errorInput = { ...baseInput, borderColor: "rgba(239,68,68,0.5)" };
const focusStyle = { borderColor: "rgba(201,168,76,0.55)" };

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [focused, setFocused] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
  });

  const calculatePasswordStrength = (p) => {
    let s = 0;
    if (p.length >= 8) s += 25;
    if (/[A-Z]/.test(p)) s += 25;
    if (/[0-9]/.test(p)) s += 25;
    if (/[^A-Za-z0-9]/.test(p)) s += 25;
    return Math.min(s, 100);
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const getStrengthColor = (s) => {
    if (s < 25) return "#EF4444";
    if (s < 50) return "#F59E0B";
    if (s < 75) return "#C9A84C";
    return "#4ADE80";
  };
  const getStrengthText = (s) => {
    if (s < 25) return "Very weak";
    if (s < 50) return "Weak";
    if (s < 75) return "Fair";
    if (s < 100) return "Strong";
    return "Very strong";
  };

  const validateForm = () => {
    const e = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      country: "",
    };
    let ok = true;
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      e.firstName = "At least 2 characters";
      ok = false;
    }
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      e.lastName = "At least 2 characters";
      ok = false;
    }
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      e.email = "Valid email required";
      ok = false;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 5) {
      e.phone = "Valid phone required";
      ok = false;
    }
    if (!formData.country) {
      e.country = "Country is required";
      ok = false;
    }
    if (!formData.password || formData.password.length < 8) {
      e.password = "At least 8 characters";
      ok = false;
    } else if (passwordStrength < 50) {
      e.password = "Password is too weak";
      ok = false;
    }
    setErrors(e);
    return ok;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setNotification({
        type: "error",
        message: "Please fill all required fields correctly",
      });
      return;
    }
    setLoading(true);
    setNotification({ type: "", message: "" });
    try {
      const res = await fetch(
        "https://sukwi-be.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setNotification({
          type: "success",
          message: "Account created! Redirecting to login…",
        });
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phone: "",
          country: "",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setNotification({
          type: "error",
          message: data.message || "Registration failed. Please try again.",
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

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(formData.password),
    },
    { label: "Contains number", met: /[0-9]/.test(formData.password) },
    {
      label: "Contains special character",
      met: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

  const isFormValid = () =>
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.country &&
    formData.password.length >= 8 &&
    passwordStrength >= 50;

  // ── Field renderer ──
  const Field = ({
    name,
    label,
    type = "text",
    placeholder,
    icon: Icon,
    hint,
  }) => {
    const hasError = !!errors[name];
    const isFocused = focused[name];
    return (
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
                color: hasError ? "#EF4444" : isFocused ? "#C9A84C" : "#2E4A60",
              }}
            />
          </div>
          <input
            name={name}
            type={type}
            required
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => setFocused((p) => ({ ...p, [name]: true }))}
            onBlur={() => setFocused((p) => ({ ...p, [name]: false }))}
            placeholder={placeholder}
            style={{
              ...(hasError ? errorInput : baseInput),
              ...(isFocused && !hasError ? focusStyle : {}),
            }}
          />
        </div>
        {hasError && (
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "#EF4444",
              marginTop: 4,
            }}
          >
            <ExclamationCircleIcon style={{ width: 12, height: 12 }} />
            {errors[name]}
          </p>
        )}
        {hint && !hasError && (
          <p style={{ fontSize: 11, color: "#2E4A60", marginTop: 4 }}>{hint}</p>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#04090F" }}>
      <Navbar />

      <div style={{ paddingTop: 96, paddingBottom: 64 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 1rem" }}>
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
                    <QFSLogo size={60} />
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
                  Join QFS Ledger
                </h2>
                <p style={{ fontSize: 13, color: "#3D5A70", margin: 0 }}>
                  Create your sovereign-grade account
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
                {/* Name row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <Field
                    name="firstName"
                    label="First name"
                    placeholder="John"
                    icon={UserIcon}
                  />
                  <Field
                    name="lastName"
                    label="Last name"
                    placeholder="Doe"
                    icon={UserIcon}
                  />
                </div>

                <Field
                  name="email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  icon={EnvelopeIcon}
                />

                <Field
                  name="phone"
                  label="Phone number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  icon={PhoneIcon}
                  hint="Include country code for international numbers"
                />

                {/* Country select */}
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
                          color: errors.country
                            ? "#EF4444"
                            : focused.country
                              ? "#C9A84C"
                              : "#2E4A60",
                        }}
                      />
                    </div>
                    <select
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      onFocus={() =>
                        setFocused((p) => ({ ...p, country: true }))
                      }
                      onBlur={() =>
                        setFocused((p) => ({ ...p, country: false }))
                      }
                      style={{
                        ...(errors.country ? errorInput : baseInput),
                        ...(focused.country && !errors.country
                          ? focusStyle
                          : {}),
                        appearance: "none",
                        paddingRight: 36,
                      }}
                    >
                      <option
                        value=""
                        style={{ background: "#04090F", color: "#2E4A60" }}
                      >
                        Select your country
                      </option>
                      {countries.map((c) => (
                        <option
                          key={c}
                          value={c}
                          style={{ background: "#07111F", color: "white" }}
                        >
                          {c}
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={errors.country ? "#EF4444" : "#2E4A60"}
                        strokeWidth="2"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.country && (
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        color: "#EF4444",
                        marginTop: 4,
                      }}
                    >
                      <ExclamationCircleIcon
                        style={{ width: 12, height: 12 }}
                      />
                      {errors.country}
                    </p>
                  )}
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
                    {formData.password && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <div
                          style={{
                            width: 60,
                            height: 3,
                            borderRadius: 2,
                            background: "rgba(201,168,76,0.1)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${passwordStrength}%`,
                              height: "100%",
                              background: getStrengthColor(passwordStrength),
                              borderRadius: 2,
                              transition: "all 0.3s",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: getStrengthColor(passwordStrength),
                          }}
                        >
                          {getStrengthText(passwordStrength)}
                        </span>
                      </div>
                    )}
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
                      <KeyIcon
                        style={{
                          width: 16,
                          height: 16,
                          color: errors.password
                            ? "#EF4444"
                            : focused.password
                              ? "#C9A84C"
                              : "#2E4A60",
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
                      placeholder="Create a strong password"
                      style={{
                        ...(errors.password ? errorInput : baseInput),
                        ...(focused.password && !errors.password
                          ? focusStyle
                          : {}),
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
                  {errors.password && (
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        color: "#EF4444",
                        marginTop: 4,
                      }}
                    >
                      <ExclamationCircleIcon
                        style={{ width: 12, height: 12 }}
                      />
                      {errors.password}
                    </p>
                  )}

                  {/* Requirements */}
                  {formData.password && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "6px 12px",
                        marginTop: 12,
                      }}
                    >
                      {passwordRequirements.map((req, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {req.met ? (
                            <CheckCircleIcon
                              style={{
                                width: 13,
                                height: 13,
                                color: "#4ADE80",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 13,
                                height: 13,
                                borderRadius: "50%",
                                border: "1px solid rgba(201,168,76,0.15)",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <span
                            style={{
                              fontSize: 11,
                              color: req.met ? "#4ADE80" : "#2E4A60",
                            }}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 12,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor:
                      loading || !isFormValid() ? "not-allowed" : "pointer",
                    background:
                      loading || !isFormValid()
                        ? "rgba(201,168,76,0.1)"
                        : "linear-gradient(135deg, #C9A84C, #F0C040)",
                    color:
                      loading || !isFormValid()
                        ? "rgba(201,168,76,0.3)"
                        : "#07111F",
                    transition: "all 0.3s",
                    marginTop: 4,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && isFormValid())
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
                      Creating your account…
                    </span>
                  ) : (
                    "Create Your Account"
                  )}
                </button>
              </form>

              {/* Login link */}
              <div
                style={{
                  marginTop: 28,
                  paddingTop: 24,
                  borderTop: "1px solid rgba(201,168,76,0.08)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 13, color: "#2E4A60", margin: 0 }}>
                  Already have an account?{" "}
                  <Link
                    to="/login"
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
                    Sign in here
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

export default Signup;
