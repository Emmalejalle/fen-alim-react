if (!process.env.EXPO_PUBLIC_API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL manquante dans .env");
}

export const API_URL = process.env.EXPO_PUBLIC_API_URL;
