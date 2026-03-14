import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ModelAccuracy() {
  const data = [
    { name: "R² Score", value: 0.91 },
    { name: "MAE", value: 12 },
    { name: "RMSE", value: 19 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Model Performance Analytics</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border">
          <h3 className="text-gray-500">R² Score</h3>
          <p className="text-4xl font-bold text-green-600">0.91</p>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border">
          <h3 className="text-gray-500">MAE</h3>
          <p className="text-4xl font-bold text-orange-500">12</p>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border">
          <h3 className="text-gray-500">RMSE</h3>
          <p className="text-4xl font-bold text-red-500">19</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border">
        <h2 className="text-xl font-semibold mb-4">Model Error Comparison</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ModelAccuracy;
