import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getToken } from "../utils/auth";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";
import ProfileBanner from "../components/ProfileBanner";
import DistanceCard from "../components/DistanceCard";
import BpmCard from "../components/BpmCard";
import WeeklyStats from "../components/WeeklyStats";
import { getUserInfo, getUserActivity } from "../services/dataProvider";
import "../css/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);

  const context = useContext(UserContext);

  if (!context) {
    return <p>Erreur de contexte</p>;
  }

  const { setUser } = context;

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate("/");
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [userData, activityData] = await Promise.all([
          getUserInfo(token),
          getUserActivity(token),
        ]);

        setUserInfo(userData);
        setActivity(activityData);
      } catch (err) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!userInfo) {
    return <p>Données indisponibles</p>;
  }

  return (
    <>
      <Header onLogout={handleLogout} />

      <main className="dashboard">
        <ProfileBanner data={userInfo} />

        <section className="dashboard__performances">
          <h2 className="dashboard__section-title">
            Vos dernières performances
          </h2>

          <div className="dashboard__cards">
            <DistanceCard data={activity} />
            <BpmCard data={activity} />
          </div>
        </section>

        <WeeklyStats data={activity} />
      </main>
    </>
  );
}