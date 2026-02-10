import { API_URL } from "../config/api";

export const getMyPrivatePoints = async (userId: string) => {
  const res = await fetch(`${API_URL}/private-waterpoints/user/${userId}`);
  return await res.json();
};
