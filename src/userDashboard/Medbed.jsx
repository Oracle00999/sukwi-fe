import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const USDT_TRC20_ADDRESS = "YOUR_USDT_TRC20_ADDRESS_HERE";

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

const focusStyle = { borderColor: "rgba(201,168,76,0.55)" };

const getUserFullName = (user = {}) =>
  user.firstName || user.lastName
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : user.fullName || user.name || "";

export default function Medbed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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
          const user = data.data?.user || {};
          setFormData((prev) => ({
            ...prev,
            name: getUserFullName(user),
            email: user.email || "",
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(USDT_TRC20_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy address. Please copy it manually.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please complete all fields before submitting.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
      setFormData((prev) => ({ ...prev, message: "" }));
      setTimeout(() => setSuccess(false), 3500);
    }, 900);
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
            Loading medbed request...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", paddingBottom: 80 }}>
      {success && (
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
              Medbed request submitted successfully!
            </span>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <Link
          to="/dashboard"
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
          Back to Dashboard
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
          Medbed Request
        </h1>
        <p style={{ fontSize: 12, color: "#3D5A70", margin: "4px 0 0" }}>
          Complete payment and send your request details for review
        </p>
      </div>

      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(160deg,#0C1C36 0%,#070F1C 100%)",
          border: "1px solid rgba(201,168,76,0.18)",
          boxShadow: "0 0 50px rgba(201,168,76,0.06)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,#C9A84C,transparent)",
          }}
        />

        <div style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "white",
                  margin: 0,
                }}
              >
                Pay with USDT (TRC20)
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "#3D5A70",
                  margin: "4px 0 0",
                  lineHeight: 1.5,
                }}
              >
                Send the required amount to the address below:
              </p>
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.2)",
                flexShrink: 0,
              }}
            >
              <ShieldCheckIcon
                style={{ width: 20, height: 20, color: "#C9A84C" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "stretch",
              padding: 10,
              borderRadius: 14,
              background: "rgba(201,168,76,0.04)",
              border: "1px solid rgba(201,168,76,0.12)",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
                color: "#C9A84C",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "monospace",
                overflowWrap: "anywhere",
                padding: "10px 4px",
              }}
            >
              {USDT_TRC20_ADDRESS}
            </div>
            <button
              type="button"
              onClick={copyAddress}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "0 12px",
                borderRadius: 11,
                border: "1px solid rgba(201,168,76,0.25)",
                background: copied
                  ? "rgba(74,222,128,0.1)"
                  : "rgba(201,168,76,0.08)",
                color: copied ? "#4ADE80" : "#C9A84C",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {copied ? (
                <CheckCircleIcon style={{ width: 14, height: 14 }} />
              ) : (
                <DocumentDuplicateIcon style={{ width: 14, height: 14 }} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div
            style={{
              minHeight: 160,
              borderRadius: 16,
              border: "1px dashed rgba(201,168,76,0.24)",
              background: "rgba(4,9,15,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 24,
            }}
          >
            <div>
              <QrCodeIcon
                style={{
                  width: 42,
                  height: 42,
                  color: "#C9A84C",
                  margin: "0 auto 10px",
                }}
              />
              <p
                style={{
                  margin: 0,
                  color: "white",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                QR code placeholder
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#3D5A70",
                  fontSize: 12,
                }}
              >
                Add the USDT TRC20 address QR code here
              </p>
            </div>
          </div>
        </div>
      </div>

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
              Request Details
            </p>
            <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
              Your name and email are prefilled from your account
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
            <PaperAirplaneIcon
              style={{ width: 18, height: 18, color: "#C9A84C" }}
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            padding: "1.5rem",
          }}
        >
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 12,
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#EF4444",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <XCircleIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
              {error}
            </div>
          )}

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
                onFocus={() => setFocused((prev) => ({ ...prev, name: true }))}
                onBlur={() => setFocused((prev) => ({ ...prev, name: false }))}
                placeholder="Enter your full name"
                style={{ ...baseInput, ...(focused.name ? focusStyle : {}) }}
              />
            </div>
          </div>

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
                onFocus={() =>
                  setFocused((prev) => ({ ...prev, email: true }))
                }
                onBlur={() =>
                  setFocused((prev) => ({ ...prev, email: false }))
                }
                placeholder="Enter your email address"
                style={{ ...baseInput, ...(focused.email ? focusStyle : {}) }}
              />
            </div>
          </div>

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
              Message
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
                <PencilSquareIcon
                  style={{
                    width: 16,
                    height: 16,
                    color: focused.message ? "#C9A84C" : "#2E4A60",
                  }}
                />
              </div>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                onFocus={() =>
                  setFocused((prev) => ({ ...prev, message: true }))
                }
                onBlur={() =>
                  setFocused((prev) => ({ ...prev, message: false }))
                }
                placeholder="Write your medbed request or payment details"
                style={{
                  ...baseInput,
                  ...(focused.message ? focusStyle : {}),
                  resize: "none",
                  lineHeight: 1.6,
                  paddingTop: "0.85rem",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 4,
              padding: "14px",
              borderRadius: 12,
              border: "none",
              fontSize: 14,
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              background: submitting
                ? "rgba(201,168,76,0.1)"
                : "linear-gradient(135deg,#C9A84C,#F0C040)",
              color: submitting ? "rgba(201,168,76,0.3)" : "#07111F",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              if (!submitting)
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
                Submitting...
              </span>
            ) : (
              "Submit Medbed Request"
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>
    </div>
  );
}
