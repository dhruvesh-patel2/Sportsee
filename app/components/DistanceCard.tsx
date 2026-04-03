import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../css/dashboard.css";

// props reçues depuis Dashboard
// ici on reçoit les données d'activité
type DistanceCardProps = {
  data: any[];
};

export default function DistanceCard({ data }: DistanceCardProps) {
  // on prend uniquement les 4 dernières activités
  const lastFourActivities = data.slice(-4);

  // on prépare les données pour le graphique
  const chartData = lastFourActivities.map((activity, index) => ({
    // libellé semaine affiché sous le graphique
    week: `S${index + 1}`,

    // distance parcourue
    distance: activity.distance,

    // date brute utile pour le tooltip et la période
    date: activity.date,
  }));

  // formate la date courte affichée dans la période
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

  // tooltip personnalisé au survol d'une barre
  function CustomTooltip({ active, payload }: any) {
    // si aucun élément n'est survolé, on n'affiche rien
    if (!active || !payload || !payload.length) {
      return null;
    }

    // récupération des données du point survolé
    const tooltipData = payload[0].payload;

    return (
      <div className="distance-card__tooltip">
        <p className="distance-card__tooltip-date">
          {formatTooltipDate(tooltipData.date)}
        </p>
        <p className="distance-card__tooltip-value">
          {tooltipData.distance.toFixed(1).replace(".", ",")} km
        </p>
      </div>
    );
  }

  // calcule la moyenne des distances sur les 4 dernières activités
  const averageDistance =
    chartData.reduce((total, item) => total + item.distance, 0) / chartData.length;

  // récupère la date de début
  const startDate = chartData[0]?.date;

  // récupère la date de fin
  const endDate = chartData[chartData.length - 1]?.date;

  // construit le texte de période affiché dans la carte
  const period =
    startDate && endDate
      ? `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`
      : "";

  return (
    <section className="distance-card">
      {/* en-tête de la carte */}
      <div className="distance-card__header">
        <div className="distance-card__header-left">
          {/* moyenne affichée en haut */}
          <h3 className="distance-card__title">
            {Math.round(averageDistance)}km en moyenne
          </h3>

          {/* sous-titre */}
          <p className="distance-card__subtitle">
            Total des kilomètres 4 dernières semaines
          </p>
        </div>

        {/* période affichée à droite */}
        <div className="distance-card__period">
          <button type="button" className="distance-card__arrow">‹</button>
          <span>{period}</span>
          <button type="button" className="distance-card__arrow">›</button>
        </div>
      </div>

      {/* zone du graphique */}
      <div className="distance-card__chart">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barCategoryGap={40}>
            {/* grille de fond horizontale */}
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e7e7e7" />

            {/* axe horizontal avec les semaines */}
            <XAxis dataKey="week" tickLine={false} axisLine={false} />

            {/* axe vertical des distances */}
            <YAxis tickLine={false} axisLine={false} />

            {/* tooltip personnalisé */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />

            {/* barre de distance */}
            <Bar
              dataKey="distance"
              fill="#aeb4ff"
              activeBar={{ fill: "#1f38ff" }}
              radius={[20, 20, 20, 20]}
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* légende sous le graphique */}
      <div className="distance-card__legend">
        <span className="distance-card__dot"></span>
        <span>Km</span>
      </div>
    </section>
  );
}