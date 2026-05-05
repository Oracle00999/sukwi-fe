// components/Hero.jsx
import React from "react";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero1 from "../assets/hero.png";

const Hero = () => {
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
                Web3 Ledger Network — Live
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
                <span className="block text-white">Web3</span>
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
                  Wallets · Digital Assets · Blockchain
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
              Secure Web3 infrastructure for managing digital assets with
              confidence. Connect wallets, protect your holdings, and move
              crypto across modern blockchain networks from one trusted ledger.
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
                  label: "Wallet Security",
                },
                {
                  icon: <LockClosedIcon className="w-4 h-4" />,
                  label: "Asset Protection",
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
                  label: "Fast Transactions",
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

          {/* RIGHT: Hero image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative"
          >
            <img
              src={Hero1}
              alt="Web3 Ledger dashboard preview"
              className="block w-full h-auto rounded-[2rem] object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
