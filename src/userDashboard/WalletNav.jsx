// components/WalletNav.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaCircleUser,
  FaHouse,
  FaMoneyBillTransfer,
  FaRegCircleUser,
  FaRightLeft,
} from "react-icons/fa6";

const navItems = [
  {
    icon: FaHouse,
    iconActive: FaHouse,
    label: "Home",
    path: "/dashboard",
  },
  {
    icon: FaMoneyBillTransfer,
    iconActive: FaMoneyBillTransfer,
    label: "Receive",
    path: "/withdraw",
  },
  {
    icon: FaRightLeft,
    iconActive: FaRightLeft,
    label: "Swap",
    path: "/swap",
  },
  {
    icon: FaRegCircleUser,
    iconActive: FaCircleUser,
    label: "Account",
    path: "/account",
  },
];

const WalletNav = () => {
  const location = useLocation();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "rgba(4,9,15,0.97)",
        borderTop: "1px solid rgba(201,168,76,0.12)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Top gold hairline */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, #C9A84C 30%, #F0C040 50%, #C9A84C 70%, transparent)",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: 64,
          padding: "0 0.5rem",
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.iconActive : item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 72,
                height: "100%",
                textDecoration: "none",
                gap: 4,
                position: "relative",
              }}
            >
              {/* Active top indicator pip */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 24,
                    height: 2,
                    borderRadius: "0 0 4px 4px",
                    background: "linear-gradient(90deg, #C9A84C, #F0C040)",
                  }}
                />
              )}

              {/* Icon container */}
              <div
                style={{
                  width: 40,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive ? "rgba(201,168,76,0.1)" : "transparent",
                  border: isActive
                    ? "1px solid rgba(201,168,76,0.2)"
                    : "1px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                <Icon
                  style={{
                    width: 20,
                    height: 20,
                    color: isActive ? "#F0C040" : "#2E4A60",
                    transition: "color 0.2s",
                  }}
                />
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#C9A84C" : "#2E4A60",
                  letterSpacing: isActive ? "0.05em" : "0.02em",
                  transition: "all 0.2s",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer for mobile */}
      <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </div>
  );
};

export default WalletNav;
