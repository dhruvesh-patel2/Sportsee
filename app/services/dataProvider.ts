import { mockUserInfo, mockUserActivity } from "../mocks/mockData";

const USE_MOCK = false;

export const getUserInfo = async () => {
  if (USE_MOCK) {
    return mockUserInfo;
  }

  const res = await fetch("http://localhost:8000/user");
  return res.json();
};

export const getUserActivity = async () => {
  if (USE_MOCK) {
    return mockUserActivity;
  }

  const res = await fetch("http://localhost:8000/activity");
  return res.json();
};