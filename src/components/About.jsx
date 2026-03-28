// components/FundSecurity.jsx
import React from "react";
import {
  ShieldCheckIcon,
  LockClosedIcon,
  GlobeAltIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const features = [
  {
    icon: ShieldCheckIcon,
    index: "01",
    title: "Smart Contract FRA",
    description:
      "Automated asset recovery through blockchain smart contracts during system transitions.",
  },
  {
    icon: LockClosedIcon,
    index: "02",
    title: "Tokenized Assets",
    description:
      "ISO-compliant digital tokens (XLM, XRP) with blockchain verification and protection.",
  },
  {
    icon: GlobeAltIcon,
    index: "03",
    title: "Global Ledger Security",
    description:
      "Distributed ledger technology ensuring transparency across all financial operations.",
  },
];

const badges = [
  "Blockchain Verified",
  "Smart Contract Protected",
  "ISO 20022 Compliant",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const FundSecurity = () => {
  return (
    <section
      className="relative py-24 md:py-32 border-t overflow-hidden"
      style={{ background: "#07111F", borderColor: "rgba(201,168,76,0.1)" }}
    >
      {/* Background: vertical gold beam center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #C9A84C44, transparent)",
        }}
      />

      {/* Radial glow — center top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header — centered ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg, transparent, #C9A84C)",
              }}
            />
            <CpuChipIcon className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#C9A84C" }}
            >
              Web3 FRA Protection
            </span>
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg, #C9A84C, transparent)",
              }}
            />
          </div>

          <h2
            className="font-black leading-[1.05] tracking-tight mb-5"
            style={{ fontSize: "clamp(2rem, 3.8vw, 3.2rem)" }}
          >
            <span className="text-white">Web3Global Ledger </span>
            <span
              style={{
                background: "linear-gradient(90deg, #C9A84C, #F0C040)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Fund Security
            </span>
          </h2>

          <p className="text-base leading-relaxed" style={{ color: "#5A7A96" }}>
            Blockchain-powered Funds Retrieving Agent (FRA) with smart contract
            automation for digital asset protection during financial
            transitions.
          </p>
        </motion.div>

        {/* ── Feature cards — unified panel ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(201,168,76,0.12)" }}
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ background: "rgba(201,168,76,0.04)" }}
                className="group relative flex flex-col gap-5 p-8"
                style={{
                  background: "rgba(201,168,76,0.015)",
                  borderRight:
                    i < features.length - 1
                      ? "1px solid rgba(201,168,76,0.08)"
                      : "none",
                  transition: "background 0.3s",
                }}
              >
                {/* Hover top hairline */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  className="absolute top-0 left-8 right-8 h-px origin-left"
                  style={{
                    background:
                      "linear-gradient(90deg, #C9A84C, #F0C040, transparent)",
                  }}
                />

                {/* Index + icon row */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold tabular-nums tracking-widest"
                    style={{ color: "rgba(201,168,76,0.25)" }}
                  >
                    {f.index}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(201,168,76,0.07)",
                      border: "1px solid rgba(201,168,76,0.15)",
                      color: "#C9A84C",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#5A7A96" }}
                  >
                    {f.description}
                  </p>
                </div>

                {/* Hover link */}
                <div className="mt-auto pt-2">
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="text-xs font-medium"
                    style={{ color: "#C9A84C" }}
                  >
                    Learn more →
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Badge strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {badges.map((badge, i) => (
            <React.Fragment key={badge}>
              <span
                className="text-xs font-medium px-4 py-1.5 rounded-lg"
                style={{
                  border: "1px solid rgba(201,168,76,0.12)",
                  background: "rgba(201,168,76,0.03)",
                  color: "#4A6E8A",
                }}
              >
                {badge}
              </span>
              {i < badges.length - 1 && (
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "rgba(201,168,76,0.2)" }}
                />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FundSecurity;
