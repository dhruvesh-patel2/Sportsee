import {
    BarChart,
    Bar,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  import { mockUserActivity } from "../mocks/mockData";
  import "../css/dashboard.css";
  
  const lastFourActivities = mockUserActivity.slice(-4);
  
  const chartData = lastFourActivities.map((activity, index) => ({
    week: `S${index + 1}`,
    distance: activity.distance,
    date: activity.date,
  }));
  
  function formatShortDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  }
  
  function formatTooltipDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  }
  
  function CustomTooltip({ active, payload }: any) {
    if (!active || !payload || !payload.length) {
      return null;
    }
  
    const data = payload[0].payload;
  
    return (
      <div className="distance-card__tooltip">
        <p className="distance-card__tooltip-date">
          {formatTooltipDate(data.date)}
        </p>
        <p className="distance-card__tooltip-value">
          {data.distance.toFixed(1).replace(".", ",")} km
        </p>
      </div>
    );
  }
  
  export default function DistanceCard() {
    const averageDistance =
      chartData.reduce((total, item) => total + item.distance, 0) / chartData.length;
  
    const startDate = chartData[0]?.date;
    const endDate = chartData[chartData.length - 1]?.date;
  
    const period =
      startDate && endDate
        ? `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`
        : "";
  
    return (
      <section className="distance-card">
       <div className="distance-card__header">
        <div className="distance-card__header-left">
         <h3 className="distance-card__title">
        {Math.round(averageDistance)}km en moyenne </h3>
         <p className="distance-card__subtitle"> Total des kilomètres 4 dernières semaines </p>
        </div>
         <div className="distance-card__period">
        <button type="button" className="distance-card__arrow">‹</button>
        <span>{period}</span>
        <button type="button" className="distance-card__arrow">›</button>
        </div>
        </div>
  
        <div className="distance-card__chart">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barCategoryGap={40}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e7e7e7" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
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
  
        <div className="distance-card__legend">
          <span className="distance-card__dot"></span>
          <span>Km</span>
        </div>
      </section>
    );
  }