import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "../css/dashboard.css";
// ici on reçoit les données d'activité
type WeeklyStatsProps = {
  data: any[];
};

const COLORS = ["#1f38ff", "#d6d9f5"];

// objectif fixe du nombre de courses
const goal = 6;

export default function WeeklyStats({ data }: WeeklyStatsProps) {
  // nombre total d'activités réalisées
  const completed = data.length;

  // nombre restant pour atteindre l'objectif
  const remaining = goal - completed > 0 ? goal - completed : 0;

  // données du graphique circulaire
  const chartData = [
    { name: "done", value: completed },
    { name: "remaining", value: remaining },
  ];

  // calcule la durée totale de toutes les activités
  const totalDuration = data.reduce(
    (acc, item) => acc + item.duration,
    0
  );

  // calcule la distance totale de toutes les activités
  const totalDistance = data.reduce(
    (acc, item) => acc + item.distance,
    0
  );

  return (
    <section className="weekly">
      {/* en-tête de la section */}
      <div className="weekly__header">
        <h2>Cette semaine</h2>
        <p>
          Du {data[0]?.date} au {data[data.length - 1]?.date}
        </p>
      </div>

      <div className="weekly__content">
        {/* carte de gauche */}
        <div className="weekly__card">
          <h3>
            <span className="weekly__blue">X{completed}</span> sur objectif de {goal}
          </h3>

          <p>Courses hebdomadaire réalisées</p>

          {/* graphique circulaire */}
          <div className="weekly__chart">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* légende */}
          <div className="weekly__legend">
            <span>{completed} réalisées</span>
            <span>{remaining} restantes</span>
          </div>
        </div>

        {/* bloc de droite */}
        <div className="weekly__right">
          <div className="weekly__mini">
            <p>Durée d’activité</p>
            <h3 className="blue">{totalDuration} minutes</h3>
          </div>

          <div className="weekly__mini">
            <p>Distance</p>
            <h3 className="orange">
              {totalDistance.toFixed(1)} kilomètres
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}