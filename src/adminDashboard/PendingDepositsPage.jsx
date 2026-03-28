import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Copy,
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

// Pending Deposits Component
const PendingDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch pending deposits - GET request with authorization
  const fetchDeposits = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        "https://sukwi-be.onrender.com/api/admin/transactions/deposits/pending",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        // Token expired or invalid
        showNotification("error", "Session expired. Please login again.");
        // Optionally redirect to login
        // window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setDeposits(data.data.deposits);
      } else {
        setError(data.message || "Failed to fetch deposits");
      }
    } catch (err) {
      setError(err.message);
      showNotification("error", err.message || "Failed to fetch deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification("info", "Copied to clipboard");
  };

  // Confirm deposit - PUT request with authorization
  const confirmDeposit = async (id) => {
    try {
      setProcessingId(id);

      const token = getAuthToken();

      if (!token) {
        showNotification(
          "error",
          "No authentication token found. Please login again.",
        );
        return;
      }

      const response = await fetch(
        `https://sukwi-be.onrender.com/api/admin/transactions/deposits/${id}/confirm`,
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
        // Remove confirmed deposit from list
        setDeposits((prev) => prev.filter((deposit) => deposit.id !== id));
        showNotification("success", "Deposit confirmed successfully");
      } else {
        showNotification("error", data.message || "Failed to confirm deposit");
      }
    } catch (err) {
      showNotification("error", err.message || "Failed to confirm deposit");
    } finally {
      setProcessingId(null);
    }
  };

  // Reject deposit - PUT request with authorization
  const rejectDeposit = async (id) => {
    try {
      setProcessingId(id);

      const token = getAuthToken();

      if (!token) {
        showNotification(
          "error",
          "No authentication token found. Please login again.",
        );
        return;
      }

      const response = await fetch(
        `https://sukwi-be.onrender.com/api/admin/transactions/deposits/${id}/reject`,
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
        // Remove rejected deposit from list
        setDeposits((prev) => prev.filter((deposit) => deposit.id !== id));
        showNotification("success", "Deposit rejected successfully");
      } else {
        showNotification("error", data.message || "Failed to reject deposit");
      }
    } catch (err) {
      showNotification("error", err.message || "Failed to reject deposit");
    } finally {
      setProcessingId(null);
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
          <p className="text-gray-600">Please Wait...</p>
        </div>
      </div>
    );
  }

  //   if (error) {
  //     return (
  //       <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
  //         <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
  //         <h3 className="text-lg font-medium text-red-800 mb-2">
  //           Failed to load deposits
  //         </h3>
  //         <p className="text-red-600 mb-4">{error}</p>
  //         <button
  //           onClick={fetchDeposits}
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
          <h1 className="text-2xl font-bold text-gray-900">Pending Deposits</h1>
          <p className="text-gray-600 mt-1">
            Review and manage cryptocurrency deposit requests
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">
              {deposits.length}
            </span>{" "}
            pending deposits
          </div>
          <button
            onClick={fetchDeposits}
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
              {deposits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        No pending deposits
                      </p>
                      <p className="text-gray-500">
                        All deposit requests have been processed
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                deposits.map((deposit) => {
                  const cryptoDetails = getCryptoDetails(
                    deposit.cryptocurrency,
                  );

                  return (
                    <tr key={deposit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 font-mono">
                            {deposit.transactionId}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(deposit.transactionId)
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
                            {deposit.user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-[180px]">
                            {deposit.user.email}
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
                          ${deposit.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {formatDate(deposit.requestedAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => confirmDeposit(deposit.id)}
                            disabled={processingId === deposit.id}
                            className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === deposit.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => rejectDeposit(deposit.id)}
                            disabled={processingId === deposit.id}
                            className="flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === deposit.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1.5" />
                            )}
                            Reject
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-gray-600"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
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

export default PendingDeposits;
