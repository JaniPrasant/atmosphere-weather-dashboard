import { useState, useMemo } from "react";
import axios from "axios";

function MultiCityEngine({ currentUnit, onSearchCity }) {
  const [cities, setCities] = useState([]);
  const [inputCity, setInputCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCityMetrics = async (cityName) => {
    const cleanName = cityName.trim();
    if (!cleanName) return;

    setLoading(true);
    setError("");

    if (cities.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
      setError(`"${cleanName}" already exists in the validation matrix.`);
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const response = await axios.get("/api/weather", {
        params: { city: cleanName },
      });
      const apiData = response.data;

      const realCityMetric = {
        id: crypto.randomUUID(),
        name: apiData.current.city,
        temp: Math.round(apiData.current.temp),
        humidity: apiData.current.humidity,
        windSpeed: apiData.current.windSpeed,
        condition: apiData.current.condition,
      };

      setCities((prev) => [...prev, realCityMetric]);
      setInputCity("");
    } catch (err) {
      setError(
        err.message ||
          `Verification Failed: "${cleanName}" is not a valid global city.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    fetchCityMetrics(inputCity);
  };

  const handleRemove = (id) => {
    setCities((prev) => prev.filter((c) => c.id !== id));
  };

  const metricsMatrix = useMemo(() => {
    if (cities.length === 0) return null;
    const temps = cities.map((c) => c.temp);
    const humidities = cities.map((c) => c.humidity);

    return {
      maxTemp: Math.max(...temps),
      minTemp: Math.min(...temps),
      avgHumidity: Math.round(
        humidities.reduce((a, b) => a + b, 0) / cities.length,
      ),
    };
  }, [cities]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-slate-100 shadow-2xl backdrop-blur-xl space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black tracking-tight text-white">
            Verified Multi-City Engine
          </h3>
          <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest border border-indigo-500/20">
            Real-Time API Sync
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Simultaneous data analysis across authenticated global meteorological
          positions
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Enter actual city (e.g., London, Tokyo, Paris)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            disabled={loading}
          />
          {loading && (
            <span className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          Verify &amp; Inject
        </button>
      </form>

      {error && (
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 animate-in fade-in zoom-in-95 duration-200">
          <p className="flex-1">
            ⚡ Error: {error}
          </p>
          <button
            type="button"
            onClick={() => setError("")}
            className="rounded-md p-1 text-red-400/60 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer text-xs"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {cities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500">
          No verified tracking nodes. Search cities above to initialize the data
          matrix.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => {
            const isMax =
              metricsMatrix &&
              city.temp === metricsMatrix.maxTemp &&
              cities.length > 1;
            const isMin =
              metricsMatrix &&
              city.temp === metricsMatrix.minTemp &&
              cities.length > 1;

            return (
              <div
                key={city.id}
                className={`relative rounded-xl border p-4 transition-all duration-300 bg-slate-900/40 hover:bg-slate-900/70 ${
                  isMax
                    ? "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                    : isMin
                      ? "border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                      : "border-slate-800"
                }`}
              >
                <button
                  onClick={() => handleRemove(city.id)}
                  className="absolute right-2 top-2 rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-white text-[10px] cursor-pointer"
                >
                  ✕
                </button>

                <div className="space-y-2">
                  <div>
                    <span
                      className="text-xs text-slate-400 font-medium cursor-pointer hover:text-indigo-400 transition-colors"
                      onClick={() => onSearchCity(city.name)}
                    >
                      {city.name} ↗
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-white tracking-tight">
                        {city.temp}°
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        {city.condition}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between border-t border-slate-800/60 pt-2 text-[11px] text-slate-400">
                    <span>
                      💧 Hum:{" "}
                      <strong className="text-slate-200">
                        {city.humidity}%
                      </strong>
                    </span>
                    <span>
                      💨 Wind:{" "}
                      <strong className="text-slate-200">
                        {city.windSpeed}{" "}
                        {currentUnit === "metric" ? "km/h" : "mph"}
                      </strong>
                    </span>
                  </div>
                </div>

                {isMax && (
                  <span className="absolute bottom-2 right-2 rounded-sm bg-amber-500/10 px-1 text-[8px] font-black tracking-wider text-amber-400 border border-amber-500/20 uppercase">
                    Thermal Peak
                  </span>
                )}
                {isMin && (
                  <span className="absolute bottom-2 right-2 rounded-sm bg-cyan-500/10 px-1 text-[8px] font-black tracking-wider text-cyan-400 border border-cyan-500/20 uppercase">
                    Thermal Floor
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {cities.length > 1 && metricsMatrix && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-3.5 text-xs grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              Cluster Max
            </p>
            <p className="text-sm font-black text-amber-400 mt-0.5">
              {metricsMatrix.maxTemp}°
            </p>
          </div>
          <div className="border-x border-slate-800">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              Cluster Min
            </p>
            <p className="text-sm font-black text-cyan-400 mt-0.5">
              {metricsMatrix.minTemp}°
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              Mean Humidity
            </p>
            <p className="text-sm font-black text-indigo-400 mt-0.5">
              {metricsMatrix.avgHumidity}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiCityEngine;
