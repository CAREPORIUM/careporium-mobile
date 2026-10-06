import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

export default function InvalidCredentialsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons
          name="warning-outline"
          size={48}
          color={colors.error}
        />
      </View>

      <Text style={styles.title}>Invalid Credentials</Text>

      <Text style={styles.subtitle}>
        The email or password you entered is incorrect.
        Please try again.
      </Text>

      <PrimaryButton
        title="Try Again"
        onPress={() => goBack("/login")}
        style={styles.tryAgain}
      />

      <Pressable
        onPress={() => router.push("/reset-password")}
        style={styles.forgotLink}
      >
        <Text style={styles.link}>Forget Password?</Text>
      </Pressable>

      <View style={styles.spacer} />

      <Pressable onPress={() => router.replace("/login")}>
        <Text style={styles.link}>Back to login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.errorLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },

  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: "center",
  },

  subtitle: {
    ...typography.bodySmall,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  tryAgain: {
    backgroundColor: colors.error,
    alignSelf: "stretch",
    marginTop: spacing.lg,
  },

  forgotLink: {
    marginTop: spacing.lg,
  },

  link: {
    ...typography.body,
    color: colors.primary,
  },

  spacer: {
    flex: 1,
  },
});