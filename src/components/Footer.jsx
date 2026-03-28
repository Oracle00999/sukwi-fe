// components/Footer.jsx
import React from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import logoImage from "../assets/logo.png";
import { motion } from "framer-motion";

const quickLinks = ["Home", "About QFS", "Fund Security", "Crypto Markets"];
const resources = ["Documentation", "FRA Guide", "ISO 20022"];
const contacts = [
  { icon: EnvelopeIcon, text: "Web3globalledger@gmail.com" },
  { icon: PhoneIcon, text: "+1 (888) WEB3-LEDGE" },
  { icon: MapPinIcon, text: "Global Headquarters" },
];
const legalLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Risk Disclosure",
];

const Footer = () => {
  return (
    <footer
      className="relative text-white border-t overflow-hidden"
      style={{ background: "#04090F", borderColor: "rgba(201,168,76,0.1)" }}
    >
      {/* Top gold hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #C9A84C 30%, #F0C040 50%, #C9A84C 70%, transparent 100%)",
        }}
      />

      {/* Subtle radial glow top-left behind logo */}
      <div
        className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Main grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 pb-14"
          style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}
        >
          {/* ── Brand column ── */}
          <div className="space-y-6 lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-3"
            >
              <img
                src={logoImage}
                alt="Web3Global Ledger Logo"
                className="h-11 w-auto"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `
                    <div class="h-11 w-11 rounded-xl flex items-center justify-center font-bold text-lg"
                         style="background:linear-gradient(135deg,#C9A84C,#F0C040);color:#060F1E">W3</div>
                  `;
                }}
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-none">
                  Web3Global
                </span>
                <span
                  className="text-sm font-medium mt-0.5"
                  style={{ color: "#C9A84C" }}
                >
                  Ledger
                </span>
              </div>
            </motion.div>

            <p className="text-sm leading-relaxed" style={{ color: "#3D5A70" }}>
              Quantum Financial System Ledger provides quantum-resistant
              financial infrastructure for the future of global finance.
            </p>

            {/* Compliance badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                border: "1px solid rgba(201,168,76,0.15)",
                background: "rgba(201,168,76,0.04)",
                color: "#C9A84C",
              }}
            >
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              ISO 20022 Compliant
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-6"
              style={{ color: "#C9A84C" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                >
                  <a
                    href="#"
                    className="text-sm transition-all duration-200 inline-flex items-center gap-2 group"
                    style={{ color: "#3D5A70" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#C9A84C")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#3D5A70")
                    }
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "#C9A84C" }}
                    />
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ── Resources ── */}
          <div>
            <h3
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-6"
              style={{ color: "#C9A84C" }}
            >
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((link, i) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                >
                  <a
                    href="#"
                    className="text-sm transition-all duration-200 inline-flex items-center gap-2 group"
                    style={{ color: "#3D5A70" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#C9A84C")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#3D5A70")
                    }
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "#C9A84C" }}
                    />
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-6"
              style={{ color: "#C9A84C" }}
            >
              Contact
            </h3>
            <ul className="space-y-4">
              {contacts.map(({ icon: Icon, text }, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: "rgba(201,168,76,0.06)",
                      border: "1px solid rgba(201,168,76,0.12)",
                      color: "#C9A84C",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: "#3D5A70" }}
                  >
                    {text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 py-6"
          style={{ borderBottom: "1px solid rgba(201,168,76,0.06)" }}
        >
          <span className="text-xs tabular-nums" style={{ color: "#243547" }}>
            © {new Date().getFullYear()} Web3Global Ledger. All rights reserved.
          </span>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs transition-colors duration-200"
                style={{ color: "#2E4A60" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#2E4A60")}
              >
                {link}
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── Disclaimer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="py-6 text-center"
        >
          <p
            className="text-xs leading-relaxed max-w-2xl mx-auto"
            style={{ color: "#1E3347" }}
          >
            Web3Global Ledger delivers quantum-resistant financial
            infrastructure with FRA protection for fund security during monetary
            transitions.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
