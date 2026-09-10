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
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header & Tab Selector */}
      <div className="flex flex-col gap-4 pb-6 mb-8 border-b sm:flex-row sm:items-center sm:justify-between border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-800">
              Super Admin Console
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Review dataset submissions and manage administrative access.
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab("datasets")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === "datasets"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" /> Datasets Approval ({datasets.length})
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === "admins"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" /> Manage Admins ({admins.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          Loading records...
        </div>
      ) : activeTab === "datasets" ? (
        /* DATASET APPROVAL TAB */
        <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold tracking-wide uppercase text-slate-800">
              All Submitted Datasets
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Pending items require approval before public publishing
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs font-semibold uppercase border-b bg-slate-50 text-slate-400 border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Chart Title</th>
                  <th className="px-6 py-3.5">Domain</th>
                  <th className="px-6 py-3.5">Submitted By</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-center">Approval Actions</th>
                  <th className="px-6 py-3.5 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {datasets.map((item) => (
                  <tr
                    key={item._id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.title}
                      <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.chartType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-700">
                      {item.submittedBy?.name || "Admin"}
                      <span className="block text-[11px] text-slate-400">
                        {item.submittedBy?.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                      )}
                      {item.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}
                      {item.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        {item.status !== "APPROVED" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(item._id, "APPROVED")
                            }
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition"
                          >
                            Approve
                          </button>
                        )}
                        {item.status !== "REJECTED" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(item._id, "REJECTED")
                            }
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-red-50 hover:text-red-700 rounded-md transition"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingDataset(item);
                            setEditTitle(item.title);
                            setEditDomain(item.domain);
                          }}
                          className="p-1 transition text-slate-400 hover:text-indigo-600"
                          title="Edit Dataset"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDataset(item._id)}
                          className="p-1 transition text-slate-400 hover:text-red-600"
                          title="Delete Dataset"
                        >
                          <Trash2 className="w-4 h-4" />
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
        /* MANAGE ADMINS TAB */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Create Admin Form */}
          <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200 h-fit">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">
                Create New Admin
              </h2>
            </div>

            {userMsg.text && (
              <div
                className={`mb-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
                  userMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {userMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {userMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Ajay Analyst"
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200 text-slate-800"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="analyst@vasudhaindia.org"
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200 text-slate-800"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase text-slate-700">
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200 text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={creatingAdmin}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {creatingAdmin
                  ? "Sending Credentials..."
                  : "Create Admin & Dispatch Email"}
              </button>
            </form>
          </div>

          {/* Admin Accounts Table */}
          <div className="overflow-hidden bg-white border shadow-sm lg:col-span-2 rounded-xl border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold tracking-wide uppercase text-slate-800">
                Active Administrative Staff
              </h2>
              <span className="text-xs font-medium text-slate-500">
                {admins.length} Staff Members
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs font-semibold uppercase border-b bg-slate-50 text-slate-400 border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Name / Email</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-center">Toggle Access</th>
                    <th className="px-6 py-3.5 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((adm) => (
                    <tr
                      key={adm._id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4">
                        <span className="block font-semibold text-slate-800">
                          {adm.name}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {adm.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {adm.isActive ? (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleAdminStatus(adm._id)}
                          className={`p-1.5 rounded-lg border transition ${
                            adm.isActive
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                              : "text-slate-400 bg-slate-50 border-slate-200 hover:bg-slate-100"
                          }`}
                          title={
                            adm.isActive ? "Disable Admin" : "Enable Admin"
                          }
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteAdmin(adm._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 bg-white border shadow-2xl rounded-2xl border-slate-100">
            <h3 className="mb-4 text-base font-bold text-slate-800">
              Edit Dataset Metadata
            </h3>
            <form onSubmit={handleSaveDatasetEdit} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200 text-slate-800"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase text-slate-700">
                  Domain
                </label>
                <select
                  value={editDomain}
                  onChange={(e) => setEditDomain(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200 text-slate-800"
                >
                  <option value="Climate">Climate</option>
                  <option value="Energy">Energy</option>
                  <option value="Power">Power</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDataset(null)}
                  className="w-1/2 py-2 text-xs font-semibold rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
