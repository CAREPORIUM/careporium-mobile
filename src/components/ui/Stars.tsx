import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

// Rating as 5 stars. Rounds to the nearest whole star.
export default function Stars({ value, size = 18 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons key={i} name={i <= full ? "star" : "star-outline"} size={size} color={colors.warning} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: "row", gap: 2 } });
