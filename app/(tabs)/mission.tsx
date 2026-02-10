import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";

const RED = "#E53724";

export default function MissionScreen() {

  const fakeMission = {
    id: "MISSION_001",
    statut: "EN COURS",
    lieu: "Zone industrielle - Vannes",
    hydrants: [
      {
        id: "H1",
        numero_pei: 245,
        debit_1_bar: 1200,
        disponibilite: "DI",
        distance: "120m",
        lat: 47.65,
        lon: -2.75,
      },
      {
        id: "H2",
        numero_pei: 301,
        debit_1_bar: 900,
        disponibilite: "DI",
        distance: "240m",
        lat: 47.651,
        lon: -2.751,
      },
    ],
  };

  const goToGPS = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      
      <Text style={styles.status}>🟢 Mission en cours</Text>
      <Text style={styles.lieu}>{fakeMission.lieu}</Text>

      <Text style={styles.section}>Points d'eau affectés</Text>

      {fakeMission.hydrants.map((h) => (
        <View key={h.id} style={styles.card}>
          <Text style={styles.title}>Hydrant N°{h.numero_pei}</Text>
          <Text>Débit : {h.debit_1_bar} L/min</Text>
          <Text>Distance : {h.distance}</Text>

          <Text style={{
            color: h.disponibilite === "DI" ? "green" : "red",
            fontWeight: "700",
            marginTop: 6
          }}>
            {h.disponibilite === "DI" ? "Fonctionnel" : "Hors service"}
          </Text>

          <TouchableOpacity
            style={styles.gpsBtn}
            onPress={() => goToGPS(h.lat, h.lon)}
          >
            <Text style={styles.gpsTxt}>📍 Y aller</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.section}>Historique des missions</Text>
      <View style={styles.historyCard}>
        <Text>Mission du 12/01/2026 - Entrepôt nord</Text>
      </View>
      <View style={styles.historyCard}>
        <Text>Mission du 02/12/2025 - Zone portuaire</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },

  status: {
    backgroundColor: "#EAF7EA",
    padding: 12,
    borderRadius: 14,
    color: "#1B5E20",
    fontWeight: "700",
    marginBottom: 15,
  },

  lieu: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },

  section: {
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },

  title: {
    fontWeight: "700",
    marginBottom: 5,
  },

  gpsBtn: {
    marginTop: 10,
    backgroundColor: RED,
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },

  gpsTxt: {
    color: "#fff",
    fontWeight: "700",
  },

  historyCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
  },
});
