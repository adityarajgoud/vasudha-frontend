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
        return <Wind className="w-6 h-6 text-sky-500" />;
      case "Energy":
        return <Flame className="w-6 h-6 text-amber-500" />;
      case "Power":
        return <Zap className="w-6 h-6 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
              {getDomainIcon()}
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                Sector Focus
              </span>
              <h1 className="text-2xl font-bold sm:text-3xl text-slate-900">
                {formattedDomain} Datasets
              </h1>
            </div>
          </div>
          <p className="max-w-2xl mt-2 text-sm text-slate-500">
            Showing all approved visualizations categorized under{" "}
            {formattedDomain}.
          </p>
        </div>
      </section>

      <main className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 mx-auto mb-4 border-4 rounded-full border-emerald-600 border-t-transparent animate-spin"></div>
            <p className="text-sm font-medium text-slate-500">
              Loading {formattedDomain} data...
            </p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="max-w-md p-12 mx-auto my-12 text-center bg-white border rounded-2xl border-slate-200">
            <Database className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">
              No {formattedDomain} Visualizations
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              There are currently no approved visualizations in this domain.
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
