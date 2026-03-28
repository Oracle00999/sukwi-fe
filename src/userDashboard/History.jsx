// pages/Transactions.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowsRightLeftIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const cryptoIcons = {
  bitcoin: "₿",
  ethereum: "Ξ",
  tether: "₮",
  "binance-coin": "ⓑ",
  solana: "◎",
  dogecoin: "Ð",
  ripple: "✕",
  stellar: "✤",
  tron: "Ⓣ",
};

const typeCfg = {
  deposit: {
    color: "#4ADE80",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.2)",
    icon: ArrowDownTrayIcon,
    prefix: "+",
  },
  withdrawal: {
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    icon: ArrowUpTrayIcon,
    prefix: "-",
  },
  swap: {
    color: "#C9A84C",
    bg: "rgba(201,168,76,0.08)",
    border: "rgba(201,168,76,0.2)",
    icon: ArrowsRightLeftIcon,
    prefix: "↔",
  },
};
const getTypeCfg = (type) =>
  typeCfg[type] || {
    color: "#3D5A70",
    bg: "rgba(201,168,76,0.04)",
    border: "rgba(201,168,76,0.1)",
    icon: ArrowsRightLeftIcon,
    prefix: "",
  };

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v || 0);

  const formatDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const hrs = (now - date) / 3600000;
    if (hrs < 24)
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (hrs < 168)
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatFullDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view transactions");
        setLoading(false);
        return;
      }
      const res = await fetch(
        "https://sukwi-be.onrender.com/api/wallet/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        const all = data.data.transactions || [];
        const deposits = all.filter((t) => t.type === "deposit").slice(0, 10);
        const withdrawals = all
          .filter((t) => t.type === "withdrawal")
          .slice(0, 10);
        const swaps = all.filter((t) => t.type === "swap").slice(0, 10);
        const combined = [...deposits, ...withdrawals, ...swaps].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setTransactions(combined);
        setError("");
      } else {
        setError(data.message || "Failed to load transactions");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const displayed =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  // ── Counts ──
  const counts = {
    all: transactions.length,
    deposit: 0,
    withdrawal: 0,
    swap: 0,
  };
  transactions.forEach((t) => {
    if (counts[t.type] !== undefined) counts[t.type]++;
  });

  if (loading && transactions.length === 0) {
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
            Loading transactions…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 80 }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <Link to="/account" style={{ textDecoration: "none" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201,168,76,0.15)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(201,168,76,0.08)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
            }}
          >
            <ArrowLeftIcon
              style={{ width: 18, height: 18, color: "#C9A84C" }}
            />
          </div>
        </Link>
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "black",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Transaction History
          </h1>
          <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
            First 10 of each type · sorted by date
          </p>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {["all", "deposit", "withdrawal", "swap"].map((tab) => {
          const cfg = tab === "all" ? null : getTypeCfg(tab);
          const active = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: `1px solid ${active ? cfg?.border || "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.1)"}`,
                background: active
                  ? cfg?.bg || "rgba(201,168,76,0.08)"
                  : "transparent",
                color: active ? cfg?.color || "#C9A84C" : "#3D5A70",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "1px 6px",
                  borderRadius: 999,
                  background: active
                    ? cfg?.border || "rgba(201,168,76,0.2)"
                    : "rgba(201,168,76,0.06)",
                  color: active ? cfg?.color || "#C9A84C" : "#2E4A60",
                }}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.2)",
            marginBottom: 14,
            fontSize: 13,
            color: "#EF4444",
          }}
        >
          {error}
        </div>
      )}

      {/* ── Table card ── */}
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
              "linear-gradient(90deg,transparent,#C9A84C,transparent)",
          }}
        />

        {/* Desktop header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 2fr 1.5fr",
            gap: 12,
            padding: "12px 20px",
            borderBottom: "1px solid rgba(201,168,76,0.07)",
          }}
          className="hidden-mobile"
        >
          {["Type", "Cryptocurrency", "Amount", "Date & Time"].map((h) => (
            <span
              key={h}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#2E4A60",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div>
          {displayed.length > 0 ? (
            displayed.map((tx, i) => {
              const cfg = getTypeCfg(tx.type);
              const Icon = cfg.icon;
              const cryptoName =
                tx.cryptocurrency.charAt(0).toUpperCase() +
                tx.cryptocurrency.slice(1).replace("-", " ");
              const isLast = i === displayed.length - 1;

              return (
                <div
                  key={tx.id || i}
                  style={{
                    padding: "13px 20px",
                    borderBottom: isLast
                      ? "none"
                      : "1px solid rgba(201,168,76,0.05)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(201,168,76,0.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Desktop row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 2fr 2fr 1.5fr",
                      gap: 12,
                      alignItems: "center",
                    }}
                    className="hidden-mobile"
                  >
                    {/* Type */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "5px 11px",
                        borderRadius: 999,
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        width: "fit-content",
                      }}
                    >
                      <Icon
                        style={{ width: 13, height: 13, color: cfg.color }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: cfg.color,
                          textTransform: "capitalize",
                        }}
                      >
                        {tx.type}
                      </span>
                    </div>

                    {/* Crypto */}
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(201,168,76,0.06)",
                          border: "1px solid rgba(201,168,76,0.12)",
                          fontSize: 14,
                          color: "#C9A84C",
                          flexShrink: 0,
                        }}
                      >
                        {cryptoIcons[tx.cryptocurrency] ||
                          tx.cryptocurrency.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "white",
                            margin: 0,
                          }}
                        >
                          {cryptoName}
                        </p>
                        <p
                          style={{ fontSize: 11, color: "#2E4A60", margin: 0 }}
                        >
                          {tx.cryptocurrency.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: cfg.color,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {cfg.prefix}
                      {formatCurrency(tx.amount)}
                    </span>

                    {/* Date */}
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "white",
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        {formatDate(tx.createdAt)}
                      </p>
                      <p style={{ fontSize: 11, color: "#2E4A60", margin: 0 }}>
                        {formatFullDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="show-mobile" style={{ display: "none" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                        }}
                      >
                        <Icon
                          style={{ width: 12, height: 12, color: cfg.color }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: cfg.color,
                            textTransform: "capitalize",
                          }}
                        >
                          {tx.type}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: cfg.color,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {cfg.prefix}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(201,168,76,0.06)",
                            border: "1px solid rgba(201,168,76,0.12)",
                            fontSize: 12,
                            color: "#C9A84C",
                          }}
                        >
                          {cryptoIcons[tx.cryptocurrency] ||
                            tx.cryptocurrency.charAt(0).toUpperCase()}
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#8EB1CE",
                          }}
                        >
                          {cryptoName}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: "#2E4A60" }}>
                        {formatDate(tx.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  margin: "0 auto 14px",
                  background: "rgba(201,168,76,0.06)",
                  border: "1px solid rgba(201,168,76,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowsRightLeftIcon
                  style={{ width: 20, height: 20, color: "#2E4A60" }}
                />
              </div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 4px",
                }}
              >
                No transactions
              </p>
              <p style={{ fontSize: 12, color: "#2E4A60", margin: 0 }}>
                Your transaction history will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Info strip ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "11px 14px",
          borderRadius: 12,
          background: "rgba(201,168,76,0.04)",
          border: "1px solid rgba(201,168,76,0.1)",
          marginTop: 12,
        }}
      >
        <InformationCircleIcon
          style={{ width: 15, height: 15, color: "#C9A84C", flexShrink: 0 }}
        />
        <p style={{ fontSize: 12, color: "#3D5A70", margin: 0 }}>
          Showing first 10 of each transaction type. For full history, contact
          support.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @media (max-width: 640px) {
          .hidden-mobile { display:none !important; }
          .show-mobile   { display:block !important; }
        }
      `}</style>
    </div>
  );
};

export default Transactions;
