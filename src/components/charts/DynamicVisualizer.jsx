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
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 lg:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <span
            className={`mb-1.5 inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getDomainBadge(
              dataset.domain,
            )}`}
          >
            <Tag className="h-3 w-3 shrink-0" />
            <span className="truncate">{dataset.domain}</span>
          </span>

          <h3 className="break-words text-base font-bold text-slate-800 sm:text-lg">
            {dataset.title}
          </h3>
        </div>

        <span className="shrink-0 text-xs font-medium text-slate-400 sm:text-right">
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

      {/* Visualization */}
      <div className="w-full min-w-0 overflow-x-auto">
        {dataset.chartType === "lat_long_map" && (
          <LatLngMap dataset={dataset} />
        )}

        {dataset.chartType === "state_heatmap" && (
          <StateHeatmap dataset={dataset} />
        )}

        {["line", "bar", "area"].includes(dataset.chartType) && (
          <TimeSeriesChart dataset={dataset} />
        )}
      </div>
    </div>
  );
}
