// pages/KycVerify.jsx
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const documentTypes = [
  { value: "national_id", label: "National ID Card" },
  { value: "passport", label: "Passport" },
  { value: "driver_license", label: "Driver's License" },
  { value: "voter_card", label: "Voter's Card" },
];

const baseInput = {
  width: "100%",
  background: "#04090F",
  border: "1px solid rgba(201,168,76,0.15)",
  borderRadius: 12,
  color: "white",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
  padding: "0.75rem 1rem",
};
const focusStyle = { borderColor: "rgba(201,168,76,0.55)" };

const KycVerify = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    documentType: "national_id",
    documentNumber: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState({});
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }
    if (
      !["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
        file.type,
      )
    ) {
      setError("File must be JPG, PNG, or PDF format");
      return;
    }
    setSelectedFile(file);
    setError("");
  };

  const handleFileChange = (e) => handleFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.documentNumber.trim()) {
      setError("Please enter your document number");
      return;
    }
    if (!selectedFile) {
      setError("Please upload a document");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const fd = new FormData();
      fd.append("documentType", formData.documentType);
      fd.append("documentNumber", formData.documentNumber.trim());
      fd.append("document", selectedFile);

      const res = await fetch("https://sukwi-be.onrender.com/api/kyc/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to upload document");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ── Success state ──
  if (success) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 80 }}>
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            background: "linear-gradient(160deg,#0C1C36 0%,#070F1C 100%)",
            border: "1px solid rgba(201,168,76,0.18)",
            textAlign: "center",
            padding: "3rem 2rem",
          }}
        >
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg,transparent,#C9A84C,transparent)",
              margin: "-3rem -2rem 3rem",
            }}
          />
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              margin: "0 auto 18px",
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleIcon
              style={{ width: 30, height: 30, color: "#4ADE80" }}
            />
          </div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "white",
              margin: "0 0 8px",
            }}
          >
            Document Uploaded Successfully
          </h2>
          <p style={{ fontSize: 13, color: "#3D5A70", margin: "0 0 28px" }}>
            Your document is now waiting for admin verification. We'll notify
            you once it's reviewed.
          </p>
          <Link to="/account" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#C9A84C,#F0C040)",
                color: "#07111F",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 22px rgba(201,168,76,0.4)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              Back to Account
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 80 }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <Link to="/account" style={{ textDecoration: "none" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201,168,76,0.15)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(201,168,76,0.08)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
            }}
          >
            <ArrowLeftIcon
              style={{ width: 18, height: 18, color: "#C9A84C" }}
            />
          </div>
        </Link>
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "black",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            KYC Verification
          </h1>
          <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
            Upload your identification document for verification
          </p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(160deg,#0C1C36 0%,#070F1C 100%)",
          border: "1px solid rgba(201,168,76,0.18)",
          boxShadow: "0 0 50px rgba(201,168,76,0.06)",
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,#C9A84C,transparent)",
          }}
        />

        {/* Card header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(201,168,76,0.08)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "white",
                margin: 0,
              }}
            >
              Identity Verification
            </p>
            <p style={{ fontSize: 12, color: "#3D5A70", margin: "3px 0 0" }}>
              Provide a valid government-issued document
            </p>
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            <ShieldCheckIcon
              style={{ width: 18, height: 18, color: "#C9A84C" }}
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Document type */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#4A6E8A",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              Document Type
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                <DocumentTextIcon
                  style={{
                    width: 16,
                    height: 16,
                    color: focused.docType ? "#C9A84C" : "#2E4A60",
                  }}
                />
              </div>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                onFocus={() => setFocused((p) => ({ ...p, docType: true }))}
                onBlur={() => setFocused((p) => ({ ...p, docType: false }))}
                style={{
                  ...baseInput,
                  appearance: "none",
                  paddingLeft: "2.75rem",
                  paddingRight: 36,
                  ...(focused.docType ? focusStyle : {}),
                }}
              >
                {documentTypes.map((t) => (
                  <option
                    key={t.value}
                    value={t.value}
                    style={{ background: "#07111F" }}
                  >
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 14,
                  height: 14,
                  color: "#3D5A70",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Document number */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#4A6E8A",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              Document Number
            </label>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, docNum: true }))}
              onBlur={() => setFocused((p) => ({ ...p, docNum: false }))}
              placeholder="e.g. A12345678"
              style={{ ...baseInput, ...(focused.docNum ? focusStyle : {}) }}
            />
          </div>

          {/* File upload drop zone */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#4A6E8A",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              Document Upload
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: "none" }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                padding: "2rem 1rem",
                borderRadius: 14,
                border: `2px dashed ${dragOver ? "#C9A84C" : selectedFile ? "rgba(74,222,128,0.4)" : "rgba(201,168,76,0.2)"}`,
                background: dragOver
                  ? "rgba(201,168,76,0.06)"
                  : selectedFile
                    ? "rgba(74,222,128,0.04)"
                    : "rgba(201,168,76,0.02)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!selectedFile) {
                  e.currentTarget.style.borderColor = "#C9A84C";
                  e.currentTarget.style.background = "rgba(201,168,76,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedFile) {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
                  e.currentTarget.style.background = "rgba(201,168,76,0.02)";
                }
              }}
            >
              {selectedFile ? (
                <>
                  <CheckCircleIcon
                    style={{
                      width: 28,
                      height: 28,
                      color: "#4ADE80",
                      margin: "0 auto 10px",
                    }}
                  />
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#4ADE80",
                      margin: "0 0 4px",
                    }}
                  >
                    {selectedFile.name}
                  </p>
                  <p style={{ fontSize: 11, color: "#3D5A70", margin: 0 }}>
                    {(selectedFile.size / 1024).toFixed(0)} KB · Click to
                    replace
                  </p>
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon
                    style={{
                      width: 28,
                      height: 28,
                      color: "#2E4A60",
                      margin: "0 auto 10px",
                    }}
                  />
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#8EB1CE",
                      margin: "0 0 4px",
                    }}
                  >
                    Click or drag to upload
                  </p>
                  <p style={{ fontSize: 11, color: "#2E4A60", margin: 0 }}>
                    JPG, PNG or PDF · Max 5MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <XCircleIcon
                style={{
                  width: 15,
                  height: 15,
                  color: "#EF4444",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: "#EF4444" }}>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            style={{
              padding: "14px",
              borderRadius: 12,
              border: "none",
              fontSize: 14,
              fontWeight: 700,
              cursor: uploading ? "not-allowed" : "pointer",
              background: uploading
                ? "rgba(201,168,76,0.1)"
                : "linear-gradient(135deg,#C9A84C,#F0C040)",
              color: uploading ? "rgba(201,168,76,0.3)" : "#07111F",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              if (!uploading)
                e.currentTarget.style.boxShadow =
                  "0 0 26px rgba(201,168,76,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {uploading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 15,
                    height: 15,
                    border: "2px solid rgba(201,168,76,0.3)",
                    borderTopColor: "#C9A84C",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                  }}
                />
                Uploading…
              </span>
            ) : (
              "Submit for Verification"
            )}
          </button>

          {/* Privacy note */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <ShieldCheckIcon
              style={{
                width: 14,
                height: 14,
                color: "#2E4A60",
                flexShrink: 0,
                marginTop: 1,
              }}
            />
            <p
              style={{
                fontSize: 11,
                color: "#2E4A60",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Your document is encrypted and securely stored. It is only used
              for identity verification and will never be shared with third
              parties.
            </p>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default KycVerify;
