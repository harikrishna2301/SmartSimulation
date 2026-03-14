import { useState } from "react";

function AirQuality() {
  const [pm, setPm] = useState("");
  const [status, setStatus] = useState("");

  const checkStatus = () => {
    let s = "";

    if (pm < 50) s = "🟢 Good";
    else if (pm < 100) s = "🟡 Moderate";
    else if (pm < 150) s = "🟠 Unhealthy for Sensitive Groups";
    else if (pm < 200) s = "🔴 Unhealthy";
    else s = "⚫ Hazardous";

    setStatus(s);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        Air Quality Health Indicator
      </h1>

      <div className="bg-white p-6 rounded-xl shadow w-96">
        <input
          type="number"
          placeholder="Enter PM2.5 value"
          className="border p-2 w-full mb-4"
          onChange={(e) => setPm(e.target.value)}
        />

        <button
          onClick={checkStatus}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Check Air Quality
        </button>

        {status && <p className="mt-6 text-xl">Air Quality Status: {status}</p>}
      </div>
    </div>
  );
}

export default AirQuality;
