import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getToken, removeToken } from "../utils/auth";
import { UserContext } from "../context/UserContext";

export default function Dashboard() {

    const navigate = useNavigate();
      const [checked, setChecked] = useState(false);
    // on récupère le contexte global
       const context = useContext(UserContext);
            if (!context) {
              return <p>Erreur de contexte</p>;
            }
      const { user, setUser } = context;
      // vérifie si l'utilisateur est connecté
      useEffect(() => {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }
        setChecked(true);
        }, [navigate]);
          const handleLogout = () => {
            // supprime le token
            removeToken();
            // supprime les données utilisateur
            setUser(null);
            navigate("/login");
          };
            if (!checked) {
              return <p>Vérification...</p>;
            }
              return (
                <div>
                  <h1>Dashboard</h1>
                  <p>Page protégée</p>
                  {user && (
                    <p>Utilisateur connecté : {user.username}</p>
                  )}
                  <button onClick={handleLogout}>
                    Se déconnecter
                  </button>
                </div>
              );
}