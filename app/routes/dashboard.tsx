import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getToken } from "../utils/auth";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";
import ProfileBanner from "../components/ProfileBanner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
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
    setChecked(true);
  }, [navigate]);

  const handleLogout = () => {
    setUser(null);
  };

  if (!checked) {
    return <p>Vérification...</p>;
  }

  return (
    <>
      <Header onLogout={handleLogout} />
      <main>
        <ProfileBanner />
      </main>
    </>
  );
}