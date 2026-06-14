import ForecastCard from "./ForecastCard";

function Forecast({ forecastData, unit }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight text-slate-900">
        5-Day Synoptic Forecast
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {forecastData.map((day, index) => (
          <ForecastCard key={`${day.day}-${index}`} dayData={day} unit={unit} />
        ))}
      </div>
    </div>
  );
}

export default Forecast;
