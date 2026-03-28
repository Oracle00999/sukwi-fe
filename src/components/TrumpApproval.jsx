// components/TrumpApproval.jsx
import React, { useRef, useState } from "react";
import {
  ShieldCheckIcon,
  FlagIcon,
  GlobeAltIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import trumpVideo from "../assets/trump.mp4";
import { motion } from "framer-motion";

const TrumpApproval = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const points = [
    {
      icon: <CpuChipIcon className="w-4 h-4" />,
      text: "Recognized as a secure and transparent foundation for the future of global finance — empowering individuals through decentralized ledger technology and smart contract automation.",
    },
    {
      icon: <GlobeAltIcon className="w-4 h-4" />,
      text: "A major advancement toward an economy based on decentralized finance, transparency, and innovation — ensuring financial control stays in the hands of the people.",
    },
    {
      icon: <ShieldCheckIcon className="w-4 h-4" />,
      text: "Protecting national sovereignty in the digital asset economy through tokenized assets and distributed ledger technology.",
    },
  ];

  return (
    <section
      className="relative py-24 md:py-32 border-t overflow-hidden"
      style={{ background: "#07111F", borderColor: "rgba(201,168,76,0.1)" }}
    >
      {/* Faint background gold glow — left side */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* ── LEFT: Text ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-10"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div
                className="h-px w-10"
                style={{
                  background: "linear-gradient(90deg, #C9A84C, transparent)",
                }}
              />
              <FlagIcon className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "#C9A84C" }}
              >
                Official Presidential Endorsement
              </span>
            </div>

            {/* Headline */}
            <div>
              <h2
                className="font-black leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(2.2rem, 3.8vw, 3.4rem)" }}
              >
                <span className="block text-white">Presidential</span>
                <span
                  className="block"
                  style={{
                    background: "linear-gradient(90deg, #C9A84C, #F0C040)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Approval
                </span>
                <span className="block text-white">Statement</span>
              </h2>
            </div>

            {/* Body points */}
            <div className="space-y-7">
              {points.map((pt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="flex gap-4"
                >
                  <div
                    className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(201,168,76,0.08)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      color: "#C9A84C",
                    }}
                  >
                    {pt.icon}
                  </div>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "#6A8FA8" }}
                  >
                    {pt.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div
              className="h-px"
              style={{
                background:
                  "linear-gradient(90deg, rgba(201,168,76,0.2), transparent)",
              }}
            />

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative pl-5"
              style={{ borderLeft: "2px solid #C9A84C" }}
            >
              <p
                className="text-lg font-medium italic leading-relaxed"
                style={{ color: "#C5CDD6" }}
              >
                "Together, we move forward to a stronger, more secure digital
                asset economy built on Web3 principles for every American and
                every global citizen."
              </p>
              <div className="flex items-center gap-2 mt-4">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#C9A84C" }}
                />
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "#4A6E8A" }}
                >
                  Official Presidential Statement
                </span>
              </div>
            </motion.blockquote>

            {/* Verification pills */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {[
                {
                  icon: <ShieldCheckIcon className="w-3.5 h-3.5" />,
                  label: "Blockchain Verified",
                },
                {
                  icon: <FlagIcon className="w-3.5 h-3.5" />,
                  label: "DeFi Sovereignty",
                },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    border: "1px solid rgba(201,168,76,0.15)",
                    background: "rgba(201,168,76,0.04)",
                    color: "#C9A84C",
                  }}
                >
                  {icon}
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Cinematic Video ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Outer gold glow ring */}
            <motion.div
              animate={{ opacity: isHovered ? 0.5 : 0.2 }}
              transition={{ duration: 0.4 }}
              className="absolute -inset-px rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, #C9A84C, #F0C04055, #C9A84C)",
                filter: "blur(8px)",
              }}
            />

            {/* Card shell */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(201,168,76,0.3)",
                background: "#060F1E",
              }}
            >
              {/* Top gold hairline */}
              <div
                className="absolute top-0 left-0 right-0 h-px z-10"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                }}
              />

              {/* Video — edge to edge */}
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={handlePlayPause}
                  controls={isPlaying}
                >
                  <source src={trumpVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Play overlay */}
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                    style={{
                      background: "rgba(6,15,30,0.55)",
                      backdropFilter: "blur(2px)",
                    }}
                    onClick={handlePlayPause}
                  >
                    {/* Play button */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center focus:outline-none"
                      style={{
                        background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                        boxShadow: "0 0 40px rgba(201,168,76,0.4)",
                      }}
                    >
                      {/* Play triangle */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="white"
                        className="w-6 h-6 ml-1"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.button>

                    {/* Caption below play button */}
                    <p
                      className="mt-4 text-xs font-medium tracking-widest uppercase"
                      style={{ color: "rgba(201,168,76,0.7)" }}
                    >
                      Watch Statement
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer bar */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{
                  background: "rgba(6,15,30,0.9)",
                  borderTop: "1px solid rgba(201,168,76,0.12)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #C9A84C22, #F0C04011)",
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  >
                    <FlagIcon
                      className="w-3.5 h-3.5"
                      style={{ color: "#C9A84C" }}
                    />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold leading-none">
                      Presidential Endorsement
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#4A6E8A" }}>
                      Official Web3Global Ledger Statement
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayPause}
                    className="text-xs px-3 py-1 rounded-lg transition-all"
                    style={{
                      background: "rgba(201,168,76,0.08)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      color: "#C9A84C",
                    }}
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: "rgba(201,168,76,0.06)",
                      color: "#4A6E8A",
                    }}
                  >
                    1:16
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom caption */}
            <p
              className="mt-3 text-xs text-center"
              style={{ color: "#3A5570" }}
            >
              Presidential endorsement of Quantum Financial System &amp; Web3
              ledger technology
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrumpApproval;
