import { useState } from "react";
import {
  LayoutDashboard,
  Brain,
  FlaskConical,
  LineChart,
  Map,
  ShieldCheck,
  Activity,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import WhatIf from "./pages/WhatIf";
import Forecast from "./pages/Forecast";
import CityMap from "./pages/CityMap";
import ModelAccuracy from "./pages/ModelAccuracy";
import AirQuality from "./pages/AirQuality";

function App() {
  const [page, setPage] = useState("dashboard");

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "prediction", label: "Prediction", icon: Brain },
    { key: "whatif", label: "What-If Analysis", icon: FlaskConical },
    { key: "forecast", label: "Forecast", icon: LineChart },
    { key: "map", label: "City Map", icon: Map },
    { key: "accuracy", label: "Model Accuracy", icon: Activity },
    { key: "airquality", label: "Air Quality", icon: ShieldCheck },
  ];

  const renderPage = () => {
    if (page === "dashboard") return <Dashboard />;
    if (page === "prediction") return <Prediction />;
    if (page === "whatif") return <WhatIf />;
    if (page === "forecast") return <Forecast />;
    if (page === "map") return <CityMap />;
    if (page === "accuracy") return <ModelAccuracy />;
    if (page === "airquality") return <AirQuality />;
    return <Dashboard />;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}

      <aside className="w-72 bg-slate-900 text-white flex flex-col px-6 py-8 shadow-2xl">
        <div className="mb-12">
          <h1 className="text-2xl font-bold tracking-tight">SmartSimulation</h1>

          <p className="text-sm text-slate-400 mt-2">
            Urban Traffic & Air Quality Intelligence
          </p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />

                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main area */}

      <main className="flex-1 flex flex-col">
        {/* Top bar */}

        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 capitalize">
              {page === "whatif" ? "What-If Analysis" : page}
            </h2>

            <p className="text-sm text-slate-500">
              Smart city monitoring and simulation platform
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-600">
              Hyderabad
            </div>

            <div className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow">
              Live Dashboard
            </div>
          </div>
        </header>

        {/* Page content */}

        <section className="p-8 overflow-y-auto">{renderPage()}</section>
      </main>
    </div>
  );
}

export default App;
