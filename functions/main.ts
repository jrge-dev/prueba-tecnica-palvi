const pathJson = "../src/assets/metrics.json";

/**
 * Carga el JSON completo
 */
export async function readJson(url: string = pathJson) {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`Error: ${respuesta.statusText}`);
    return await respuesta.json();
  } catch (error) {
    console.error("Error en la carga de datos:", error);
    return null;
  }
}

export async function getDaysByCategory(category: "A" | "B" | "C" | "D") {
  const fullData = await readJson();

  if (!fullData) return [];

  const days = fullData[category]?.days;

  if (!days) {
    console.warn(`No se encontraron 'days' en la categoría ${category}`);
    return [];
  }

  return days;
}

export async function getAnalyticsData() {
  const daysA = await getDaysByCategory("A");

  return daysA.map((day: any) => ({
    fecha: day.date,
    ...day,
  }));
}
/**
 * Estructura de los datos dentro del array 'days'
 */
interface DayEntry {
  date: string;
  metrics: Record<string, number>;
  [key: string]: any;
}

/**
 * Función Base: Agrupa el dataset en semanas (bloques de 7 días)
 * @param data Array de días (extraído de A, B, C o D)
 * @returns Un array de arrays, donde cada sub-array contiene 7 días
 */
export function groupByWeeks(data: DayEntry[]): DayEntry[][] {
  if (!data || data.length === 0) return [];

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const weeks: DayEntry[][] = [];

  for (let i = 0; i < sortedData.length; i += 7) {
    const week = sortedData.slice(i, i + 7);
    weeks.push(week);
  }

  return weeks;
}

/**
 * Calcula la analítica de deals por semana con ARRASTRE de deals abiertas.
 */
export function getWeeklyDealsAnalytics(days: DayEntry[]) {
  const weeklyGroups = groupByWeeks(days);

  // Esta variable vive fuera del map para acumular entre semanas
  let totalPendingFromPast = 0;

  return weeklyGroups.map((week, index) => {
    const weeklyTotals = week.reduce(
      (acc, day) => {
        acc.created += day.metrics?.deals_created || 0;
        acc.won += day.metrics?.deals_won || 0;
        acc.lost += day.metrics?.deals_lost || 0;
        return acc;
      },
      { created: 0, won: 0, lost: 0 },
    );

    // 1. Deals que no se cerraron ESTA semana
    const currentWeekOpen =
      weeklyTotals.created - (weeklyTotals.won + weeklyTotals.lost);

    // 2. Sumamos lo que ya traíamos de antes
    totalPendingFromPast += currentWeekOpen;

    const hasCreated = weeklyTotals.created > 0;

    return {
      week: index + 1,
      period: {
        start: week[0].date,
        end: week[week.length - 1].date,
      },
      summary: {
        created: weeklyTotals.created,
        won: weeklyTotals.won,
        lost: weeklyTotals.lost,
        openThisWeek: currentWeekOpen,
        totalBacklog: totalPendingFromPast,
      },
      ratios: {
        successPercentage: hasCreated
          ? parseFloat(
              ((weeklyTotals.won / weeklyTotals.created) * 100).toFixed(2),
            )
          : 0,
        lossPercentage: hasCreated
          ? parseFloat(
              ((weeklyTotals.lost / weeklyTotals.created) * 100).toFixed(2),
            )
          : 0,
        openPercentage: hasCreated
          ? parseFloat(
              ((currentWeekOpen / weeklyTotals.created) * 100).toFixed(2),
            )
          : 0,
      },
    };
  });
}
/**
 * Calcula el embudo completo (Funnel) paso a paso por semana.
 * Flujo: Tráfico -> Leads -> Leads Calificados -> Deals -> Ganados
 */
export function getWeeklyFunnelAnalytics(days: DayEntry[]) {
  const weeklyGroups = groupByWeeks(days);

  return weeklyGroups.map((week, index) => {
    // 1. Acumulamos los valores brutos de la semana
    const totals = week.reduce(
      (acc, day) => {
        acc.traffic += day.metrics?.traffic || 0;
        acc.leads += day.metrics?.leads_created || 0;
        acc.qualified += day.metrics?.leads_qualified || 0;
        acc.deals += day.metrics?.deals_created || 0;
        acc.won += day.metrics?.deals_won || 0;
        return acc;
      },
      { traffic: 0, leads: 0, qualified: 0, deals: 0, won: 0 },
    );

    // Helper para calcular tasas de conversión sin errores de división por cero
    const calcRate = (numerator: number, denominator: number) =>
      denominator > 0
        ? parseFloat(((numerator / denominator) * 100).toFixed(2))
        : 0;

    return {
      week: index + 1,
      period: {
        start: week[0].date,
        end: week[week.length - 1].date,
      },
      // DATOS BRUTOS (VOLUMEN)
      volumes: {
        traffic: totals.traffic,
        leads: totals.leads,
        qualified: totals.qualified,
        deals: totals.deals,
        won: totals.won,
      },
      // TASAS DE CONVERSIÓN (EL CORAZÓN DEL ANÁLISIS)
      conversions: {
        // Eficacia del marketing (Tráfico a Leads)
        trafficToLead: calcRate(totals.leads, totals.traffic),

        // Calidad del interesado (Leads a Calificados)
        leadToQualified: calcRate(totals.qualified, totals.leads),

        // Efectividad de preventa (Calificados a Oportunidad real/Deal)
        qualifiedToDeal: calcRate(totals.deals, totals.qualified),

        // Eficacia comercial (Cierre de Deals)
        dealToWon: calcRate(totals.won, totals.deals),

        // EFICIENCIA TOTAL (De Tráfico directo a Venta)
        totalEfficiency: calcRate(totals.won, totals.traffic),
      },
    };
  });
}
