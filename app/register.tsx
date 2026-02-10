import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { register } from "../services/auth.service";


export default function RegisterScreen() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    // 1. Vérification des champs vides
    if (!nom || !prenom || !email || !password || !phone) {
      alert("Tous les champs sont obligatoires");
      return;
    }

    // 2. Validation de l'Email (Regex @ et .)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Veuillez entrer une adresse email valide");
      return;
    }

    // 3. Validation Mot de passe (8 caractères minimum)
    if (password.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    // 4. Validation Téléphone (10 chiffres, commence par 0)
    // Regex : commence par 0, puis un chiffre de 1 à 9, puis 8 chiffres
    const phoneRegex = /^0[1-9][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      alert("Le numéro de téléphone doit contenir 10 chiffres et commencer par 0");
      return;
    }

    //5. les deux champs de mdp sont identiques
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }


    try {
      setLoading(true);

      const response = await register({
        nom,
        prenom,
        email,
        password,
        phone,
        role: "civil",
        idMission: null,
      });

      Alert.alert(
        "Succès",
        "Votre compte a été créé avec succès !",
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
      
    } catch (err: any) {
      console.log("Détails de l'erreur :", err.message);

      Alert.alert(
        "Erreur d'inscription",
        err.message || "Une erreur est survenue lors de l'inscription.",
        [{ text: "Réessayer" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false}
          keyboardShouldPersistTaps="handled"
        > 
          {/* HEADER ROUGE */}
          <View style={styles.header} />

          {/* BLOC GRIS */}
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => router.push("/")}
              style={{ marginBottom: 25 }}
            >
              <Text style={styles.back}>← Retour à la connexion</Text>
            </TouchableOpacity>

            <Text style={styles.title}>S’inscrire</Text>

            <TextInput
              placeholder="Nom"
              value={nom}
              onChangeText={setNom}
              placeholderTextColor="#cfcfcf"
              style={styles.input}
            />

            <TextInput
              placeholder="Prénom"
              value={prenom}
              onChangeText={setPrenom}
              placeholderTextColor="#cfcfcf"
              style={styles.input}
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#cfcfcf"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Mot de passe (8 car. min)"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#cfcfcf"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>


            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#cfcfcf"
                secureTextEntry={!showConfirmPassword}
                style={styles.passwordInput}
              />

              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>




            <TextInput
              placeholder="Téléphone (10 chiffres)"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#cfcfcf"
              keyboardType="phone-pad"
              style={styles.input}
              maxLength={10} // Empêche de taper plus de 10 chiffres
            />

            {/* BOUTON */}
            <TouchableOpacity 
              style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.submitTxt}>
                {loading ? "Création..." : "Créer le compte"}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const RED = "#E53724";
const LIGHT_BG = "#F3EDEB";
const ORANGE = "#F28A3C";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: RED,
  },
  scrollContent: {
        flexGrow: 1,
        backgroundColor: LIGHT_BG,
  },
  header: {
    backgroundColor: RED,
    height: 215,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  card: {
    marginTop: -50,
    flex: 1,
    backgroundColor: LIGHT_BG,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 26,
    paddingTop: 50,
  },
  back: {
    fontSize: 16,
    color: ORANGE,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: ORANGE,
    marginBottom: 35,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 30,
    fontSize: 16,
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: RED,
    marginTop: 15,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  submitTxt: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 30,
  paddingHorizontal: 22,
  marginBottom: 20,
},

passwordInput: {
  flex: 1,
  paddingVertical: 14,
  fontSize: 16,
},

});