// pages/Deposit.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  DocumentDuplicateIcon,
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

const infoItems = [
  "Deposits are processed after blockchain confirmation.",
  "Minimum deposit amount is $10.00.",
  "Always double-check the deposit address before sending.",
  "Contact support if deposit is not credited within 24 hours.",
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

const Deposit = () => {
  const navigate = useNavigate();
  const [depositData, setDepositData] = useState({
    cryptocurrency: "bitcoin",
    amount: "",
    txHash: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [depositResult, setDepositResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState({});

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v || 0);

  const formatDate = (d) =>
    new Date(d).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getCrypto = (id) => cryptoOptions.find((c) => c.id === id) || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    setDepositData((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositData.amount);
    if (!depositData.amount || amount <= 0) {
      setError("Please enter a valid deposit amount");
      return;
    }
    if (amount < 10) {
      setError("Minimum deposit amount is $10");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await fetch(
        "https://sukwi-be.onrender.com/api/wallet/deposit/request",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            cryptocurrency: depositData.cryptocurrency,
            txHash: depositData.txHash || undefined,
          }),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setDepositResult(data.data);
        setSuccess(true);
        setDepositData({ cryptocurrency: "bitcoin", amount: "", txHash: "" });
      } else {
        setError(data.message || "Deposit request failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading || !depositData.amount || parseFloat(depositData.amount) < 10;
  const selectedCrypto = getCrypto(depositData.cryptocurrency);

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
            Deposit Funds
          </h1>
          <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
            Add cryptocurrency to your wallet
          </p>
        </div>
      </div>

      {/* ── Main card ── */}
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 20,
          background: "linear-gradient(160deg, #0C1C36 0%, #070F1C 100%)",
          border: "1px solid rgba(201,168,76,0.18)",
          boxShadow: "0 0 50px rgba(201,168,76,0.06)",
        }}
      >
        {/* Top hairline */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #C9A84C, transparent)",
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
              Make a Deposit
            </p>
            <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
              Deposit cryptocurrency to your wallet
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
            <ArrowDownTrayIcon
              style={{ width: 18, height: 18, color: "#C9A84C" }}
            />
          </div>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {success && depositResult ? (
            /* ── Success state ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Success icon + message */}
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
                  Deposit Request Submitted!
                </h3>
                <p style={{ fontSize: 13, color: "#3D5A70", margin: 0 }}>
                  Your deposit request has been received and is pending
                  confirmation.
                </p>
              </div>

              {/* Deposit address */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: "rgba(201,168,76,0.04)",
                  border: "1px solid rgba(201,168,76,0.15)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#4A6E8A",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {getCrypto(depositResult.transaction.cryptocurrency).name}{" "}
                    Deposit Address
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(depositResult.depositAddress)
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: copied ? "#4ADE80" : "#C9A84C",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      padding: 0,
                      transition: "color 0.2s",
                    }}
                  >
                    <DocumentDuplicateIcon style={{ width: 13, height: 13 }} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#04090F",
                    border: "1px solid rgba(201,168,76,0.1)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: 12,
                      color: "white",
                      margin: 0,
                      wordBreak: "break-all",
                      lineHeight: 1.6,
                    }}
                  >
                    {depositResult.depositAddress}
                  </p>
                </div>
                <p
                  style={{ fontSize: 11, color: "#3D5A70", margin: "8px 0 0" }}
                >
                  Send funds to this address. The deposit will be credited after
                  blockchain confirmation.
                </p>
              </div>

              {/* Transaction details */}
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
                  Transaction Details
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[
                    ["Transaction ID", depositResult.transaction.transactionId],
                    [
                      "Amount",
                      formatCurrency(depositResult.transaction.amount),
                    ],
                    [
                      "Cryptocurrency",
                      getCrypto(depositResult.transaction.cryptocurrency).name,
                    ],
                    [
                      "Request Time",
                      formatDate(depositResult.transaction.createdAt),
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
                      {depositResult.transaction.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next steps */}
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
                  Next Steps
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {[
                    "Send the exact amount to the deposit address above.",
                    "Wait for blockchain confirmation (usually 2–6 confirmations).",
                    "Your funds will be credited after admin verification.",
                    "Check deposit status in your transaction history.",
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 10 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#C9A84C",
                          flexShrink: 0,
                          minWidth: 16,
                        }}
                      >
                        {i + 1}.
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#3D5A70",
                          lineHeight: 1.5,
                        }}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
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
                  New Deposit
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
            /* ── Deposit form ── */
            <form
              onSubmit={handleDeposit}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
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
                    value={depositData.cryptocurrency}
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
                    {cryptoOptions.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                        style={{ background: "#07111F" }}
                      >
                        {c.name} ({c.symbol})
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
                {/* Selected crypto pill */}
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
                    {selectedCrypto.name} selected
                  </span>
                </div>
              </div>

              {/* Amount */}
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
                  Deposit Amount (USD)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    name="amount"
                    value={depositData.amount}
                    onChange={handleChange}
                    onFocus={() => setFocused((p) => ({ ...p, amount: true }))}
                    onBlur={() => setFocused((p) => ({ ...p, amount: false }))}
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
                <p
                  style={{ fontSize: 11, color: "#2E4A60", margin: "6px 0 0" }}
                >
                  Minimum deposit: $10.00
                </p>
              </div>

              {/* TX hash */}
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
                  Transaction Hash{" "}
                  <span
                    style={{
                      color: "#2E4A60",
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  name="txHash"
                  value={depositData.txHash}
                  onChange={handleChange}
                  onFocus={() => setFocused((p) => ({ ...p, txHash: true }))}
                  onBlur={() => setFocused((p) => ({ ...p, txHash: false }))}
                  placeholder="0x..."
                  style={{
                    ...baseInput,
                    fontFamily: "monospace",
                    fontSize: 13,
                    ...(focused.txHash ? focusStyle : {}),
                  }}
                />
                <p
                  style={{ fontSize: 11, color: "#2E4A60", margin: "6px 0 0" }}
                >
                  Provide if you've already sent the transaction
                </p>
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
                  "Request Deposit"
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
                  Deposit will be processed after blockchain confirmation.
                  Please ensure you send funds to the correct address.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Info panel ── */}
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          background: "linear-gradient(160deg,#0C1C36,#070F1C)",
          border: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)",
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
            Deposit Information
          </p>
        </div>
        <div
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {infoItems.map((item, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#C9A84C",
                  flexShrink: 0,
                  marginTop: 5,
                }}
              />
              <span style={{ fontSize: 13, color: "#3D5A70", lineHeight: 1.5 }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default Deposit;
