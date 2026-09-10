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
          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approved
          </span>
        );

      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
            <XCircle className="h-3.5 w-3.5" />
            Rejected
          </span>
        );

      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            <Clock className="h-3.5 w-3.5" />
            Pending approval
          </span>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-emerald-600">
              Admin workspace
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Dataset management
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your submitted datasets and track their review status.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add dataset
          </button>
        </div>

        {/* Dataset section */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {/* Table header */}
          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Submitted datasets
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Datasets submitted from your account
              </p>
            </div>

            <span className="text-sm text-slate-500">
              {datasets.length}{" "}
              {datasets.length === 1 ? "submission" : "submissions"}
            </span>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
                Loading datasets...
              </div>
            </div>
          ) : datasets.length === 0 ? (
            /* Empty state */
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>

              <h3 className="text-sm font-semibold text-slate-800">
                No datasets yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Upload your first CSV dataset to submit it for review.
              </p>

              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Add dataset
              </button>
            </div>
          ) : (
            /* Dataset table */
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
                      Visualization
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-500">
                      Rows
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-500">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-500">
                      Submitted
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {datasets.map((item) => (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100">
                            <FileText className="h-4 w-4 text-slate-500" />
                          </div>

                          <span className="max-w-xs truncate text-sm font-medium text-slate-800">
                            {item.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {item.domain}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {item.chartType === "lat_long_map" &&
                            "India map (lat/long)"}

                          {item.chartType === "state_heatmap" &&
                            "State heatmap"}

                          {["line", "bar", "area"].includes(item.chartType) &&
                            `Time series (${item.chartType})`}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {item.data?.length || 0}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {getStatusBadge(item.status)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Add dataset
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Submit a CSV dataset for review.
                </p>
              </div>

              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="px-6 py-5">
              {/* Error */}
              {uploadError && (
                <div className="mb-5 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Success */}
              {uploadSuccess && (
                <div className="mb-5 flex items-start gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-5">
                {/* Chart title */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Chart title
                  </label>

                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Renewable energy capacity by state"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Domain + Chart type */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Domain
                    </label>

                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="Climate">Climate</option>
                      <option value="Energy">Energy</option>
                      <option value="Power">Power</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Chart type
                    </label>

                    <select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="lat_long_map">India map (lat/long)</option>

                      <option value="state_heatmap">India state heatmap</option>

                      <option value="line">Time series - line chart</option>

                      <option value="bar">Time series - bar chart</option>

                      <option value="area">Time series - area chart</option>
                    </select>
                  </div>
                </div>

                {/* Schema information */}
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3.5 py-3">
                  <div className="text-xs font-medium text-slate-700">
                    Expected CSV schema
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {chartType === "lat_long_map" &&
                      "Requires Latitude, Longitude, and a metric column."}

                    {chartType === "state_heatmap" &&
                      "Requires State and Value columns."}

                    {["line", "bar", "area"].includes(chartType) &&
                      "Requires Date/Year and at least one numeric metric column."}
                  </p>
                </div>

                {/* File upload */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    CSV file
                  </label>

                  <div className="relative rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30">
                    <input
                      type="file"
                      accept=".csv"
                      required
                      onChange={handleFileChange}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />

                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-slate-200">
                      <UploadCloud className="h-5 w-5 text-slate-500" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      {file ? file.name : "Choose a CSV file or drag it here"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Maximum file size: 5MB
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading
                      ? "Validating and uploading..."
                      : "Submit dataset"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
