import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const ORANGE = "#F97316";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: ORANGE,
          height: 65,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 6,
        },
      }}
    >
      {/* CARTE */}
      <Tabs.Screen
        name="carte"
        options={{
          title: "Carte",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="location-pin" size={size} color={color} />
          ),
        }}
      />

      {/* AJOUTER POINT D'EAU */}
      <Tabs.Screen
        name="ajouter"
        options={{
          title: "Ajouter",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-location-alt" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
