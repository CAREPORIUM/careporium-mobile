import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace("/onboarding"), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="medkit-outline" size={40} color={colors.white} />
      <Text style={styles.text}>CAREPORIUM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 12 },
  text: { color: colors.white, fontSize: 26, fontWeight: "700", letterSpacing: 1 },
});