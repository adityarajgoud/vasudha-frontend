import React, { useEffect, useState } from "react";
import API from "../services/api";
import DynamicVisualizer from "../components/charts/DynamicVisualizer";
import { BarChart3, Database, Globe2 } from "lucide-react";

export default function Home() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/public/datasets")
      .then(({ data }) => setDatasets(data.datasets))
      .catch((err) =>
        console.error("Failed to load published visualizations:", err),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
              <Globe2 className="w-3.5 h-3.5" /> Vasudha Open Data Initiative
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
              India Climate, Energy & Power Visualizations
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Explore interactive geospatial, state choropleth heatmaps, and
              time-series analyses verified and approved by researchers at
              Vasudha Foundation.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Ordered Visualizations Feed */}
      <main className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 mx-auto mb-4 border-4 rounded-full border-emerald-600 border-t-transparent animate-spin"></div>
            <p className="text-sm font-medium text-slate-500">
              Loading published visualizations...
            </p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="max-w-md p-12 mx-auto my-12 text-center bg-white border rounded-2xl border-slate-200">
            <Database className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">
              No Visualizations Published Yet
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Once an Admin submits a dataset and the Super Admin approves it,
              it will render here in approved chronological order.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {datasets.map((dataset) => (
              <DynamicVisualizer key={dataset._id} dataset={dataset} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
