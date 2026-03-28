import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Wallet,
  PlusCircle,
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

// Get crypto details function
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
  };

  return (
    details[crypto.toLowerCase()] || {
      color: "bg-gray-100 text-gray-800",
      label: crypto,
      short: crypto,
    }
  );
};

// Add/Update Wallet Component
const AddWalletAddresses = () => {
  const [formData, setFormData] = useState({
    cryptocurrency: "",
    address: "",
    network: "",
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  // Available cryptocurrencies
  const cryptoOptions = [
    "bitcoin",
    "ethereum",
    "tether",
    "binance-coin",
    "solana",
    "ripple",
    "stellar",
    "dogecoin",
    "tron",
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.cryptocurrency) {
      newErrors.cryptocurrency = "Please select a cryptocurrency";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Wallet address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address seems too short";
    }

    if (!formData.network.trim()) {
      newErrors.network = "Network type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification("error", "Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      const token = getAuthToken();

      if (!token) {
        showNotification(
          "error",
          "No authentication token found. Please login again.",
        );
        return;
      }

      const response = await fetch(
        "https://sukwi-be.onrender.com/api/admin/crypto-addresses",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cryptocurrency: formData.cryptocurrency,
            address: formData.address.trim(),
            network: formData.network.trim(),
          }),
        },
      );

      if (response.status === 401) {
        showNotification("error", "Session expired. Please login again.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Reset form on success
        setFormData({
          cryptocurrency: "",
          address: "",
          network: "",
        });

        const cryptoDetails = getCryptoDetails(formData.cryptocurrency);
        showNotification(
          "success",
          `${cryptoDetails.label} address ${
            data.data.cryptoAddress ? "updated" : "added"
          } successfully`,
        );
      } else {
        showNotification("error", data.message || "Failed to save address");
      }
    } catch (err) {
      showNotification("error", err.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add/Update Wallet Addresses
          </h1>
          <p className="text-gray-600 mt-1">
            Add new cryptocurrency addresses or update existing ones
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* Cryptocurrency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cryptocurrency <span className="text-red-500">*</span>
            </label>
            <select
              name="cryptocurrency"
              value={formData.cryptocurrency}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cryptocurrency ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select a cryptocurrency</option>
              {cryptoOptions.map((crypto) => {
                const details = getCryptoDetails(crypto);
                return (
                  <option key={crypto} value={crypto}>
                    {details.label} ({details.short})
                  </option>
                );
              })}
            </select>
            {errors.cryptocurrency && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cryptocurrency}
              </p>
            )}
            {formData.cryptocurrency && (
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    getCryptoDetails(formData.cryptocurrency).color
                  }`}
                >
                  {getCryptoDetails(formData.cryptocurrency).label}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Selecting an existing cryptocurrency will update its address
                </p>
              </div>
            )}
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter the full wallet address..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                errors.address ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter the complete wallet address. Make sure to double-check for
              accuracy.
            </p>
          </div>

          {/* Network */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Network <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="network"
              value={formData.network}
              onChange={handleChange}
              placeholder="e.g., BEP 20, ERC-20, TRC-20, Mainnet, etc."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.network ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.network && (
              <p className="mt-1 text-sm text-red-600">{errors.network}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Specify the network type (e.g., BEP 20, ERC-20, TRC-20, Mainnet)
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Save Address
                </>
              )}
            </button>
            <p className="mt-2 text-sm text-gray-500">
              This will add a new address or update the existing one for the
              selected cryptocurrency
            </p>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-blue-900">How it works</h3>
            <ul className="mt-2 text-sm text-blue-800 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <span>Select a cryptocurrency from the dropdown</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <span>Enter the wallet address and network type</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <span>
                  If the cryptocurrency already exists, its address will be
                  updated
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <span>If it doesn't exist, a new entry will be created</span>
              </li>
            </ul>
          </div>
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

export default AddWalletAddresses;
