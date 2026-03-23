import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { mockUserActivity } from "../mocks/mockData";
import "../css/dashboard.css";

const goal = 6;

const completed = mockUserActivity.length;

const remaining = goal - completed > 0 ? goal - completed : 0;

const chartData = [
  { name: "done", value: completed },
  { name: "remaining", value: remaining },
];

const COLORS = ["#1f38ff", "#d6d9f5"];

export default function WeeklyStats() {
  const totalDuration = mockUserActivity.reduce(
    (acc, item) => acc + item.duration,
    0
  );
  const totalDistance = mockUserActivity.reduce(
    (acc, item) => acc + item.distance,
    0
  );

  return (
    <section className="weekly">
      <div className="weekly__header">
        <h2>Cette semaine</h2>
        <p>
          Du {mockUserActivity[0].date} au{" "}
          {mockUserActivity[mockUserActivity.length - 1].date}
        </p>
      </div>

      <div className="weekly__content">
        {/* LEFT */}
        <div className="weekly__card">
          <h3>
            <span className="weekly__blue">X{completed}</span> sur objectif de {goal}
          </h3>

          <p>Courses hebdomadaire réalisées</p>

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

          <div className="weekly__legend">
            <span>{completed} réalisées</span>
            <span>{remaining} restantes</span>
          </div>
        </div>

        {/* RIGHT */}
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