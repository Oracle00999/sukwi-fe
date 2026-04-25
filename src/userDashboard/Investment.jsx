import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ChartPieIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const API_BASE = "https://sukwi-be.onrender.com/api";

const cryptocurrencies = [
  { value: "bitcoin", label: "Bitcoin" },
  { value: "ethereum", label: "Ethereum" },
  { value: "tether", label: "Tether" },
  { value: "binance-coin", label: "Binance Coin" },
  { value: "solana", label: "Solana" },
  { value: "dogecoin", label: "Dogecoin" },
  { value: "ripple", label: "Ripple" },
  { value: "stellar", label: "Stellar" },
  { value: "tron", label: "Tron" },
];

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizePlans = (payload) => {
  const data = payload?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.plans)) return data.plans;
  if (Array.isArray(data?.investmentPlans)) return data.investmentPlans;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const getPlanId = (plan) => plan?.id || plan?._id;
const getPlanName = (plan) => plan?.name || plan?.planSnapshot?.name || "Plan";
const getPlanRoi = (plan) => plan?.roi || plan?.planSnapshot?.roi || 0;
const getPlanDuration = (plan) =>
  plan?.duration || plan?.planSnapshot?.duration || 0;
const getPlanMin = (plan) => plan?.minAmount || plan?.planSnapshot?.minAmount;
const getPlanMax = (plan) => plan?.maxAmount || plan?.planSnapshot?.maxAmount;
const getCryptoLabel = (value) =>
  cryptocurrencies.find((crypto) => crypto.value === value)?.label || value;

