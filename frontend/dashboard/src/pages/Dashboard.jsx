import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/data")
      .then((res) => res.json())
      .then((d) => {
        const hours = Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          traffic_flow: 0,
          pm25: 0,
        }));

        d.forEach((item) => {
          const h = Number(item.hour);

          if (h >= 0 && h <= 23) {
            hours[h] = {
              hour: h,
              traffic_flow: Number(item.traffic_flow),
              pm25: Number(item.pm25),
            };
          }
        });

        setData(hours);
      });
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
        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border">
          <h3 className="text-gray-500">Average PM2.5</h3>
          <p className="text-4xl font-bold text-blue-600">{avgPM}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border">
          <h3 className="text-gray-500">Peak Traffic</h3>
          <p className="text-4xl font-bold text-green-600">{peakTraffic}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border">
          <h3 className="text-gray-500">Worst Pollution</h3>
          <p className="text-4xl font-bold text-red-600">{worstPollution}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border">
          <h3 className="text-gray-500">Model Accuracy</h3>
          <p className="text-4xl font-bold text-purple-600">91%</p>
        </div>
      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-2 gap-8">
        {/* TRAFFIC CHART */}

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border">
          <h2 className="text-lg font-semibold mb-4">Traffic Flow Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="trafficArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="hour"
                interval={0}
                angle={-35}
                textAnchor="end"
                height={50}
                tickFormatter={(h) => `${h}:00`}
              />

              <YAxis />

              <Tooltip
                labelFormatter={(h) => `Hour: ${h}:00`}
                formatter={(value) => [`Vehicles: ${value}`, "Traffic Flow"]}
              />

              <Area
                type="natural"
                dataKey="traffic_flow"
                stroke="none"
                fill="url(#trafficArea)"
                tooltipType="none"
              />

              <Line
                type="natural"
                dataKey="traffic_flow"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* POLLUTION CHART */}

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border">
          <h2 className="text-lg font-semibold mb-4">Pollution Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="pollutionArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="hour"
                interval={0}
                angle={-35}
                textAnchor="end"
                height={50}
                tickFormatter={(h) => `${h}:00`}
              />

              <YAxis />

              <Tooltip
                labelFormatter={(h) => `Hour: ${h}:00`}
                formatter={(value) => [`PM2.5: ${value}`, "Pollution"]}
              />

              <Area
                type="natural"
                dataKey="pm25"
                stroke="none"
                fill="url(#pollutionArea)"
                tooltipType="none"
              />

              <Line
                type="natural"
                dataKey="pm25"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={1200}
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
          <li>🚗 Traffic congestion increases during peak hours (8–10 AM)</li>

          <li>
            🌫 Higher traffic flow strongly correlates with PM2.5 pollution
            levels
          </li>

          <li>
            ⚠ Areas with traffic above 350 vehicles/hour show higher pollution
            risk
          </li>

          <li>
            📉 Reducing traffic volume by 20% could significantly improve air
            quality
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
