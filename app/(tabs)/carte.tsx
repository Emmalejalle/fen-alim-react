import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Marker } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { getAllWaterPoints } from "../../services/water.service";


type Hydrant = {
  _id: string;

  _numero_pei: number | null;
  _insee5: number | null;

  _debit_1_bar: number | null;
  _press_debit: number | null;
  _disponibilite: "DI" | "HS" | null;
  _type_nature: string | null;

  _longitude: number;
  _latitude: number;

  location: {
    type: "Point";
    coordinates: [number, number];
  };
};


const RED = "#E53724";

export default function CarteScreen() {
  const router = useRouter();
  const mapRef = useRef<any>(null);

  const [selectedPoint, setSelectedPoint] = useState<Hydrant | null>(null);
  const [waterPoints, setWaterPoints] = useState<Hydrant[]>([]);
  const [loading, setLoading] = useState(true);

  const [region, setRegion] = useState({
    latitude: 46.603354,
    longitude: 1.888334,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "hydrant",
    etat: "Fonctionnel",
    debit: "Eleve",
    distance: 10,
  });


  useEffect(() => {
    async function initApp() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
          });

          setRegion({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }

        const data = await getAllWaterPoints();
        if (Array.isArray(data)) {
          setWaterPoints(data);
        }
      } catch (error) {
        console.error("Erreur iPhone:", error);
      } finally {
        setLoading(false);
      }
    }

    initApp();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.logoutEmoji}>🚪</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Rechercher..."
          placeholderTextColor="#ddd"
          style={styles.searchBar}
        />
      </View>

      <View style={styles.mapWrapper}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={RED} />
          </View>
        ) : (
          <>
            <MapView
              ref={mapRef}
              style={styles.map}
              region={region}
              showsUserLocation
              showsCompass
              rotateEnabled
              radius={65}
              animationEnabled={false}
              clusterColor={RED}
              clusterTextColor="#ffffff"
            >
              {waterPoints.map((point, index) => (
                <Marker
                  key={point._id || index}
                  coordinate={{
                    latitude: point._latitude,
                    longitude: point._longitude,
                  }}
                  image={require("../../assets/pin.png")}
                  tracksViewChanges={false}
                  onPress={() => setSelectedPoint(point)}
                />
              ))}

            </MapView>

            <View style={styles.floatingButtons}>
              <TouchableOpacity
                style={styles.floatingBtn}
                onPress={async () => {
                  const pos = await Location.getCurrentPositionAsync({});
                  mapRef.current?.animateToRegion(
                    {
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    },
                    500
                  );
                }}
              >
                <Text style={styles.icon}>📍</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.floatingBtn}
                onPress={() => setShowFilters(true)}

              >
                <Text style={styles.icon}>🔎</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.floatingBtn, { backgroundColor: RED }]}
                onPress={() => router.push("/(tabs)/ajouter")}
              >
                <Text style={[styles.icon, { color: "#fff" }]}>➕</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {showFilters && (
  <View style={styles.filterOverlay}>
    <View style={styles.filterSheet}>
      <Text style={styles.filterTitle}>Filtres</Text>

      {/* TYPE */}
      <Text style={styles.section}>Type de point d'eau</Text>
      <View style={styles.rowBtns}>
        {["hydrant", "citerne", "naturel"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.filterBtn,
              filters.type === t && styles.activeBtn,
            ]}
            onPress={() => setFilters({ ...filters, type: t })}
          >
            <Text style={filters.type === t && styles.activeTxt}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ETAT */}
      <Text style={styles.section}>Etat</Text>
      <View style={styles.rowBtns}>
        {["Fonctionnel", "Fuite", "Cassé", "Hors service"].map((e) => (
          <TouchableOpacity
            key={e}
            style={[
              styles.filterBtn,
              filters.etat === e && styles.activeBtn,
            ]}
            onPress={() => setFilters({ ...filters, etat: e })}
          >
            <Text style={filters.etat === e && styles.activeTxt}>
              {e}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* DEBIT */}
      <Text style={styles.section}>Débit</Text>
      <View style={styles.rowBtns}>
        {["Faible", "Moyen", "Eleve"].map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.filterBtn,
              filters.debit === d && styles.activeBtn,
            ]}
            onPress={() => setFilters({ ...filters, debit: d })}
          >
            <Text style={filters.debit === d && styles.activeTxt}>
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ACTIONS */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() =>
            setFilters({
              type: "hydrant",
              etat: "Fonctionnel",
              debit: "Eleve",
              distance: 10,
            })
          }
        >
          <Text>Réinitialiser</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => setShowFilters(false)}
        >
          <Text style={{ color: "#fff" }}>Appliquer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)}


     {selectedPoint && (
        <View style={styles.infoCard}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedPoint(null)}>
            <Text style={styles.closeTxt}>×</Text>
          </TouchableOpacity>

         <Text style={styles.title}>
            Hydrant N°{selectedPoint._numero_pei ?? "N/A"}
          </Text>

          <Text style={styles.row}>
            Débit : {selectedPoint._debit_1_bar ?? "N/A"} L/min
          </Text>

          <Text style={styles.row}>
            Code INSEE : {selectedPoint._insee5 ?? "N/A"}
          </Text>

          <Text style={styles.row}>
            État :{" "}
            <Text
              style={{
                color: selectedPoint._disponibilite === "DI" ? "green" : "red",
                fontWeight: "700",
              }}
            >
              {selectedPoint._disponibilite === "DI"
                ? "Fonctionnel"
                : "Hors service"}
            </Text>
          </Text>



          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.button, { flex: 1, marginRight: 8 }]}
              onPress={() =>
                router.push({
                  pathname: "/details",
                  params: {
                    hydrant: JSON.stringify(selectedPoint),
                  },
                })
              }
            >
              <Text style={styles.buttonText}>Voir détails</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { flex: 1, marginLeft: 8, backgroundColor: "#222" }]}
              onPress={() =>
                router.push({
                  pathname: "/signaler",
                  params: {
                    hydrant: JSON.stringify(selectedPoint),
                  },
                })
              }
            >
              <Text style={styles.buttonText}>Signaler</Text>
            </TouchableOpacity>

          </View>

        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    height: 185,
    backgroundColor: RED,
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    paddingBottom: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 999,
    position: "relative", 
  },

  btnRow: {
  flexDirection: "row",
  marginTop: 15,
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
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
  },
  mapWrapper: {
    position: "absolute",
    top: 120, 
    left: 0,
    right: 0,
    height: 830,
    zIndex: 5, 
    overflow: "hidden",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  infoCard: {
    position: "absolute",
    bottom: 120, // Ajusté pour ne pas être caché par la barre d'onglets
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 20,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#eee",
    width: 26,
    height: 26,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  closeTxt: {
    fontSize: 20,
    color: "#333",
    marginTop: -2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 5,
  },
  row: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: RED,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  floatingButtons: {
  position: "absolute",
  right: 15,
  top: 140,
  gap: 15,
  zIndex: 20,
},

floatingBtn: {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: "#fff",
  justifyContent: "center",
  alignItems: "center",
  elevation: 6,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 6,
},

icon: {
  fontSize: 22,
},
filterOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  justifyContent: "flex-end",
  zIndex: 50,
},

filterSheet: {
  backgroundColor: "#fff",
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  padding: 20,
},

filterTitle: {
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 15,
},

section: {
  marginTop: 15,
  fontWeight: "600",
},

rowBtns: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 10,
},

filterBtn: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  padding: 10,
},

activeBtn: {
  backgroundColor: RED,
},

activeTxt: {
  color: "#fff",
},

actionsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 25,
},

resetBtn: {
  padding: 12,
  backgroundColor: "#eee",
  borderRadius: 10,
},

applyBtn: {
  padding: 12,
  backgroundColor: RED,
  borderRadius: 10,
},


});