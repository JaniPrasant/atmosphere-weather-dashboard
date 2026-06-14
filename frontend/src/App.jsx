import { useState, useEffect, useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import SearchForm from "./components/SearchForm";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import WeatherChart from "./components/WeatherChart";
import FavoritesList from "./components/FavoritesList";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthContext } from "./context/AuthContext";
import ToggleSwitch from "./components/ToggleSwitch";
import ActivityPlanner from "./components/ActivityPlanner";
import MultiCityEngine from "./components/MultiCityEngine";
import SolarArcTracker from "./components/SolarArcTracker";
import Footer from "./components/Footer";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const [geolocationError, setGeolocationError] = useState("");

  const [unit, setUnit] = useState(() => {
    return localStorage.getItem("unit") || "metric";
  });

  useEffect(() => {
    if (isAuthenticated && user?.unitPreference) {
      setUnit(user.unitPreference);
    } else {
      setUnit(localStorage.getItem("unit") || "metric");
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("unit", unit);
    if (isAuthenticated && token) {
      const updateUserPreferenceInDb = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
          await axios.put("/api/user/preferences", { unit }, config);
        } catch (error) {
          console.error("Failed to sync unit preference to DB:", error);
        }
      };
      updateUserPreferenceInDb();
    }
  }, [unit, isAuthenticated, token]);

  const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const handleGeolocationClick = () => {
    setError(null);
    setGeolocationError("");

    if (!navigator.geolocation) {
      setGeolocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get("/api/weather/coords", {
            params: {
              lat: latitude,
              lon: longitude,
            },
          });
          setWeatherData(res.data);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch weather by coordinates:", err);
          setError(
            "Could not fetch weather data for your location. Please try again.",
          );
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        let message = "";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message =
              "You denied the request for Geolocation. Please enable it in your browser settings to use this feature.";
            break;
          case err.POSITION_UNAVAILABLE:
            message = "Location information is currently unavailable.";
            break;
          case err.TIMEOUT:
            message = "The request to get your location timed out.";
            break;
          default:
            message = "An unknown error occurred while getting your location.";
            break;
        }
        setGeolocationError(message);
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) setSearchHistory(JSON.parse(storedHistory));

    const defaultCity = localStorage.getItem("defaultCity");
    if (defaultCity) fetchWeather(defaultCity);
  }, []);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await axios.get("/api/weather", { params: { city } });
      setWeatherData(response.data);
      const newCity = response.data.current.city;
      const updatedHistory = [
        newCity,
        ...searchHistory.filter(
          (item) => item.toLowerCase() !== newCity.toLowerCase(),
        ),
      ].slice(0, 8);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "An unexpected error occurred while fetching weather data.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = (city) => {
    localStorage.setItem("defaultCity", city);
    alert(`${city} has been set as your default city!`);
  };

  const getAtmosphericBackground = () => {
    if (!weatherData) return "from-slate-50 via-slate-100 to-zinc-50";
    const condition = weatherData.current.condition.toLowerCase();

    if (
      condition.includes("rain") ||
      condition.includes("drizzle") ||
      condition.includes("thunderstorm")
    ) {
      return "from-slate-700 via-slate-900 to-blue-950 text-slate-100";
    }
    if (condition.includes("cloud")) {
      return "from-sky-100 via-slate-200 to-zinc-200";
    }
    if (condition.includes("snow") || condition.includes("ice")) {
      return "from-blue-50 via-cyan-100/50 to-white";
    }

    return "from-amber-50/60 via-sky-50 to-blue-100/70";
  };

  const isDarkBg =
    weatherData &&
    (weatherData.current.condition.toLowerCase().includes("rain") ||
      weatherData.current.condition.toLowerCase().includes("thunderstorm"));

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-br ${getAtmosphericBackground()} font-sans antialiased transition-all duration-1000`}
    >
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow flex flex-col justify-start">
        <Routes>
          <Route
            path="/"
            element={
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full flex-grow">
                <div
                  className={`flex flex-col gap-6 rounded-3xl border ${isDarkBg ? "border-white/10 bg-slate-900/40" : "border-white/40 bg-white/70"} p-5 sm:p-6 shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between transition-colors duration-500`}
                >
                  <div className="space-y-1">
                    <h1
                      className={`text-2xl font-black tracking-tight ${isDarkBg ? "text-white" : "text-slate-950"}`}
                    >
                      Weather Console
                    </h1>
                    <p
                      className={`text-sm ${isDarkBg ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Real-time environmental metrics and predictive arrays
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center md:w-auto md:justify-end">
                    <div className="flex justify-start sm:justify-center">
                      <ToggleSwitch unit={unit} onToggle={handleUnitToggle} />
                    </div>
                    <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:w-auto">
                      <div className="w-full sm:w-80 lg:w-80 shrink-0">
                        <SearchForm onSearch={fetchWeather} />
                      </div>

                      <button
                        type="button"
                        className="inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-500 active:scale-98 transition-all shrink-0 cursor-pointer"
                        onClick={handleGeolocationClick}
                      >
                        Locate Me
                      </button>
                    </div>
                  </div>
                </div>

                {isAuthenticated && (
                  <FavoritesList onFavoriteClick={fetchWeather} />
                )}

                {searchHistory.length > 0 && (
                  <div
                    className={`flex items-center gap-2 rounded-2xl ${isDarkBg ? "bg-white/5 border-white/5" : "bg-slate-950/5 border-black/5"} border p-3 text-sm backdrop-blur-md`}
                  >
                    <span
                      className={`font-bold text-xs uppercase tracking-wider ${isDarkBg ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Recents:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {searchHistory.map((city, index) => (
                        <button
                          key={index}
                          className={`rounded-lg px-3 py-1 text-xs font-semibold shadow-xs border transition-all active:scale-95 cursor-pointer ${isDarkBg ? "bg-slate-800/80 border-white/10 text-slate-200 hover:bg-slate-700" : "bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                          onClick={() => fetchWeather(city)}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {geolocationError && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                    {geolocationError}
                  </div>
                )}

                <main>
                  {loading && !weatherData && (
                    <div className="flex h-64 flex-col items-center justify-center text-slate-500 font-medium tracking-wide">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-4"></div>
                      Compiling planetary telemetry systems...
                    </div>
                  )}

                  {error && !loading && (
                    <div className="rounded-2xl bg-red-500/10 backdrop-blur-md p-8 text-center text-red-600 border border-red-500/20 font-semibold shadow-lg">
                      {error}
                    </div>
                  )}

                  {weatherData && !loading && !error && (
                    <div className="space-y-8">
                      {" "}
                      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
                        <div className="lg:col-span-1 space-y-8">
                          <CurrentWeather
                            weatherData={weatherData.current}
                            onSetDefault={fetchWeather}
                            unit={unit}
                          />
                          {isAuthenticated ? (
                            <ActivityPlanner
                              weatherData={weatherData.current}
                              unit={unit}
                            />
                          ) : (
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/30 p-5 text-center backdrop-blur-xs">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                🔒 Smart Planner Locked
                              </p>
                              <p className="text-[11px] text-slate-500 mt-1">
                                Unlock custom apparel recommendations by joining
                                us.
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="lg:col-span-2 space-y-8">
                          <Forecast
                            forecastData={weatherData.forecast}
                            unit={unit}
                          />
                          {(() => {
                            const chartData = weatherData.forecast.map(
                              (day) => ({
                                name: day.day,
                                temperature: Math.round(day.tempHigh),
                              }),
                            );
                            return (
                              <WeatherChart data={chartData} unit={unit} />
                            );
                          })()}
                          {isAuthenticated ? (
                            <SolarArcTracker
                              weatherData={weatherData.current}
                            />
                          ) : (
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/30 p-5 text-center backdrop-blur-xs">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                🔒 Solar Arc Tracking Locked
                              </p>
                              <p className="text-[11px] text-slate-500 mt-1">
                                Unlock sunset analytics and golden hour indexes
                                by logging in.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      {isAuthenticated ? (
                        <MultiCityEngine
                          currentUnit={unit}
                          onSearchCity={fetchWeather}
                        />
                      ) : (
                        /* Modern Eye-Catching Conversion Block for Guest Users */
                        <div className="rounded-3xl border border-indigo-500/30 bg-linear-to-r from-slate-950 via-indigo-950 to-slate-950 p-8 text-slate-200 shadow-2xl relative overflow-hidden group">
                          {/* Ambient Backlight Glow Effects */}
                          <div className="absolute -top-24 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
                          <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                          <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-3 items-center">
                            {/* Headline Pitch */}
                            <div className="lg:col-span-2 space-y-2">
                              <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-extrabold tracking-widest text-indigo-400 uppercase border border-indigo-500/20 shadow-xs">
                                ✨ Core Console Premium Features Available
                              </span>
                              <h2 className="text-xl font-black text-white tracking-tight sm:text-2xl">
                                Expand your data telemetry overview
                              </h2>
                              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                                Create a free account right now to sync custom
                                unit settings across multiple browsers, compare
                                global city weather clusters concurrently, and
                                unlock our predictive activity modules.
                              </p>

                              {/* Visual feature chips tags to spark interest */}
                              <div className="flex flex-wrap gap-2 pt-2">
                                <span className="rounded-md bg-slate-900 border border-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                                  ✓ Multi-City Cluster Matrices
                                </span>
                                <span className="rounded-md bg-slate-900 border border-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                                  ✓ Solar Arc Golden Hour Graphs
                                </span>
                                <span className="rounded-md bg-slate-900 border border-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                                  ✓ Packing Variable Adapters
                                </span>
                              </div>
                            </div>

                            {/* Conversion Action Center */}
                            <div className="lg:col-span-1 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                              <Link
                                to="/register"
                                className="rounded-xl bg-indigo-600 px-6 py-3 text-center text-xs font-black text-white shadow-sm hover:bg-indigo-500 active:scale-98 transition-all"
                              >
                                Create Free Account
                              </Link>
                              <Link
                                to="/login"
                                className="rounded-xl bg-slate-900 border border-slate-800 px-6 py-3 text-center text-xs font-black text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                              >
                                Sign In to Console
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </main>
              </div>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
