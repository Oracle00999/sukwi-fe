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
import {
  tokenCoinGeckoIds,
  tokenDisplayNames,
  tokenIds,
  tokenPrecision,
  tokenSymbols,
} from "./tokenConfig";
import { DashboardSkeleton } from "./Skeletons";

const PRICE_FETCH_INTERVAL = 5 * 60 * 60 * 1000;

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
    return parseFloat(amount).toFixed(tokenPrecision[token] ?? 4);
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
    return <DashboardSkeleton />;
  }

  return (
    <div className="-m-3 min-h-[calc(100vh-64px)] bg-[#04090F] text-white sm:-m-4 lg:-m-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-24 pt-4 sm:px-5 lg:px-6">
        <section className="relative mb-5 aspect-[1.9/1] min-h-[180px] overflow-hidden rounded-[22px] border border-[#C9A84C]/25 bg-[linear-gradient(135deg,#07111F_0%,#0C1E38_48%,#04090F_100%)] shadow-[0_14px_38px_rgba(0,0,0,0.32),inset_0_0_0_1px_rgba(255,255,255,0.04)] sm:mx-auto sm:min-h-0 sm:w-full sm:max-w-[460px] lg:max-w-[500px]">
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(201,168,76,0.24)_0%,transparent_34%),linear-gradient(292deg,rgba(92,225,230,0.18)_0%,transparent_38%)]" />
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(247,228,165,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(247,228,165,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute left-0 top-0 h-full w-2/3 bg-[linear-gradient(130deg,rgba(255,255,255,0.12),transparent_42%)]" />
          <div className="absolute bottom-0 right-0 h-24 w-3/5 skew-x-[-24deg] rounded-tl-[32px] bg-[linear-gradient(120deg,rgba(201,168,76,0.18),rgba(92,225,230,0.12))]" />

          <div className="relative z-[2] flex h-full flex-col justify-between p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="m-0 text-[1.35rem] font-black leading-none text-white sm:text-3xl">
                  <span className="text-[#C9A84C]">Web3</span> Ledger
                </p>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8EB1CE] sm:text-xs">
                  Web3 Asset Wallet
                </p>
              </div>

              <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg border border-[#F7E4A5]/30 bg-[#F7E4A5]/10">
                <div className="grid grid-cols-2 gap-1">
                  <span className="h-2 w-3.5 rounded-sm bg-[#F7E4A5]/70" />
                  <span className="h-2 w-3.5 rounded-sm bg-[#F7E4A5]/45" />
                  <span className="h-2 w-3.5 rounded-sm bg-[#F7E4A5]/45" />
                  <span className="h-2 w-3.5 rounded-sm bg-[#F7E4A5]/70" />
                </div>
              </div>
            </div>

            <div className="grid max-w-[70%] grid-cols-4 gap-1.5">
              <span className="h-1.5 rounded-full bg-[#F7E4A5]/35" />
              <span className="h-1.5 rounded-full bg-[#F7E4A5]/35" />
              <span className="h-1.5 rounded-full bg-[#F7E4A5]/35" />
              <span className="h-1.5 rounded-full bg-[#F7E4A5]/35" />
            </div>

            <div className="flex items-end justify-between gap-4">
              <KycBadge status={userData?.kycStatus} />
              <p className="m-0 text-right text-xs font-bold uppercase tracking-[0.18em] text-[#8EB1CE]">
                Wallet ID
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <p className="mb-1.5 text-base font-medium text-[#8EB1CE]">Balance</p>
          <p className="m-0 text-[clamp(2.35rem,10vw,4.5rem)] font-black leading-none text-white">
            {formatCurrency(totalBalance)}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A84C]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9A84C]">
              Live Portfolio
            </span>
          </div>
        </section>

        <div className="mb-7 grid grid-cols-4 gap-x-2.5 gap-y-4 sm:grid-cols-8">
          {actionButtons.map(({ to, icon, label }) => (
            <Link key={label} to={to} className="group no-underline">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-13 w-full min-w-0 items-center justify-center rounded-[17px] border border-[#C9A84C]/25 bg-[#F7E4A5] text-[#04090F] shadow-[0_10px_22px_rgba(0,0,0,0.16)] transition-all group-hover:-translate-y-0.5 group-hover:bg-white group-hover:shadow-[0_14px_28px_rgba(201,168,76,0.14)] sm:h-12">
                  {React.createElement(icon, {
                    className: "h-5 w-5",
                  })}
                </div>
                <span className="max-w-full truncate text-center text-[11px] font-semibold text-[#8EB1CE]">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mb-6">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="m-0 text-2xl font-black leading-none text-white">
                Tokens
              </h2>
              <p className="mt-1.5 text-[11px] font-medium text-[#3D5A70]">
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
              <Link
                key={token}
                to={`/token/${token}`}
                className="flex items-center justify-between gap-3 py-4 text-inherit no-underline transition-colors hover:bg-[#C9A84C]/[0.03]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black ring-1 ring-[#C9A84C]/15">
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
                    <p className="m-0 truncate text-lg font-semibold text-white">
                      {tokenDisplayNames[token]}
                    </p>
                    <p className="mt-0.5 truncate text-xs font-medium tabular-nums text-[#8EB1CE]">
                      {tokenAmount} {tokenSymbols[token]}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="m-0 text-lg font-semibold tabular-nums text-white">
                    {formatCurrency(usdBalance)}
                  </p>
                  {price > 0 ? (
                    <p className="mt-0.5 text-[11px] font-medium tabular-nums text-[#8EB1CE]">
                      {formatCurrency(price)}
                    </p>
                  ) : (
                    <div
                      aria-label="Loading token price"
                      className="ml-auto mt-1.5 h-2.5 w-14 animate-pulse rounded-full bg-[#8EB1CE]/20"
                    />
                  )}
                </div>
              </Link>
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
