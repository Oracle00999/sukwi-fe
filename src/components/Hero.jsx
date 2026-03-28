// components/Hero.jsx
import React, { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TICKER_DATA = [
  { symbol: "BTC", value: "43,210.88", change: "+2.4%" },
  { symbol: "ETH", value: "2,891.54", change: "+1.8%" },
  { symbol: "QFS", value: "18.72", change: "+5.1%" },
];

const WALLET_ASSETS = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    amount: "2.4819",
    usd: "$107,245.10",
    color: "#F7931A",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "18.330",
    usd: "$53,244.12",
    color: "#627EEA",
  },
  {
    name: "QFS Token",
    symbol: "QFS",
    amount: "5,000.00",
    usd: "$93,600.00",
    color: "#C9A84C",
  },
];

const TRANSACTIONS = [
  {
    type: "Received",
    symbol: "BTC",
    amount: "+0.2140",
    time: "2m ago",
    positive: true,
  },
  {
    type: "Sent",
    symbol: "ETH",
    amount: "-1.500",
    time: "18m ago",
    positive: false,
  },
  {
    type: "Received",
    symbol: "QFS",
    amount: "+250.00",
    time: "1h ago",
    positive: true,
  },
];

const SPARKLINE_DATA = [
  28, 34, 30, 38, 33, 42, 38, 47, 44, 52, 49, 58, 54, 61, 58, 66,
];

