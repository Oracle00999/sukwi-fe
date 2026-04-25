import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Edit3,
  Loader2,
  PlusCircle,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

const API_BASE = "https://sukwi-be.onrender.com/api";

const emptyForm = {
  name: "",
  roi: "",
  duration: "",
  minAmount: "",
  maxAmount: "",
};

const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const getPlanId = (plan) => plan?.id || plan?._id;

const normalizePlans = (payload) => {
  const data = payload?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.plans)) return data.plans;
  if (Array.isArray(data?.investmentPlans)) return data.investmentPlans;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Notification = ({ type, message, onClose }) => {
  const isSuccess = type === "success";

  return (
    <div
      className={`fixed right-4 top-4 z-50 max-w-md rounded-lg border p-4 shadow-lg ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <div className="flex items-start gap-3">
        {isSuccess ? (
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        ) : (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        )}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 transition hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function Staking() {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [notification, setNotification] = useState(null);

  const stats = useMemo(
    () => ({
      total: plans.length,
      averageRoi:
        plans.length > 0
          ? plans.reduce((sum, plan) => sum + Number(plan.roi || 0), 0) /
            plans.length
          : 0,
      lowestMin:
        plans.length > 0
          ? Math.min(...plans.map((plan) => Number(plan.minAmount || 0)))
          : 0,
    }),
    [plans],
  );

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const getHeaders = useCallback(() => {
    const token = getAuthToken();

    if (!token) {
      showNotification("error", "No authentication token found.");
      return null;
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [showNotification]);

  const fetchPlans = useCallback(async () => {
    const headers = getHeaders();
    if (!headers) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/investment-plans`, {
        headers,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load investment plans");
      }

      setPlans(normalizePlans(data));
    } catch (error) {
      showNotification(
        "error",
        error.message || "Failed to load investment plans",
      );
    } finally {
      setLoading(false);
    }
  }, [getHeaders, showNotification]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const validateForm = () => {
    const nextErrors = {};
    const roi = Number(formData.roi);
    const duration = Number(formData.duration);
    const minAmount = Number(formData.minAmount);
    const maxAmount = Number(formData.maxAmount);

    if (!formData.name.trim()) {
      nextErrors.name = "Plan name is required";
    }

    if (!formData.roi || roi <= 0) {
      nextErrors.roi = "ROI must be greater than 0";
    }

    if (!formData.duration || duration <= 0) {
      nextErrors.duration = "Duration must be greater than 0";
    }

    if (!formData.minAmount || minAmount <= 0) {
      nextErrors.minAmount = "Minimum amount must be greater than 0";
    }

    if (!formData.maxAmount || maxAmount <= 0) {
      nextErrors.maxAmount = "Maximum amount must be greater than 0";
    } else if (minAmount > maxAmount) {
      nextErrors.maxAmount = "Maximum amount must be above minimum amount";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const resetForm = () => {
    setEditingPlan(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || "",
      roi: String(plan.roi ?? ""),
      duration: String(plan.duration ?? ""),
      minAmount: String(plan.minAmount ?? ""),
      maxAmount: String(plan.maxAmount ?? ""),
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification("error", "Please fix the form errors.");
      return;
    }

    const headers = getHeaders();
    if (!headers) return;

    const payload = {
      name: formData.name.trim(),
      roi: Number(formData.roi),
      duration: Number(formData.duration),
      minAmount: Number(formData.minAmount),
      maxAmount: Number(formData.maxAmount),
    };
    const editingId = getPlanId(editingPlan);
    const endpoint = editingId
      ? `${API_BASE}/admin/investment-plans/${editingId}`
      : `${API_BASE}/admin/investment-plans`;

    try {
      setSaving(true);
      const res = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save investment plan");
      }

      showNotification(
        "success",
        editingId
          ? "Investment plan updated successfully"
          : "Investment plan created successfully",
      );
      resetForm();
      await fetchPlans();
    } catch (error) {
      showNotification(
        "error",
        error.message || "Failed to save investment plan",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan) => {
    const planId = getPlanId(plan);
    if (!planId) return;

    const shouldDelete = window.confirm(
      `Delete ${plan.name || "this investment plan"}?`,
    );
    if (!shouldDelete) return;

    const headers = getHeaders();
    if (!headers) return;

    try {
      setDeletingId(planId);
      const res = await fetch(`${API_BASE}/admin/investment-plans/${planId}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete investment plan");
      }

      showNotification("success", "Investment plan deleted successfully");
      setPlans((prev) => prev.filter((item) => getPlanId(item) !== planId));

      if (getPlanId(editingPlan) === planId) {
        resetForm();
      }
    } catch (error) {
      showNotification(
        "error",
        error.message || "Failed to delete investment plan",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Investment Plans
          </h1>
          <p className="mt-1 text-gray-600">
            Create, update, and remove investment plans users can subscribe to.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPlans}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Available Plans</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Average ROI</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.averageRoi.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Lowest Min Amount</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatMoney(stats.lowestMin)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingPlan ? "Edit Plan" : "Add Plan"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {editingPlan
                  ? "Update this investment plan."
                  : "Create a new plan for users."}
              </p>
            </div>

            {editingPlan && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                title="Cancel edit"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <Field
              label="Plan Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Starter Plan"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="ROI (%)"
                name="roi"
                type="number"
                value={formData.roi}
                onChange={handleChange}
                error={errors.roi}
                placeholder="10"
              />
              <Field
                label="Duration (days)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                error={errors.duration}
                placeholder="3"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Min Amount"
                name="minAmount"
                type="number"
                value={formData.minAmount}
                onChange={handleChange}
                error={errors.minAmount}
                placeholder="100"
              />
              <Field
                label="Max Amount"
                name="maxAmount"
                type="number"
                value={formData.maxAmount}
                onChange={handleChange}
                error={errors.maxAmount}
                placeholder="5000"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            {saving
              ? "Saving..."
              : editingPlan
                ? "Update Investment Plan"
                : "Add Investment Plan"}
          </button>
        </form>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">
              Available Investment Plans
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Plans returned from the admin investment plans endpoint.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : plans.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <PlusCircle className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm font-semibold text-gray-700">
                No investment plans yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Add your first investment plan using the form on the left.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHead>Name</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Min</TableHead>
                    <TableHead>Max</TableHead>
                    <TableHead align="right">Actions</TableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {plans.map((plan) => {
                    const planId = getPlanId(plan);
                    const isDeleting = deletingId === planId;

                    return (
                      <tr key={planId} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {plan.name}
                          </p>
                          <p className="text-xs text-gray-500">{planId}</p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-green-700">
                          {Number(plan.roi || 0)}%
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {Number(plan.duration || 0)} days
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {formatMoney(plan.minAmount)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {formatMoney(plan.maxAmount)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(plan)}
                              className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(plan)}
                              disabled={isDeleting}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-wait disabled:opacity-60"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Field = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      name={name}
      type={type}
      min={type === "number" ? "0" : undefined}
      step={type === "number" ? "any" : undefined}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
        error ? "border-red-300" : "border-gray-300"
      }`}
    />
    {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
  </div>
);

const TableHead = ({ children, align = "left" }) => (
  <th
    className={`whitespace-nowrap px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${
      align === "right" ? "text-right" : "text-left"
    }`}
  >
    {children}
  </th>
);
