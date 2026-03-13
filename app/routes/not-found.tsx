import { Link } from "react-router";

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page introuvable</h1>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}