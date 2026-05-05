import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Notification Component
const Notification = ({ type, message, onClose }) => {
  const bgColor = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icon = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <XCircle className="h-5 w-5 text-red-600" />,
    info: <AlertCircle className="h-5 w-5 text-blue-600" />,
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor[type]} border rounded-lg shadow-lg p-4 max-w-md transition-transform duration-300`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{icon[type]}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Truncate address for display
const truncateAddress = (address, start = 6, end = 4) => {
  if (!address) return "";
  if (address.length <= start + end + 3) return address;
  return `${address.substring(0, start)}...${address.substring(
    address.length - end,
  )}`;
};

// Pending Withdrawals Component
const PendingWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [notification, setNotification] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(null);

  // Fetch pending withdrawals - GET request
  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        "https://sukwi-be.onrender.com/api/admin/transactions/withdrawals/pending",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        showNotification("error", "Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setWithdrawals(data.data.withdrawals);
      } else {
        setError(data.message || "Failed to fetch withdrawals");
      }
    } catch (err) {
      setError(err.message);
      showNotification("error", err.message || "Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Copy to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(id);
    showNotification("info", "Address copied to clipboard");

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedAddress(null);
    }, 2000);
  };

  // Approve withdrawal - PUT request
  const approveWithdrawal = async (id) => {
    try {
      setProcessingId(id);
      setProcessingAction("approve");

      const token = getAuthToken();

      if (!token) {
        showNotification(
          "error",
          "No authentication token found. Please login again.",
        );
        return;
      }

      const response = await fetch(
        `https://sukwi-be.onrender.com/api/admin/transactions/withdrawals/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        showNotification("error", "Session expired. Please login again.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Remove approved withdrawal from list
        setWithdrawals((prev) =>
          prev.filter((withdrawal) => withdrawal.id !== id),
        );
        showNotification("success", "Withdrawal approved successfully");
      } else {
        showNotification(
          "error",
          data.message || "Failed to approve withdrawal",
        );
      }
    } catch (err) {
      showNotification("error", err.message || "Failed to approve withdrawal");
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  // Reject withdrawal - PUT request
  const rejectWithdrawal = async (id) => {
    try {
      setProcessingId(id);
      setProcessingAction("reject");

      const token = getAuthToken();

      if (!token) {
        showNotification(
          "error",
          "No authentication token found. Please login again.",
        );
        return;
      }

      const response = await fetch(
        `https://sukwi-be.onrender.com/api/admin/transactions/withdrawals/${id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        showNotification("error", "Session expired. Please login again.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Remove rejected withdrawal from list
        setWithdrawals((prev) =>
          prev.filter((withdrawal) => withdrawal.id !== id),
        );
        showNotification("success", "Withdrawal rejected successfully");
      } else {
        showNotification(
          "error",
          data.message || "Failed to reject withdrawal",
        );
      }
    } catch (err) {
      showNotification("error", err.message || "Failed to reject withdrawal");
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get crypto icon/color
  const getCryptoDetails = (crypto) => {
    const details = {
      bitcoin: {
        color: "bg-orange-100 text-orange-800",
        label: "Bitcoin",
        short: "BTC",
      },
      ethereum: {
        color: "bg-purple-100 text-purple-800",
        label: "Ethereum",
        short: "ETH",
      },
      "binance-coin": {
        color: "bg-yellow-100 text-yellow-800",
        label: "Binance Coin",
        short: "BNB",
      },
      solana: {
        color: "bg-pink-100 text-pink-800",
        label: "Solana",
        short: "SOL",
      },
      ripple: {
        color: "bg-gray-100 text-gray-800",
        label: "Ripple",
        short: "XRP",
      },
      stellar: {
        color: "bg-blue-100 text-blue-800",
        label: "Stellar",
        short: "XLM",
      },
      dogecoin: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Dogecoin",
        short: "DOGE",
      },
      tron: {
        color: "bg-red-100 text-red-800",
        label: "TRON",
        short: "TRX",
      },
      tether: {
        color: "bg-green-100 text-green-800",
        label: "Tether",
        short: "USDT",
      },
      usdt: {
        color: "bg-green-100 text-green-800",
        label: "USDT",
        short: "USDT",
      },
      litecoin: {
        color: "bg-blue-100 text-blue-800",
        label: "Litecoin",
        short: "LTC",
      },
    };

    return (
      details[crypto.toLowerCase()] || {
        color: "bg-gray-100 text-gray-800",
        label: crypto,
        short: crypto,
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600"> Please Wait...</p>
        </div>
      </div>
    );
  }

  //   if (error) {
  //     return (
  //       <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
  //         <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
  //         <h3 className="text-lg font-medium text-red-800 mb-2">
  //           Failed to load withdrawals
  //         </h3>
  //         <p className="text-red-600 mb-4">{error}</p>
  //         <button
  //           onClick={fetchWithdrawals}
  //           className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
  //         >
  //           Try Again
  //         </button>
  //       </div>
  //     );
  //   }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pending Withdrawals
          </h1>
          <p className="text-gray-600 mt-1">
            Review and manage cryptocurrency withdrawal requests
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">
              {withdrawals.length}
            </span>{" "}
            pending withdrawals
          </div>
          <button
            onClick={fetchWithdrawals}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cryptocurrency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        No pending withdrawals
                      </p>
                      <p className="text-gray-500">
                        All withdrawal requests have been processed
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => {
                  const cryptoDetails = getCryptoDetails(
                    withdrawal.cryptocurrency,
                  );
                  const isCopied = copiedAddress === withdrawal.id;
                  const isProcessing = processingId === withdrawal.id;
                  const isApproving =
                    isProcessing && processingAction === "approve";
                  const isRejecting =
                    isProcessing && processingAction === "reject";

                  return (
                    <tr key={withdrawal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 font-mono">
                            {withdrawal.transactionId}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                withdrawal.transactionId,
                                "tx-" + withdrawal.id,
                              )
                            }
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy Transaction ID"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {withdrawal.user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-[180px]">
                            {withdrawal.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cryptoDetails.color}`}
                        >
                          {cryptoDetails.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ${withdrawal.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 max-w-[220px]">
                          <div className="flex-1 min-w-0">
                            <span
                              className="text-sm font-mono text-gray-900 truncate block"
                              title={withdrawal.toAddress}
                            >
                              {truncateAddress(withdrawal.toAddress)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  withdrawal.toAddress,
                                  withdrawal.id,
                                )
                              }
                              className={`p-1.5 rounded transition-colors ${
                                isCopied
                                  ? "bg-green-100 text-green-600"
                                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                              }`}
                              title={isCopied ? "Copied!" : "Copy address"}
                            >
                              {isCopied ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {formatDate(withdrawal.requestedAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 shadow-sm">
                          <button
                            onClick={() => approveWithdrawal(withdrawal.id)}
                            disabled={isProcessing}
                            className="inline-flex min-w-[96px] items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isApproving ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => rejectWithdrawal(withdrawal.id)}
                            disabled={isProcessing}
                            className="inline-flex min-w-[86px] items-center justify-center rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition-all hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isRejecting ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1.5" />
                            )}
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default PendingWithdrawals;
