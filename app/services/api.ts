const API_URL = "http://localhost:8000/api";

export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Identifiants invalides");
  }

  return response.json();
}

export async function fetchUserInfo(token: string) {
  const response = await fetch(`${API_URL}/user-info`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de charger le profil");
  }

  return response.json();
}

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

  if (!response.ok) {
    throw new Error("Impossible de charger les activités");
  }

  return response.json();
}