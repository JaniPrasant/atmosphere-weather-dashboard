import { useMemo } from "react";

function SolarArcTracker({ weatherData }) {
  const sunriseStr = weatherData?.sunrise || "06:00 AM";
  const sunsetStr = weatherData?.sunset || "06:45 PM";

  const sunPositionPercent = useMemo(() => {
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const parseTimeToMinutes = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      const riseMinutes = parseTimeToMinutes(sunriseStr);
      const setMinutes = parseTimeToMinutes(sunsetStr);

      if (currentMinutes <= riseMinutes) return 0;
      if (currentMinutes >= setMinutes) return 100;

      const totalDaylightDuration = setMinutes - riseMinutes;
      const minutesElapsed = currentMinutes - riseMinutes;
      return Math.round((minutesElapsed / totalDaylightDuration) * 100);
    } catch {
      return 45;
    }
  }, [sunriseStr, sunsetStr]);

  return (
    <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
          Solar Orbit &amp; Golden Hour Index
        </h3>
        <p className="text-xs text-slate-500">
          Visualizing daylight tracking arrays and atmospheric lighting curves
        </p>
      </div>

      <div className="relative h-24 border-b border-dashed border-slate-300 flex items-end justify-between px-4 overflow-hidden bg-gradient-to-t from-amber-500/5 to-transparent rounded-2xl pt-4">
        <div className="absolute inset-x-6 bottom-0 h-32 rounded-t-full border-2 border-dashed border-slate-300/80 pointer-events-none" />
        <div
          className="absolute h-6 w-6 bottom-[-12px] bg-amber-400 rounded-full border-4 border-white shadow-md shadow-amber-500/50 flex items-center justify-center transition-all duration-1000 ease-out z-10"
          style={{
            left: `calc(${sunPositionPercent}% - 12px)`,
            bottom: `${Math.sin((sunPositionPercent / 100) * Math.PI) * 70 - 12}px`,
          }}
        >
          <div className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
        </div>

        <div className="text-left z-20 pb-2">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            Sunrise
          </p>
          <p className="text-xs font-black text-slate-800">{sunriseStr}</p>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-2 text-center">
          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[9px] font-black text-amber-700 uppercase tracking-widest border border-amber-500/20 shadow-xs">
            ✨ Golden Hour Active Near Sunset
          </span>
        </div>

        <div className="text-right z-20 pb-2">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            Sunset
          </p>
          <p className="text-xs font-black text-slate-800">{sunsetStr}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/60 border border-slate-200/40 p-3 shadow-2xs">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Daylight Status
          </p>
          <p className="text-xs font-black text-slate-700 mt-0.5">
            {sunPositionPercent === 100
              ? "Orbit Terminated (Night)"
              : sunPositionPercent === 0
                ? "Pre-Dawn State"
                : `Sun Angle: Day-Cycle ${sunPositionPercent}%`}
          </p>
        </div>
        <div className="rounded-xl bg-white/60 border border-slate-200/40 p-3 shadow-2xs">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Luminance Profile
          </p>
          <p className="text-xs font-black text-slate-700 mt-0.5">
            {sunPositionPercent > 80 && sunPositionPercent < 100
              ? "Ideal Ambient Photography"
              : "Standard Sky Illumination"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SolarArcTracker;
