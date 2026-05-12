import { useEffect, useState } from "react";
import {
  getDaysByCategory,
  getWeeklyDealsAnalytics,
  getWeeklyFunnelAnalytics,
} from "../../functions/main.ts";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
type Category = "A" | "B" | "C" | "D";
export default function MetricsView() {
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<Category>("A");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getDaysByCategory(category);
      const funnelResult = getWeeklyFunnelAnalytics(data);
      if (data && data.length && funnelResult.length > 0) {
        const result = getWeeklyDealsAnalytics(data);
        setAnalysis(result);
        setFunnelData(funnelResult);
        console.log(funnelData);
      } else {
        setAnalysis([]);
      }
      setLoading(false);
    }
    loadData();
  }, [category]);

  const chartData = analysis.map((item) => ({
    name: `Sem ${item.week}`,
    Creadas: item.summary.created,
    Ganadas: item.summary.won,
    Backlog: item.summary.totalBacklog,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Analítica de Pipeline
        </h1>

        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
          <label
            htmlFor="cat-select"
            className="text-sm font-medium text-slate-600"
          >
            Filtrar por Categoría:
          </label>
          <select
            id="cat-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
          >
            <option value="A">Categoría A</option>
            <option value="B">Categoría B</option>
            <option value="C">Categoría C</option>
            <option value="D">Categoría D</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="animate-pulse text-blue-600 font-medium">
            Actualizando métricas...
          </p>
        </div>
      ) : (
        <>
          <h2 className="font-bold text-lg text-center mb-4">
            Reporte de Gestión de Oportunidades
          </h2>

          <div
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8"
            style={{ width: "100%", height: 400 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />

                <Bar
                  dataKey="Creadas"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Oportunidades Creadas"
                  barSize={25}
                />
                <Bar
                  dataKey="Ganadas"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Ventas Ganadas"
                  barSize={25}
                />
                <Bar
                  dataKey="Backlog"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  name="Pendientes (Backlog)"
                  barSize={25}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h2 className="text-lg text-center mb-4 mt-10">Semana Actual</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">
                Flujo Nuevo
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-slate-800">
                  {analysis[analysis.length - 1]?.summary.created || 0}
                </span>
                <span className="text-slate-500 text-xs">
                  Creadas esta semana
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl shadow-sm">
              <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
                Cierres Exitosos
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-emerald-900">
                  {analysis[analysis.length - 1]?.summary.won || 0}
                </span>
                <span className="text-emerald-700 text-xs text-opacity-70">
                  Ganadas
                </span>
              </div>
            </div>

            <div className="bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-700">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Carga de Trabajo
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-white">
                  {analysis[analysis.length - 1]?.summary.totalBacklog || 0}
                </span>
                <span className="text-slate-400 text-xs">En Pipeline</span>
              </div>
            </div>
          </div>
          <div
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8"
            style={{ width: "100%", height: 300 }}
          >
            <h2 className="font-bold text-lg text-center mb-4 mt-10">
              Eficacia del Embudo (Conversión %)
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData.map((f) => ({
                  name: `Sem ${f.week}`,
                  Calidad: f.conversions.leadToQualified,
                  Cierre: f.conversions.dealToWon,
                  Total: f.conversions.totalEfficiency,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis unit="%" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar
                  dataKey="Calidad"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="% Captación"
                />
                <Bar
                  dataKey="Cierre"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="% Cotización"
                />
                <Bar
                  dataKey="Total"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="% Eficiencia"
                />
              </BarChart>
            </ResponsiveContainer>
            <h2 className="text-lg text-center mb-4 mt-10">Semana Actual</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {/* Card: Eficiencia de Punta a Punta */}
              <div className="bg-linear-to-br from-slate-800 to-slate-900 p-5 rounded-2xl shadow-lg border border-slate-700">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Eficiencia Total
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-white">
                    {
                      funnelData[funnelData.length - 1]?.conversions
                        .totalEfficiency
                    }
                    %
                  </span>
                  <span className="text-slate-500 text-xs">Semana actual</span>
                </div>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                  De cada 100 visitas, esta es la conversión real a dinero.
                </p>
              </div>

              {/* Card: Rendimiento de Interés */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-amber-600 text-xs font-bold uppercase tracking-wider">
                  Captación
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-slate-800">
                    {
                      funnelData[funnelData.length - 1]?.conversions
                        .trafficToLead
                    }
                    %
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  Captación{" "}
                </p>
              </div>

              {/* Card: Calidad de Preventa */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider">
                  Cotización{" "}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-slate-800">
                    {
                      funnelData[funnelData.length - 1]?.conversions
                        .qualifiedToDeal
                    }
                    %
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  Leads calificados que logramos subir a una cotización.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
