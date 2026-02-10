import { API_URL } from "../config/api";

type RegisterPayload = {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  phone: string;
  role: "civil" | "pompier" | "commandant" | "administrateur";
  idMission: number | null;
};

type LoginPayload = {
  email: string;
  password: string;
};  

export async function login(payload: LoginPayload) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  // Si le serveur renvoie une erreur (400, 401, etc.)
  if (!response.ok) {
    return { success: false, detail: data.detail || "Erreur connexion" };
  }

  // Si c'est un 200 OK
  return { success: true, ...data };
}

export async function register(payload: RegisterPayload) {
  const response = await fetch(`${API_URL}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erreur inscription");
  }

  return data;
}
