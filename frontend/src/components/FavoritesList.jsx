import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function FavoritesList({ onFavoriteClick }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get("/api/favorites", config);
        setFavorites(res.data.favoriteCities);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setError("Could not load your favorites.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [token]);

  if (loading || error || favorites.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs font-medium text-slate-400 text-center">
        {loading && "Syncing favorite tracking indexes..."}
        {error && error}
        {!loading &&
          !error &&
          favorites.length === 0 &&
          "No metrics flagged as favorites."}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Tracked Target Arrays
      </h4>
      <div className="flex flex-wrap gap-2">
        {favorites.map((city) => (
          <button
            key={city}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer"
            onClick={() => onFavoriteClick(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FavoritesList;
