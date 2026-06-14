import { useMemo } from "react";

function ActivityPlanner({ weatherData, unit }) {
  const { temp, humidity, windSpeed, condition } = weatherData;

  const analysis = useMemo(() => {
    const tempC = unit === "imperial" ? ((temp - 32) * 5) / 9 : temp;
    const condLower = condition.toLowerCase();

    let comfortScore = 100;
    const alerts = [];
    const recommendations = {
      outdoorSports: {
        status: "Optimal",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200/50",
      },
      photography: {
        status: "Optimal",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200/50",
      },
      apparel: [],
    };

    if (tempC > 30) {
      comfortScore -= 20;
      alerts.push(
        "Thermal Warning: High heat load. Minimize extended aerobic exposure.",
      );
      recommendations.outdoorSports = {
        status: "Marginal Risk",
        color: "text-amber-600 bg-amber-50 border-amber-200/50",
      };
      recommendations.apparel.push(
        "Moisture-wicking mesh fabrics",
        "UV protection eyewear/cap",
      );
    } else if (tempC < 10) {
      comfortScore -= 15;
      alerts.push(
        "Thermal Warning: Low temperatures. Elevated wind chill hazard potential.",
      );
      recommendations.apparel.push(
        "Thermal base layers",
        "Insulated windproof outer shell",
      );
    } else {
      recommendations.apparel.push(
        "Breathable casual layers",
        "Standard UV skin shield",
      );
    }

    if (humidity > 75) {
      comfortScore -= 15;
      if (condLower.includes("rain") || condLower.includes("drizzle")) {
        comfortScore -= 25;
        alerts.push(
          "Precipitation Alert: Waterproof deployment required for external hardware.",
        );
        recommendations.outdoorSports = {
          status: "Restricted",
          color: "text-red-600 bg-red-50 border-red-200/50",
        };
        recommendations.photography = {
          status: "Critical Hazard",
          color: "text-red-600 bg-red-50 border-red-200/50",
        };
        recommendations.apparel.unshift(
          "DWR (Durable Water Repellent) rated jacket",
          "Waterproof footwear",
        );
      } else {
        alerts.push(
          "Atmospheric Humidity Saturation: High risk of camera optical lens fogging.",
        );
        recommendations.photography = {
          status: "Marginal Risk",
          color: "text-amber-600 bg-amber-50 border-amber-200/50",
        };
      }
    }

    if (windSpeed > 10) {
      comfortScore -= 15;
      alerts.push(
        "Kinetic Hazard: Elevated wind velocities detected. Secure lightweight structures.",
      );
      if (recommendations.outdoorSports.status !== "Restricted") {
        recommendations.outdoorSports = {
          status: "Suboptimal",
          color: "text-amber-600 bg-amber-50 border-amber-200/50",
        };
      }
    }

    comfortScore = Math.max(0, Math.min(100, comfortScore));

    let comfortLabel = "Excellent";
    let comfortColor = "text-emerald-600 bg-emerald-500/10";
    if (comfortScore < 40) {
      comfortLabel = "Hazardous / Restricted";
      comfortColor = "text-red-600 bg-red-500/10";
    } else if (comfortScore < 75) {
      comfortLabel = "Suboptimal / Caution";
      comfortColor = "text-amber-600 bg-amber-500/10";
    }

    return {
      comfortScore,
      comfortLabel,
      comfortColor,
      alerts,
      recommendations,
    };
  }, [temp, humidity, windSpeed, condition, unit]);

  return (
    <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-black tracking-tight text-slate-900">
          Smart Packing &amp; Activity Planner
        </h3>
        <p className="text-xs text-slate-500">
          Translating raw meteorological metrics into dynamic operational
          guidelines
        </p>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Comfort &amp; Utility Index
          </p>
          <p
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold mt-1 ${analysis.comfortColor}`}
          >
            {analysis.comfortLabel}
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black tracking-tighter text-slate-900">
            {analysis.comfortScore}
          </span>
          <span className="text-xs font-bold text-slate-400">/100</span>
        </div>
      </div>

      {analysis.alerts.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
            Active System Warnings
          </h4>
          <ul className="space-y-1">
            {analysis.alerts.map((alert, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-red-200/40 bg-red-50/50 px-3 py-2 text-xs font-medium text-red-700"
              >
                ⚠️ {alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div
          className={`rounded-xl border p-3 ${analysis.recommendations.outdoorSports.color}`}
        >
          <p className="text-[9px] font-black uppercase tracking-wider opacity-60">
            Outdoor Activities
          </p>
          <p className="text-sm font-black mt-0.5">
            {analysis.recommendations.outdoorSports.status}
          </p>
        </div>
        <div
          className={`rounded-xl border p-3 ${analysis.recommendations.photography.color}`}
        >
          <p className="text-[9px] font-black uppercase tracking-wider opacity-60">
            Precision Photography
          </p>
          <p className="text-sm font-black mt-0.5">
            {analysis.recommendations.photography.status}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Calculated Packing Arrays
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {analysis.recommendations.apparel.map((item, idx) => (
            <span
              key={idx}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs"
            >
              ✓ {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityPlanner;
