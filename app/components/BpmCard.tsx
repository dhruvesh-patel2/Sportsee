import {
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  ComposedChart,
} from "recharts";
import "../css/dashboard.css";

// props reçues depuis Dashboard
// ici on reçoit les données d'activité
type BpmCardProps = {
  data: any[];
};

// labels affichés sous le graphique
const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function BpmCard({ data }: BpmCardProps) {
  // on prend uniquement les 7 dernières activités
  const lastSevenActivities = data.slice(-7);

  // on transforme les données reçues en format lisible par Recharts
  const bpmChartData = lastSevenActivities.map((activity, index) => ({
    // nom du jour affiché sous le graphique
    day: dayLabels[index],

    // bpm minimum
    min: activity.heartRate.min,

    // bpm maximum
    max: activity.heartRate.max,

    // bpm moyen
    average: activity.heartRate.average,

    // date brute utile pour le tooltip et la période
    date: activity.date,
  }));

  // formate une date courte pour la période affichée en haut
  function formatShortDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  }

  // formate la date affichée dans le tooltip
  function formatTooltipDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  // tooltip personnalisé affiché au survol d'une barre
  function CustomBpmTooltip({ active, payload }: any) {
    // si rien n'est survolé, on n'affiche rien
    if (!active || !payload || !payload.length) {
      return null;
    }

    // récupération des données du point survolé
    const d = payload[0].payload;

    return (
      <div className="bpm-card__tooltip">
        <p className="bpm-card__tooltip-date">{formatTooltipDate(d.date)}</p>
        <p className="bpm-card__tooltip-value">Min : {d.min} BPM</p>
        <p className="bpm-card__tooltip-value">Max : {d.max} BPM</p>
        <p className="bpm-card__tooltip-value">Moy : {d.average} BPM</p>
      </div>
    );
  }

  // calcule la moyenne générale du BPM sur les 7 activités
  const averageBpm =
    bpmChartData.reduce((total, item) => total + item.average, 0) /
    bpmChartData.length;

  // récupère la date de début
  const startDate = bpmChartData[0]?.date;

  // récupère la date de fin
  const endDate = bpmChartData[bpmChartData.length - 1]?.date;

  // construit le texte de période affiché en haut de la carte
  const period =
    startDate && endDate
      ? `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`
      : "";

  return (
    <section className="bpm-card">
      {/* en-tête de la carte */}
      <div className="bpm-card__header">
        <div className="bpm-card__header-left">
          {/* valeur moyenne globale */}
          <h3 className="bpm-card__title">{Math.round(averageBpm)} BPM</h3>

          {/* sous-titre */}
          <p className="bpm-card__subtitle">Fréquence cardiaque moyenne</p>
        </div>

        {/* période affichée à droite */}
        <div className="bpm-card__period">
          <button type="button" className="bpm-card__arrow">‹</button>
          <span>{period}</span>
          <button type="button" className="bpm-card__arrow">›</button>
        </div>
      </div>

      {/* zone du graphique */}
      <div className="bpm-card__chart">
        <ResponsiveContainer width="100%" height={290}>
          <ComposedChart data={bpmChartData} barCategoryGap={22}>
            {/* grille de fond horizontale */}
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e7e7e7" />

            {/* axe horizontal avec les jours */}
            <XAxis dataKey="day" tickLine={false} axisLine={false} />

            {/* axe vertical avec les valeurs bpm */}
            <YAxis
              domain={[130, 187]}
              ticks={[130, 145, 160, 187]}
              tickLine={false}
              axisLine={false}
            />

            {/* tooltip personnalisé */}
            <Tooltip content={<CustomBpmTooltip />} cursor={{ fill: "transparent" }} />

            {/* barre bpm minimum */}
            <Bar
              dataKey="min"
              fill="#f3b8ac"
              radius={[10, 10, 10, 10]}
              barSize={14}
            />

            {/* barre bpm maximum */}
            <Bar
              dataKey="max"
              fill="#ff3b0a"
              activeBar={{ fill: "#e73300" }}
              radius={[10, 10, 10, 10]}
              barSize={14}
            />

            {/* ligne bpm moyen */}
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

      {/* légende sous le graphique */}
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