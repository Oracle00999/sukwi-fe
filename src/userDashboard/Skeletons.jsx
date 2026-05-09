import React from "react";

const pulse = "animate-pulse bg-[#8EB1CE]/15";

const SkeletonBlock = ({ className = "" }) => (
  <div className={`${pulse} rounded-full ${className}`} aria-hidden="true" />
);

const card =
  "rounded-[18px] border border-[#C9A84C]/10 bg-[#C9A84C]/[0.03]";

export const DashboardSkeleton = () => (
  <div className="-m-3 min-h-[calc(100vh-64px)] bg-[#04090F] text-white sm:-m-4 lg:-m-6">
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-24 pt-4 sm:px-5 lg:px-6">
      <section className="relative mb-5 aspect-[1.9/1] min-h-[180px] overflow-hidden rounded-[22px] border border-[#C9A84C]/25 bg-[linear-gradient(135deg,#07111F_0%,#0C1E38_48%,#04090F_100%)] sm:mx-auto sm:min-h-0 sm:w-full sm:max-w-[460px] lg:max-w-[500px]">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(201,168,76,0.18)_0%,transparent_34%),linear-gradient(292deg,rgba(92,225,230,0.12)_0%,transparent_38%)]" />
        <div className="relative z-[2] flex h-full flex-col justify-between p-5 sm:p-6">
          <div>
            <SkeletonBlock className="h-8 w-40" />
            <SkeletonBlock className="mt-3 h-3 w-32" />
          </div>
          <div className="grid max-w-[70%] grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((item) => (
              <SkeletonBlock key={item} className="h-1.5" />
            ))}
          </div>
          <div className="flex items-end justify-between">
            <SkeletonBlock className="h-7 w-28" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <SkeletonBlock className="h-5 w-20" />
        <SkeletonBlock className="mt-3 h-14 w-56" />
        <SkeletonBlock className="mt-4 h-3 w-32" />
      </section>

      <div className="mb-7 grid grid-cols-4 gap-x-2.5 gap-y-4 sm:grid-cols-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="h-13 w-full rounded-[17px] bg-[#F7E4A5]/80 sm:h-12" />
            <SkeletonBlock className="h-3 w-12" />
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <SkeletonBlock className="h-7 w-24" />
            <SkeletonBlock className="mt-2 h-3 w-36" />
          </div>
          <SkeletonBlock className="h-3 w-20" />
        </div>
        <div className="divide-y divide-[#C9A84C]/10">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between gap-3 py-4">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-12 w-12" />
                <div>
                  <SkeletonBlock className="h-5 w-28" />
                  <SkeletonBlock className="mt-2 h-3 w-20" />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="mt-2 h-3 w-14" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export const InvestmentSkeleton = () => (
  <div className="mx-auto max-w-5xl pb-20">
    <div className="mb-5 flex items-center gap-2">
      <SkeletonBlock className="h-8 w-8" />
      <SkeletonBlock className="h-4 w-32" />
    </div>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="mt-3 h-8 w-56" />
        <SkeletonBlock className="mt-3 h-4 w-72 max-w-full" />
      </div>
      <SkeletonBlock className="h-11 w-32 rounded-xl" />
    </div>
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className={`${card} p-4`}>
          <SkeletonBlock className="h-8 w-8" />
          <SkeletonBlock className="mt-5 h-4 w-24" />
          <SkeletonBlock className="mt-3 h-7 w-32" />
        </div>
      ))}
    </div>
    <div className={`${card} p-4`}>
      <SkeletonBlock className="h-6 w-40" />
      <div className="mt-5 space-y-4">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <SkeletonBlock className="h-4 w-40 max-w-full" />
              <SkeletonBlock className="mt-2 h-3 w-28 max-w-full" />
            </div>
            <SkeletonBlock className="h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const inlineBlock = (extra = {}) => ({
  borderRadius: 999,
  background: "rgba(142,177,206,0.16)",
  animation: "skeletonPulse 1.4s ease-in-out infinite",
  ...extra,
});

const inlineCard = {
  border: "1px solid rgba(201,168,76,0.1)",
  background: "rgba(201,168,76,0.03)",
  borderRadius: 18,
};

const InlinePulseStyle = () => (
  <style>{`
    @keyframes skeletonPulse {
      0%, 100% { opacity: .45; }
      50% { opacity: 1; }
    }
  `}</style>
);

export const InlineSkeletonPage = ({ type = "form" }) => {
  const isAccount = type === "account";
  const isHistory = type === "history";
  const isBalanceForm = type === "balanceForm";
  const maxWidth = isAccount || isHistory ? 720 : isBalanceForm ? 520 : 640;
  const rows = isHistory ? 5 : isAccount ? 4 : 3;

  return (
    <div style={{ maxWidth, margin: "0 auto", paddingBottom: 80 }}>
      <InlinePulseStyle />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <div style={inlineBlock({ width: 40, height: 40 })} />
        <div style={{ flex: 1 }}>
          <div style={inlineBlock({ width: 180, height: 24 })} />
          <div style={inlineBlock({ width: 120, height: 12, marginTop: 10 })} />
        </div>
      </div>

      {isAccount && (
        <div style={{ ...inlineCard, padding: 18, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={inlineBlock({ width: 64, height: 64 })} />
            <div style={{ flex: 1 }}>
              <div style={inlineBlock({ width: "55%", height: 24 })} />
              <div style={inlineBlock({ width: "38%", height: 13, marginTop: 10 })} />
            </div>
          </div>
        </div>
      )}

      {isBalanceForm && (
        <div style={{ ...inlineCard, padding: 18, marginBottom: 18 }}>
          <div style={inlineBlock({ width: 130, height: 13 })} />
          <div style={inlineBlock({ width: "70%", height: 34, marginTop: 14 })} />
        </div>
      )}

      <div style={{ ...inlineCard, padding: 18 }}>
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: index === 0 ? "0 0 16px" : "16px 0",
              borderTop:
                index === 0 ? "none" : "1px solid rgba(201,168,76,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
              <div style={inlineBlock({ width: 42, height: 42 })} />
              <div style={{ flex: 1 }}>
                <div style={inlineBlock({ width: "60%", height: 15 })} />
                <div style={inlineBlock({ width: "42%", height: 11, marginTop: 9 })} />
              </div>
            </div>
            <div style={inlineBlock({ width: 76, height: 20 })} />
          </div>
        ))}
      </div>

      {!isHistory && (
        <div style={{ ...inlineCard, padding: 18, marginTop: 18 }}>
          <div style={inlineBlock({ width: "100%", height: 46, borderRadius: 12 })} />
          <div style={inlineBlock({ width: "100%", height: 46, borderRadius: 12, marginTop: 14 })} />
          <div style={inlineBlock({ width: "100%", height: 50, borderRadius: 14, marginTop: 18, background: "rgba(247,228,165,0.75)" })} />
        </div>
      )}
    </div>
  );
};