export default function Investment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    cryptocurrency: "bitcoin",
    amount: "",
  });
  const [notice, setNotice] = useState({ type: "", message: "" });

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [navigate]);

  const fetchActiveInvestments = useCallback(async () => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/investments/active`, { headers });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load investments");
      }

      setInvestments(data.data?.investments || []);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Failed to load investments",
      });
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchActiveInvestments();
  }, [fetchActiveInvestments]);

  const overview = useMemo(
    () =>
      investments.reduce(
        (totals, investment) => {
          const amount = Number(investment.amount || 0);
          const profit = Number(investment.profit || 0);

          return {
            totalProfit: totals.totalProfit + profit,
            totalStake: totals.totalStake + amount,
            activeStake:
              investment.status === "active"
                ? totals.activeStake + amount
                : totals.activeStake,
          };
        },
        { totalProfit: 0, totalStake: 0, activeStake: 0 },
      ),
    [investments],
  );

  const fetchPlans = async () => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      setNotice({ type: "", message: "" });
      setPlansOpen(true);
      setPlansLoading(true);

      const res = await fetch(`${API_BASE}/investments/plans`, {
        headers,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load investment plans");
      }

      setPlans(normalizePlans(data));
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Failed to load investment plans",
      });
    } finally {
      setPlansLoading(false);
    }
  };

  const closePlans = () => {
    if (submitting) return;
    setPlansOpen(false);
    setSelectedPlan(null);
    setFormData({ cryptocurrency: "bitcoin", amount: "" });
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setFormData((prev) => ({
      ...prev,
      amount: String(getPlanMin(plan) || ""),
    }));
    setNotice({ type: "", message: "" });
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    const headers = authHeaders();
    const planId = getPlanId(selectedPlan);

    if (!headers || !planId) return;

    try {
      setNotice({ type: "", message: "" });
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/investments/invest`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          planId,
          cryptocurrency: formData.cryptocurrency,
          amount: Number(formData.amount),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create investment");
      }

      setNotice({
        type: "success",
        message: data.message || "Investment created successfully",
      });
      setPlansOpen(false);
      setSelectedPlan(null);
      setFormData({ cryptocurrency: "bitcoin", amount: "" });

      if (data.data?.investment) {
        setInvestments((prev) => [data.data.investment, ...prev]);
      } else {
        await fetchActiveInvestments();
      }
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Failed to create investment",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const stats = [
    {
      label: "Total Profit",
      value: formatMoney(overview.totalProfit),
      icon: ChartPieIcon,
      iconClass: "text-emerald-400",
    },
    {
      label: "Total Stake",
      value: formatMoney(overview.totalStake),
      icon: BanknotesIcon,
      iconClass: "text-[#C9A84C]",
    },
    {
      label: "Active Stake",
      value: formatMoney(overview.activeStake),
      icon: ClockIcon,
      iconClass: "text-sky-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-[3px] border-[#C9A84C]/15 border-t-[#C9A84C]" />
          <p className="text-sm font-medium text-[#3D5A70]">
            Loading investments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-20">
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

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[#C9A84C]">
            Investment
          </p>
          <h1 className="text-2xl font-black text-black">
            Investment Overview
          </h1>
          <p className="mt-1.5 text-sm text-[#3D5A70]">
            Track your profit, total stake, and current active investment.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPlans}
          disabled={plansLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#F0C040] px-4 py-3 text-sm font-extrabold text-[#07111F] transition hover:shadow-[0_0_24px_rgba(201,168,76,0.28)] disabled:cursor-wait disabled:opacity-70"
        >
          {plansLoading ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
          Get Plans
        </button>
      </div>

      {notice.message && (
        <div
          className={`mb-5 flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-bold ${
            notice.type === "success"
              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-600"
              : "border-red-500/25 bg-red-500/10 text-red-500"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircleIcon className="h-5 w-5 shrink-0" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
          )}
          {notice.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[18px] border border-[#C9A84C]/15 bg-gradient-to-br from-[#0C1C36] to-[#07111F] p-5 shadow-[0_18px_45px_rgba(7,17,31,0.08)]"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              {React.createElement(stat.icon, {
                className: `h-5 w-5 ${stat.iconClass}`,
              })}
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4A6E8A]">
              {stat.label}
            </p>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#C9A84C]/15 bg-gradient-to-br from-[#0C1C36] to-[#07111F] shadow-[0_18px_45px_rgba(7,17,31,0.08)]">
        <div className="flex flex-col gap-3 border-b border-[#C9A84C]/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-extrabold text-white">
              Investment Log
            </p>
            <p className="mt-1 text-xs text-[#3D5A70]">
              Active investments from your investment history.
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/10 px-3 py-1 text-xs font-bold text-[#C9A84C]">
            {investments.length} Active
          </span>
        </div>

        {investments.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
            <ClockIcon className="mb-3 h-9 w-9 text-[#C9A84C]" />
            <p className="text-sm font-extrabold text-white">
              No active investments yet
            </p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-[#3D5A70]">
              Your active investment records will appear here after you invest
              in a plan.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-[#C9A84C]/10">
                <thead className="bg-white/[0.03]">
                  <tr>
                    {[
                      "Plan",
                      "Crypto",
                      "Amount",
                      "Profit",
                      "Payout",
                      "Started",
                      "Matures",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#4A6E8A]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C9A84C]/10">
                  {investments.map((investment) => (
                    <tr key={investment.id || investment.investmentId}>
                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="text-sm font-extrabold text-white">
                          {investment.planSnapshot?.name || "Investment Plan"}
                        </p>
                        <p className="mt-1 text-xs text-[#3D5A70]">
                          {investment.investmentId}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-[#C9A84C]">
                        {getCryptoLabel(investment.cryptocurrency)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-white">
                        {formatMoney(investment.amount)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-emerald-400">
                        {formatMoney(investment.profit)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-white">
                        {formatMoney(investment.payoutAmount)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-[#B7C7D6]">
                        {formatDate(investment.startDate)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-[#B7C7D6]">
                        {formatDate(investment.maturityDate)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-extrabold capitalize text-emerald-400">
                          {investment.status || "active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 lg:hidden">
              {investments.map((investment) => (
                <div
                  key={investment.id || investment.investmentId}
                  className="rounded-2xl border border-[#C9A84C]/15 bg-white/[0.03] p-4"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-white">
                        {investment.planSnapshot?.name || "Investment Plan"}
                      </p>
                      <p className="mt-1 text-xs text-[#3D5A70]">
                        {investment.investmentId}
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-extrabold capitalize text-emerald-400">
                      {investment.status || "active"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Crypto", getCryptoLabel(investment.cryptocurrency)],
                      ["Amount", formatMoney(investment.amount)],
                      ["Profit", formatMoney(investment.profit)],
                      ["Payout", formatMoney(investment.payoutAmount)],
                      ["Started", formatDate(investment.startDate)],
                      ["Matures", formatDate(investment.maturityDate)],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="mb-1 text-[10px] font-extrabold uppercase text-[#3D5A70]">
                          {label}
                        </p>
                        <p className="text-xs font-extrabold text-white">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {plansOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-[#C9A84C]/20 bg-[#07111F] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#C9A84C]/10 px-5 py-4">
              <div>
                <p className="text-base font-extrabold text-white">
                  Investment Plans
                </p>
                <p className="mt-1 text-xs text-[#3D5A70]">
                  Choose a plan, then select currency and amount.
                </p>
              </div>
              <button
                type="button"
                onClick={closePlans}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/10 text-[#C9A84C]"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid max-h-[calc(90vh-76px)] gap-5 overflow-y-auto p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
              <div>
                {plansLoading ? (
                  <div className="flex min-h-48 items-center justify-center">
                    <ArrowPathIcon className="h-7 w-7 animate-spin text-[#C9A84C]" />
                  </div>
                ) : plans.length === 0 ? (
                  <p className="rounded-xl border border-[#C9A84C]/10 bg-white/[0.03] py-10 text-center text-sm text-[#3D5A70]">
                    No investment plans available.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {plans.map((plan) => {
                      const planId = getPlanId(plan);
                      const isSelected = getPlanId(selectedPlan) === planId;

                      return (
                        <button
                          key={planId}
                          type="button"
                          onClick={() => handleSelectPlan(plan)}
                          className={`rounded-2xl border p-4 text-left transition ${
                            isSelected
                              ? "border-[#C9A84C]/70 bg-[#C9A84C]/10"
                              : "border-[#C9A84C]/15 bg-white/[0.03] hover:border-[#C9A84C]/35"
                          }`}
                        >
                          <p className="mb-3 text-base font-extrabold text-white">
                            {getPlanName(plan)}
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              ["ROI", `${getPlanRoi(plan)}%`],
                              ["Duration", `${getPlanDuration(plan)} days`],
                              ["Min", formatMoney(getPlanMin(plan))],
                              ["Max", formatMoney(getPlanMax(plan))],
                            ].map(([label, value]) => (
                              <div key={label}>
                                <p className="mb-1 text-[10px] font-extrabold uppercase text-[#3D5A70]">
                                  {label}
                                </p>
                                <p className="text-xs font-extrabold text-[#C9A84C]">
                                  {value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <form
                onSubmit={handleInvest}
                className="rounded-2xl border border-[#C9A84C]/15 bg-gradient-to-br from-[#0C1C36] to-[#07111F] p-5"
              >
                {selectedPlan ? (
                  <>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/10">
                      <CurrencyDollarIcon className="h-5 w-5 text-[#C9A84C]" />
                    </div>
                    <p className="text-base font-extrabold text-white">
                      Invest in {getPlanName(selectedPlan)}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#3D5A70]">
                      Select your funding currency and amount to start this
                      plan.
                    </p>

                    <label className="mt-5 block text-xs font-extrabold uppercase tracking-[0.08em] text-[#4A6E8A]">
                      Currency
                    </label>
                    <select
                      value={formData.cryptocurrency}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cryptocurrency: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-xl border border-[#C9A84C]/20 bg-[#04090F] px-3.5 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/60"
                    >
                      {cryptocurrencies.map((crypto) => (
                        <option
                          key={crypto.value}
                          value={crypto.value}
                          className="bg-[#07111F]"
                        >
                          {crypto.label}
                        </option>
                      ))}
                    </select>

                    <label className="mt-4 block text-xs font-extrabold uppercase tracking-[0.08em] text-[#4A6E8A]">
                      Amount
                    </label>
                    <input
                      type="number"
                      min={getPlanMin(selectedPlan)}
                      max={getPlanMax(selectedPlan)}
                      required
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      placeholder="Enter amount"
                      className="mt-2 w-full rounded-xl border border-[#C9A84C]/20 bg-[#04090F] px-3.5 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/60"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-5 w-full rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#F0C040] px-4 py-3.5 text-sm font-black text-[#07111F] transition disabled:cursor-wait disabled:opacity-55"
                    >
                      {submitting ? "Creating Investment..." : "Invest Now"}
                    </button>
                  </>
                ) : (
                  <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#C9A84C]/20 bg-white/[0.02] px-5 text-center">
                    <ChartPieIcon className="mb-3 h-9 w-9 text-[#C9A84C]" />
                    <p className="text-sm font-extrabold text-white">
                      Select a plan
                    </p>
                    <p className="mt-1 max-w-60 text-xs leading-5 text-[#3D5A70]">
                      Pick an investment plan from the list to continue.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
