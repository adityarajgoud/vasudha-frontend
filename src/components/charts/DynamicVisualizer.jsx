import React from "react";
import LatLngMap from "./LatLngMap";
import StateHeatmap from "./StateHeatmap";
import TimeSeriesChart from "./TimeSeriesChart";
import { Tag } from "lucide-react";

export default function DynamicVisualizer({ dataset }) {
  const getDomainBadge = (domain) => {
    switch (domain) {
      case "Climate":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Energy":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Power":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-6 transition-shadow bg-white border shadow-sm rounded-2xl border-slate-200 hover:shadow-md">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border mb-1.5 ${getDomainBadge(dataset.domain)}`}
          >
            <Tag className="w-3 h-3" /> {dataset.domain}
          </span>
          <h3 className="text-lg font-bold text-slate-800">{dataset.title}</h3>
        </div>
        <span className="text-xs font-medium text-slate-400">
          {new Date(dataset.approvedAt || dataset.createdAt).toLocaleDateString(
            undefined,
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            },
          )}
        </span>
      </div>

      {dataset.chartType === "lat_long_map" && <LatLngMap dataset={dataset} />}
      {dataset.chartType === "state_heatmap" && (
        <StateHeatmap dataset={dataset} />
      )}
      {["line", "bar", "area"].includes(dataset.chartType) && (
        <TimeSeriesChart dataset={dataset} />
      )}
    </div>
  );
}
