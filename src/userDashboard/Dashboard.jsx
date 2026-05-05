// pages/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBitcoin,
  FaCoins,
  FaHospital,
  FaLink,
  FaMoneyBillTransfer,
  FaRegBell,
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaRegClock,
  FaRegCreditCard,
  FaShieldHalved,
  FaWallet,
} from "react-icons/fa6";

const PRICE_FETCH_INTERVAL = 5 * 60 * 60 * 1000;

const tokenIds = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  tether: "tether",
  "binance-coin": "binancecoin",
  solana: "solana",
  dogecoin: "dogecoin",
  ripple: "ripple",
  stellar: "stellar",
  tron: "tron",
};

const tokenDisplayNames = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  tether: "Tether",
  "binance-coin": "Binance Coin",
  solana: "Solana",
  dogecoin: "Dogecoin",
  ripple: "Ripple",
  stellar: "Stellar",
  tron: "Tron",
};

const tokenSymbols = {
  bitcoin: "BTC",
  ethereum: "ETH",
  tether: "USDT",
  "binance-coin": "BNB",
  solana: "SOL",
  dogecoin: "DOGE",
  ripple: "XRP",
  stellar: "XLM",
  tron: "TRX",
};

const tokenCoinGeckoIds = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  tether: "tether",
  "binance-coin": "binancecoin",
  solana: "solana",
  dogecoin: "dogecoin",
  ripple: "ripple",
  stellar: "stellar",
  tron: "tron",
};

const notifications = [
  { id: 1, message: "Welcome to QFS Ledger!", read: false },
];

const actionButtons = [
  { to: "/deposit", icon: FaWallet, label: "Deposit" },
  { to: "/withdraw", icon: FaMoneyBillTransfer, label: "Receive" },
  { to: "/link", icon: FaLink, label: "Link" },
  { to: "/kyc-verify", icon: FaShieldHalved, label: "Verify" },
  { to: "/medbed", icon: FaHospital, label: "Medbed" },
  { to: "/buy", icon: FaBitcoin, label: "Buy Crypto" },
  { to: "/staking", icon: FaCoins, label: "Staking" },
  { to: "/card-creation", icon: FaRegCreditCard, label: "Card" },
];

