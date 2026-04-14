import { PieChart, Pie, ResponsiveContainer } from "recharts";
import {
  formatActivityPeriod,
  getLatestWeekActivities,
  type UserActivity,
} from "../utils/activity";
import "../css/weekly-stats.css";

type WeeklyStatsProps = {
  data: UserActivity[];
  goal: number;
};

export default function WeeklyStats({ data, goal }: WeeklyStatsProps) {
  const latestWeekActivities = getLatestWeekActivities(data);

  const completed = latestWeekActivities.length;
  const remaining = Math.max(0, goal - completed);

  // Données du graphique : part réalisée vs part restante.
  const chartData = [
    { name: "réalisées", value: completed, fill: "#1f38ff" },
    { name: "restantes", value: remaining, fill: "#d6d9f5" },
  ];

  const totalDuration = latestWeekActivities.reduce((acc, item) => acc + item.duration, 0);
  const totalDistance = latestWeekActivities.reduce((acc, item) => acc + item.distance, 0);

  const startDate = latestWeekActivities[0]?.date;
  const endDate = latestWeekActivities[latestWeekActivities.length - 1]?.date;
  const period =
    startDate && endDate
      ? `Du ${formatActivityPeriod(startDate, endDate)}`
      : "Aucune activité récente";

  return (
    <section className="weekly">
      <div className="weekly__header">
        <h2>Cette semaine</h2>
        <p>{period}</p>
      </div>

      <div className="weekly__content">
        <div className="weekly__card">
          <h3>
            <span className="weekly__blue">x{completed}</span> sur objectif de {goal}
          </h3>
          <p>Courses hebdomadaire réalisées</p>

          <div className="weekly__chart">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} dataKey="value" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="weekly__legend">
            <span><span className="weekly__dot weekly__dot--blue" /> {completed} réalisées</span>
            <span><span className="weekly__dot weekly__dot--gray" /> {remaining} restantes</span>
          </div>
        </div>

        <div className="weekly__right">
          <div className="weekly__mini">
            <p>Durée d'activité</p>
            <h3 className="blue">{totalDuration} minutes</h3>
          </div>

          <div className="weekly__mini">
            <p>Distance</p>
            <h3 className="orange">{totalDistance.toFixed(1)} kilomètres</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
