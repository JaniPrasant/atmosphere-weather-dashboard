import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function WeatherChart({ data, unit }) {
  const unitSymbol = unit === "metric" ? "°C" : "°F";
  
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          5-Day Temperature Trend
        </h3>
        <p className="text-sm text-slate-500">
          Visualizing expected high temperature variations
        </p>
      </div>
      <div className="h-[300px] w-100%">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="chartTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}${unitSymbol}`}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
              formatter={(value) => [`${value}${unitSymbol}`, "Temperature"]}
              labelStyle={{ color: "#0f172a", fontWeight: "600" }}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#chartTemp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WeatherChart;
