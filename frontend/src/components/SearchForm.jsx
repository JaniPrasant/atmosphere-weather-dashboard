import { useState } from "react";

function SearchForm({ onSearch }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    onSearch(city);
    setCity("");
  };

  return (
    <form className="flex w-full items-center gap-2 sm:w-auto" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search global grids..."
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-blue-500 focus:outline-none sm:w-64 transition-all"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button 
        type="submit" 
        className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:scale-98 transition-all"
      >
        Search
      </button>
    </form>
  );
}

export default SearchForm;
