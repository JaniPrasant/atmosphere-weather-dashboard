function ToggleSwitch({ unit, onToggle }) {
  const isChecked = unit === "imperial";

  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-1">
      <button
        onClick={() => isChecked && onToggle()}
        className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
          !isChecked
            ? "bg-white text-slate-900 shadow-xs"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        °C
      </button>
      <button
        onClick={() => !isChecked && onToggle()}
        className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
          isChecked
            ? "bg-white text-slate-900 shadow-xs"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        °F
      </button>
    </div>
  );
}

export default ToggleSwitch;
