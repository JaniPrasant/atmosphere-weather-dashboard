import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { formatTemperature } from "../utils/temperature";
import { getWeatherIcon } from "../utils/weatherIconMap";

function CurrentWeather({ weatherData, onSetDefault, unit }) {
  const { isAuthenticated, token } = useContext(AuthContext);
  const [favoriteStatus, setFavoriteStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });
  const {
    city,
    country,
    temp,
    description,
    icon,
    humidity,
    windSpeed,
    feelsLike,
    condition,
  } = weatherData;
  const unitSymbol = unit === "metric" ? "°C" : "°F";

  const handleAddFavorite = async () => {
    setFavoriteStatus({ loading: true, error: null, success: null });

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post("/api/favorites", { city }, config);
      setFavoriteStatus({
        loading: false,
        success: "Added to favorites!",
        error: null,
      });
      setTimeout(
        () => setFavoriteStatus({ ...favoriteStatus, success: null }),
        3000,
      );
    } catch (err) {
      const message =
        err.response?.data?.message || "Could not add to favorites.";
      setFavoriteStatus({ loading: false, error: message, success: null });
    }
  };

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (humidity / 100) * circumference;

  return (
    <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl space-y-6 transition-all duration-300 hover:shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          {city}
        </h2>
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-0.5">
          {country}
        </p>
      </div>

      <div className="relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-slate-50/50 to-slate-100/50 rounded-2xl py-6 border border-slate-200/50 group">
        <div className="text-6xl text-blue-600 mb-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
          {getWeatherIcon(condition, icon)}
        </div>
        <div className="text-6xl font-black text-slate-900 tracking-tighter">
          {formatTemperature(temp, unit)}
          {unitSymbol}
        </div>
        <p className="text-sm font-bold text-slate-700 mt-1 capitalize">
          {condition}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 px-4 text-center italic">
          "{description}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3 border border-slate-200/40 shadow-xs">
          <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="#f1f5f9"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="#3b82f6"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-xs font-black text-slate-800">
              {humidity}%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Humidity
            </p>
            <p className="text-xs font-bold text-slate-700">Moisture Profile</p>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl p-3 border border-slate-200/40 shadow-xs flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Wind Vectors
          </p>
          <p className="text-sm font-black text-slate-900 tracking-tight">
            {windSpeed}{" "}
            <span className="text-xs font-medium text-slate-400">m/s</span>
          </p>
          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
            Velocity Target
          </p>
        </div>

        <div className="bg-white/60 rounded-xl p-3 border border-slate-200/40 shadow-xs col-span-2 flex justify-between items-center px-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Apparent Thermal Index
            </p>
            <p className="text-xs font-semibold text-slate-500">Feels Like</p>
          </div>
          <p className="text-xl font-black text-slate-900">
            {formatTemperature(feelsLike, unit)}
            {unitSymbol}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pt-2">
        {isAuthenticated && (
          <button
            onClick={handleAddFavorite}
            disabled={favoriteStatus.loading}
            className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-sm font-semibold text-white shadow-md shadow-amber-500/10 hover:from-amber-400 hover:to-amber-500 active:scale-98 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer"
          >
            {favoriteStatus.loading
              ? "Synchronizing Layer..."
              : "★ Flag as Favorite Grid"}
          </button>
        )}
        <button
          className="w-full inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          onClick={() => {
            onSetDefault(city);
            alert(`${city} set as default grid.`);
          }}
        >
          Set Default Matrix
        </button>
        {favoriteStatus.success && (
          <p className="text-center text-xs font-bold text-emerald-600 animate-bounce">
            {favoriteStatus.success}
          </p>
        )}
        {favoriteStatus.error && (
          <p className="text-center text-xs font-bold text-red-600">
            {favoriteStatus.error}
          </p>
        )}
      </div>
    </div>
  );
}

export default CurrentWeather;
