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
  // permet de rediriger l'utilisateur
  const navigate = useNavigate();

  // états pour le chargement et les erreurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // états pour stocker les données utilisateur et activité
  const [userInfo, setUserInfo] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);

  // récupération du contexte utilisateur
  const context = useContext(UserContext);

  // sécurité si le contexte n'existe pas
  if (!context) {
    return <p>Erreur de contexte</p>;
  }

  const { setUser } = context;

  useEffect(() => {
    // récupération du token
    const token = getToken();

    // si pas connecté, retour à la page login
    if (!token) {
      navigate("/");
      return;
    }

    // chargement des données depuis le provider
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [userData, activityData] = await Promise.all([
          getUserInfo(token!),
          getUserActivity(token!),
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

  // remet l'utilisateur à null lors de la déconnexion
  const handleLogout = () => {
    setUser(null);
  };

  // affichage pendant le chargement
  if (loading) {
    return <p>Chargement...</p>;
  }

  // affichage en cas d'erreur
  if (error) {
    return <p>{error}</p>;
  }

  // affichage si aucune donnée utilisateur n'est disponible
  if (!userInfo) {
    return <p>Données indisponibles</p>;
  }

  return (
    <>
      {/* en-tête du tableau de bord */}
      <Header onLogout={handleLogout} />

      <main className="dashboard">
        {/* bannière du profil */}
        <ProfileBanner data={userInfo} />

        {/* cartes des performances */}
        <section className="dashboard__performances">
          <h2 className="dashboard__section-title">
            Vos dernières performances
          </h2>

          <div className="dashboard__cards">
            <DistanceCard data={activity} />
            <BpmCard data={activity} />
          </div>
        </section>

        {/* statistiques hebdomadaires */}
        <WeeklyStats data={activity} />
      </main>
    </>
  );
}
