// components/CryptoTracker.jsx
import React, { useState, useEffect } from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  FireIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const cryptocurrencies = [
  "bitcoin",
  "ethereum",
  "ripple",
  "cardano",
  "solana",
  "polkadot",
  "dogecoin",
  "stellar",
  "chainlink",
  "litecoin",
];

const CryptoTracker = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const ids = cryptocurrencies.join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h,24h,7d`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCryptoData(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const id = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(id);
  }, []);

  const formatCurrency = (v) => {
    if (v < 0.01)
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      }).format(v);
    if (v < 1)
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(v);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(v);
  };

  const formatMarketCap = (v) => {
    if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
    return `$${v.toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    const pos = value > 0;
    return (
      <span
        className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold tabular-nums"
        style={{ color: pos ? "#4ADE80" : "#F87171" }}
      >
        {pos ? (
          <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
        ) : (
          <ArrowTrendingDownIcon className="w-3.5 h-3.5" />
        )}
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  // ── Skeleton rows ──
  const SkeletonRow = () => (
    <div
      className="flex items-center justify-between px-5 py-4"
      style={{ borderBottom: "1px solid rgba(201,168,76,0.06)" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-9 h-9 rounded-full"
          style={{ background: "rgba(201,168,76,0.06)" }}
        />
        <div className="space-y-2">
          <div
            className="w-20 h-3 rounded"
            style={{ background: "rgba(201,168,76,0.06)" }}
          />
          <div
            className="w-14 h-2.5 rounded"
            style={{ background: "rgba(201,168,76,0.04)" }}
          />
        </div>
      </div>
      <div className="space-y-2 text-right">
        <div
          className="w-24 h-3 rounded ml-auto"
          style={{ background: "rgba(201,168,76,0.06)" }}
        />
        <div
          className="w-16 h-2.5 rounded ml-auto"
          style={{ background: "rgba(201,168,76,0.04)" }}
        />
      </div>
    </div>
  );

  const totalMarketCap = cryptoData.reduce((s, c) => s + c.market_cap, 0);
  const totalVolume = cryptoData.reduce((s, c) => s + c.total_volume, 0);
  const topGainer = cryptoData.length
    ? cryptoData.reduce((a, b) =>
        a.price_change_percentage_24h > b.price_change_percentage_24h ? a : b,
      )
    : null;

  return (
    <section
      className="py-20 md:py-28 border-t"
      style={{ background: "#07111F", borderColor: "rgba(201,168,76,0.1)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg, #C9A84C, transparent)",
              }}
            />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#C9A84C" }}
            >
              Live Market Data
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Real-Time{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #C9A84C, #F0C040)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Crypto
              </span>{" "}
              Markets
            </h2>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#C9A84C" }}
              />
              {lastUpdated && (
                <span
                  className="text-xs tabular-nums"
                  style={{ color: "#3D5A70" }}
                >
                  Updated {lastUpdated}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Table card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(201,168,76,0.15)",
            background: "linear-gradient(160deg, #0C1C36 0%, #081424 100%)",
          }}
        >
          {/* Top gold hairline */}
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #C9A84C, transparent)",
            }}
          />

          {/* ── Desktop table ── */}
          <div className="hidden sm:block overflow-x-auto">
            {loading ? (
              <div className="animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}
                  >
                    {[
                      "#",
                      "Asset",
                      "Price",
                      "24h Change",
                      "Market Cap",
                      "7d Change",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`py-4 px-5 text-left text-xs font-semibold tracking-widest uppercase ${i === 0 ? "w-12" : ""}`}
                        style={{ color: "#3D5A70" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cryptoData.map((crypto, index) => (
                    <motion.tr
                      key={crypto.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      onClick={() =>
                        window.open(
                          `https://www.coingecko.com/en/coins/${crypto.id}`,
                          "_blank",
                        )
                      }
                      className="cursor-pointer group"
                      style={{
                        borderBottom: "1px solid rgba(201,168,76,0.05)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(201,168,76,0.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {/* Rank */}
                      <td className="py-4 px-5">
                        <span
                          className="text-sm tabular-nums"
                          style={{ color: "#2E4A60" }}
                        >
                          {index + 1}
                        </span>
                      </td>

                      {/* Asset */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={crypto.image}
                              alt={crypto.name}
                              className="w-9 h-9 rounded-full"
                              style={{
                                border: "1px solid rgba(201,168,76,0.15)",
                              }}
                            />
                            <div
                              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                              style={{
                                background: "#07111F",
                                border: "1px solid rgba(201,168,76,0.2)",
                              }}
                            >
                              <CurrencyDollarIcon
                                className="w-2 h-2"
                                style={{ color: "#C9A84C" }}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {crypto.symbol.toUpperCase()}
                            </p>
                            <p className="text-xs" style={{ color: "#3D5A70" }}>
                              {crypto.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-5">
                        <span className="text-sm font-bold text-white tabular-nums">
                          {formatCurrency(crypto.current_price)}
                        </span>
                      </td>

                      {/* 24h */}
                      <td className="py-4 px-5">
                        {formatPercentage(crypto.price_change_percentage_24h)}
                      </td>

                      {/* Market cap */}
                      <td className="py-4 px-5">
                        <span
                          className="text-sm tabular-nums"
                          style={{ color: "#5A7A96" }}
                        >
                          {formatMarketCap(crypto.market_cap)}
                        </span>
                      </td>

                      {/* 7d */}
                      <td className="py-4 px-5">
                        {formatPercentage(
                          crypto.price_change_percentage_7d_in_currency || 0,
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Mobile cards ── */}
          <div
            className="block sm:hidden divide-y"
            style={{ borderColor: "rgba(201,168,76,0.06)" }}
          >
            {loading
              ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              : cryptoData.map((crypto, index) => (
                  <motion.div
                    key={crypto.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    onClick={() =>
                      window.open(
                        `https://www.coingecko.com/en/coins/${crypto.id}`,
                        "_blank",
                      )
                    }
                    className="flex items-center justify-between px-4 py-4 cursor-pointer"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(201,168,76,0.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-9 h-9 rounded-full"
                        style={{ border: "1px solid rgba(201,168,76,0.15)" }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {crypto.symbol.toUpperCase()}
                        </p>
                        <p className="text-xs" style={{ color: "#3D5A70" }}>
                          {crypto.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white tabular-nums">
                        {formatCurrency(crypto.current_price)}
                      </p>
                      <div className="mt-0.5">
                        {formatPercentage(crypto.price_change_percentage_24h)}
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>

          {/* Table footer */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{
              borderTop: "1px solid rgba(201,168,76,0.08)",
              background: "rgba(6,15,30,0.4)",
            }}
          >
            <span className="text-xs" style={{ color: "#2E4A60" }}>
              Data via CoinGecko · refreshes every 30s
            </span>
            <button
              onClick={fetchCryptoData}
              className="text-xs px-3 py-1 rounded-lg transition-all"
              style={{
                border: "1px solid rgba(201,168,76,0.15)",
                background: "rgba(201,168,76,0.04)",
                color: "#C9A84C",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)")
              }
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* ── Stats footer ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(201,168,76,0.1)" }}
        >
          {[
            {
              icon: <ChartBarIcon className="w-4 h-4" />,
              label: "Total Market Cap",
              value: cryptoData.length ? formatMarketCap(totalMarketCap) : "—",
              sub: null,
            },
            {
              icon: <ArrowTrendingUpIcon className="w-4 h-4" />,
              label: "24h Volume",
              value: cryptoData.length ? formatMarketCap(totalVolume) : "—",
              sub: null,
            },
            {
              icon: <FireIcon className="w-4 h-4" />,
              label: "Top Gainer",
              value: topGainer ? topGainer.symbol.toUpperCase() : "—",
              sub: topGainer
                ? `+${topGainer.price_change_percentage_24h.toFixed(2)}%`
                : null,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ background: "rgba(201,168,76,0.04)" }}
              className="relative flex items-center gap-4 px-7 py-6"
              style={{
                background: "rgba(201,168,76,0.02)",
                borderRight: i < 2 ? "1px solid rgba(201,168,76,0.1)" : "none",
                transition: "background 0.3s",
              }}
            >
              {/* Top hairline */}
              <div
                className="absolute top-0 left-8 right-8 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
                }}
              />
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(201,168,76,0.07)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  color: "#C9A84C",
                }}
              >
                {stat.icon}
              </div>
              <div>
                <p
                  className="text-xs uppercase tracking-widest font-medium"
                  style={{ color: "#3D5A70" }}
                >
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-white mt-0.5 tabular-nums">
                  {stat.value}
                </p>
                {stat.sub && (
                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: "#4ADE80" }}
                  >
                    {stat.sub}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CryptoTracker;
