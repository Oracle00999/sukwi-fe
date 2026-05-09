import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowTrendUp,
  FaMoneyBillTransfer,
  FaWallet,
} from "react-icons/fa6";
import {
  tokenCoinGeckoIds,
  tokenDisplayNames,
  tokenPrecision,
  tokenSymbols,
} from "./tokenConfig";

const chartWindow = "1D";

const formatCurrency = (value, compact = false) => {
  const amount = Number(value) || 0;
  const decimals = Math.abs(amount) > 0 && Math.abs(amount) < 1 ? 6 : 2;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: compact ? 2 : decimals,
    maximumFractionDigits: compact ? 2 : decimals,
  }).format(amount);
};

const formatTokenAmount = (amount, token) => {
  if (!amount) return "0";
  return parseFloat(amount).toFixed(tokenPrecision[token] ?? 4);
};

const SkeletonBlock = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-full bg-[#8EB1CE]/15 ${className}`}
    aria-hidden="true"
  />
);

const ChartSkeleton = () => (
  <div
    className="h-44 overflow-hidden rounded-[18px] border border-[#C9A84C]/10 bg-[#C9A84C]/[0.03] p-3"
    aria-label="Loading chart"
  >
    <div className="flex h-full flex-col justify-between">
      {[0, 1, 2, 3].map((line) => (
        <div key={line} className="h-px w-full bg-[#8EB1CE]/10" />
      ))}
    </div>
    <div className="-mt-24 flex items-end gap-2">
      {[28, 56, 42, 82, 62, 96, 74, 112, 90].map((height, index) => (
        <div
          key={index}
          className="w-full animate-pulse rounded-t-full bg-[#C9A84C]/20"
          style={{ height }}
        />
      ))}
    </div>
  </div>
);

const UnavailableText = ({ children, className = "" }) => (
  <p className={`m-0 text-sm font-semibold text-[#8EB1CE] ${className}`}>
    {children}
  </p>
);

