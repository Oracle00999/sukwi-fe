import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  FileText,
  AlertCircle,
  Loader2,
  X,
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

// Format document type
const formatDocumentType = (type) => {
  const types = {
    driver_license: "Driver License",
    passport: "Passport",
    national_id: "National ID",
    voter_id: "Voter ID",
    utility_bill: "Utility Bill",
    bank_statement: "Bank Statement",
  };

  return (
    types[type] ||
    type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

// Document Viewer Modal Component
const DocumentViewer = ({ kycId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();

        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await fetch(
          `https://sukwi-be.onrender.com/api/admin/kyc/${kycId}/document`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 401) {
          setError("Session expired. Please login again.");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.status}`);
        }

        // Create blob URL for the image/document
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        setError(err.message || "Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();

    // Cleanup blob URL on unmount
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [kycId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">KYC Document</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading document...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Failed to load document
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : imageUrl ? (
            <div className="flex flex-col items-center">
              <img
                src={imageUrl}
                alt="KYC Document"
                className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
                onError={() =>
                  setError(
                    "Failed to display image. The file may be corrupted or in an unsupported format.",
                  )
                }
              />
              <p className="text-sm text-gray-500 mt-4">
                If the document doesn't display properly, it may be in a format
                that requires a separate viewer.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// Pending KYC Component
const PendingKYC = () => {
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [notification, setNotification] = useState(null);
  const [viewingDocumentId, setViewingDocumentId] = useState(null);

  // Fetch pending KYC - GET request
  const fetchPendingKYC = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        "https://sukwi-be.onrender.com/api/admin/kyc/pending",
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
        setKycSubmissions(data.data.pendingKyc);
      } else {
        setError(data.message || "Failed to fetch pending KYC");
      }
    } catch (err) {
      setError(err.message);
      showNotification("error", err.message || "Failed to fetch pending KYC");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // View document in modal
  const viewDocument = (id) => {
    setViewingDocumentId(id);
  };

  // Verify KYC - PUT request
  const verifyKYC = async (id) => {
    try {
      setProcessingId(id);
      setProcessingAction("verify");

      const token = getAuthToken();

      if (!token) {
        showNotification(
          "error",
          "No authentication token found. Please login again.",
        );
        return;
      }

      const response = await fetch(
        `https://sukwi-be.onrender.com/api/admin/kyc/${id}/verify`,
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
        // Remove verified KYC from list
        setKycSubmissions((prev) => prev.filter((kyc) => kyc.id !== id));
        showNotification("success", "KYC verified successfully");
      } else {
        showNotification("error", data.message || "Failed to verify KYC");
      }
    } catch (err) {
      showNotification("error", err.message || "Failed to verify KYC");
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  // Reject KYC - PUT request
  const rejectKYC = async (id) => {
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
        `https://sukwi-be.onrender.com/api/admin/kyc/${id}/reject`,
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
        // Remove rejected KYC from list
        setKycSubmissions((prev) => prev.filter((kyc) => kyc.id !== id));
        showNotification("success", "KYC rejected successfully");
      } else {
        showNotification("error", data.message || "Failed to reject KYC");
      }
    } catch (err) {
      showNotification("error", err.message || "Failed to reject KYC");
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

  // if (error) {
  //   return (
  //     <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
  //       <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
  //       <h3 className="text-lg font-medium text-red-800 mb-2">
  //         Failed to load KYC submissions
  //       </h3>
  //       <p className="text-red-600 mb-4">{error}</p>
  //       <button
  //         onClick={fetchPendingKYC}
  //         className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
  //       >
  //         Try Again
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pending KYC Verification
          </h1>
          <p className="text-gray-600 mt-1">
            Review and verify user identity documents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">
              {kycSubmissions.length}
            </span>{" "}
            pending KYC submissions
          </div>
          <button
            onClick={fetchPendingKYC}
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
                  User Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
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
              {kycSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        No pending KYC submissions
                      </p>
                      <p className="text-gray-500">
                        All KYC requests have been processed
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                kycSubmissions.map((kyc) => {
                  const isProcessing = processingId === kyc.id;
                  const isVerifying =
                    isProcessing && processingAction === "verify";
                  const isRejecting =
                    isProcessing && processingAction === "reject";

                  return (
                    <tr key={kyc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {kyc.user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {kyc.user.email}
                          </p>
                          {/* <p className="text-xs text-gray-400 mt-1">
                            Joined: {formatDate(kyc.user.joinedAt)}
                          </p> */}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDocumentType(kyc.documentType)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">
                          {kyc.documentNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {formatDate(kyc.submittedAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => viewDocument(kyc.id)}
                          className="inline-flex min-w-[122px] items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100 hover:shadow-sm"
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          View Document
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 shadow-sm">
                          <button
                            onClick={() => verifyKYC(kyc.id)}
                            disabled={isProcessing}
                            className="inline-flex min-w-[90px] items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isVerifying ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                            )}
                            Verify
                          </button>
                          <button
                            onClick={() => rejectKYC(kyc.id)}
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

      {/* Document Viewer Modal */}
      {viewingDocumentId && (
        <DocumentViewer
          kycId={viewingDocumentId}
          onClose={() => setViewingDocumentId(null)}
        />
      )}

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

export default PendingKYC;
