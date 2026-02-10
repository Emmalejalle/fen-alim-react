import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";

const RED = "#E53724";

export default function ProfilScreen() {
  const { user, logout } = useUser();
  const router = useRouter();

  const [editing, setEditing] = useState(false);

  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.name}>
          {user.prenom} {user.nom}
        </Text>
      </View>

      {/* INFOS */}
      <View style={styles.card}>
        <Text style={styles.section}>Mes informations</Text>

        <Text>Email</Text>
        <TextInput
          value={email}
          editable={editing}
          onChangeText={setEmail}
          style={[styles.input, !editing && styles.disabled]}
        />

        <Text>Téléphone</Text>
        <TextInput
          value={phone}
          editable={editing}
          onChangeText={setPhone}
          style={[styles.input, !editing && styles.disabled]}
        />

        {editing && (
          <>
            <Text>Nouveau mot de passe</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </>
        )}

        {!editing ? (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setEditing(true)}
          >
            <Text style={{ color: "#fff" }}>Modifier mes informations</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => setEditing(false)}
          >
            <Text style={{ color: "#fff" }}>Enregistrer</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SIGNALEMENTS */}
      <Text style={styles.title}>Mes signalements</Text>
      <View style={styles.emptyCard}>
        <Text>Aucun signalement pour le moment</Text>
      </View>

      {/* POINTS PRIVES */}
      <Text style={styles.title}>Mes points d'eau privés</Text>
      <View style={styles.emptyCard}>
        <Text>Aucun point d'eau ajouté</Text>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          logout();
          router.replace("/");
        }}
      >
        <Text style={styles.logoutTxt}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    backgroundColor: RED,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  name: { color: "#fff", fontSize: 24, fontWeight: "700" },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },

  section: {
    fontWeight: "700",
    marginBottom: 15,
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
  },

  disabled: {
    backgroundColor: "#eee",
    color: "#777",
  },

  editBtn: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },

  saveBtn: {
    backgroundColor: RED,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },

  title: {
    marginLeft: 20,
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },

  logoutBtn: {
    backgroundColor: "#222",
    margin: 20,
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },

  logoutTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
