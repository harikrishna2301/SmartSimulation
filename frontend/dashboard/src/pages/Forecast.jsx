import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

function Forecast() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/data")
      .then((res) => res.json())
      .then((d) => {
        // Clean and round values
        const cleaned = d.map((row) => ({
          hour: row.hour,
          pm25: Number(parseFloat(row.pm25).toFixed(2)),
          traffic_flow: Math.round(row.traffic_flow),
        }));

        setData(cleaned);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">24 Hour Pollution Forecast</h1>

      <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="hour"
              label={{
                value: "Hour of Day",
                position: "insideBottom",
                offset: -5,
              }}
            />

            <YAxis
              label={{
                value: "PM2.5 Level",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value) => [`${value} µg/m³`, "PM2.5"]}
              labelFormatter={(label) => `Hour: ${label}:00`}
            />

            {/* Air Quality Zones */}

            <ReferenceArea y1={0} y2={50} fill="#bbf7d0" fillOpacity={0.3} />

            <ReferenceArea y1={50} y2={100} fill="#fde68a" fillOpacity={0.3} />

            <ReferenceArea y1={100} y2={200} fill="#fecaca" fillOpacity={0.3} />

            {/* Pollution Forecast Line */}

            <Line
              type="monotone"
              dataKey="pm25"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Forecast;
