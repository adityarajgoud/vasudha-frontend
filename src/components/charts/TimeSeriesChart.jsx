import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function TimeSeriesChart({ dataset }) {
  const { chartType, data, columns } = dataset;

  // Identify date/category column and metric keys
  const xKey =
    columns.find((c) => /^(date|year|month|period|time)$/i.test(c)) ||
    columns[0];
  const metricKeys = columns.filter((c) => c !== xKey);

  const colors = ["#16a34a", "#0284c7", "#ea580c", "#8b5cf6"];

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            <XAxis
              dataKey={xKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={12}
            />

            <YAxis stroke="#64748b" fontSize={12} tickLine={false} width={40} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            {metricKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[i % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            <XAxis
              dataKey={xKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={12}
            />

            <YAxis stroke="#64748b" fontSize={12} tickLine={false} width={40} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            {metricKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case "line":
      default:
        return (
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            <XAxis
              dataKey={xKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={12}
            />

            <YAxis stroke="#64748b" fontSize={12} tickLine={false} width={40} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            {metricKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="h-[300px] w-full min-w-0 pt-3 sm:h-[350px] sm:pt-4 md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
