import { formatTemperature } from "../utils/temperature";
import { getWeatherIcon } from "../utils/weatherIconMap";

function ForecastCard({ dayData, unit }) {
  const { day, icon, tempHigh, tempLow, condition } = dayData;
  const unitSymbol = unit === "metric" ? "°C" : "°F";

  return (
    <div className="rounded-2xl border border-white/40 bg-white/60 p-4 text-center shadow-md backdrop-blur-md flex flex-col justify-between items-center space-y-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {day}
      </p>
      <div className="text-4xl text-slate-700 my-1 transition-transform duration-300 group-hover:scale-115">
        {getWeatherIcon(condition, icon)}
      </div>
      <div className="space-y-0.5 bg-slate-50/80 rounded-xl py-1 px-2.5 w-full border border-slate-100">
        <p className="text-xs font-black text-slate-800">
          Hi: {formatTemperature(tempHigh, unit)}
          {unitSymbol}
        </p>
        <p className="text-[10px] font-bold text-slate-400">
          Lo: {formatTemperature(tempLow, unit)}
          {unitSymbol}
        </p>
      </div>
    </div>
  );
}

export default ForecastCard;
