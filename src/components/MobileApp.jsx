// components/MobileApp.jsx
import React from "react";
import {
  DevicePhoneMobileIcon,
  ClockIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const MobileApp = () => {
  return (
    <section
      className="relative py-24 md:py-32 border-t overflow-hidden"
      style={{ background: "#060F1E", borderColor: "rgba(201,168,76,0.1)" }}
    >
      {/* Radial gold glow — center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Faint phone outline watermark */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none"
        style={{ width: 320, height: 500 }}
      >
        <svg viewBox="0 0 200 340" fill="none" className="w-full h-full">
          <rect
            x="10"
            y="10"
            width="180"
            height="320"
            rx="28"
            stroke="#C9A84C"
            strokeWidth="8"
          />
          <rect x="75" y="22" width="50" height="8" rx="4" fill="#C9A84C" />
          <rect
            x="30"
            y="50"
            width="140"
            height="240"
            rx="8"
            stroke="#C9A84C"
            strokeWidth="4"
          />
          <circle cx="100" cy="310" r="10" stroke="#C9A84C" strokeWidth="4" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg, transparent, #C9A84C)",
              }}
            />
            <DevicePhoneMobileIcon
              className="w-3.5 h-3.5"
              style={{ color: "#C9A84C" }}
            />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#C9A84C" }}
            >
              Mobile App
            </span>
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg, #C9A84C, transparent)",
              }}
            />
          </div>

          <h2
            className="font-black leading-[1.05] tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 3.8vw, 3.2rem)" }}
          >
            <span className="text-white">Your Wallet, </span>
            <span
              style={{
                background: "linear-gradient(90deg, #C9A84C, #F0C040)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Everywhere
            </span>
          </h2>

          <p
            className="text-base leading-relaxed max-w-md mx-auto"
            style={{ color: "#5A7A96" }}
          >
            Our mobile app is in development. Manage your quantum-secure assets
            on iOS and Android — coming soon.
          </p>
        </motion.div>

        {/* ── Content ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Launching soon badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
            style={{
              border: "1px solid rgba(201,168,76,0.25)",
              background: "rgba(201,168,76,0.05)",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#C9A84C" }}
            />
            <ClockIcon className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#C9A84C" }}
            >
              Launching Soon
            </span>
          </div>

          {/* Store buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {[
              {
                icon: DevicePhoneMobileIcon,
                label: "App Store",
                sub: "iOS",
              },
              {
                icon: ArrowDownTrayIcon,
                label: "Google Play",
                sub: "Android",
              },
            ].map(({ icon: Icon, label, sub }) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-4 px-7 py-4 rounded-xl cursor-pointer"
                style={{
                  border: "1px solid rgba(201,168,76,0.15)",
                  background: "rgba(201,168,76,0.03)",
                  transition: "border-color 0.3s, background 0.3s",
                  minWidth: 180,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
                  e.currentTarget.style.background = "rgba(201,168,76,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
                  e.currentTarget.style.background = "rgba(201,168,76,0.03)";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.2)",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#C9A84C" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none mb-1">
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: "#3D5A70" }}>
                    {sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature strip */}
          <div
            className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden mt-4"
            style={{
              border: "1px solid rgba(201,168,76,0.1)",
              maxWidth: 520,
              width: "100%",
            }}
          >
            {[
              { label: "Real-time prices", sub: "Live market data" },
              { label: "Instant transfers", sub: "Send & receive 24/7" },
              { label: "Biometric security", sub: "Face ID & fingerprint" },
            ].map((feat, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center px-4 py-5"
                style={{
                  background: "rgba(201,168,76,0.015)",
                  borderRight:
                    i < 2 ? "1px solid rgba(201,168,76,0.08)" : "none",
                }}
              >
                <p className="text-xs font-700 text-white mb-1 font-bold leading-tight">
                  {feat.label}
                </p>
                <p className="text-[10px]" style={{ color: "#2E4A60" }}>
                  {feat.sub}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom badge ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-center justify-center gap-3 mt-14"
        >
          <div
            className="h-px flex-1 max-w-[80px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(201,168,76,0.2))",
            }}
          />
          <span
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: "#3D5A70" }}
          >
            iOS &amp; Android
          </span>
          <div
            className="h-px flex-1 max-w-[80px]"
            style={{
              background:
                "linear-gradient(270deg, transparent, rgba(201,168,76,0.2))",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MobileApp;
