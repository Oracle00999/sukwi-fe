// pages/Account.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  EnvelopeIcon,
  UserIcon,
  PhoneIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import CardLogo from "../assets/btcimg.png";

// ── QFS Logo (same as rest of dashboard) ──
const QFSLogo = ({ size = 44 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="acBorder"
        x1="0"
        y1="0"
        x2="60"
        y2="60"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#F0C040" />
      </linearGradient>
      <linearGradient id="acChip" x1="0" y1="0" x2="1" y2="1">
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
      stroke="url(#acBorder)"
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
    <rect x="35" y="36" width="19" height="15" rx="4" fill="url(#acChip)" />
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

const kycCfg = {
  verified: {
    icon: CheckCircleIcon,
    label: "KYC Verified",
    color: "#4ADE80",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.2)",
    actionText: "Verified",
  },
  pending: {
    icon: ClockIcon,
    label: "KYC Pending",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    actionText: "Pending Review",
  },
  default: {
    icon: XCircleIcon,
    label: "KYC Required",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    actionText: "Verify Now",
  },
};
const getKyc = (status) => kycCfg[status] || kycCfg.default;

const walletActions = [
  {
    to: "/kyc-verify",
    icon: ShieldCheckIcon,
    label: "KYC Verification",
    sub: "Identity verification",
    kyc: true,
  },
  {
    to: "/card-creation",
    icon: CreditCardIcon,
    label: "Create Card",
    sub: "Create a new card",
  },
  {
    to: "/history",
    icon: ClockIcon,
    label: "History",
    sub: "View transactions",
  },
  {
    to: "/deposit",
    icon: ArrowUpTrayIcon,
    label: "Send Funds",
    sub: "Deposit to wallet",
  },
  {
    to: "/withdraw",
    icon: ArrowDownTrayIcon,
    label: "Withdraw",
    sub: "Send to external wallet",
  },
  {
    href: "https://www.moonpay.com/buy/xlm",
    icon: ShoppingCartIcon,
    label: "Buy & Sell",
    sub: "Trade crypto",
    external: true,
  },
  {
    to: "/swap",
    icon: ArrowsRightLeftIcon,
    label: "Swap",
    sub: "Exchange between cryptos",
  },
  {
    to: "/link",
    icon: Cog6ToothIcon,
    label: "Link Wallet",
    sub: "Connect external wallet",
  },
];

const Account = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
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
        setUserData(data.data.user);
        setError("");
      } else {
        setError(data.message || "Failed to fetch account data");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d, opts) =>
    d ? new Date(d).toLocaleDateString("en-US", opts) : "N/A";

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
            Loading your account…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    );
  }

  const kyc = getKyc(userData?.kycStatus);
  const KycIcon = kyc.icon;
  const initials =
    [userData?.firstName, userData?.lastName]
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .join("") || "U";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 80 }}>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "black",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          My Account
        </h1>
        <p style={{ fontSize: 12, color: "#3D5A70", margin: "4px 0 0" }}>
          Manage your wallet and account settings
        </p>
      </div>

      {/* ── Profile hero card ── */}
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 20,
          border: "1px solid rgba(201,168,76,0.25)",
          boxShadow: "0 0 50px rgba(201,168,76,0.08)",
        }}
      >
        {/* BG image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${CardLogo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(4,9,15,0.72) 0%, rgba(12,30,56,0.65) 100%)",
          }}
        />
        {/* Top hairline */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #C9A84C, transparent)",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#C9A84C,#F0C040)",
                fontSize: 20,
                fontWeight: 900,
                color: "#07111F",
                flexShrink: 0,
                boxShadow: "0 0 20px rgba(201,168,76,0.35)",
              }}
            >
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "white",
                  margin: "0 0 3px",
                  letterSpacing: "-0.02em",
                }}
              >
                {userData?.firstName && userData?.lastName
                  ? `${userData.firstName} ${userData.lastName}`
                  : userData?.fullName || "User"}
              </h2>
              <p style={{ fontSize: 13, color: "#8EB1CE", margin: "0 0 10px" }}>
                {userData?.email || "—"}
              </p>
              {/* KYC badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: kyc.bg,
                  border: `1px solid ${kyc.border}`,
                }}
              >
                <KycIcon style={{ width: 13, height: 13, color: kyc.color }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: kyc.color,
                    letterSpacing: "0.05em",
                  }}
                >
                  {kyc.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Wallet actions ── */}
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 20,
          background: "linear-gradient(160deg,#0C1C36 0%,#070F1C 100%)",
          border: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(201,168,76,0.35),transparent)",
          }}
        />
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid rgba(201,168,76,0.07)",
          }}
        >
          <p
            style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0 }}
          >
            Wallet Actions
          </p>
        </div>

        {/* Scrollable row */}
        <div
          style={{
            overflowX: "auto",
            padding: "1rem 1rem 1.25rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ display: "flex", gap: 10, width: "max-content" }}>
            {walletActions.map(
              ({ to, href, icon: Icon, label, sub, kyc: isKyc, external }) => {
                const iconColor = isKyc
                  ? getKyc(userData?.kycStatus).color
                  : "#C9A84C";
                const iconBg = isKyc
                  ? getKyc(userData?.kycStatus).bg
                  : "rgba(201,168,76,0.08)";
                const iconBorder = isKyc
                  ? getKyc(userData?.kycStatus).border
                  : "rgba(201,168,76,0.18)";

                const inner = (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: 10,
                      width: 140,
                      padding: "16px 12px",
                      borderRadius: 16,
                      background: "rgba(201,168,76,0.03)",
                      border: "1px solid rgba(201,168,76,0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(201,168,76,0.07)";
                      e.currentTarget.style.borderColor =
                        "rgba(201,168,76,0.28)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(201,168,76,0.03)";
                      e.currentTarget.style.borderColor =
                        "rgba(201,168,76,0.1)";
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: iconBg,
                        border: `1px solid ${iconBorder}`,
                      }}
                    >
                      <Icon
                        style={{ width: 22, height: 22, color: iconColor }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "white",
                          margin: "0 0 2px",
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#3D5A70",
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {sub}
                      </p>
                    </div>
                  </div>
                );

                return external ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link key={label} to={to} style={{ textDecoration: "none" }}>
                    {inner}
                  </Link>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* ── Account information ── */}
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(160deg,#0C1C36 0%,#070F1C 100%)",
          border: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(201,168,76,0.35),transparent)",
          }}
        />
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid rgba(201,168,76,0.07)",
          }}
        >
          <p
            style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0 }}
          >
            Account Information
          </p>
        </div>

        <div style={{ padding: "1.25rem" }}>
          {/* Info grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[
              {
                label: "Member Since",
                value: fmt(userData?.createdAt, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              },
              {
                label: "Last Login",
                value: userData?.lastLogin
                  ? new Date(userData.lastLogin).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(201,168,76,0.03)",
                  border: "1px solid rgba(201,168,76,0.08)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#4A6E8A",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 5px",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "white",
                    margin: 0,
                  }}
                >
                  {value}
                </p>
              </div>
            ))}

            {/* Account status */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(201,168,76,0.03)",
                border: "1px solid rgba(201,168,76,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#4A6E8A",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: "0 0 5px",
                }}
              >
                Account Status
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: userData?.isActive
                    ? "rgba(74,222,128,0.08)"
                    : "rgba(239,68,68,0.08)",
                  border: `1px solid ${userData?.isActive ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: userData?.isActive ? "#4ADE80" : "#EF4444",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: userData?.isActive ? "#4ADE80" : "#EF4444",
                  }}
                >
                  {userData?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* KYC status detail */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(201,168,76,0.03)",
                border: "1px solid rgba(201,168,76,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#4A6E8A",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: "0 0 5px",
                }}
              >
                KYC Status
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>
                  {userData?.kycStatus === "verified"
                    ? "Fully Verified"
                    : userData?.kycStatus === "pending"
                      ? "Under Review"
                      : "Not Verified"}
                </span>
                {userData?.kycStatus === "verified" &&
                  userData?.kycVerifiedAt && (
                    <span style={{ fontSize: 11, color: "#3D5A70" }}>
                      {fmt(userData.kycVerifiedAt, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
              </div>
            </div>
          </div>

          {/* Profile fields */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 20,
            }}
          >
            {[
              {
                icon: UserIcon,
                label: "Full Name",
                value: userData?.firstName
                  ? `${userData.firstName} ${userData.lastName || ""}`.trim()
                  : userData?.fullName || "—",
              },
              {
                icon: EnvelopeIcon,
                label: "Email Address",
                value: userData?.email || "—",
              },
              {
                icon: PhoneIcon,
                label: "Phone Number",
                value: userData?.phone || "—",
              },
              {
                icon: GlobeAltIcon,
                label: "Country",
                value: userData?.country || "—",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  borderRadius: 12,
                  background: "rgba(201,168,76,0.02)",
                  border: "1px solid rgba(201,168,76,0.07)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(201,168,76,0.06)",
                    border: "1px solid rgba(201,168,76,0.12)",
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: 15, height: 15, color: "#C9A84C" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#3D5A70",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      margin: 0,
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "white",
                      margin: "2px 0 0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Support */}
          <div
            style={{
              paddingTop: 16,
              borderTop: "1px solid rgba(201,168,76,0.07)",
            }}
          >
            <p style={{ fontSize: 12, color: "#3D5A70", margin: "0 0 10px" }}>
              Need help with your account?
            </p>
            <button
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 12,
                border: "1px solid rgba(201,168,76,0.15)",
                background: "rgba(201,168,76,0.04)",
                color: "#C9A84C",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,168,76,0.1)";
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(201,168,76,0.04)";
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
              }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default Account;
