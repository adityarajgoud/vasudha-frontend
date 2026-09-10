import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Plus,
  X,
} from "lucide-react";

export default function AdminDashboard() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("Climate");
  const [chartType, setChartType] = useState("lat_long_map");
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchMyDatasets = async () => {
    try {
      const { data } = await API.get("/datasets/my");
      setDatasets(data.datasets);
    } catch (err) {
      console.error("Failed to load datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDatasets();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && !selected.name.toLowerCase().endsWith(".csv")) {
      setUploadError("Only .csv files are supported.");
      setFile(null);
      return;
    }
    setUploadError("");
    setFile(selected);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");
    setUploadSuccess("");

    if (!file) {
      setUploadError("Please choose a .csv dataset file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("domain", domain);
    formData.append("chartType", chartType);
    formData.append("file", file);

    setUploading(true);
    try {
      await API.post("/datasets/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadSuccess(
        "Dataset submitted successfully! Pending Super Admin review.",
      );
      setTitle("");
      setFile(null);
      fetchMyDatasets();
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess("");
      }, 1500);
    } catch (err) {
      setUploadError(
        err.response?.data?.message ||
          "Upload failed. Ensure CSV schema matches the chart type.",
      );
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending Approval
          </span>
        );
    }
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header & Upload Button */}
      <div className="flex flex-col gap-4 pb-6 mb-8 border-b sm:flex-row sm:items-center sm:justify-between border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and submit environmental and energy datasets for review.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Add New Dataset
        </button>
      </div>

      {/* Dataset Table */}
      <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold tracking-wide uppercase text-slate-800">
            Submitted Datasets
          </h2>
          <span className="text-xs font-medium text-slate-500">
            {datasets.length} Total Submissions
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            Loading datasets...
          </div>
        ) : datasets.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">
              No datasets submitted yet.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Click "Add New Dataset" to upload your first CSV.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs font-semibold uppercase border-b bg-slate-50 text-slate-400 border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Chart Title</th>
                  <th className="px-6 py-3.5">Domain</th>
                  <th className="px-6 py-3.5">Visualization Type</th>
                  <th className="px-6 py-3.5">Rows</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Submitted On</th>
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
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {item.chartType === "lat_long_map" &&
                        "India Map (Lat/Long)"}
                      {item.chartType === "state_heatmap" && "State Heatmap"}
                      {["line", "bar", "area"].includes(item.chartType) &&
                        `Time Series (${item.chartType.toUpperCase()})`}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {item.data?.length || 0}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CSV Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 bg-white border shadow-2xl rounded-2xl border-slate-100">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Add New Dataset
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="flex items-start gap-2 p-3 mb-4 text-xs text-red-700 border border-red-200 rounded-lg bg-red-50">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 p-3 mb-4 text-xs border rounded-lg bg-emerald-50 border-emerald-200 text-emerald-700">
                <CheckCircle2 className="flex-shrink-0 w-4 h-4" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase text-slate-700">
                  Chart Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Renewable Energy Capacity - State Wise"
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase text-slate-700">
                    Domain
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Climate">Climate</option>
                    <option value="Energy">Energy</option>
                    <option value="Power">Power</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase text-slate-700">
                    Chart Type
                  </label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="lat_long_map">India Map (Lat/Long)</option>
                    <option value="state_heatmap">India State Heatmap</option>
                    <option value="line">Time Series - Line Chart</option>
                    <option value="bar">Time Series - Bar Chart</option>
                    <option value="area">Time Series - Area Chart</option>
                  </select>
                </div>
              </div>

              {/* Schema Hint */}
              <div className="p-3 text-xs border rounded-lg bg-slate-50 border-slate-200 text-slate-600">
                <span className="font-semibold text-slate-700">
                  Expected CSV Schema:{" "}
                </span>
                {chartType === "lat_long_map" &&
                  "Requires Latitude, Longitude, and a metric column."}
                {chartType === "state_heatmap" &&
                  "Requires State and Value columns."}
                {["line", "bar", "area"].includes(chartType) &&
                  "Requires Date/Year and at least one numeric metric column."}
              </div>

              {/* File Input */}
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase text-slate-700">
                  Upload CSV File
                </label>
                <div className="relative p-4 text-center transition border-2 border-dashed rounded-lg cursor-pointer border-slate-200 hover:border-emerald-500">
                  <input
                    type="file"
                    accept=".csv"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 mx-auto mb-1 text-slate-400" />
                  <p className="text-xs font-medium text-slate-700">
                    {file
                      ? file.name
                      : "Click to select or drag & drop a .csv file"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Maximum file size: 5MB
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold transition rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 text-xs font-semibold text-white transition rounded-lg shadow-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {uploading ? "Validating & Uploading..." : "Submit Dataset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
