import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";


const RED = "#E53724";

export default function SignalerScreen() {
  const router = useRouter();
  const { hydrant } = useLocalSearchParams();
  const h = JSON.parse(hydrant as string);
  const [showSelect, setShowSelect] = useState(false);


  const problems = [
  "Cassé / détérioré",
  "Fuite d'eau",
  "Inaccessible (végétation, travaux…)",
  "Bouché / Obstrué",
  "Manque de pression / débit insuffisant",
  "Couvercle / capot manquant",
  "Point d'eau devenu privé / clôturé",
  "Point d'eau introuvable",
  "Signalisation absente",
  "Autre problème",
];

  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [problem, setProblem] = useState(problems[0]);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const sendReport = async () => {
  try {
    const body = {
      waterpoint_id: h._id,
      numero_pei: h._numero_pei,
      probleme: problem,
      commentaire: comment,
      photos: photos, // plus tard tu enverras en base64
      utilisateur: "mobile_user",
      date: new Date().toISOString(),
    };

    console.log("SIGNALER =>", body);

    await fetch("http://API_A_REMPLIR/signalements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    router.back();
  } catch (e) {
    console.error(e);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        {/* HEADER */}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: "#fff", fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Signaler un point d'eau</Text>
        </View>

        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.card}>

            <Text style={styles.status}>
                {h._disponibilite === "DI"
                    ? "✅ État actuel : fonctionnel (déclaré)"
                    : "❌ État actuel : hors service (déclaré)"}
            </Text>


            {/* TYPE PROBLEME */}
            <Text style={styles.section}>Type de problème</Text>

            <TouchableOpacity
            style={styles.select}
            onPress={() => setShowSelect(!showSelect)}
            >
            <Text>{problem}</Text>
            <Text style={styles.arrow}>▾</Text>
            </TouchableOpacity>

            {showSelect && (
            <View style={styles.dropdown}>
                {problems.map((p) => (
                <TouchableOpacity
                    key={p}
                    style={styles.dropdownItem}
                    onPress={() => {
                    setProblem(p);
                    setShowSelect(false);
                    }}
                >
                    <Text>{p}</Text>
                </TouchableOpacity>
                ))}
            </View>
            )}


            {/* PHOTOS */}
            <Text style={styles.section}>Ajouter une photo (optionnel)</Text>
           <View style={styles.photoRow}>
                {photos.map((uri, i) => (
                    <Image key={i} source={{ uri }} style={styles.photo} />
                ))}

                {photos.length < 4 && (
                    <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                    <Text style={{ fontSize: 22 }}>📷</Text>
                    </TouchableOpacity>
                )}
            </View>


            {/* COMMENTAIRE */}
            <Text style={styles.section}>Détails supplémentaires...</Text>
            <TextInput
                placeholder="Ajouter votre commentaire"
                placeholderTextColor="#9E9E9E"
                style={styles.textArea}
                multiline
            />

            </View>

            {/* BOUTON EN BAS */}
            <TouchableOpacity style={styles.button} onPress={sendReport}>
            <Text style={styles.buttonTxt}>Envoyer le signalement</Text>
            </TouchableOpacity>

        </ScrollView>
        </KeyboardAvoidingView>
    </View>
    );

}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
  height: 185,
  backgroundColor: RED,
  paddingHorizontal: 20,
  justifyContent: "flex-end",
  paddingBottom: 20,
  borderBottomLeftRadius: 40,
  borderBottomRightRadius: 40,
},


  back: {
    color: "#fff",
    fontSize: 22,
  },

status: {
  alignSelf: "flex-start",
  backgroundColor: "#EAF7EA",
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 14,
  marginBottom: 20,
  color: "#1B5E20",
  fontWeight: "600",
},


  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },

  content: {
    padding: 20,
    marginTop: -5,

  },
photo: {
  width: 70,
  height: 70,
  borderRadius: 8,
  marginRight: 8,
},

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },
  
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    backgroundColor: "#fafafa",
    fontSize: 15,
  },


  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    padding: 12,
  },

  section: {
    marginTop: 20,
    fontWeight: "600",
  },

  select: {
  borderWidth: 1,
  borderColor: "#e5e5e5",
  borderRadius: 14,
  padding: 14,
  marginTop: 12,
  backgroundColor: "#fafafa",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

  photoRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  photoBtn: {
    width: 75,
    height: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    height: 100,
    textAlignVertical: "top",
  },

  submitBtn: {
    marginTop: 25,
    backgroundColor: RED,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },

  submitTxt: {
    color: "#fff",
    fontWeight: "700",
  },

  dropdown: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  marginTop: 8,
  backgroundColor: "#fff",
},

dropdownItem: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},

scroll: {
  padding: 20,
  paddingBottom: 120,
},

button: {
  backgroundColor: RED,
  marginHorizontal: 20,
  marginTop: 10,
  padding: 18,
  borderRadius: 30,
  alignItems: "center",
},

buttonTxt: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 16,
},


arrow: {
  fontSize: 18,
  color: "#888",
},
logoutBtn: {
  position: "absolute",
  top: 50,
  right: 25,
  backgroundColor: "rgba(255,255,255,0.2)",
  padding: 8,
  borderRadius: 20,
  zIndex: 1000,
},

logoutEmoji: {
  fontSize: 22,
},

});
