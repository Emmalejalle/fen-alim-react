import { login } from "@/services/auth.service";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUser();


  // On crée les états pour stocker les saisies
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Vérification des champs vides
    if (!email || !password) {
      Alert.alert("Champs vides", "Merci de remplir l'email et le mot de passe !");
      return;
    }

    // 2. Validation du format Email (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Format invalide", "Veuillez entrer une adresse email correcte.");
      return;
    }

    // 3. Validation longueur mot de passe (optionnel mais recommandé)
    if (password.length < 8) {
        console.log("Validation front: mot de passe trop court");
        // On peut laisser passer pour la connexion si le compte a été créé 
        // avant la règle des 8 carac, mais c'est mieux de prévenir.
    }

    try {
      setLoading(true);
      console.log("Tentative de connexion pour :", email);
      
      const result = await login({
        email: email,
        password: password,
      });

      // On vérifie notre indicateur personnalisé 'success' ou 'ok' selon ton service
      if (result && (result.success || result.ok)) {
        console.log("Connexion réussie ! Redirection vers la carte...");
         const result = await login({
            email,
            password,
          });

          setUser({
            id: result.id,
            nom: result.nom,
            prenom: result.prenom,
            email: result.email,
            phone: result.phone,
          });

          router.replace("/(tabs)/carte");

      } else {
        // Le serveur a répondu une erreur (ex: mauvais mdp)
        console.log("Échec connexion :", result?.detail);
        Alert.alert("Erreur", result?.detail || "Identifiants invalides ou compte inexistant.");
      }
    } catch (error) {
      // Erreur réseau critique (serveur éteint, mauvaise IP, pare-feu Linux actif)
      console.error("Erreur réseau Login :", error);
      Alert.alert(
        "Erreur Réseau", 
        "Impossible de joindre le serveur. \nVérifie ton IP locale (10.97.105.6) et que ton pare-feu Linux est bien coupé (sudo ufw disable)."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false}
          keyboardShouldPersistTaps="handled"
        > 
          <View style={styles.header}>
            <View style={styles.headerTextBox}>
              <Text style={styles.welcome}>Bienvenue!</Text>
              <Text style={styles.subtitle}>sur FEN•ALIM</Text>
            </View>
          </View>

          <Image source={require("../assets/hydrant.png")} style={styles.hydrant} />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connexion</Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#cfcfcf"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />

            <TextInput
              placeholder="Mot de passe"
              placeholderTextColor="#cfcfcf"
              secureTextEntry
              style={styles.input}
              onChangeText={setPassword}
              value={password}
            />

            <TouchableOpacity style={{ alignSelf: "flex-end" }}>
              <Text style={styles.forgot}>mot de passe oublié</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, loading && { opacity: 0.7 }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                  {loading ? "Connexion en cours..." : "Connexion"}
              </Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.line} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.line} />
            </View>

            <Text style={styles.noAccount}>Vous n’avez pas de compte ?</Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.createLink}>créer le</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const RED = "#E53724";
const LIGHT_BG = "#F3EDEB";
const ORANGE = "#F28A3C";
const TEXT_GREY = "#A8A8A8";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: RED },
  scrollContent: {
        flexGrow: 1,
        backgroundColor: LIGHT_BG,
  },
  header: {
  backgroundColor: RED,
  height: 335,
  paddingHorizontal: 26,
  paddingTop: 40,
  borderBottomLeftRadius: 60,
  borderBottomRightRadius: 60,
  zIndex: 1
},

headerTextBox: {
  marginTop: 40
},

welcome: {
  fontSize: 40,
  fontWeight: "800",
  color: "#fff"
},

subtitle: {
  fontSize: 22,
  color: "#fff",
  marginTop: -5,
  fontWeight: "500"
},

hydrant: {
  width: 140,
  height: 260,
  resizeMode: "contain",
  position: "absolute",
  top: 140,
  right: 20,
  zIndex: 5
},

card: {
  backgroundColor: LIGHT_BG,
  borderTopLeftRadius: 50,
  borderTopRightRadius: 50,
  paddingHorizontal: 26,
  paddingTop: 100,
  zIndex: 3,
  flex: 1,
  marginTop: -80
},

cardTitle: {
  fontSize: 28,
  color: ORANGE,
  fontWeight: "700",
  marginBottom: 30
},

input: {
  backgroundColor: "#fff",
  paddingHorizontal: 22,
  paddingVertical: 14,
  borderRadius: 30,
  fontSize: 16,
  marginBottom: 18
},

forgot: {
  color: ORANGE,
  fontSize: 13,
  marginBottom: 30
},

loginButton: {
  backgroundColor: RED,
  paddingVertical: 16,
  borderRadius: 30,
  alignItems: "center",
  marginBottom: 35
},

loginText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "600"
},

separatorContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 15
},

line: {
  flex: 1,
  height: 1,
  backgroundColor: "#d4d4d4"
},

separatorText: {
  marginHorizontal: 10,
  color: TEXT_GREY,
  fontSize: 14
},

noAccount: {
  textAlign: "center",
  fontSize: 14,
  color: TEXT_GREY,
  marginBottom: 5
},

createLink: {
  textAlign: "center",
  color: ORANGE,
  fontSize: 16,
  fontWeight: "600"
},

});
