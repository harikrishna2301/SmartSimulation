import React, { useState } from "react";
import { getPrediction } from "../api/prediction";

function WhatIf() {
  const [traffic, setTraffic] = useState(200);
  const [change, setChange] = useState(0);

  const [result, setResult] = useState(null);

  const runSimulation = async () => {
    const newTraffic = traffic + (traffic * change) / 100;

    const data = {
      year: 2026,
      month: 6,
      day: 15,
      hour: 12,
      weekday: 2,
    };

    const res = await getPrediction(data);

    setResult({
      traffic: newTraffic,
      pm25: res.pm25,
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">
        What-If Traffic Simulation
      </h1>

      <div className="bg-white p-6 rounded-xl shadow w-[400px]">
        <label className="block mb-2">Current Traffic</label>

        <input
          type="number"
          value={traffic}
          onChange={(e) => setTraffic(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <label className="block mb-2">Traffic Change (%)</label>

        <input
          type="range"
          min="-50"
          max="100"
          value={change}
          onChange={(e) => setChange(e.target.value)}
          className="w-full"
        />

        <p className="mt-2 mb-4">Change: {change}%</p>

        <button
          onClick={runSimulation}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Run Simulation
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow w-[400px]">
          <h2 className="text-xl mb-4">Simulation Result</h2>

          <p>🚗 Traffic Flow: {result.traffic}</p>

          <p>🌫 PM2.5 Level: {result.pm25}</p>
        </div>
      )}
    </div>
  );
}

export default WhatIf;
