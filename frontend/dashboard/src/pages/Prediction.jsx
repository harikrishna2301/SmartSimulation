import { useState } from "react";
import { getPrediction } from "../api/prediction";

function Prediction() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [hour, setHour] = useState(12);
  const [weekday, setWeekday] = useState(2);

  const [result, setResult] = useState(null);

  /* ------------------------
Traffic Status Logic
------------------------ */

  const trafficStatus = (value) => {
    if (value <= 150) return { label: "Low Traffic", color: "text-green-600" };

    if (value <= 350)
      return { label: "Moderate Traffic", color: "text-yellow-600" };

    return { label: "High Traffic", color: "text-red-600" };
  };

  /* ------------------------
Air Quality Logic
------------------------ */

  const airQualityStatus = (pm) => {
    if (pm <= 50) return { label: "Good", color: "text-green-600" };

    if (pm <= 100) return { label: "Moderate", color: "text-yellow-600" };

    if (pm <= 150)
      return { label: "Unhealthy (Sensitive)", color: "text-orange-600" };

    if (pm <= 200) return { label: "Unhealthy", color: "text-red-600" };

    return { label: "Hazardous", color: "text-purple-700" };
  };

  /* ------------------------
Prediction Function
------------------------ */

  const handlePredict = async () => {
    const data = {
      year,
      month,
      day,
      hour,
      weekday,
    };

    const res = await getPrediction(data);

    setResult(res);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        Future Traffic & Pollution Prediction
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Month</label>
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Day</label>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hour</label>
            <input
              type="number"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Weekday</label>

            <select
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
              className="border rounded-lg p-3 w-full"
            >
              <option value={0}>Monday</option>
              <option value={1}>Tuesday</option>
              <option value={2}>Wednesday</option>
              <option value={3}>Thursday</option>
              <option value={4}>Friday</option>
              <option value={5}>Saturday</option>
              <option value={6}>Sunday</option>
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Predict
        </button>
      </div>

      {result && (
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Predicted Traffic</h3>
            <p className="text-3xl font-bold text-blue-600">{result.traffic}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Traffic Status</h3>
            <p
              className={`text-xl font-bold ${trafficStatus(result.traffic).color}`}
            >
              {trafficStatus(result.traffic).label}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">PM2.5 Level</h3>
            <p className="text-3xl font-bold text-red-600">
              {result.pm25.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow col-span-3">
            <h3 className="text-sm text-gray-500">Air Quality Status</h3>
            <p
              className={`text-2xl font-bold ${airQualityStatus(result.pm25).color}`}
            >
              {airQualityStatus(result.pm25).label}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prediction;
