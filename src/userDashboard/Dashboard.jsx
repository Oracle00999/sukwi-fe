// pages/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBitcoin,
  FaCoins,
  FaHospital,
  FaLink,
  FaMoneyBillTransfer,
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
    ? Object.values(userData.wallet.balances).reduce(
        (sum, value) => sum + value,
        0,
      )
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
    const cfg = kycConfig[status] || {
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
    <div className="-m-3 min-h-[calc(100vh-64px)] bg-[#04090F] text-white sm:-m-4 lg:-m-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <section className="relative mb-7 aspect-[1.9/1] min-h-[210px] overflow-hidden rounded-[28px] border border-[#C9A84C]/25 bg-[linear-gradient(135deg,#07111F_0%,#0C1E38_48%,#04090F_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.04)] sm:mx-auto sm:min-h-0 sm:w-full sm:max-w-[520px] lg:max-w-[560px]">
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(201,168,76,0.24)_0%,transparent_34%),linear-gradient(292deg,rgba(92,225,230,0.18)_0%,transparent_38%)]" />
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(247,228,165,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(247,228,165,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute left-0 top-0 h-full w-2/3 bg-[linear-gradient(130deg,rgba(255,255,255,0.12),transparent_42%)]" />
          <div className="absolute bottom-0 right-0 h-28 w-3/5 skew-x-[-24deg] rounded-tl-[38px] bg-[linear-gradient(120deg,rgba(201,168,76,0.18),rgba(92,225,230,0.12))]" />

          <div className="relative z-[2] flex h-full flex-col justify-between p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="m-0 text-2xl font-black leading-none text-white sm:text-4xl">
                  <span className="text-[#C9A84C]">Web3</span> Ledger
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8EB1CE]">
                  Web3 Asset Wallet
                </p>
              </div>

              <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl border border-[#F7E4A5]/30 bg-[#F7E4A5]/10">
                <div className="grid grid-cols-2 gap-1">
                  <span className="h-2.5 w-4 rounded-sm bg-[#F7E4A5]/70" />
                  <span className="h-2.5 w-4 rounded-sm bg-[#F7E4A5]/45" />
                  <span className="h-2.5 w-4 rounded-sm bg-[#F7E4A5]/45" />
                  <span className="h-2.5 w-4 rounded-sm bg-[#F7E4A5]/70" />
                </div>
              </div>
            </div>

            <div className="grid max-w-[76%] grid-cols-4 gap-2">
              <span className="h-2 rounded-full bg-[#F7E4A5]/35" />
              <span className="h-2 rounded-full bg-[#F7E4A5]/35" />
              <span className="h-2 rounded-full bg-[#F7E4A5]/35" />
              <span className="h-2 rounded-full bg-[#F7E4A5]/35" />
            </div>

            <div className="flex items-end justify-between gap-4">
              <KycBadge status={userData?.kycStatus} />
              <p className="m-0 text-right text-xs font-bold uppercase tracking-[0.18em] text-[#8EB1CE]">
                Wallet ID
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7">
          <p className="mb-2 text-lg font-medium text-[#8EB1CE]">Balance</p>
          <p className="m-0 text-[clamp(3rem,12vw,5.6rem)] font-black leading-none text-white">
            {formatCurrency(totalBalance)}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#C9A84C]" />
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#C9A84C]">
              Live Portfolio
            </span>
          </div>
        </section>

        <div className="mb-8 grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-8">
          {actionButtons.map(({ to, icon, label }) => (
            <Link key={label} to={to} className="group no-underline">
              <div className="flex flex-col items-center gap-2.5">
                <div className="flex h-16 w-full min-w-0 items-center justify-center rounded-[22px] border border-[#C9A84C]/25 bg-[#F7E4A5] text-[#04090F] shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-all group-hover:-translate-y-0.5 group-hover:bg-white group-hover:shadow-[0_16px_32px_rgba(201,168,76,0.16)] sm:h-14">
                  {React.createElement(icon, {
                    className: "h-6 w-6",
                  })}
                </div>
                <span className="max-w-full truncate text-center text-xs font-semibold text-[#8EB1CE]">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mb-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="m-0 text-3xl font-black leading-none text-white">
                Tokens
              </h2>
              <p className="mt-2 text-xs font-medium text-[#3D5A70]">
                {sortedTokens.length} assets in your wallet
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8EB1CE]">
                Live prices
              </span>
            </div>
          </div>

          <div className="divide-y divide-[#C9A84C]/10">
            {sortedTokens.map(({ token, usdBalance, tokenAmount, price }) => (
              <div
                key={token}
                className="flex items-center justify-between gap-4 py-5 transition-colors hover:bg-[#C9A84C]/[0.03]"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black ring-1 ring-[#C9A84C]/15">
                    {tokenLogos[token] ? (
                      <img
                        src={tokenLogos[token]}
                        alt={token}
                        className="h-full w-full rounded-full bg-black object-contain p-2"
                      />
                    ) : (
                      <span className="text-xl font-black text-[#F0C040]">
                        {tokenSymbols[token]?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 truncate text-xl font-semibold text-white">
                      {tokenDisplayNames[token]}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium tabular-nums text-[#8EB1CE]">
                      {tokenAmount} {tokenSymbols[token]}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="m-0 text-xl font-semibold tabular-nums text-white">
                    {formatCurrency(usdBalance)}
                  </p>
                  <p className="mt-1 text-xs font-medium tabular-nums text-[#8EB1CE]">
                    {price > 0 ? formatCurrency(price) : "Price loading"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* <div className="flex items-start gap-3 rounded-[18px] border border-[#C9A84C]/10 bg-[#C9A84C]/5 px-4 py-3.5">
          <FaShieldHalved className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#C9A84C]" />
          <p className="m-0 text-xs leading-5 text-[#8EB1CE]">
            All assets are protected by quantum-resistant encryption and FRA
            fund recovery system. Prices update every 5 hours.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default UserDashboard;
