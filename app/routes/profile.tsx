import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getToken, removeToken } from "../utils/auth";
import { UserContext } from "../context/UserContext";
import { getUserInfo, getUserActivity } from "../services/dataProvider";
import Header from "../components/Header";
import "../css/profile.css";

function formatJoinDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Profile() {
  const navigate = useNavigate();
  const context = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);

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

        const authToken: string = token!;

        const [userData, activityData] = await Promise.all([
          getUserInfo(authToken),
          getUserActivity(authToken),
        ]);

        setUserInfo(userData);
        setActivity(activityData);
      } catch {
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    navigate("/");
  };

  if (loading) {
    return <p>Vérification...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!userInfo) {
    return <p>Données indisponibles</p>;
  }

  const { profile } = userInfo;
  const statistics = userInfo.statistics ?? {};

  const activityTotalCalories = activity.reduce(
    (total, item) => total + item.caloriesBurned,
    0
  );

  const activityTotalDistance = activity.reduce(
    (total, item) => total + item.distance,
    0
  );

  const activityTotalDuration = activity.reduce(
    (total, item) => total + item.duration,
    0
  );

  const activityTotalSessions = activity.length;

  const totalCalories = statistics.totalCalories ?? activityTotalCalories;
  const totalDistance = statistics.totalDistance ?? activityTotalDistance;
  const totalDuration = statistics.totalDuration ?? activityTotalDuration;
  const totalSessions = statistics.totalSessions ?? activityTotalSessions;
  const totalRestDays = Math.max(0, 30 - totalSessions);

  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  return (
    <>
      <Header onLogout={handleLogout} />

      <main className="profile-page">
        <section className="profile-page__grid">
          <div className="profile-page__left">
            <article className="profile-card profile-card--identity">
              <img
                src={profile.profilePicture}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="profile-card__image"
              />

              <div className="profile-card__identity-text">
                <h1 className="profile-card__name">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="profile-card__member">
                  Membre depuis le {formatJoinDate(profile.createdAt)}
                </p>
              </div>
            </article>

            <article className="profile-card profile-card--details">
              <h2 className="profile-card__title">Votre profil</h2>

              <div className="profile-card__details-list">
                <p><strong>Âge :</strong> {profile.age}</p>
                <p><strong>Genre :</strong> {profile.gender === "male" ? "Homme" : "Femme"} </p>
                <p><strong>Taille :</strong> {profile.height} cm</p>
                <p><strong>Poids :</strong> {profile.weight} kg</p>
              </div>
            </article>
          </div>

          <div className="profile-page__right">
            <div className="profile-stats__header">
              <h2 className="profile-stats__title">Vos statistiques</h2>
              <p className="profile-stats__subtitle">
                depuis le {formatJoinDate(profile.createdAt)}
              </p>
            </div>

            <div className="profile-stats__grid">
              <article className="profile-stat">
                <p className="profile-stat__label">Temps total couru</p>
                <p className="profile-stat__value">{hours}h {minutes}min</p>
              </article>

              <article className="profile-stat">
                <p className="profile-stat__label">Calories brûlées</p>
                <p className="profile-stat__value">{totalCalories} cal</p>
              </article>

              <article className="profile-stat">
                <p className="profile-stat__label">Distance totale parcourue</p>
                <p className="profile-stat__value">{Math.round(totalDistance)} km</p>
              </article>

              <article className="profile-stat">
                <p className="profile-stat__label">Nombre de jours de repos</p>
                <p className="profile-stat__value">{totalRestDays} jours</p>
              </article>

              <article className="profile-stat">
                <p className="profile-stat__label">Nombre de sessions</p>
                <p className="profile-stat__value">{totalSessions} sessions</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
