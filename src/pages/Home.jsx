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
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-emerald-700">
              <Globe2 className="w-4 h-4" />
              <span>Vasudha Open Data Initiative</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              India climate, energy and power visualizations
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Explore interactive geospatial, state-level and time-series
              visualizations based on datasets verified and approved by
              researchers at Vasudha Foundation.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Ordered Visualizations Feed */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />

            <p className="mt-4 text-sm text-slate-500">
              Loading published visualizations...
            </p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg p-10 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-5 rounded-lg bg-slate-100">
                <Database className="w-6 h-6 text-slate-500" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                No visualizations published yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Once an Admin submits a dataset and the Super Admin approves it,
                the visualization will appear here in approved chronological
                order.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {datasets.map((dataset) => (
              <DynamicVisualizer key={dataset._id} dataset={dataset} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
