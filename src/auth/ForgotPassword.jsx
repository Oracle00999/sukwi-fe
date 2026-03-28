// pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetData, setResetData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://sukwi-be.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setResetData(data.data);
        setSuccess(true);
        setEmail(""); // Clear email for security
      } else {
        setError(data.message || "Failed to generate reset code");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (resetData?.resetCode) {
      navigator.clipboard.writeText(resetData.resetCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTimeRemaining = (expiresAt) => {
    if (!expiresAt) return "";
    const expires = new Date(expiresAt);
    const now = new Date();
    const diffMs = expires - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (diffMs <= 0) return "Expired";
    return `${diffHours}h ${mins}m remaining`;
  };

  if (success && resetData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Reset Code Generated
            </h1>
            <p className="text-gray-600 mt-2">
              Use this code to reset your password
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-100 shadow-lg p-6">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircleIcon className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-4">
                Reset Code Created
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Copy this code and use it to reset your password
              </p>
            </div>

            {/* Reset Code Display */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-900">
                  Your Reset Code
                </label>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {formatTimeRemaining(resetData.expiresAt)}
                </span>
              </div>
              <div className="relative">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <code className="text-2xl font-bold text-gray-900 tracking-wider font-mono">
                      {resetData.resetCode}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      <DocumentDuplicateIcon className="h-5 w-5 mr-1" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This code will only be shown once. Please copy it now.
              </p>
            </div>

            {/* Warnings */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <span className="text-xs text-yellow-800">!</span>
                </div>
                <p className="text-sm text-yellow-800">
                  {resetData.warning ||
                    "This code is displayed only once. Copy it now."}
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <span className="text-xs text-red-800">!</span>
                </div>
                <p className="text-sm text-red-800">
                  {resetData.note ||
                    "Save this code securely. Do not share it with anyone."}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-emerald-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-emerald-800 mb-2">
                Next Steps
              </h4>
              <ol className="text-sm text-emerald-700 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Copy the reset code above</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Go to the password reset page</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Enter your email and the reset code</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>Create a new password</span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/reset-password"
                className="block w-full py-3 bg-emerald-600 text-white text-center rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Go to Reset Password Page
              </Link>
              <Link
                to="/login"
                className="block w-full py-3 border border-gray-300 text-gray-700 text-center rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email to receive a password reset code
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter your registered email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
                loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating Reset Code...
                </div>
              ) : (
                "Send Reset Code"
              )}
            </button>

            {/* Back to Login */}
            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>

            {/* Information */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                A 8-character reset code will be generated and displayed on
                screen. The code expires in 1 hour and will only be shown once.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
