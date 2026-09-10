import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

export default function StateHeatmap({ dataset }) {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/india.geojson.json")
      .then((res) => res.json())
      .then((json) => setGeoData(json))
      .catch((err) => console.error("Failed to load India GeoJSON:", err));
  }, []);

  // Compute values lookup table and scale
  const stateValues = {};
  let minVal = Infinity;
  let maxVal = -Infinity;

  dataset.data.forEach((row) => {
    const rawState = (row.state || row.State || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const val = Number(row.value || row.Value || 0);
    stateValues[rawState] = val;
    if (val < minVal) minVal = val;
    if (val > maxVal) maxVal = val;
  });

  if (minVal === Infinity) minVal = 0;
  if (maxVal === -Infinity) maxVal = 100;

  // Dynamic green-gradient generator
  const getColor = (d) => {
    if (d === undefined) return "#e2e8f0";
    const range = maxVal - minVal || 1;
    const normalized = (d - minVal) / range;
    return normalized > 0.8
      ? "#14532d"
      : normalized > 0.6
        ? "#16a34a"
        : normalized > 0.4
          ? "#4ade80"
          : normalized > 0.2
            ? "#86efac"
            : "#bbf7d0";
  };

  const styleFeature = (feature) => {
    const featState = (
      feature.properties.ST_NM ||
      feature.properties.NAME_1 ||
      feature.properties.state_name ||
      ""
    )
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const value = stateValues[featState];

    return {
      fillColor: getColor(value),
      weight: 1.5,
      opacity: 1,
      color: "#ffffff",
      dashArray: "2",
      fillOpacity: 0.85,
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName =
      feature.properties.ST_NM ||
      feature.properties.NAME_1 ||
      feature.properties.state_name ||
      "State";
    const featKey = stateName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const value = stateValues[featKey];

    layer.bindTooltip(
      `<div class="font-sans text-xs">
        <strong>${stateName}</strong><br/>
        Value: <strong>${value !== undefined ? value.toLocaleString() : "No Data"}</strong>
      </div>`,
      { sticky: true },
    );
  };

  return (
    <div className="h-[440px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={4.4}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJSON
            key={dataset._id}
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}
