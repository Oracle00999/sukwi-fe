import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Loader2,
  Calendar,
  Wallet,
  AlertCircle,
  Shield,
  X,
  Send,
  Phone,
  Globe,
  Play,
  Pause,
} from "lucide-react";

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Format KYC status
const formatKYCStatus = (status) => {
  const statusMap = {
    not_submitted: {
      label: "Not Submitted",
      color: "bg-gray-100 text-gray-800",
    },
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    verified: { label: "Verified", color: "bg-green-100 text-green-800" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
  };

  return (
    statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" }
  );
};

// Format role
const formatRole = (role) => {
  const roleMap = {
    user: { label: "User", color: "bg-blue-100 text-blue-800" },
    admin: { label: "Admin", color: "bg-purple-100 text-purple-800" },
    super_admin: { label: "Super Admin", color: "bg-red-100 text-red-800" },
  };

  return roleMap[role] || { label: role, color: "bg-gray-100 text-gray-800" };
};

// Format status
const formatStatus = (isActive) => {
  return isActive
    ? { label: "Active", color: "bg-green-100 text-green-800" }
    : { label: "Suspended", color: "bg-red-100 text-red-800" };
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

// Filter out admin users
const filterOutAdmins = (users) => {
  return users.filter((user) => user.role !== "admin");
};

// Toast Notification Component
const Toast = ({ message, type = "success", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-6 right-6 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-right-10 duration-300`}
    >
      {type === "success" && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {type === "error" && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700">{message}</p>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fund Modal Component
const FundModal = ({ isOpen, onClose, user, onFundSuccess }) => {
  const [cryptocurrency, setCryptocurrency] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const token = getAuthToken();

      const response = await fetch(
        `https://sukwi-be.onrender.com/api/admin/users/${user.id}/fund`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cryptocurrency,
            amount: parseFloat(amount),
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Wait for success message to show, then close modal and trigger success callback
        setTimeout(() => {
          onClose();
          if (onFundSuccess) {
            onFundSuccess(
              `Successfully funded ${user?.fullName} with $${amount} ${cryptocurrency}`,
            );
          }
        }, 1500);
      } else {
        setError(data.message || "Failed to fund user");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Fund User Account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-green-800 font-medium">
                Fund transfer initiated successfully!
              </p>
            </div>
          ) : (
            <>
              {/* User Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Funding user:</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                {user?.phone && (
                  <p className="text-xs text-gray-500 mt-1">
                    <Phone className="inline h-3 w-3 mr-1" />
                    {user.phone}
                  </p>
                )}
                {user?.country && (
                  <p className="text-xs text-gray-500 mt-1">
                    <Globe className="inline h-3 w-3 mr-1" />
                    {user.country}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Cryptocurrency Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cryptocurrency
                  </label>
                  <select
                    value={cryptocurrency}
                    onChange={(e) => setCryptocurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    {cryptoOptions.map((crypto) => (
                      <option key={crypto} value={crypto}>
                        {crypto.charAt(0).toUpperCase() +
                          crypto.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Funding...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Fund User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Users Component
const UsersManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "Confirm",
    cancelText: "Cancel",
    loading: false,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  // Fetch users - GET request
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch("https://sukwi-be.onrender.com/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAllUsers(data.data.users);
        // Filter out admin users
        const regularUsers = filterOutAdmins(data.data.users);
        setFilteredUsers(regularUsers);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFundClick = (user) => {
    setSelectedUser(user);
    setFundModalOpen(true);
  };

  const handleSuspendUser = async (user) => {
    try {
      setConfirmationModal((prev) => ({ ...prev, loading: true }));

      const token = getAuthToken();
      const response = await fetch(
        `https://sukwi-be.onrender.com/api/users/${user.id}/suspend`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setToast({
          message: `Successfully suspended user ${user.fullName}`,
          type: "success",
          visible: true,
        });
        fetchUsers(); // Refresh users list
        setConfirmationModal({ isOpen: false, loading: false });
      } else {
        setToast({
          message: data.message || "Failed to suspend user",
          type: "error",
          visible: true,
        });
        setConfirmationModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      setToast({
        message: err.message || "Network error",
        type: "error",
        visible: true,
      });
      setConfirmationModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleActivateUser = async (user) => {
    try {
      setConfirmationModal((prev) => ({ ...prev, loading: true }));

      const token = getAuthToken();
      const response = await fetch(
        `https://sukwi-be.onrender.com/api/users/${user.id}/activate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setToast({
          message: `Successfully activated user ${user.fullName}`,
          type: "success",
          visible: true,
        });
        fetchUsers(); // Refresh users list
        setConfirmationModal({ isOpen: false, loading: false });
      } else {
        setToast({
          message: data.message || "Failed to activate user",
          type: "error",
          visible: true,
        });
        setConfirmationModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      setToast({
        message: err.message || "Network error",
        type: "error",
        visible: true,
      });
      setConfirmationModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const showSuspendConfirmation = (user) => {
    setSelectedUser(user);
    setConfirmationModal({
      isOpen: true,
      title: "Suspend User",
      message: `Are you sure you want to suspend ${user.fullName}? This will prevent them from accessing their account.`,
      onConfirm: () => handleSuspendUser(user),
      confirmText: "Suspend",
      cancelText: "Cancel",
      loading: false,
    });
  };

  const showActivateConfirmation = (user) => {
    setSelectedUser(user);
    setConfirmationModal({
      isOpen: true,
      title: "Activate User",
      message: `Are you sure you want to activate ${user.fullName}? This will restore their account access.`,
      onConfirm: () => handleActivateUser(user),
      confirmText: "Activate",
      cancelText: "Cancel",
      loading: false,
    });
  };

  const handleFundSuccess = (message) => {
    // Refresh users list after successful fund
    fetchUsers();
    // Show toast notification
    if (message) {
      setToast({
        message,
        type: "success",
        visible: true,
      });
    }
  };

  const handleCloseToast = () => {
    setToast({ message: "", type: "success", visible: false });
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
      confirmText: "Confirm",
      cancelText: "Cancel",
      loading: false,
    });
  };

  // Calculate statistics from filtered users only
  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter((user) => user.isActive).length;
  const kycVerified = filteredUsers.filter(
    (user) => user.kycStatus === "verified",
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">
            View all regular users and their account information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{totalUsers}</span>{" "}
            regular users
          </div>
          <button
            onClick={fetchUsers}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">KYC Verified</p>
              <p className="text-2xl font-bold">{kycVerified}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        No regular users found
                      </p>
                      <p className="text-gray-500">
                        No regular users have registered yet
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const kycStatus = formatKYCStatus(user.kycStatus);
                  const role = formatRole(user.role);
                  const status = formatStatus(user.isActive);

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            ID: {user.id.substring(0, 8)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {user.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {user.country && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Globe className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{user.country}</span>
                            </div>
                          )}
                          {!user.phone && !user.country && (
                            <span className="text-xs text-gray-400">
                              No contact info
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.color}`}
                          >
                            {role.label}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${kycStatus.color}`}
                          >
                            {kycStatus.label}
                          </span>
                          {user.kycSubmittedAt && (
                            <span className="ml-2 text-xs text-gray-500">
                              {formatDate(user.kycSubmittedAt)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Wallet className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(user.wallet?.totalValue || 0)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleFundClick(user)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <Send className="h-4 w-4" />
                            Fund
                          </button>
                          {user.isActive ? (
                            <button
                              onClick={() => showSuspendConfirmation(user)}
                              className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <Pause className="h-4 w-4" />
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => showActivateConfirmation(user)}
                              className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <Play className="h-4 w-4" />
                              Activate
                            </button>
                          )}
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

      {/* Fund Modal */}
      <FundModal
        isOpen={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
        user={selectedUser}
        onFundSuccess={handleFundSuccess}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        loading={confirmationModal.loading}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default UsersManagement;