const generateSparkline = (points, w, h) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((p) => h - ((p - min) / range) * h);
  return xs
    .map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`)
    .join(" ");
};

const Hero = () => {
  const [activeAsset, setActiveAsset] = useState(0);
  const sparkPath = generateSparkline(SPARKLINE_DATA, 200, 50);

  return (
    <section className="relative min-h-screen flex items-center text-white overflow-hidden mt-11">
      {/* Deep Sapphire base */}
      <div className="absolute inset-0 bg-[#060F1E]" />

      {/* Diagonal split */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(108deg, #060F1E 55%, #0C1E38 55%)",
        }}
      />

      {/* Scan-line texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(201,168,76,0.015) 3px, rgba(201,168,76,0.015) 4px)",
        }}
      />

      {/* Gold corner accent */}
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none opacity-20">
        <svg viewBox="0 0 256 256" fill="none" className="w-full h-full">
          <path d="M0 0 L80 0 L0 80 Z" fill="#C9A84C" />
          <path d="M0 0 L50 0 L0 50 Z" fill="#F0C040" opacity="0.6" />
        </svg>
      </div>

      {/* Hex grid — right half */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V17L28 1L56 17V50Z' fill='none' stroke='%23C9A84C' stroke-width='1'/%3E%3C/svg%3E\")",
          backgroundSize: "56px 100px",
        }}
      />

      {/* Radial gold glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Text */}
          <div className="space-y-9">
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-[#C9A84C]">
                QFS Network — Live
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <h1
                className="font-black leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(2.6rem, 4.5vw, 4rem)" }}
              >
                <span className="block text-white">QFS-Worldwide</span>
                <span
                  className="block mt-1"
                  style={{
                    background:
                      "linear-gradient(90deg, #C9A84C 0%, #F0C040 50%, #C9A84C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Ledger
                </span>
                <span className="block text-[#7A9CBE] text-2xl font-light tracking-normal mt-3">
                  Web3 · Blockchain · QFS
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-[#8EB1CE] text-lg leading-relaxed max-w-[480px]"
            >
              Quantum Financial System infrastructure built for the next era of
              digital assets. Institutional-grade custody, real-time settlement,
              and Fund Retrieval protection — all in one platform.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              {[
                {
                  icon: <ShieldCheckIcon className="w-4 h-4" />,
                  label: "Sovereign Security",
                },
                {
                  icon: <LockClosedIcon className="w-4 h-4" />,
                  label: "Fund Retrieval",
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-4 h-4"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  ),
                  label: "Real-time Settlement",
                },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1A3050] bg-[#0C1E38]/60 text-[#7A9CBE] text-sm"
                >
                  <span className="text-[#C9A84C]">{icon}</span>
                  {label}
                </div>
              ))}
            </motion.div>

            {/* Ticker strip */}
            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex gap-4"
            >
              {TICKER_DATA.map(({ symbol, value, change }) => (
                <div
                  key={symbol}
                  className="flex flex-col px-4 py-2 rounded-lg border border-[#1A3050] bg-[#0A1828]/80"
                >
                  <span className="text-[10px] tracking-widest uppercase text-[#4A6E8A] font-medium">
                    {symbol}
                  </span>
                  <span className="text-white font-semibold text-sm tabular-nums">
                    ${value}
                  </span>
                  <span className="text-[#4ADE80] text-xs font-medium">
                    {change}
                  </span>
                </div>
              ))}
            </motion.div> */}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-[#0B1F3A]"
                style={{
                  background:
                    "linear-gradient(135deg, #C9A84C 0%, #F0C040 50%, #C9A84C 100%)",
                  boxShadow:
                    "0 0 32px rgba(201,168,76,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-medium text-[#8EB1CE] border border-[#1A3050] hover:border-[#C9A84C]/60 hover:text-[#F0C040] hover:bg-[#0C1E38] transition-all duration-300"
              >
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign In
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Crypto Wallet UI */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            {/* Main Wallet Card */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0E2040 0%, #091628 100%)",
                border: "1px solid rgba(201,168,76,0.25)",
                boxShadow:
                  "0 0 60px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.1)",
              }}
            >
              {/* Top gold line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                }}
              />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#4A6E8A] text-xs uppercase tracking-widest font-medium">
                      Total Portfolio Value
                    </p>
                    <p className="text-3xl font-bold text-white mt-1 tabular-nums">
                      $254,089
                      <span className="text-base font-normal text-[#4A6E8A]">
                        .22
                      </span>
                    </p>
                    <p className="text-[#4ADE80] text-sm mt-0.5 font-medium">
                      ▲ +$5,218.40 &nbsp;(+2.1%) today
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(201,168,76,0.13), rgba(240,192,64,0.07))",
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                      <rect
                        x="2"
                        y="5"
                        width="20"
                        height="14"
                        rx="3"
                        stroke="#C9A84C"
                        strokeWidth="1.5"
                      />
                      <path d="M2 10h20" stroke="#C9A84C" strokeWidth="1.5" />
                      <circle cx="17" cy="15" r="1.5" fill="#F0C040" />
                    </svg>
                  </div>
                </div>

                {/* Sparkline */}
                <div className="relative mb-6">
                  <svg
                    viewBox="0 0 200 58"
                    className="w-full"
                    style={{ height: 58 }}
                  >
                    <defs>
                      <linearGradient
                        id="sparkGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#C9A84C"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#C9A84C"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={`${sparkPath} L200,58 L0,58 Z`}
                      fill="url(#sparkGrad)"
                    />
                    <path
                      d={sparkPath}
                      fill="none"
                      stroke="#C9A84C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="200" cy="8" r="3" fill="#F0C040" />
                  </svg>
                  <div className="flex justify-between text-[10px] text-[#2E4A60] mt-1 px-1">
                    <span>7D</span>
                    <span>14D</span>
                    <span>21D</span>
                    <span>30D</span>
                  </div>
                </div>

                {/* Asset rows */}
                <div className="space-y-2">
                  {WALLET_ASSETS.map((asset, i) => (
                    <motion.div
                      key={asset.symbol}
                      onClick={() => setActiveAsset(i)}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                      style={{
                        background:
                          activeAsset === i
                            ? "rgba(201,168,76,0.08)"
                            : "rgba(255,255,255,0.02)",
                        border:
                          activeAsset === i
                            ? "1px solid rgba(201,168,76,0.25)"
                            : "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: `${asset.color}22`,
                            border: `1px solid ${asset.color}55`,
                            color: asset.color,
                          }}
                        >
                          {asset.symbol.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {asset.name}
                          </p>
                          <p className="text-[#3E6080] text-xs tabular-nums">
                            {asset.amount}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-semibold tabular-nums">
                          {asset.usd}
                        </p>
                        <p className="text-xs" style={{ color: asset.color }}>
                          {asset.symbol}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions Card */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
