import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { saveToken } from "../utils/auth";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const context = useContext(UserContext);
  if (!context) {
    return <p>Erreur de contexte</p>;
  }
  const { setUser } = context;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.token) {
        saveToken(data.token);
        setUser({
          username: username,
          userId: data.userId,
        });
        navigate("/dashboard");
      } else {
        setError("Identifiants incorrects");
      }
    } catch (error) {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            id="username"
            type="text"
            placeholder="sophiemartin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="password123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}