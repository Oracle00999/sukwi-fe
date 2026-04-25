import React from "react";
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const exchanges = [
  {
    name: "Coinbase",
    url: "https://www.coinbase.com/",
    region: "Popular in the US",
    accent: "from-blue-500 to-blue-700",
  },
  {
    name: "Kraken",
    url: "https://www.kraken.com/",
    region: "Global exchange",
    accent: "from-purple-500 to-indigo-700",
  },
  {
    name: "Gemini",
    url: "https://www.gemini.com/",
    region: "US-based exchange",
    accent: "from-cyan-500 to-blue-700",
  },
  {
    name: "Crypto.com",
    url: "https://crypto.com/",
    region: "Global exchange",
    accent: "from-sky-500 to-slate-800",
  },
  {
    name: "Binance.US",
    url: "https://www.binance.us/",
    region: "US Binance platform",
    accent: "from-yellow-400 to-amber-600",
  },
];

export default function BuyCrypto() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl pb-20">
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#3D5A70] transition hover:text-[#C9A84C]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/10">
          <ArrowLeftIcon className="h-4 w-4 text-[#C9A84C]" />
        </span>
        Back to Dashboard
      </button>

      <div className="mb-6">
        <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[#C9A84C]">
          Buy Crypto
        </p>
        <h1 className="text-2xl font-black text-black">Choose an Exchange</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[#3D5A70]">
          Open a trusted exchange in a new tab to buy crypto, then return here
          to deposit into your QFS wallet.
        </p>
      </div>

      <div className="space-y-4">
          {exchanges.map((exchange) => (
            <a
              key={exchange.name}
              href={exchange.url}
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-2xl border border-[#C9A84C]/15 bg-gradient-to-br from-[#0C1C36] to-[#07111F] shadow-[0_18px_45px_rgba(7,17,31,0.08)] transition hover:-translate-y-1 hover:border-[#C9A84C]/45 hover:shadow-[0_22px_55px_rgba(7,17,31,0.16)]"
            >
              <div className={`h-1.5 bg-gradient-to-r ${exchange.accent}`} />
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <BuildingLibraryIcon className="h-6 w-6 text-[#C9A84C]" />
                </div>
                  <div>
                    <p className="text-base font-extrabold text-white">
                      {exchange.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#4A6E8A]">
                      {exchange.region}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 shrink-0 text-[#C9A84C] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <div className="rounded-xl border border-[#C9A84C]/10 bg-[#C9A84C]/10 px-4 py-2 text-center text-xs font-extrabold text-[#C9A84C]">
                  Open Exchange
                </div>
                </div>
              </div>
            </a>
          ))}
      </div>

      <p className="mt-3 text-xs leading-5 text-[#3D5A70]">
        Exchange availability, fees, and supported assets may vary by region.
      </p>
    </div>
  );
}