const SimplePriceChart = ({ prices, isLoading, hasError }) => {
  const points = useMemo(() => {
    if (!prices?.length) return [];

    const width = 360;
    const height = 168;
    const padding = 14;
    const values = prices.map(([, price]) => price);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return prices.map(([, price], index) => {
      const x =
        padding +
        (index / Math.max(prices.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((price - min) / range) * (height - padding * 2);
      return [x, y];
    });
  }, [prices]);

  if (isLoading) return <ChartSkeleton />;

  if (hasError || points.length < 2) {
    return (
      <div className="flex h-44 items-center justify-center rounded-[18px] border border-[#C9A84C]/10 bg-[#C9A84C]/[0.03] px-4 text-center">
        <UnavailableText>Chart unavailable</UnavailableText>
      </div>
    );
  }

  const linePath = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1][0]} 168 L ${points[0][0]} 168 Z`;

  return (
    <div className="rounded-[18px] border border-[#C9A84C]/10 bg-[#C9A84C]/[0.03] p-3">
      <svg viewBox="0 0 360 168" className="h-44 w-full" role="img">
        <defs>
          <linearGradient id="assetChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[34, 67, 100, 133].map((y) => (
          <line
            key={y}
            x1="14"
            x2="346"
            y1={y}
            y2={y}
            stroke="rgba(142,177,206,0.12)"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill="url(#assetChartFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#F0C040"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r="4"
          fill="#F7E4A5"
          stroke="#04090F"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

const TokenDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [price, setPrice] = useState(null);
  const [logo, setLogo] = useState("");
  const [chartPrices, setChartPrices] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const [marketLoaded, setMarketLoaded] = useState(false);
  const [chartLoaded, setChartLoaded] = useState(false);
  const [loadErrors, setLoadErrors] = useState({
    user: false,
    market: false,
    chart: false,
  });

  const coinId = tokenCoinGeckoIds[tokenId];

  useEffect(() => {
    if (!coinId) return undefined;

    let isActive = true;
    const token = localStorage.getItem("token");

    Promise.resolve().then(() => {
      if (!isActive) return;
      setUserData(null);
      setPrice(null);
      setLogo("");
      setChartPrices([]);
      setUserLoaded(false);
      setMarketLoaded(false);
      setChartLoaded(false);
      setLoadErrors({ user: false, market: false, chart: false });
    });

    if (!token) {
      navigate("/login");
      return undefined;
    }

    fetch("https://sukwi-be.onrender.com/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json().then((payload) => ({ res, payload })))
      .then(({ res, payload }) => {
        if (!isActive) return;
        if (!res.ok || !payload.success) {
          throw new Error("User request failed");
        }
        setUserData(payload.data.user);
      })
      .catch(() => {
        if (isActive) {
          setLoadErrors((prev) => ({ ...prev, user: true }));
        }
      })
      .finally(() => {
        if (isActive) setUserLoaded(true);
      });

    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&per_page=1&sparkline=false`,
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((payload) => {
        if (!isActive) return;
        const market = payload?.[0];
        if (!market) {
          throw new Error("Market request failed");
        }
        setPrice(market?.current_price ?? 0);
        setLogo(market?.image || "");
      })
      .catch(() => {
        if (isActive) {
          setLoadErrors((prev) => ({ ...prev, market: true }));
        }
      })
      .finally(() => {
        if (isActive) setMarketLoaded(true);
      });

    fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`,
    )
      .then((res) => (res.ok ? res.json() : {}))
      .then((payload) => {
        if (!isActive) return;
        if (!payload?.prices?.length) {
          throw new Error("Chart request failed");
        }
        setChartPrices(payload.prices);
      })
      .catch(() => {
        if (isActive) {
          setLoadErrors((prev) => ({ ...prev, chart: true }));
        }
      })
      .finally(() => {
        if (isActive) setChartLoaded(true);
      });

    return () => {
      isActive = false;
    };
  }, [coinId, navigate]);

  if (!coinId) return <Navigate to="/dashboard" replace />;

  const usdBalance = userLoaded ? userData?.wallet?.balances?.[tokenId] || 0 : 0;
  const tokenAmount = marketLoaded && price > 0 ? usdBalance / price : 0;
  const firstChartPrice = chartPrices?.[0]?.[1] || 0;
  const changePercent =
    chartLoaded && marketLoaded && firstChartPrice > 0 && price > 0
      ? ((price - firstChartPrice) / firstChartPrice) * 100
      : 0;
  const isPositive = changePercent >= 0;

  return (
    <div className="-m-3 min-h-[calc(100vh-64px)] bg-[#04090F] text-white sm:-m-4 lg:-m-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-24 pt-4 sm:px-5 lg:px-6">
        <div className="mb-5 flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A84C]/15 bg-[#C9A84C]/5 text-[#C9A84C] no-underline"
            aria-label="Back to dashboard"
          >
            <FaArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <p className="m-0 text-xl font-black leading-none text-white">
              {tokenDisplayNames[tokenId]}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8EB1CE]">
              {tokenSymbols[tokenId]} Asset
            </p>
          </div>
        </div>

        <section className="mb-5 overflow-hidden rounded-[22px] border border-[#C9A84C]/15 bg-[linear-gradient(160deg,#0C1C36_0%,#070F1C_100%)]">
          <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(201,168,76,0.45),transparent)]" />
          <div className="p-4 sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black ring-1 ring-[#C9A84C]/15">
                  {logo ? (
                    <img
                      src={logo}
                      alt={tokenDisplayNames[tokenId]}
                      className="h-full w-full rounded-full bg-black object-contain p-2"
                    />
                  ) : (
                    <span className="text-xl font-black text-[#F0C040]">
                      {tokenSymbols[tokenId]?.[0]}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="m-0 text-sm font-semibold text-[#8EB1CE]">
                    Current price
                  </p>
                  {!marketLoaded ? (
                    <SkeletonBlock className="mt-2 h-8 w-32" />
                  ) : loadErrors.market ? (
                    <UnavailableText className="mt-2">
                      Price unavailable
                    </UnavailableText>
                  ) : (
                    <p className="mt-1 text-3xl font-black leading-none text-white">
                      {formatCurrency(price)}
                    </p>
                  )}
                </div>
              </div>

              {!marketLoaded || !chartLoaded ? (
                <SkeletonBlock className="h-7 w-16 shrink-0" />
              ) : loadErrors.market || loadErrors.chart ? (
                <div className="flex shrink-0 items-center rounded-full border border-[#C9A84C]/15 bg-[#C9A84C]/5 px-2.5 py-1 text-xs font-bold text-[#8EB1CE]">
                  1D unavailable
                </div>
              ) : (
                <div
                  className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${
                    isPositive
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                      : "border-red-400/20 bg-red-400/10 text-red-300"
                  }`}
                >
                  <FaArrowTrendUp className="h-3 w-3" />
                  {Math.abs(changePercent).toFixed(2)}%
                </div>
              )}
            </div>

            <SimplePriceChart
              prices={chartPrices}
              isLoading={!chartLoaded}
              hasError={loadErrors.chart}
            />

            <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3D5A70]">
              <span>{chartWindow}</span>
              <span>USD</span>
            </div>
          </div>
        </section>

        <section className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-[18px] border border-[#C9A84C]/10 bg-[#C9A84C]/[0.03] p-4">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[#3D5A70]">
              Balance
            </p>
            {!userLoaded ? (
              <SkeletonBlock className="mt-3 h-7 w-24" />
            ) : loadErrors.user ? (
              <UnavailableText className="mt-3">Unavailable</UnavailableText>
            ) : (
              <p className="mt-2 text-2xl font-black leading-none text-white">
                {formatCurrency(usdBalance, true)}
              </p>
            )}
          </div>
          <div className="rounded-[18px] border border-[#C9A84C]/10 bg-[#C9A84C]/[0.03] p-4">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[#3D5A70]">
              Amount
            </p>
            {!userLoaded || !marketLoaded ? (
              <>
                <SkeletonBlock className="mt-3 h-7 w-24" />
                <SkeletonBlock className="mt-2 h-3 w-10" />
              </>
            ) : loadErrors.user || loadErrors.market ? (
              <>
                <UnavailableText className="mt-3">Unavailable</UnavailableText>
                <p className="mt-1 text-xs font-semibold text-[#8EB1CE]">
                  {tokenSymbols[tokenId]}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 truncate text-2xl font-black leading-none text-white">
                  {formatTokenAmount(tokenAmount, tokenId)}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#8EB1CE]">
                  {tokenSymbols[tokenId]}
                </p>
              </>
            )}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Link
            to="/deposit"
            className="flex items-center justify-center gap-2 rounded-[18px] bg-[#F7E4A5] px-4 py-4 text-sm font-black text-[#04090F] no-underline shadow-[0_12px_26px_rgba(0,0,0,0.18)]"
          >
            <FaWallet className="h-4 w-4" />
            Deposit
          </Link>
          <Link
            to="/withdraw"
            className="flex items-center justify-center gap-2 rounded-[18px] border border-[#C9A84C]/20 bg-[#C9A84C]/10 px-4 py-4 text-sm font-black text-[#F0C040] no-underline"
          >
            <FaMoneyBillTransfer className="h-4 w-4" />
            Receive
          </Link>
        </section>

        <div className="mt-5 flex items-start gap-2 rounded-[14px] border border-[#C9A84C]/10 bg-[#C9A84C]/[0.03] px-4 py-3">
          <FaArrowDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C9A84C]" />
          <p className="m-0 text-xs leading-5 text-[#8EB1CE]">
            Market chart uses recent USD pricing and updates when this page is
            opened.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
