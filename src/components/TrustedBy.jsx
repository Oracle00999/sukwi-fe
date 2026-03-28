// components/TrustedBy.jsx
import React from "react";
import {
  BuildingLibraryIcon,
  CpuChipIcon,
  BanknotesIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  DevicePhoneMobileIcon,
  CircleStackIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const logos = [
  { name: "Global Bank", icon: BuildingLibraryIcon },
  { name: "Quantum Fintech", icon: CpuChipIcon },
  { name: "Secure Capital", icon: BanknotesIcon },
  { name: "International Finance", icon: GlobeAltIcon },
  { name: "Tech Bank", icon: DevicePhoneMobileIcon },
  { name: "Blockchain Corp", icon: CircleStackIcon },
  { name: "Capital One", icon: BuildingOfficeIcon },
  { name: "Digital Assets", icon: BuildingStorefrontIcon },
];

const duplicatedLogos = [...logos, ...logos];

const stats = [
  { value: "47", suffix: "", label: "Countries Served" },
  { value: "$500m", suffix: "+", label: "Assets Secured" },
  { value: "24/7", suffix: "", label: "Quantum Uptime" },
];

const TrustedBy = () => {
  return (
    <section
      className="py-20 md:py-28 border-t"
      style={{
        background: "#07111F",
        borderColor: "rgba(201,168,76,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          {/* Eyebrow */}
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
              Partners
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-sm">
              Trusted by
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #C9A84C, #F0C040)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                industry leaders
              </span>
            </h2>
            <p
              className="text-base leading-relaxed max-w-xs md:text-right"
              style={{ color: "#5A7A96" }}
            >
              Powering secure financial operations for the world's most
              innovative institutions across 47 countries.
            </p>
          </div>
        </motion.div>

        {/* ── Marquee ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative overflow-hidden"
          style={{
            borderTop: "1px solid rgba(201,168,76,0.08)",
            borderBottom: "1px solid rgba(201,168,76,0.08)",
            paddingTop: "2rem",
            paddingBottom: "2rem",
          }}
        >
          {/* Fade left */}
          <div
            className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, #07111F, transparent)",
            }}
          />
          {/* Fade right */}
          <div
            className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(270deg, #07111F, transparent)",
            }}
          />

          <div className="flex animate-marquee">
            {duplicatedLogos.map((logo, index) => {
              const Icon = logo.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex-shrink-0 mx-5 flex items-center gap-3 px-6 py-3 rounded-xl group cursor-default"
                  style={{
                    border: "1px solid rgba(201,168,76,0.1)",
                    background: "rgba(201,168,76,0.03)",
                    minWidth: 200,
                    transition: "border-color 0.3s, background 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                    e.currentTarget.style.background = "rgba(201,168,76,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)";
                    e.currentTarget.style.background = "rgba(201,168,76,0.03)";
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(201,168,76,0.08)",
                      border: "1px solid rgba(201,168,76,0.15)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#C9A84C" }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white leading-none">
                      {logo.name}
                    </p>
                    <p
                      className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: "#C9A84C" }}
                    >
                      Trusted Partner
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px"
          style={{
            border: "1px solid rgba(201,168,76,0.1)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              whileHover={{ background: "rgba(201,168,76,0.05)" }}
              className="relative px-10 py-10 flex flex-col"
              style={{
                background: "rgba(201,168,76,0.02)",
                borderRight:
                  i < stats.length - 1
                    ? "1px solid rgba(201,168,76,0.1)"
                    : "none",
                transition: "background 0.3s",
              }}
            >
              {/* Top gold bar */}
              <div
                className="absolute top-0 left-10 right-10 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
                }}
              />

              <span
                className="text-4xl md:text-5xl font-black leading-none tabular-nums"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.value}
                <span className="text-2xl">{stat.suffix}</span>
              </span>

              <p
                className="mt-3 text-sm font-medium tracking-wide uppercase"
                style={{ color: "#5A7A96", letterSpacing: "0.1em" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Live badge ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          <div
            className="h-px flex-1 max-w-[80px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(201,168,76,0.2))",
            }}
          />
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#C9A84C" }}
            />
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: "#3D5A70" }}
            >
              Live global network
            </span>
          </div>
          <div
            className="h-px flex-1 max-w-[80px]"
            style={{
              background:
                "linear-gradient(270deg, transparent, rgba(201,168,76,0.2))",
            }}
          />
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TrustedBy;
