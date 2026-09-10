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
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700 sm:mb-4">
              <Globe2 className="h-4 w-4 shrink-0" />
              <span>Vasudha Open Data Initiative</span>
            </div>

            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              India climate, energy and power visualizations
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
              Explore interactive geospatial, state-level and time-series
              visualizations based on datasets verified and approved by
              researchers at Vasudha Foundation.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Ordered Visualizations Feed */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center px-4 py-20 sm:py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

            <p className="mt-4 text-center text-sm text-slate-500">
              Loading published visualizations...
            </p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="flex justify-center px-0 py-10 sm:py-16">
            <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center sm:p-10">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                <Database className="h-6 w-6 text-slate-500" />
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
          <div className="space-y-5 sm:space-y-6">
            {datasets.map((dataset) => (
              <DynamicVisualizer key={dataset._id} dataset={dataset} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
