import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export default function LatLngMap({ dataset }) {
  const { data } = dataset;

  // Center coordinate for India
  const defaultCenter = [22.5937, 78.9629];

  return (
    <div className="h-[300px] w-full overflow-hidden rounded-lg border border-slate-200 shadow-inner sm:h-[360px] sm:rounded-xl md:h-[420px]">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data.map((item, idx) => {
          const lat = Number(item.lat || item.Latitude || item.LATITUDE);
          const lng = Number(
            item.lng || item.Longitude || item.LONGITUDE || item.LON,
          );

          const metricKey = Object.keys(item).find(
            (k) =>
              ![
                "lat",
                "lng",
                "Latitude",
                "Longitude",
                "LATITUDE",
                "LONGITUDE",
                "LON",
              ].includes(k),
          );

          const val = metricKey ? item[metricKey] : "N/A";

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <CircleMarker
              key={idx}
              center={[lat, lng]}
              radius={7}
              pathOptions={{
                color: "#15803d",
                fillColor: "#22c55e",
                fillOpacity: 0.8,
                weight: 2,
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs font-sans">
                  <div className="text-sm font-bold text-slate-800">
                    {dataset.title}
                  </div>

                  <div className="text-slate-600">
                    <span className="font-medium">Coordinates:</span>{" "}
                    {lat.toFixed(3)}, {lng.toFixed(3)}
                  </div>

                  {metricKey && (
                    <div className="font-semibold text-emerald-700">
                      <span className="capitalize text-slate-600">
                        {metricKey}:
                      </span>{" "}
                      {val}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
