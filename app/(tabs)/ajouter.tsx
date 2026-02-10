import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import * as Location from "expo-location";




const RED = "#E53724";

export default function SignalerScreen() {
  const router = useRouter();

  const [type, setType] = useState("piscine");
  const [showSelect, setShowSelect] = useState(false);
  const types = ["Piscine", "Lac", "Rivière", "Citerne", "Bassin"];
  const [photos, setPhotos] = useState<string[]>([]);

  const [adresse, setAdresse] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [coords, setCoords] = useState<{lat:number, lon:number} | null>(null);


  const takePhoto = async () => {
 
    const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return;

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.5,
  });

  if (!result.canceled) {
    setPhotos([...photos, result.assets[0].uri]);
  }
};

useEffect(() => {
  const getPos = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const pos = await Location.getCurrentPositionAsync({});
    setCoords({
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
    });
  };

  getPos();
}, []);



const sendNewWaterPoint = async () => {
  if (!coords) return;

  const body = {
    location: {
      type: "Point",
      coordinates: [coords.lon, coords.lat],
    },
    statut: "PRIVE",
    type_nature: type,
    utilisateur: "mobile_user",
    accessibilite: "C",
    disponibilite: "IN",
    date_crea: new Date().toISOString(),
    commentaire,
    photos,
  };

  console.log("AJOUT WP =>", body);

  await fetch("http://ROUTE_A_METTRE/waterpoints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  router.back();
};


  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => router.replace("/")}
        >
            <Text style={styles.logoutEmoji}>🚪</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Ajouter un point d'eau privé</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >

        <View style={styles.card}>
          <Text style={styles.title}>Formulaire</Text>

          {/* ADRESSE */}
          <TextInput
            placeholder="Adresse"
            style={styles.input}
            value={adresse}
            onChangeText={setAdresse}
          />

          {/* TYPE */}
          <Text style={styles.section}>Type de point d'eau</Text>

            <TouchableOpacity
            style={styles.select}
            onPress={() => setShowSelect(!showSelect)}
            >
            <Text style={{ fontSize: 15 }}>{type}</Text>
            <Text style={styles.arrow}>▾</Text>
            </TouchableOpacity>

            {showSelect && (
            <View style={styles.dropdown}>
                {types.map((t) => (
                <TouchableOpacity
                    key={t}
                    style={styles.dropdownItem}
                    onPress={() => {
                    setType(t);
                    setShowSelect(false);
                    }}
                >
                    <Text>{t}</Text>
                </TouchableOpacity>
                ))}
            </View>
            )}


          {/* PHOTO */}
          <Text style={styles.section}>Ajouter une photo (optionnel)</Text>
          <View style={styles.photoRow}>
            {[0, 1, 2, 3].map((i) => (
                <TouchableOpacity
                key={i}
                style={styles.photoBtn}
                onPress={takePhoto}
                >
                {photos[i] ? (
                    <Image
                    source={{ uri: photos[i] }}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                    />
                ) : (
                    <Text style={{ fontSize: 22 }}>📷</Text>
                )}
                </TouchableOpacity>
            ))}
            </View>


          {/* DETAILS */}
          <Text style={styles.section}>Détails supplémentaires...</Text>
          <TextInput
            placeholder="Ajouter votre commentaire"
            style={styles.textArea}
            multiline
            value={commentaire}
            onChangeText={setCommentaire}
          />


          {/* BOUTON */}
          <TouchableOpacity style={styles.submitBtn} onPress={sendNewWaterPoint}>
            <Text style={styles.submitTxt}>Envoyer le signalement</Text>
          </TouchableOpacity>
        </View>
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
