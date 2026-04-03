import { mockUserInfo, mockUserActivity } from "../mocks/mockData";
import { fetchUserInfo, fetchUserActivity } from "./api";

// permet de choisir entre les données mockées et l'API
const USE_MOCK = false;

// calcule une période de dates pour récupérer les activités
function getDateRangeForActivity() {
  const now = new Date();

  // date de fin = aujourd'hui
  const endWeek = now.toISOString().split("T")[0];

  // date de début = il y a 60 jours
  const startDate = new Date();
  startDate.setDate(now.getDate() - 60);

  const startWeek = startDate.toISOString().split("T")[0];

  return { startWeek, endWeek };
}

// récupère les infos utilisateur
export async function getUserInfo(token: string) {
  // si le mode mock est activé, on retourne les fausses données
  if (USE_MOCK) {
    return mockUserInfo;
  }

  // sinon on appelle l'API
  return fetchUserInfo(token);
}

// récupère les activités utilisateur
export async function getUserActivity(token: string) {
  // si le mode mock est activé, on retourne les fausses données
  if (USE_MOCK) {
    return mockUserActivity;
  }
  const { startWeek, endWeek } = getDateRangeForActivity();
  return fetchUserActivity(token, startWeek, endWeek);
}