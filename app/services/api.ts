// URL de base de l'API backend
const API_URL = "http://localhost:8000/api";

// normalise les données utilisateur pour avoir une structure cohérente côté front
function normalizeUserInfo(data: any) {
  const profileSource = data?.profile ?? {};
  const userInfosSource = data?.userInfos ?? {};
  const statisticsSource = data?.statistics ?? {};

  return {
    ...data,
    profile: {
      // fusionne les infos venant de userInfos et profile
      ...userInfosSource,
      ...profileSource,

      // récupère le genre même s'il est stocké à différents endroits
      gender:
        profileSource.gender ??
        userInfosSource.gender ??
        data?.gender ??
        null,
    },
    statistics: statisticsSource,
  };
}

// envoie les identifiants au backend pour connecter l'utilisateur
export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  // si la connexion échoue, on envoie une erreur
  if (!response.ok) {
    throw new Error("Identifiants invalides");
  }

  // retourne la réponse de l'API
  return response.json();
}

// récupère les informations du profil utilisateur
export async function fetchUserInfo(token: string) {
  const response = await fetch(`${API_URL}/user-info`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // si la requête échoue, on envoie une erreur
  if (!response.ok) {
    throw new Error("Impossible de charger le profil");
  }

  // transforme les données avant de les renvoyer au front
  const data = await response.json();
  return normalizeUserInfo(data);
}

// récupère les activités de l'utilisateur sur une période donnée
export async function fetchUserActivity(
  token: string,
  startWeek: string,
  endWeek: string
) {
  const response = await fetch(
    `${API_URL}/user-activity?startWeek=${encodeURIComponent(startWeek)}&endWeek=${encodeURIComponent(endWeek)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  // si la requête échoue, on envoie une erreur
  if (!response.ok) {
    throw new Error("Impossible de charger les activités");
  }

  // retourne les données d'activité
  return response.json();
}
