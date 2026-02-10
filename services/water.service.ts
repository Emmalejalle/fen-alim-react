import { API_URL } from "../config/api";


export const getAllWaterPoints = async () => {
  try {
    const response = await fetch(`${API_URL}/waterpoints/`);
    if (!response.ok) throw new Error("Erreur serveur");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};