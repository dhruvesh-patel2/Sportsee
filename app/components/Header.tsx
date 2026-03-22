import { Link, useNavigate } from "react-router";
import { removeToken } from "../utils/auth";
import "../css/dashboard.css";

type HeaderProps = {
    onLogout?: () => void;
  };
  
  export default function Header({ onLogout }: HeaderProps) {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      removeToken();
      if (onLogout) {
        onLogout();
      }
      navigate("/");
    };
  
    return (
      <header className="header">
        <div className="header__container">
          <Link to="/dashboard" className="header__logo">
            <img src="/logo.png" alt="Logo SportSee" className="header__logo-img" />
          </Link>
          <nav className="header__nav">
            <Link to="/dashboard" className="header__link">Dashboard</Link>
            <span className="header__link">Mon profil</span>
            <button type="button" className="header__logout" onClick={handleLogout}>Se déconnecter</button>
          </nav>
        </div>
      </header>
    );
  }