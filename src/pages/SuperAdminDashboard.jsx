import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  ShieldCheck,
  UserPlus,
  Users,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Power,
  Clock,
  Layers,
  AlertCircle,
} from "lucide-react";

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("datasets"); // 'datasets' | 'admins'
  const [datasets, setDatasets] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Admin Form State
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [userMsg, setUserMsg] = useState({ type: "", text: "" });
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // Edit Dataset Modal State
  const [editingDataset, setEditingDataset] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDomain, setEditDomain] = useState("Climate");

  const fetchData = async () => {
    setLoading(true);

    try {
      const [dsRes, adminRes] = await Promise.all([
        API.get("/datasets/all"),
        API.get("/users/admins"),
      ]);

      setDatasets(dsRes.data.datasets);
      setAdmins(adminRes.data.admins);
    } catch (err) {
      console.error("Failed to load Super Admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.patch(`/datasets/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteDataset = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dataset?"))
      return;

    try {
      await API.delete(`/datasets/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete dataset");
    }
  };

  const handleSaveDatasetEdit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/datasets/${editingDataset._id}`, {
        title: editTitle,
        domain: editDomain,
      });

      setEditingDataset(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update dataset");
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setUserMsg({ type: "", text: "" });
    setCreatingAdmin(true);

    try {
      const { data } = await API.post("/users/admins", {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
      });

      setUserMsg({ type: "success", text: data.message });

      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");

      fetchData();
    } catch (err) {
      setUserMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to create Admin",
      });
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleToggleAdminStatus = async (id) => {
    try {
      await API.patch(`/users/admins/${id}/toggle`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle Admin status");
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (
      !window.confirm("Are you sure you want to permanently remove this Admin?")
    )
      return;

    try {
      await API.delete(`/users/admins/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete Admin");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <ShieldCheck className="h-4 w-4" />
              Administration
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Super admin dashboard
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Review submitted datasets and manage administrative access.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex w-full border-b border-slate-200 lg:w-auto lg:border-b-0">
            <button
              onClick={() => setActiveTab("datasets")}
              className={`relative flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm transition lg:flex-none ${
                activeTab === "datasets"
                  ? "font-medium text-indigo-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Layers className="h-4 w-4" />
              Datasets
              <span className="text-xs text-slate-400">{datasets.length}</span>
              {activeTab === "datasets" && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("admins")}
              className={`relative flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm transition lg:flex-none ${
                activeTab === "admins"
                  ? "font-medium text-indigo-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users className="h-4 w-4" />
              Admins
              <span className="text-xs text-slate-400">{admins.length}</span>
              {activeTab === "admins" && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
              Loading records...
            </div>
          </div>
        ) : activeTab === "datasets" ? (
          /* Dataset approval */
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Submitted datasets
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Review and manage datasets submitted by administrators.
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {datasets.length}{" "}
                {datasets.length === 1 ? "dataset" : "datasets"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-500">
                      Chart title
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-500">
                      Domain
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-500">
                      Submitted by
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-500">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-center text-xs font-medium text-slate-500">
                      Review
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {datasets.map((item) => (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      {/* Title */}
                      <td className="px-5 py-4">
                        <div className="max-w-xs">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {item.chartType}
                          </p>
                        </div>
                      </td>

                      {/* Domain */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {item.domain}
                        </span>
                      </td>

                      {/* Submitted by */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {item.submittedBy?.name || "Admin"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {item.submittedBy?.email}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {item.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Published
                          </span>
                        )}

                        {item.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                            <XCircle className="h-3.5 w-3.5" />
                            Rejected
                          </span>
                        )}

                        {item.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            <Clock className="h-3.5 w-3.5" />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Review */}
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          {item.status !== "APPROVED" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(item._id, "APPROVED")
                              }
                              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                            >
                              Approve
                            </button>
                          )}

                          {item.status !== "REJECTED" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(item._id, "REJECTED")
                              }
                              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Manage */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingDataset(item);
                              setEditTitle(item.title);
                              setEditDomain(item.domain);
                            }}
                            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                            title="Edit dataset"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteDataset(item._id)}
                            className="rounded-md p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            title="Delete dataset"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Manage admins */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Create admin */}
            <div className="h-fit rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                    <UserPlus className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Create admin
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Add a new administrator account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-5">
                {userMsg.text && (
                  <div
                    className={`mb-5 flex items-start gap-2.5 rounded-md border px-3.5 py-3 text-sm ${
                      userMsg.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {userMsg.type === "success" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}

                    <span>{userMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleCreateAdmin} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Full name
                    </label>

                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Ajay Analyst"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email address
                    </label>

                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="analyst@vasudhaindia.org"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Initial password
                    </label>

                    <input
                      type="password"
                      required
                      minLength={6}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creatingAdmin}
                    className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creatingAdmin ? "Sending credentials..." : "Create admin"}
                  </button>
                </form>
              </div>
            </div>

            {/* Admin accounts */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:col-span-2">
              <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Admin accounts
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Manage access for administrative users.
                  </p>
                </div>

                <span className="text-sm text-slate-500">
                  {admins.length} {admins.length === 1 ? "account" : "accounts"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-500">
                        Name and email
                      </th>

                      <th className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-500">
                        Status
                      </th>

                      <th className="whitespace-nowrap px-5 py-3 text-center text-xs font-medium text-slate-500">
                        Access
                      </th>

                      <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-medium text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {admins.map((adm) => (
                      <tr
                        key={adm._id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {adm.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {adm.email}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {adm.isActive ? (
                            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Disabled
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => handleToggleAdminStatus(adm._id)}
                            className={`inline-flex rounded-md border p-2 transition ${
                              adm.isActive
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                            }`}
                            title={
                              adm.isActive ? "Disable admin" : "Enable admin"
                            }
                          >
                            <Power className="h-4 w-4" />
                          </button>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDeleteAdmin(adm._id)}
                            className="rounded-md p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            title="Delete admin"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Edit Dataset Modal */}
        {editingDataset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              {/* Modal header */}
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Edit dataset
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Update the dataset information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingDataset(null)}
                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={handleSaveDatasetEdit}
                className="space-y-5 px-6 py-5"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Title
                  </label>

                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Domain
                  </label>

                  <select
                    value={editDomain}
                    onChange={(e) => setEditDomain(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="Climate">Climate</option>
                    <option value="Energy">Energy</option>
                    <option value="Power">Power</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={() => setEditingDataset(null)}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
