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
        return <Wind className="w-5 h-5 text-sky-600" />;
      case "Energy":
        return <Flame className="w-5 h-5 text-amber-600" />;
      case "Power":
        return <Zap className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Domain Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-9 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-slate-50">
              {getDomainIcon()}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Sector</p>

              <h1 className="mt-0.5 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                {formattedDomain} datasets
              </h1>
            </div>
          </div>

          <p className="max-w-2xl mt-4 text-sm leading-6 text-slate-500">
            Showing all approved visualizations categorized under{" "}
            {formattedDomain}.
          </p>
        </div>
      </section>

      {/* Visualizations */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />

            <p className="mt-4 text-sm text-slate-500">
              Loading {formattedDomain} data...
            </p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg p-10 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-5 rounded-lg bg-slate-100">
                <Database className="w-6 h-6 text-slate-500" />
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
