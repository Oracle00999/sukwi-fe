// components/WhyTrustUs.jsx
import React from "react";
import {
  ShieldCheckIcon,
  LockClosedIcon,
  BanknotesIcon,
  GlobeAltIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const trustPoints = [
  {
    icon: ShieldCheckIcon,
    title: "Quantum-Resistant Security",
    description:
      "Built with post-quantum cryptography that remains secure against future quantum computing threats.",
    index: "01",
  },
  {
    icon: LockClosedIcon,
    title: "Military-Grade Encryption",
    description:
      "256-bit encryption and zero-knowledge proofs ensure your data stays private and secure.",
    index: "02",
  },
  {
    icon: BanknotesIcon,
    title: "FRA Protected",
    description:
      "Funds Retrieving Agent ensures asset recovery during financial system transitions.",
    index: "03",
  },
  {
    icon: GlobeAltIcon,
    title: "Global Compliance",
    description:
      "Designed to meet international financial regulations and ISO 20022 standards.",
    index: "04",
  },
  {
    icon: ClockIcon,
    title: "24/7 Monitoring",
    description:
      "Round-the-clock system monitoring and instant threat detection response.",
    index: "05",
  },
  {
    icon: UserGroupIcon,
    title: "Expert Team",
    description:
      "Backed by financial cryptographers and quantum computing specialists.",
    index: "06",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const WhyTrustUs = () => {
  return (
    <section
      className="relative py-24 md:py-32 border-t overflow-hidden"
      style={{ background: "#060F1E", borderColor: "rgba(201,168,76,0.1)" }}
    >
      {/* Subtle diamond grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(45deg, rgba(201,168,76,0.03) 1px, transparent 1px),
                            linear-gradient(-45deg, rgba(201,168,76,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
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
              Trust &amp; Security
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 max-w-4xl">
            <h2
              className="font-black leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              <span className="text-white">Why Trust </span>
              <span
                style={{
                  background: "linear-gradient(90deg, #C9A84C, #F0C040)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Web3Global Ledger
              </span>
            </h2>
            <p
              className="text-base leading-relaxed md:text-right max-w-xs"
              style={{ color: "#5A7A96" }}
            >
              Built on transparency, security, and proven quantum technology.
            </p>
          </div>
        </motion.div>

        {/* ── Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{
            border: "1px solid rgba(201,168,76,0.1)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {trustPoints.map((point, i) => {
            const Icon = point.icon;
            const isRightEdge = (i + 1) % 3 === 0;
            const isBottomEdge = i >= trustPoints.length - 3;

            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ background: "rgba(201,168,76,0.04)" }}
                className="group relative p-8 flex flex-col gap-5"
                style={{
                  background: "rgba(201,168,76,0.015)",
                  borderRight: !isRightEdge
                    ? "1px solid rgba(201,168,76,0.08)"
                    : "none",
                  borderBottom: !isBottomEdge
                    ? "1px solid rgba(201,168,76,0.08)"
                    : "none",
                  transition: "background 0.3s",
                }}
              >
                {/* Top hairline accent — visible on hover */}
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

                {/* Header row: index + icon */}
                <div className="flex items-center justify-between">
                  {/* Numbered index */}
                  <span
                    className="text-xs font-bold tabular-nums tracking-widest"
                    style={{ color: "rgba(201,168,76,0.25)" }}
                  >
                    {point.index}
                  </span>

                  {/* Icon badge */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
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
                    {point.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#5A7A96" }}
                  >
                    {point.description}
                  </p>
                </div>

                {/* Bottom "learn more" link — appears on hover */}
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

        {/* ── Bottom strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-1"
        >
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#C9A84C" }}
            />
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: "#3D5A70" }}
            >
              All systems operational
            </span>
          </div>

          <div className="flex items-center gap-6">
            {["ISO 20022", "Post-Quantum", "Zero-Knowledge"].map((badge) => (
              <span
                key={badge}
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{
                  border: "1px solid rgba(201,168,76,0.12)",
                  background: "rgba(201,168,76,0.03)",
                  color: "#4A6E8A",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyTrustUs;