const kycConfig = {
  verified: {
    icon: FaRegCircleCheck,
    label: "KYC Verified",
    className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-400",
  },
  pending: {
    icon: FaRegClock,
    label: "KYC Pending",
    className: "border-amber-400/25 bg-amber-400/10 text-amber-400",
  },
};

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [tokenPrices, setTokenPrices] = useState({});
  const [tokenLogos, setTokenLogos] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [tokenAmounts, setTokenAmounts] = useState({});

  const fetchTokenLogos = async () => {
    try {
      const ids = Object.values(tokenCoinGeckoIds).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&per_page=20&sparkline=false`,
      );
      if (!res.ok) return;

      const data = await res.json();
      const logos = {};
      data.forEach((coin) => {
        const key = Object.keys(tokenCoinGeckoIds).find(
          (k) => tokenCoinGeckoIds[k] === coin.id,
        );
        if (key) logos[key] = coin.image;
      });
      setTokenLogos(logos);
    } catch (e) {
      console.error("Logo fetch failed:", e);
    }
  };

  const fetchTokenPrices = async (isInitial = false) => {
    try {
      const ids = Object.values(tokenIds).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      );
      if (!res.ok) return;

      const data = await res.json();
      const prices = {};
      Object.keys(tokenIds).forEach((key) => {
        const id = tokenIds[key];
        if (data[id]) prices[key] = data[id].usd;
      });
      setTokenPrices((prev) => {
        const merged = { ...prev, ...prices };
        if (isInitial) calculateTokenAmounts(merged);
        return merged;
      });
    } catch (e) {
      console.error("Price fetch failed:", e);
    }
  };

  const calculateTokenAmounts = (prices) => {
    if (!userData?.wallet?.balances) return;

    const amounts = {};
    Object.keys(userData.wallet.balances).forEach((token) => {
      const usd = userData.wallet.balances[token];
      const price = prices[token];
      amounts[token] = price > 0 ? usd / price : 0;
    });
    setTokenAmounts(amounts);
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("https://sukwi-be.onrender.com/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok && data.success) setUserData(data.data.user);
    } catch (e) {
      console.error("User fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchTokenLogos();
    const id = setInterval(fetchUserData, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (userData?.wallet?.balances && !initialized) {
      fetchTokenPrices(true);
      setInitialized(true);
    }

    if (initialized) {
      const id = setInterval(fetchTokenPrices, PRICE_FETCH_INTERVAL);
      return () => clearInterval(id);
    }
  }, [userData, initialized]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);

  const formatTokenAmount = (amount, token) => {
    if (!amount) return "0";
    const precision = {
      bitcoin: 6,
      ethereum: 4,
      tether: 2,
      "binance-coin": 4,
      solana: 2,
      dogecoin: 0,
      ripple: 0,
      stellar: 0,
      tron: 0,
    };
    return parseFloat(amount).toFixed(precision[token] ?? 4);
  };

  const totalBalance = userData?.wallet?.balances
    ? Object.values(userData.wallet.balances).reduce((sum, value) => sum + value, 0)
    : 0;

  const sortedTokens = userData?.wallet?.balances
    ? Object.entries(userData.wallet.balances)
        .map(([token, usdBalance]) => ({
          token,
          usdBalance,
          tokenAmount: formatTokenAmount(tokenAmounts[token] || 0, token),
          price: tokenPrices[token] || 0,
        }))
        .sort((a, b) => b.usdBalance - a.usdBalance)
    : [];

  const KycBadge = ({ status }) => {
    const cfg =
      kycConfig[status] || {
        icon: FaRegCircleXmark,
        label: "KYC Required",
        className: "border-red-400/25 bg-red-400/10 text-red-400",
      };

    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-[0.05em] ${cfg.className}`}
      >
        {React.createElement(cfg.icon, { className: "h-3.5 w-3.5" })}
        <span>{cfg.label}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-4 h-14 w-14">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#C9A84C]/10" />
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#C9A84C]" />
          </div>
          <p className="text-sm font-medium text-[#3D5A70]">
            Loading your wallet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="relative mb-6 overflow-hidden rounded-[20px] border border-[#C9A84C]/30 bg-[radial-gradient(circle_at_16%_18%,rgba(240,192,64,0.28),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(56,189,248,0.12),transparent_26%),linear-gradient(135deg,#04090F_0%,#0C1E38_48%,#07111F_100%)] shadow-[0_0_60px_rgba(201,168,76,0.10),inset_0_1px_0_rgba(201,168,76,0.15)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12),transparent_28%,rgba(201,168,76,0.10)_72%,transparent)] opacity-85" />
        <div className="relative z-[2] h-px bg-[linear-gradient(90deg,transparent,#C9A84C,#F0C040,#C9A84C,transparent)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(rgba(201,168,76,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.12)_1px,transparent_1px)] bg-[length:34px_34px] opacity-10 [mask-image:linear-gradient(135deg,rgba(0,0,0,0.8),transparent_72%)]" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 z-[1] h-56 w-56 rounded-full border border-[#C9A84C]/15 shadow-[inset_0_0_0_28px_rgba(201,168,76,0.025),inset_0_0_0_56px_rgba(201,168,76,0.02)]" />

        <div className="relative z-[2] px-6 pb-5 pt-6">
          <div className="mb-5 flex items-center justify-between">
            <KycBadge status={userData?.kycStatus} />

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((value) => !value)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/10 transition hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/15"
              >
                <FaRegBell className="h-4 w-4 text-[#C9A84C]" />
                {notifications.some((notification) => !notification.read) && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-[#07111F] bg-red-500" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-2xl border border-[#C9A84C]/20 bg-[#0C1E38] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                  <div className="h-px bg-[linear-gradient(90deg,transparent,#C9A84C,transparent)]" />
                  <div className="border-b border-[#C9A84C]/10 px-4 py-3">
                    <p className="m-0 text-sm font-bold text-white">
                      Notifications
                    </p>
                    <p className="mt-0.5 text-xs text-[#3D5A70]">
                      1 new message
                    </p>
                  </div>
                  <div className="p-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between rounded-xl border border-[#C9A84C]/10 bg-[#C9A84C]/5 px-3 py-2.5"
                      >
                        <p className="m-0 text-sm text-[#C5CDD6]">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#C9A84C]/10 px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="w-full border-0 bg-transparent text-xs font-semibold text-[#3D5A70] transition hover:text-[#C9A84C]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#3D5A70]">
              Total Portfolio Balance
            </p>
            <p className="m-0 text-[clamp(2rem,6vw,2.8rem)] font-black leading-none tracking-[-0.03em] text-white">
              {formatCurrency(totalBalance)}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A84C]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9A84C]">
                Quantum-Secured · Live
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-4 gap-2">
        {actionButtons.map(({ to, icon, label }) => (
          <Link key={label} to={to} className="group no-underline">
            <div className="flex flex-col items-center justify-center gap-2 rounded-[14px] border border-[#C9A84C]/20 bg-[#C9A84C]/5 px-3 py-4 transition-all group-hover:border-[#C9A84C]/40 group-hover:bg-[#C9A84C]/10 group-hover:shadow-[0_4px_16px_rgba(201,168,76,0.10)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#C9A84C]/25 bg-[#C9A84C]/10">
                {React.createElement(icon, {
                  className: "h-[18px] w-[18px] text-[#C9A84C]",
                })}
              </div>
              <span className="text-center text-xs font-semibold text-[#8EB1CE]">
                {label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <section className="mb-6 overflow-hidden rounded-[20px] border border-[#C9A84C]/10 bg-[linear-gradient(160deg,#0C1C36_0%,#070F1C_100%)]">
        <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)]" />
        <div className="flex items-center justify-between border-b border-[#C9A84C]/10 px-5 py-4">
          <div>
            <p className="m-0 text-sm font-bold text-white">Your Assets</p>
            <p className="mt-0.5 text-[11px] text-[#3D5A70]">
              {sortedTokens.length} tokens
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#3D5A70]">
              Live prices
            </span>
          </div>
        </div>

        <div className="p-3">
          {sortedTokens.map(({ token, usdBalance, tokenAmount, price }) => (
            <div
              key={token}
              className="mb-1.5 flex items-center justify-between rounded-[14px] border border-[#C9A84C]/5 bg-[#C9A84C]/[0.015] px-3.5 py-3 transition-all hover:border-[#C9A84C]/20 hover:bg-[#C9A84C]/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C9A84C]/15 bg-[#04090F]">
                  {tokenLogos[token] ? (
                    <img
                      src={tokenLogos[token]}
                      alt={token}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <span className="text-sm font-extrabold text-[#C9A84C]">
                      {tokenSymbols[token]?.[0]}
                    </span>
                  )}
                </div>
                <div>
                  <p className="m-0 text-sm font-bold text-white">
                    {tokenDisplayNames[token]}
                  </p>
                  <p className="mt-0.5 text-[11px] tabular-nums text-[#3D5A70]">
                    {tokenAmount}{" "}
                    <span className="text-[#2E4A60]">
                      {tokenSymbols[token]}
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="m-0 text-sm font-bold tabular-nums text-white">
                  {formatCurrency(usdBalance)}
                </p>
                <p className="mt-0.5 text-[11px] tabular-nums text-[#3D5A70]">
                  {price > 0 ? formatCurrency(price) : "—"}
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                    usdBalance > 0
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                      : "border-[#C9A84C]/10 bg-[#C9A84C]/5 text-[#2E4A60]"
                  }`}
                >
                  {usdBalance > 0 ? "Active" : "Empty"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-20 flex items-start gap-3 rounded-[14px] border border-[#C9A84C]/10 bg-[#C9A84C]/5 px-4 py-3.5">
        <FaShieldHalved className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#C9A84C]" />
        <p className="m-0 text-xs leading-5 text-[#3D5A70]">
          All assets are protected by quantum-resistant encryption and FRA fund
          recovery system. Prices update every 5 hours.
        </p>
      </div>
    </>
  );
};

export default UserDashboard;
