import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const RED = "#E53724";

export default function DetailsScreen() {
  const router = useRouter();
  const { hydrant } = useLocalSearchParams();

  // On récupère DIRECT l'objet envoyé depuis la carte
  const h = JSON.parse(hydrant as string);

  const lat = h.location.coordinates[1];
  const lon = h.location.coordinates[0];

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Hydrant N°{h._numero_pei ?? "N/A"}
        </Text>

        <Text style={styles.subtitle}>
          INSEE : {h._insee5 ?? "N/A"}
        </Text>

        <Text style={styles.subtitle}>
          Dernière maj : {h._date_maj ?? "Inconnue"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* LOCALISATION */}
        <Text style={styles.section}>📍 Localisation</Text>
        <View style={styles.card}>
          <Text>Latitude : {lat}</Text>
          <Text>Longitude : {lon}</Text>
          <Text>Carto ref : {h._carto_ref ?? "Non renseigné"}</Text>
        </View>

        {/* CARACTÉRISTIQUES */}
        <Text style={styles.section}>💧 Caractéristiques techniques</Text>
        <View style={styles.card}>
          <Text>Type nature : {h._type_nature ?? "N/A"}</Text>
          <Text>Débit à 1 bar : {h._debit_1_bar ?? "N/A"} L/min</Text>
          <Text>Pression / débit : {h._press_debit ?? "N/A"}</Text>
          <Text>Volume eau min : {h._vol_eau_min ?? "Non renseigné"}</Text>
          <Text>Nb raccordement : {h._nb_raccordement ?? "Non renseigné"}</Text>
          <Text>Statut : {h._statut ?? "Non renseigné"}</Text>
        </View>

        {/* ÉTAT */}
        <Text style={styles.section}>🚦 État</Text>
        <View style={styles.card}>
          <Text>
            Disponibilité :{" "}
            <Text style={{ color: h._disponibilite === "DI" ? "green" : "red" }}>
              {h._disponibilite === "DI"
                ? "Fonctionnel"
                : "Hors service"}
            </Text>
          </Text>
          <Text>Accessibilité : {h._accessibilite ?? "Non renseigné"}</Text>
          <Text>
            Dernière vérification : {h._derniere_verification ?? "Inconnue"}
          </Text>
        </View>

        {/* MÉTADONNÉES */}
        <Text style={styles.section}>🧾 Informations système</Text>
        <View style={styles.card}>
          <Text>ID Mongo : {h._id}</Text>
          <Text>Créé le : {h._date_crea ?? "N/A"}</Text>
          <Text>Modifié le : {h._date_maj ?? "N/A"}</Text>
          <Text>Utilisateur : {h._utilisateur ?? "Inconnu"}</Text>
        </View>

        {/* BOUTON SIGNALER */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/signaler",
              params: { hydrant: JSON.stringify(h) },
            })
          }
        >
          <Text style={styles.buttonTxt}>Signaler un problème</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    height: 185,
    backgroundColor: RED,
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    paddingBottom: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  back: { color: "#fff", fontSize: 22 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#fff", opacity: 0.9 },

  content: { padding: 20, paddingBottom: 100 },

  section: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
  },

  button: {
    marginTop: 30,
    backgroundColor: RED,
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonTxt: {
    color: "#fff",
    fontWeight: "700",
  },
});
