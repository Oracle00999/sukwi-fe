// pages/Swap.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
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

const selectStyle = {
  background: "#04090F",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: 10,
  color: "white",
  fontSize: 13,
  fontWeight: 700,
  outline: "none",
  padding: "8px 30px 8px 10px",
  appearance: "none",
  cursor: "pointer",
  minWidth: 90,
};

const Swap = () => {
  const navigate = useNavigate();
  const [swapData, setSwapData] = useState({
    fromCrypto: "tether",
    toCrypto: "bitcoin",
    amount: "",
  });
  const [userBalances, setUserBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [swapping, setSwapping] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [swapResult, setSwapResult] = useState(null);

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
        if (first) setSwapData((p) => ({ ...p, fromCrypto: first.id }));
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

  const getBalance = (id) => userBalances[id] || 0;
  const getCrypto = (id) => cryptoOptions.find((c) => c.id === id) || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    setSwapData((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const switchCurrencies = () =>
    setSwapData((p) => ({
      fromCrypto: p.toCrypto,
      toCrypto: p.fromCrypto,
      amount: p.amount,
    }));

  const handleMax = () =>
    setSwapData((p) => ({ ...p, amount: getBalance(p.fromCrypto).toString() }));

  const handleSwap = async (e) => {
    e.preventDefault();
    const amount = parseFloat(swapData.amount);
    if (!swapData.amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (amount > getBalance(swapData.fromCrypto)) {
      setError(
        `Insufficient balance. You have ${formatCurrency(getBalance(swapData.fromCrypto))}`,
      );
      return;
    }
    if (swapData.fromCrypto === swapData.toCrypto) {
      setError("Cannot swap to the same cryptocurrency");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://sukwi-be.onrender.com/api/swap/execute",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromCrypto: swapData.fromCrypto,
            toCrypto: swapData.toCrypto,
            amount,
          }),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setSwapResult({
          from: getCrypto(swapData.fromCrypto),
          to: getCrypto(swapData.toCrypto),
          amount,
        });
        setSwapping(true);
        setTimeout(() => {
          setSwapping(false);
          setSuccess(true);
          setUserBalances((p) => ({
            ...p,
            [swapData.fromCrypto]: (p[swapData.fromCrypto] || 0) - amount,
            [swapData.toCrypto]: (p[swapData.toCrypto] || 0) + amount,
          }));
          setTimeout(() => {
            setSuccess(false);
            setSwapData((p) => ({ ...p, amount: "" }));
          }, 2500);
        }, 1500);
      } else {
        setError(data.message || "Swap failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !swapData.amount || parseFloat(swapData.amount) <= 0 || loading;

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
            Swap
          </h1>
          <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
            Trade between cryptocurrencies instantly
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
              Instant Swap
            </p>
            <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
              Trade between supported cryptocurrencies · No fees
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
            <ArrowsRightLeftIcon
              style={{ width: 18, height: 18, color: "#C9A84C" }}
            />
          </div>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* ── Swapping animation ── */}
          {swapping ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div
                style={{
                  position: "relative",
                  width: 64,
                  height: 64,
                  margin: "0 auto 20px",
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
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowsRightLeftIcon
                    style={{ width: 24, height: 24, color: "#C9A84C" }}
                  />
                </div>
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "white",
                  margin: "0 0 6px",
                }}
              >
                Processing Swap
              </h3>
              <p style={{ fontSize: 13, color: "#3D5A70" }}>
                Please wait while we process your transaction…
              </p>
            </div>
          ) : success ? (
            /* ── Success ── */
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
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
                  style={{ width: 30, height: 30, color: "#4ADE80" }}
                />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "white",
                  margin: "0 0 8px",
                }}
              >
                Swap Successful!
              </h3>
              {swapResult && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    borderRadius: 12,
                    background: "rgba(201,168,76,0.06)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    marginBottom: 24,
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 700, color: "#C9A84C" }}
                  >
                    {swapResult.from.icon}
                  </span>
                  <span style={{ fontSize: 13, color: "#8EB1CE" }}>
                    {formatCurrency(swapResult.amount)} {swapResult.from.symbol}
                  </span>
                  <ArrowsRightLeftIcon
                    style={{ width: 14, height: 14, color: "#3D5A70" }}
                  />
                  <span style={{ fontSize: 13, color: "#8EB1CE" }}>
                    {swapResult.to.symbol}
                  </span>
                  <span
                    style={{ fontSize: 14, fontWeight: 700, color: "#C9A84C" }}
                  >
                    {swapResult.to.icon}
                  </span>
                </div>
              )}
              <br />
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "11px 28px",
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
          ) : (
            /* ── Swap form ── */
            <form
              onSubmit={handleSwap}
              style={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              {/* FROM box */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: "rgba(201,168,76,0.04)",
                  border: "1px solid rgba(201,168,76,0.12)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#4A6E8A",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    }}
                  >
                    From
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span style={{ fontSize: 11, color: "#3D5A70" }}>
                      Available:
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#C9A84C",
                      }}
                    >
                      {formatCurrency(getBalance(swapData.fromCrypto))}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="text"
                    name="amount"
                    value={swapData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontSize: 28,
                      fontWeight: 900,
                      color: "white",
                      minWidth: 0,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleMax}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "1px solid rgba(201,168,76,0.25)",
                        background: "rgba(201,168,76,0.07)",
                        color: "#C9A84C",
                        fontSize: 10,
                        fontWeight: 800,
                        cursor: "pointer",
                        letterSpacing: "0.06em",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(201,168,76,0.15)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(201,168,76,0.07)")
                      }
                    >
                      MAX
                    </button>
                    <div style={{ position: "relative" }}>
                      <select
                        name="fromCrypto"
                        value={swapData.fromCrypto}
                        onChange={handleChange}
                        style={selectStyle}
                      >
                        {cryptoOptions.map((c) => (
                          <option
                            key={c.id}
                            value={c.id}
                            disabled={getBalance(c.id) <= 0}
                            style={{ background: "#07111F" }}
                          >
                            {c.symbol}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 12,
                          height: 12,
                          color: "#3D5A70",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {swapData.amount && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#3D5A70",
                      margin: "8px 0 0",
                    }}
                  >
                    ≈ {formatCurrency(parseFloat(swapData.amount))}
                  </p>
                )}

                {/* Coin name row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: "1px solid rgba(201,168,76,0.07)",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#C9A84C" }}>
                    {getCrypto(swapData.fromCrypto).icon}
                  </span>
                  <span style={{ fontSize: 12, color: "#3D5A70" }}>
                    {getCrypto(swapData.fromCrypto).name}
                  </span>
                </div>
              </div>

              {/* Switch button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "2px 0",
                }}
              >
                <button
                  type="button"
                  onClick={switchCurrencies}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg,#C9A84C,#F0C040)",
                    border: "3px solid #07111F",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 16px rgba(201,168,76,0.5)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <ArrowsRightLeftIcon
                    style={{
                      width: 16,
                      height: 16,
                      color: "#07111F",
                      transform: "rotate(90deg)",
                    }}
                  />
                </button>
              </div>

              {/* TO box */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: "rgba(201,168,76,0.04)",
                  border: "1px solid rgba(201,168,76,0.12)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#4A6E8A",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    }}
                  >
                    To (Estimate)
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span style={{ fontSize: 11, color: "#3D5A70" }}>
                      Balance:
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#C9A84C",
                      }}
                    >
                      {formatCurrency(getBalance(swapData.toCrypto))}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 900,
                        color: swapData.amount ? "white" : "#2E4A60",
                      }}
                    >
                      {swapData.amount
                        ? formatCurrency(parseFloat(swapData.amount))
                        : "$0.00"}
                    </span>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#2E4A60",
                        margin: "6px 0 0",
                      }}
                    >
                      Same USD value as input
                    </p>
                  </div>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <select
                      name="toCrypto"
                      value={swapData.toCrypto}
                      onChange={handleChange}
                      style={selectStyle}
                    >
                      {cryptoOptions.map((c) => (
                        <option
                          key={c.id}
                          value={c.id}
                          style={{ background: "#07111F" }}
                        >
                          {c.symbol}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon
                      style={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 12,
                        height: 12,
                        color: "#3D5A70",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: "1px solid rgba(201,168,76,0.07)",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#C9A84C" }}>
                    {getCrypto(swapData.toCrypto).icon}
                  </span>
                  <span style={{ fontSize: 12, color: "#3D5A70" }}>
                    {getCrypto(swapData.toCrypto).name}
                  </span>
                </div>
              </div>

              {/* Rate summary */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(201,168,76,0.03)",
                  border: "1px solid rgba(201,168,76,0.08)",
                  marginTop: 8,
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <span style={{ fontSize: 11, color: "#3D5A70" }}>
                    Exchange Rate
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "white" }}
                  >
                    1:1 USD Value
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    textAlign: "right",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#3D5A70" }}>
                    Network Fee
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80" }}
                  >
                    $0.00
                  </span>
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
                    marginTop: 4,
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
                  marginTop: 8,
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
                  "Swap Now"
                )}
              </button>

              {/* Disclaimer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  marginTop: 4,
                }}
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
                  Swap executes instantly at equal USD value. Your balances will
                  update immediately.
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

export default Swap;
