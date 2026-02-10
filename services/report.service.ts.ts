import { API_URL } from "../config/api";

export const getMyReports = async (userId: string) => {
  const res = await fetch(`${API_URL}/reports/user/${userId}`);
  return await res.json();
};
