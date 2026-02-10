import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function AppButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#E53724",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  txt: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
