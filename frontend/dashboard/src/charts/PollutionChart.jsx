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
  { hour: "6AM", pm25: 45 },
  { hour: "8AM", pm25: 80 },
  { hour: "10AM", pm25: 70 },
  { hour: "12PM", pm25: 60 },
  { hour: "2PM", pm25: 65 },
  { hour: "4PM", pm25: 90 },
  { hour: "6PM", pm25: 110 },
  { hour: "8PM", pm25: 85 },
];

function PollutionChart() {
  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
      <h3>PM2.5 Levels</h3>

      <LineChart width={500} height={300} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="pm25" stroke="#dc2626" strokeWidth={3} />
      </LineChart>
    </div>
  );
}

export default PollutionChart;
