import { mockUserInfo, mockUserActivity } from "../mocks/mockData";
import { fetchUserInfo, fetchUserActivity } from "./api";

const USE_MOCK = false;

function getDateRangeForActivity() {
  const now = new Date();

  const endWeek = now.toISOString().split("T")[0];

  const startDate = new Date();
  startDate.setDate(now.getDate() - 60);

  const startWeek = startDate.toISOString().split("T")[0];

  return { startWeek, endWeek };
}

export async function getUserInfo(token: string) {
  if (USE_MOCK) {
    return mockUserInfo;
  }

  return fetchUserInfo(token);
}

export async function getUserActivity(token: string) {
  if (USE_MOCK) {
    return mockUserActivity;
  }

  const { startWeek, endWeek } = getDateRangeForActivity();
  return fetchUserActivity(token, startWeek, endWeek);
}