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
  // permet de rediriger l'utilisateur vers une autre page
  const navigate = useNavigate();

  // checked sert à savoir si la vérification du token et le chargement minimal sont terminés
  const [checked, setChecked] = useState(false);

  // stocke les informations du profil utilisateur
  const [userInfo, setUserInfo] = useState<any>(null);

  // stocke les données d'activité (mock ou API selon le dataProvider)
  const [activity, setActivity] = useState<any[]>([]);

  // récupère le contexte utilisateur global
  const context = useContext(UserContext);

  // sécurité : si le contexte n'existe pas, on affiche une erreur
  if (!context) {
    return <p>Erreur de contexte</p>;
  }

  // permet de modifier l'utilisateur connecté dans le contexte
  const { setUser } = context;

  useEffect(() => {
    // on récupère le token de connexion enregistré
    const token = getToken();

    // si aucun token n'est trouvé, on renvoie l'utilisateur vers la page de login
    if (!token) {
      navigate("/");
      return;
    }

    // on récupère les données du profil utilisateur
    // getUserInfo passe par le dataProvider :
    // il choisit soit les mocks soit l'API réelle
    getUserInfo().then((data) => {
      setUserInfo(data);
    });

    // on récupère les données d'activité sportive
    // ici aussi, la source dépend du dataProvider (mock ou API)
    getUserActivity().then((data) => {
      setActivity(data);

      // quand les données principales sont chargées,
      // on autorise l'affichage de la page
      setChecked(true);
    });
  }, [navigate]);

  // fonction appelée lors du logout
  const handleLogout = () => {
    // on vide l'utilisateur dans le contexte
    setUser(null);
  };

  // tant que la vérification n'est pas terminée
  // ou que les infos utilisateur ne sont pas chargées,
  // on affiche un message temporaire
  if (!checked || !userInfo) {
    return <p>Vérification...</p>;
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