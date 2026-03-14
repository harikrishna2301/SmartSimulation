import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { hour: "6AM", traffic: 120 },
  { hour: "8AM", traffic: 300 },
  { hour: "10AM", traffic: 250 },
  { hour: "12PM", traffic: 200 },
  { hour: "2PM", traffic: 220 },
  { hour: "4PM", traffic: 350 },
  { hour: "6PM", traffic: 400 },
  { hour: "8PM", traffic: 280 },
];

function TrafficChart() {
  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
      <h3>Traffic Flow</h3>

      <LineChart width={500} height={300} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="traffic"
          stroke="#2563eb"
          strokeWidth={3}
        />
      </LineChart>
    </div>
  );
}

export default TrafficChart;
