import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/constants/theme";

type StatusScreenProps = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  text: string;
  buttonTitle: string;
  onPress: () => void;
};

export default function StatusScreen({ icon, color, title, text, buttonTitle, onPress }: StatusScreenProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={color} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{text}</Text>
      <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", paddingHorizontal: spacing.lg, paddingTop: 160 },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.md },
  subtitle: { ...typography.bodySmall, color: colors.text, textAlign: "center", marginTop: spacing.sm },
  button: { alignSelf: "stretch", height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  buttonText: { color: colors.white, ...typography.button },
});