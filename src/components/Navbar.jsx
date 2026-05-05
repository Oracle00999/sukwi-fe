// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

// ── Web3 Ledger Logo: WL monogram with circuit detail ──
const Web3LedgerLogo = ({ size = 40 }) => {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="web3LedgerBorder"
          x1="0"
          y1="0"
          x2="60"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#F0C040" />
        </linearGradient>
        <linearGradient id="web3LedgerGold" x1="8" y1="8" x2="52" y2="52">
          <stop offset="0%" stopColor="#F0C040" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
        <linearGradient id="web3LedgerCyan" x1="12" y1="12" x2="48" y2="48">
          <stop offset="0%" stopColor="#5CE1E6" />
          <stop offset="100%" stopColor="#8EB1CE" />
        </linearGradient>
      </defs>

      <rect x="4" y="4" width="52" height="52" rx="14" fill="transparent" />

      <path
        d="M12 16H22L26 38L31 21L36 38L41 16H48"
        stroke="url(#web3LedgerGold)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 18V42H51"
        stroke="#F7E4A5"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 45H27M27 45V39M47 14H53M53 14V21M13 23H7M7 23V31"
        stroke="url(#web3LedgerCyan)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="27" cy="45" r="2.4" fill="#5CE1E6" />
      <circle cx="53" cy="21" r="2.4" fill="#5CE1E6" />
      <circle cx="7" cy="31" r="2.4" fill="#5CE1E6" />
    </svg>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [backendPinged, setBackendPinged] = useState(false);

  useEffect(() => {
    const pingBackend = async () => {
      if (backendPinged) return;
      try {
        await fetch(`https://sukwi-be.onrender.com/?_=${Date.now()}`, {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });
        console.log("✅ Backend woken successfully");
      } catch {
        try {
          await fetch(`https://sukwi-be.onrender.com/?_=${Date.now()}`, {
            method: "GET",
            mode: "no-cors",
          });
          console.log("✅ Backend ping sent (no-cors mode)");
        } catch {
          console.log("⚠️ Backend ping attempt completed");
        }
      }
      setBackendPinged(true);
    };

    pingBackend();
    const id = setInterval(() => setBackendPinged(false), 4 * 60 * 1000);
    return () => clearInterval(id);
  }, [backendPinged]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? "rgba(4,9,15,0.96)" : "#04090F",
        borderBottom: `1px solid ${isScrolled ? "rgba(201,168,76,0.18)" : "rgba(201,168,76,0.08)"}`,
        backdropFilter: isScrolled ? "blur(18px)" : "none",
        boxShadow: isScrolled ? "0 4px 32px rgba(201,168,76,0.07)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{ transition: "filter 0.3s, transform 0.3s" }}
              className="transition-transform duration-300 group-hover:scale-105"
              onMouseEnter={(e) =>
                (e.currentTarget.style.filter =
                  "drop-shadow(0 0 8px rgba(201,168,76,0.5))")
              }
              onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
            >
              <Web3LedgerLogo size={40} />
            </div>

            <div className="flex flex-col leading-none">
              <span
                className="font-black text-white"
                style={{ fontSize: "1.1rem", letterSpacing: "-0.02em" }}
              >
                Web3
              </span>
              <span
                className="font-semibold uppercase mt-0.5"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  color: "#C9A84C",
                }}
              >
                Ledger
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300"
              style={{
                color: "#8EB1CE",
                border: "1px solid rgba(201,168,76,0.15)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)";
                e.currentTarget.style.color = "#F0C040";
                e.currentTarget.style.background = "rgba(201,168,76,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
                e.currentTarget.style.color = "#8EB1CE";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2.5 text-sm font-semibold rounded-xl"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                color: "#07111F",
                transition: "box-shadow 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 24px rgba(201,168,76,0.45)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              Get Started Free
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl transition-all duration-300"
              style={{ color: "#8EB1CE" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#C9A84C";
                e.currentTarget.style.background = "rgba(201,168,76,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#8EB1CE";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {isMenuOpen && (
          <div
            className="md:hidden"
            style={{
              borderTop: "1px solid rgba(201,168,76,0.08)",
              background: "rgba(4,9,15,0.98)",
              backdropFilter: "blur(18px)",
            }}
          >
            <div className="px-2 pt-3 pb-4 space-y-2">
              <Link
                to="/login"
                className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300"
                style={{
                  color: "#8EB1CE",
                  border: "1px solid rgba(201,168,76,0.12)",
                  background: "transparent",
                }}
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
                  e.currentTarget.style.color = "#F0C040";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.12)";
                  e.currentTarget.style.color = "#8EB1CE";
                }}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                  color: "#07111F",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
