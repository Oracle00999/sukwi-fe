// components/UserNav.jsx
import React, { useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

// ── Same QFS logo used across the site ──
const QFSLogo = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="unBorder"
        x1="0"
        y1="0"
        x2="60"
        y2="60"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#F0C040" />
      </linearGradient>
      <linearGradient id="unChip" x1="0" y1="0" x2="1" y2="1">
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
      stroke="url(#unBorder)"
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
    <rect x="35" y="36" width="19" height="15" rx="4" fill="url(#unChip)" />
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

const UserNav = () => {
  const [hoveringLogout, setHoveringLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Pull user info for greeting
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const initials =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .join("") || "U";

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(4,9,15,0.96)",
        borderBottom: "1px solid rgba(201,168,76,0.12)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
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

      <div style={{ width: "100%", padding: "0 1.25rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          {/* ── Left: Logo + wordmark ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{ filter: "drop-shadow(0 0 6px rgba(201,168,76,0.3))" }}
            >
              <QFSLogo size={36} />
            </div>
            {/* <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.02em",
                }}
              >
                QFS WorldWide
              </span>
              <span
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 600,
                  color: "#C9A84C",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Ledger
              </span>
            </div> */}
          </div>

          {/* ── Right: User avatar + sign out ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* User avatar pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 12px 5px 6px",
                borderRadius: 999,
                border: "1px solid rgba(201,168,76,0.15)",
                background: "rgba(201,168,76,0.04)",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#07111F",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#8EB1CE",
                  whiteSpace: "nowrap",
                }}
              >
                {user.firstName
                  ? `${user.firstName} ${user.lastName || ""}`.trim()
                  : "My Account"}
              </span>
            </div>

            {/* Sign out button */}
            <button
              onClick={handleLogout}
              onMouseEnter={() => setHoveringLogout(true)}
              onMouseLeave={() => setHoveringLogout(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 10,
                border: `1px solid ${hoveringLogout ? "rgba(239,68,68,0.35)" : "rgba(201,168,76,0.12)"}`,
                background: hoveringLogout
                  ? "rgba(239,68,68,0.07)"
                  : "transparent",
                color: hoveringLogout ? "#EF4444" : "#3D5A70",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <ArrowRightOnRectangleIcon style={{ width: 15, height: 15 }} />
              <span style={{ display: "none" }} className="sm-inline">
                Sign Out
              </span>
              <span style={{ fontSize: 13 }} className="hidden sm:inline">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNav;
