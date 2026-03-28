// components/CustomerTestimonials.jsx
import React from "react";
import { StarIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    text: "QFS = Quantum Financial System is the future. Withdraw funds from banks and secure them in QFS-backed assets like XLM and XRP before it's too late!",
    author: "Michael R.",
    role: "Early Investor",
    rating: 5,
  },
  {
    id: 2,
    text: "XRP is a HOLD crypto. Red days are buying opportunities! Soon, higher prices will be the norm. HOLD until new tax codes pass—this is the future of finance!",
    author: "Sarah L.",
    role: "Crypto Trader",
    rating: 5,
  },
  {
    id: 3,
    text: "Switching to the Quantum Financial System (QFS) by securing funds in XLM and XRP is the best decision. The banking system has never been honest with us!",
    author: "David K.",
    role: "Financial Advisor",
    rating: 5,
  },
  {
    id: 4,
    text: "Have you claimed your $200K NESARA GESARA payout? The transition to QFS is happening—don't be left behind!",
    author: "Jennifer M.",
    role: "QFS Advocate",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const CustomerTestimonials = () => {
  return (
    <section
      className="relative py-24 md:py-32 border-t overflow-hidden"
      style={{ background: "#07111F", borderColor: "rgba(201,168,76,0.1)" }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg, #C9A84C, transparent)",
              }}
            />
            <ChatBubbleLeftRightIcon
              className="w-3.5 h-3.5"
              style={{ color: "#C9A84C" }}
            />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#C9A84C" }}
            >
              Community Voices
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="font-black leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              <span className="text-white">What Our </span>
              <span
                style={{
                  background: "linear-gradient(90deg, #C9A84C, #F0C040)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Customers
              </span>
              <span className="text-white"> Say</span>
            </h2>
            <p
              className="text-base leading-relaxed md:text-right max-w-xs"
              style={{ color: "#5A7A96" }}
            >
              Join thousands who have already transitioned to quantum-secure
              finance.
            </p>
          </div>
        </motion.div>

        {/* ── Testimonials grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{
            border: "1px solid rgba(201,168,76,0.1)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {testimonials.map((t, i) => {
            const isRightEdge = (i + 1) % 2 === 0;
            const isBottomEdge = i >= testimonials.length - 2;

            return (
              <motion.div
                key={t.id}
                variants={itemVariants}
                whileHover={{ background: "rgba(201,168,76,0.04)" }}
                className="relative flex flex-col gap-5 p-8"
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

                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-4 h-4"
                      style={{ color: "#C9A84C", fill: "#C9A84C" }}
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p
                  className="text-base leading-relaxed italic flex-1"
                  style={{ color: "#6A8FA8" }}
                >
                  "{t.text}"
                </p>

                {/* Author */}
                <div
                  className="flex items-center gap-3 pt-5"
                  style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                      color: "#07111F",
                    }}
                  >
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none mb-1">
                      {t.author}
                    </p>
                    <p className="text-xs" style={{ color: "#3D5A70" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Bottom live badge ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
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
              Verified community reviews
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
    </section>
  );
};

export default CustomerTestimonials;
