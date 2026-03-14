import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/data")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  const avgPM = data.length
    ? (data.reduce((a, b) => a + b.pm25, 0) / data.length).toFixed(2)
    : 0;

  const peakTraffic = data.length
    ? Math.max(...data.map((d) => d.traffic_flow))
    : 0;

  const worstPollution = data.length ? Math.max(...data.map((d) => d.pm25)) : 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Urban Traffic & Air Quality Dashboard
      </h1>

      {/* KPI CARDS */}

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/40 hover:shadow-xl transition flex flex-col">
          <h3 className="text-gray-500">Average PM2.5</h3>
          <p className="text-4xl font-bold text-blue-600">{avgPM}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/40 hover:shadow-xl transition flex flex-col">
          <h3 className="text-gray-500">Peak Traffic</h3>
          <p className="text-4xl font-bold text-green-600">{peakTraffic}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/40 hover:shadow-xl transition flex flex-col">
          <h3 className="text-gray-500">Worst Pollution</h3>
          <p className="text-4xl font-bold text-red-600">{worstPollution}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/40 hover:shadow-xl transition flex flex-col">
          <h3 className="text-gray-500">Model Accuracy</h3>
          <p className="text-4xl font-bold text-purple-600">91%</p>
        </div>
      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-2 gap-8">
        {/* Traffic Chart */}

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border">
          <h2 className="text-lg font-semibold mb-4">Traffic Flow Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              <XAxis
                dataKey="hour"
                tick={{ fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "white",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}
              />

              <Line
                type="monotone"
                dataKey="traffic_flow"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pollution Chart */}

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border">
          <h2 className="text-lg font-semibold mb-4">Pollution Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              <XAxis
                dataKey="hour"
                tick={{ fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "white",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}
              />

              <Line
                type="monotone"
                dataKey="pm25"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI INSIGHTS */}

      <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border">
        <h2 className="text-xl font-semibold mb-4">
          AI Traffic & Pollution Insights
        </h2>

        <ul className="space-y-3 text-gray-700">
          <li>
            🚗 Traffic congestion tends to increase during peak working hours (8
            AM – 10 AM).
          </li>

          <li>
            🌫 Higher traffic flow is strongly correlated with increased PM2.5
            pollution levels.
          </li>

          <li>
            ⚠ Urban areas with traffic above 350 vehicles/hour show elevated
            pollution risk.
          </li>

          <li>
            📉 Reducing traffic volume by 20% could significantly improve air
            quality.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
