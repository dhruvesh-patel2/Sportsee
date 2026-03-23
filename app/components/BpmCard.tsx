import {
    BarChart,
    Bar,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    LineChart,
    Line,
    ComposedChart,
  } from "recharts";
  import { mockUserActivity } from "../mocks/mockData";
  import "../css/dashboard.css";
  
  const lastSevenActivities = mockUserActivity.slice(-7);
  // on prend les 7 dernières activités
  
  const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  // labels affichés sous le graphique
  
  const bpmChartData = lastSevenActivities.map((activity, index) => ({
    day: dayLabels[index],
    min: activity.heartRate.min,
    max: activity.heartRate.max,
    average: activity.heartRate.average,
    date: activity.date,
  }));
  // on prépare les données pour le graphique
  
  function formatShortDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  }
  // format de date pour la période
  
  function formatTooltipDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  }
  // format de date pour le tooltip
  
  function CustomBpmTooltip({ active, payload }: any) {
    if (!active || !payload || !payload.length) {
      return null;
    }
  
    const data = payload[0].payload;
  
    return (
      <div className="bpm-card__tooltip">
        <p className="bpm-card__tooltip-date">{formatTooltipDate(data.date)}</p>
        <p className="bpm-card__tooltip-value">Min : {data.min} BPM</p>
        <p className="bpm-card__tooltip-value">Max : {data.max} BPM</p>
        <p className="bpm-card__tooltip-value">Moy : {data.average} BPM</p>
      </div>
    );
  }
  
  export default function BpmCard() {
    const averageBpm =
      bpmChartData.reduce((total, item) => total + item.average, 0) / bpmChartData.length;
    // calcule la moyenne globale du BPM
  
    const startDate = bpmChartData[0]?.date;
    const endDate = bpmChartData[bpmChartData.length - 1]?.date;
    // dates de début et de fin
  
    const period =
      startDate && endDate
        ? `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`
        : "";
    // texte de période
  
    return (
      <section className="bpm-card">
        <div className="bpm-card__header">
          <div className="bpm-card__header-left">
            <h3 className="bpm-card__title">{Math.round(averageBpm)} BPM</h3>
            <p className="bpm-card__subtitle">Fréquence cardiaque moyenne</p>
          </div>
  
          <div className="bpm-card__period">
            <button type="button" className="bpm-card__arrow">‹</button>
            <span>{period}</span>
            <button type="button" className="bpm-card__arrow">›</button>
          </div>
        </div>
  
        <div className="bpm-card__chart">
          <ResponsiveContainer width="100%" height={290}>
            <ComposedChart data={bpmChartData} barCategoryGap={22}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e7e7e7" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis
                domain={[130, 187]}
                ticks={[130, 145, 160, 187]}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomBpmTooltip />} cursor={{ fill: "transparent" }} />
  
              <Bar
                dataKey="min"
                fill="#f3b8ac"
                radius={[10, 10, 10, 10]}
                barSize={14}
              />
              <Bar
                dataKey="max"
                fill="#ff3b0a"
                activeBar={{ fill: "#e73300" }}
                radius={[10, 10, 10, 10]}
                barSize={14}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#7f8cff"
                strokeWidth={3}
                dot={{ r: 4, fill: "#1f38ff", stroke: "#ffffff", strokeWidth: 1 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
  
        <div className="bpm-card__legend">
          <div className="bpm-card__legend-item">
            <span className="bpm-card__dot bpm-card__dot--min"></span>
            <span>Min</span>
          </div>
          <div className="bpm-card__legend-item">
            <span className="bpm-card__dot bpm-card__dot--max"></span>
            <span>Max BPM</span>
          </div>
          <div className="bpm-card__legend-item">
            <span className="bpm-card__dot bpm-card__dot--avg"></span>
            <span>Max BPM</span>
          </div>
        </div>
      </section>
    );
  }