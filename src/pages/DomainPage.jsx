import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import DynamicVisualizer from "../components/charts/DynamicVisualizer";
import { Wind, Flame, Zap, Database } from "lucide-react";

export default function DomainPage() {
  const { domainName } = useParams();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Capitalize route param to match DB enum ('climate' -> 'Climate')
  const formattedDomain =
    domainName.charAt(0).toUpperCase() + domainName.slice(1).toLowerCase();

  useEffect(() => {
    setLoading(true);
    API.get(`/public/datasets?domain=${formattedDomain}`)
      .then(({ data }) => setDatasets(data.datasets))
      .catch((err) => console.error("Failed to load domain datasets:", err))
      .finally(() => setLoading(false));
  }, [domainName]);

  const getDomainIcon = () => {
    switch (formattedDomain) {
      case "Climate":
        return <Wind className="h-5 w-5 text-sky-600" />;
      case "Energy":
        return <Flame className="h-5 w-5 text-amber-600" />;
      case "Power":
        return <Zap className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Domain Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
              {getDomainIcon()}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">Sector</p>

              <h1 className="mt-0.5 break-words text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {formattedDomain} datasets
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:mt-4">
            Showing all approved visualizations categorized under{" "}
            {formattedDomain}.
          </p>
        </div>
      </section>

      {/* Visualizations */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center px-4 py-20 sm:py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

            <p className="mt-4 text-center text-sm text-slate-500">
              Loading {formattedDomain} data...
            </p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="flex justify-center px-0 py-10 sm:py-16">
            <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center sm:p-10">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                <Database className="h-6 w-6 text-slate-500" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                No {formattedDomain} visualizations
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                There are currently no approved visualizations in this domain.
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
