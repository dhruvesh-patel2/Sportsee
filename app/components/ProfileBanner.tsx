import { mockUserInfo } from "../mocks/mockData";
import "../css/dashboard.css";

function formatJoinDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfileBanner() {
  const { profile, statistics } = mockUserInfo;

  return (
    <section className="profile-banner">
      <div className="profile-banner__left">
        <img
          src={profile.profilePicture}
          alt={`${profile.firstName} ${profile.lastName}`}
          className="profile-banner__image"
        />
        <div className="profile-banner__infos">
          <h2 className="profile-banner__name">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="profile-banner__member">
            Membre depuis le {formatJoinDate(profile.createdAt)}
          </p>
        </div>
      </div>

      <div className="profile-banner__right">
        <p className="profile-banner__label">Distance totale parcourue</p>
        <div className="profile-banner__distance-card">
          <span className="profile-banner__distance-value">
            {Math.round(statistics.totalDistance)} km
          </span>
        </div>
      </div>
    </section>
  );
}