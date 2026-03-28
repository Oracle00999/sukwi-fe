// pages/Withdraw.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const cryptoOptions = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: "₿" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "Ξ" },
  { id: "tether", name: "Tether", symbol: "USDT", icon: "₮" },
  { id: "binance-coin", name: "Binance Coin", symbol: "BNB", icon: "ⓑ" },
  { id: "solana", name: "Solana", symbol: "SOL", icon: "◎" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", icon: "Ð" },
  { id: "ripple", name: "Ripple", symbol: "XRP", icon: "✕" },
  { id: "stellar", name: "Stellar", symbol: "XLM", icon: "✤" },
  { id: "tron", name: "Tron", symbol: "TRX", icon: "Ⓣ" },
];

const baseInput = {
  width: "100%",
  background: "#04090F",
  border: "1px solid rgba(201,168,76,0.15)",
  borderRadius: 12,
  color: "white",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
  padding: "0.75rem 1rem",
};
const focusStyle = { borderColor: "rgba(201,168,76,0.5)" };

const Withdraw = () => {
  const navigate = useNavigate();
  const [withdrawData, setWithdrawData] = useState({
    cryptocurrency: "tether",
    amount: "",
    toAddress: "",
  });
  const [userBalances, setUserBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [withdrawResult, setWithdrawResult] = useState(null);
  const [focused, setFocused] = useState({});

  useEffect(() => {
    fetchUserBalances();
  }, []);

  const fetchUserBalances = async () => {
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
        const balances = data.data.user.wallet.balances || {};
        setUserBalances(balances);
        const first = cryptoOptions.find((c) => balances[c.id] > 0);
        if (first) setWithdrawData((p) => ({ ...p, cryptocurrency: first.id }));
      } else {
        setError(data.message || "Failed to fetch balances");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v || 0);

  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getCrypto = (id) => cryptoOptions.find((c) => c.id === id) || {};
  const getBalance = (id) => userBalances[id] || 0;
  const withBalance = cryptoOptions.filter((c) => getBalance(c.id) > 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    setWithdrawData((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const handleMax = () =>
    setWithdrawData((p) => ({
      ...p,
      amount: getBalance(p.cryptocurrency).toString(),
    }));

  const validateAddress = (crypto, address) => {
    const a = address.trim();
    if (!a) return "Please enter a destination address";
    switch (crypto) {
      case "bitcoin":
        if (!/^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/.test(a))
          return "Invalid Bitcoin address format";
        break;
      case "ethereum":
      case "tether":
        if (!/^0x[a-fA-F0-9]{40}$/.test(a))
          return "Invalid Ethereum/Tether address format";
        break;
      case "tron":
        if (!/^T[a-zA-Z0-9]{33}$/.test(a)) return "Invalid TRON address format";
        break;
      default:
        if (a.length < 20) return "Address appears too short";
    }
    return "";
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawData.amount);
    if (!withdrawData.amount || amount <= 0) {
      setError("Please enter a valid withdrawal amount");
      return;
    }
    if (amount > getBalance(withdrawData.cryptocurrency)) {
      setError(
        `Insufficient balance. You have ${formatCurrency(getBalance(withdrawData.cryptocurrency))}`,
      );
      return;
    }
    if (amount < 10) {
      setError("Minimum withdrawal amount is $10");
      return;
    }
    const addrErr = validateAddress(
      withdrawData.cryptocurrency,
      withdrawData.toAddress,
    );
    if (addrErr) {
      setError(addrErr);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://sukwi-be.onrender.com/api/wallet/withdraw/request",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            cryptocurrency: withdrawData.cryptocurrency,
            toAddress: withdrawData.toAddress.trim(),
          }),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setWithdrawResult(data.data);
        setSuccess(true);
        setUserBalances((p) => ({
          ...p,
          [withdrawData.cryptocurrency]:
            (p[withdrawData.cryptocurrency] || 0) - amount,
        }));
        setWithdrawData((p) => ({ ...p, amount: "", toAddress: "" }));
      } else {
        setError(
          data.message || "Withdrawal request failed. Please try again.",
        );
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled =
    submitting || !withdrawData.amount || parseFloat(withdrawData.amount) < 10;
  const selectedCrypto = getCrypto(withdrawData.cryptocurrency);
  const selectedBalance = getBalance(withdrawData.cryptocurrency);

  // ── Loading ──
  if (loading && Object.keys(userBalances).length === 0) {
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
            Loading your balances…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 80 }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
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
            Withdraw Funds
          </h1>
          <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
            Transfer funds to external wallet · No fees
          </p>
        </div>
      </div>

      {/* ── Main card ── */}
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 20,
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
              Withdraw Cryptocurrency
            </p>
            <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
              Send funds to an external wallet address
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
            <ArrowUpTrayIcon
              style={{ width: 18, height: 18, color: "#C9A84C" }}
            />
          </div>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {success && withdrawResult ? (
            /* ── Success state ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    margin: "0 auto 14px",
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
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "white",
                    margin: "0 0 6px",
                  }}
                >
                  Withdrawal Request Submitted!
                </h3>
                <p style={{ fontSize: 13, color: "#3D5A70", margin: 0 }}>
                  Your withdrawal is being processed.
                </p>
              </div>

              {/* Withdrawal details */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: "rgba(201,168,76,0.03)",
                  border: "1px solid rgba(201,168,76,0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#4A6E8A",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 12px",
                  }}
                >
                  Withdrawal Details
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[
                    [
                      "Transaction ID",
                      withdrawResult.transaction?.transactionId || "N/A",
                    ],
                    [
                      "Amount",
                      formatCurrency(withdrawResult.transaction?.amount),
                    ],
                    [
                      "Cryptocurrency",
                      getCrypto(withdrawResult.transaction?.cryptocurrency)
                        .name,
                    ],
                    [
                      "Request Time",
                      formatDate(withdrawResult.transaction?.createdAt),
                    ],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#3D5A70" }}>
                        {label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "white",
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#3D5A70" }}>
                      Destination
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: "monospace",
                        color: "white",
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {withdrawData.toAddress ||
                        withdrawResult.transaction?.toAddress}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#3D5A70" }}>
                      Status
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: "rgba(245,158,11,0.08)",
                        border: "1px solid rgba(245,158,11,0.2)",
                        color: "#F59E0B",
                      }}
                    >
                      {withdrawResult.transaction?.status || "pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Processing info */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: "rgba(201,168,76,0.03)",
                  border: "1px solid rgba(201,168,76,0.08)",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#4A6E8A",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 10px",
                  }}
                >
                  Processing Information
                </p>
                {[
                  "Withdrawals are processed within 24 hours.",
                  "Check transaction status in your transaction history.",
                  "Contact support if withdrawal is delayed beyond 48 hours.",
                ].map((item, i) => (
                  <div
                    key={i}
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
                        color: "#3D5A70",
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <button
                  onClick={() => setSuccess(false)}
                  style={{
                    padding: "12px",
                    borderRadius: 12,
                    border: "1px solid rgba(201,168,76,0.25)",
                    background: "rgba(201,168,76,0.06)",
                    color: "#C9A84C",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(201,168,76,0.12)";
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(201,168,76,0.06)";
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
                  }}
                >
                  New Withdrawal
                </button>
                <Link to="/dashboard" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: 12,
                      border: "none",
                      background: "linear-gradient(135deg,#C9A84C,#F0C040)",
                      color: "#07111F",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(201,168,76,0.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* ── Withdraw form ── */
            <form
              onSubmit={handleWithdraw}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              {/* No balance warning */}
              {withBalance.length === 0 && (
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "rgba(245,158,11,0.06)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    fontSize: 13,
                    color: "#F59E0B",
                  }}
                >
                  No funded wallets found. Please deposit funds first.
                </div>
              )}

              {/* Cryptocurrency select */}
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
                  Select Cryptocurrency
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    name="cryptocurrency"
                    value={withdrawData.cryptocurrency}
                    onChange={handleChange}
                    onFocus={() => setFocused((p) => ({ ...p, crypto: true }))}
                    onBlur={() => setFocused((p) => ({ ...p, crypto: false }))}
                    style={{
                      ...baseInput,
                      appearance: "none",
                      paddingRight: 36,
                      ...(focused.crypto ? focusStyle : {}),
                    }}
                  >
                    {withBalance.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                        style={{ background: "#07111F" }}
                      >
                        {c.name} ({c.symbol}) —{" "}
                        {formatCurrency(getBalance(c.id))}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 15,
                      height: 15,
                      color: "#3D5A70",
                      pointerEvents: "none",
                    }}
                  />
                </div>

                {/* Balance pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    marginTop: 8,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(201,168,76,0.06)",
                    border: "1px solid rgba(201,168,76,0.12)",
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#F0C040" }}
                  >
                    {selectedCrypto.icon}
                  </span>
                  <span style={{ fontSize: 12, color: "#4A6E8A" }}>
                    Balance:{" "}
                    <span style={{ color: "#C9A84C", fontWeight: 700 }}>
                      {formatCurrency(selectedBalance)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Amount + MAX */}
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
                  Withdrawal Amount (USD)
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <input
                      type="text"
                      name="amount"
                      value={withdrawData.amount}
                      onChange={handleChange}
                      onFocus={() =>
                        setFocused((p) => ({ ...p, amount: true }))
                      }
                      onBlur={() =>
                        setFocused((p) => ({ ...p, amount: false }))
                      }
                      placeholder="0.00"
                      style={{
                        ...baseInput,
                        fontSize: 24,
                        fontWeight: 800,
                        paddingRight: 56,
                        ...(focused.amount ? focusStyle : {}),
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#3D5A70",
                      }}
                    >
                      USD
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleMax}
                    style={{
                      padding: "0 18px",
                      borderRadius: 12,
                      border: "1px solid rgba(201,168,76,0.25)",
                      background: "rgba(201,168,76,0.07)",
                      color: "#C9A84C",
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                      letterSpacing: "0.05em",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(201,168,76,0.15)";
                      e.currentTarget.style.borderColor =
                        "rgba(201,168,76,0.45)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(201,168,76,0.07)";
                      e.currentTarget.style.borderColor =
                        "rgba(201,168,76,0.25)";
                    }}
                  >
                    MAX
                  </button>
                </div>
                <p
                  style={{ fontSize: 11, color: "#2E4A60", margin: "6px 0 0" }}
                >
                  Minimum withdrawal: $10.00 · No fees
                </p>
              </div>

              {/* Destination address */}
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
                  Destination Wallet Address
                </label>
                <textarea
                  name="toAddress"
                  value={withdrawData.toAddress}
                  onChange={handleChange}
                  onFocus={() => setFocused((p) => ({ ...p, addr: true }))}
                  onBlur={() => setFocused((p) => ({ ...p, addr: false }))}
                  placeholder={`Enter ${selectedCrypto.name || ""} address…`}
                  rows={3}
                  style={{
                    ...baseInput,
                    fontFamily: "monospace",
                    fontSize: 13,
                    resize: "none",
                    lineHeight: 1.6,
                    ...(focused.addr ? focusStyle : {}),
                  }}
                />
                <p
                  style={{ fontSize: 11, color: "#2E4A60", margin: "6px 0 0" }}
                >
                  Double-check the address — funds cannot be recovered if sent
                  to the wrong address.
                </p>
              </div>

              {/* Summary row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(201,168,76,0.03)",
                  border: "1px solid rgba(201,168,76,0.1)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#3D5A70",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Amount to Withdraw
                  </p>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "white",
                      margin: "3px 0 0",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {withdrawData.amount
                      ? formatCurrency(parseFloat(withdrawData.amount))
                      : "$0.00"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#3D5A70",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Network Fee
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#4ADE80",
                      margin: "3px 0 0",
                    }}
                  >
                    $0.00
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  <XCircleIcon
                    style={{
                      width: 15,
                      height: 15,
                      color: "#EF4444",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, color: "#EF4444" }}>
                    {error}
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isDisabled}
                style={{
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
                    Processing…
                  </span>
                ) : (
                  "Withdraw Funds"
                )}
              </button>

              {/* Disclaimer */}
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
              >
                <InformationCircleIcon
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
                  Withdrawals are processed within 24 hours. Ensure the
                  destination address is correct before submitting.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default Withdraw;
