import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

export default function CreatePasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const hasLength = password.length >= 8;
  const hasCase =
    /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberOrSpecial =
    /[0-9]|[^A-Za-z0-9]/.test(password);

  const passwordsMatch =
    password.length > 0 && password === confirmPassword;

  const canReset =
    hasLength &&
    hasCase &&
    hasNumberOrSpecial &&
    passwordsMatch;

  const renderRule = (passed: boolean, label: string) => (
    <View style={styles.rule} key={label}>
      <Ionicons
        name={
          passed
            ? "checkmark-circle"
            : "ellipse-outline"
        }
        size={19}
        color={passed ? colors.success : colors.placeholder}
      />
      <Text
        style={[
          styles.ruleText,
          passed && styles.passedRuleText,
        ]}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable
        style={styles.backButton}
        onPress={() => goBack("/login")}
        accessibilityLabel="Go back"
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color={colors.text}
        />
      </Pressable>

      <View style={styles.lockCircle}>
        <Ionicons
          name="lock-closed-outline"
          size={34}
          color={colors.primary}
        />
      </View>

      <Text style={styles.title}>Create New Password</Text>

      <Text style={styles.subtitle}>
        Your new password must be strong and secure.
      </Text>

      <Text style={styles.label}>New Password</Text>

      <AppInput
        placeholder="Enter new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={hidePassword}
        leftIcon={
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={colors.placeholder}
          />
        }
        rightIcon={
          <Pressable
            onPress={() => setHidePassword(!hidePassword)}
            accessibilityLabel={
              hidePassword ? "Show password" : "Hide password"
            }
          >
            <Ionicons
              name={
                hidePassword ? "eye-off-outline" : "eye-outline"
              }
              size={20}
              color={colors.placeholder}
            />
          </Pressable>
        }
      />

      <Text style={styles.label}>Confirm Password</Text>

      <AppInput
        placeholder="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={hideConfirmPassword}
        leftIcon={
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={colors.placeholder}
          />
        }
        rightIcon={
          <Pressable
            onPress={() =>
              setHideConfirmPassword(!hideConfirmPassword)
            }
            accessibilityLabel={
              hideConfirmPassword
                ? "Show confirm password"
                : "Hide confirm password"
            }
          >
            <Ionicons
              name={
                hideConfirmPassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={20}
              color={colors.placeholder}
            />
          </Pressable>
        }
      />

      <View style={styles.rulesContainer}>
        {renderRule(hasLength, "At least 8 characters")}
        {renderRule(hasCase, "Uppercase and lowercase letters")}
        {renderRule(
          hasNumberOrSpecial,
          "A number or special character"
        )}
      </View>

      {confirmPassword.length > 0 && !passwordsMatch && (
        <Text style={styles.errorText}>
          Passwords do not match.
        </Text>
      )}

      <PrimaryButton
        title="Reset Password"
        onPress={() => router.replace("/login")}
        disabled={!canReset}
        style={styles.resetButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 50,
    paddingBottom: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  lockCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  label: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    fontWeight: "600",
  },
  rulesContainer: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  rule: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  ruleText: {
    ...typography.bodySmall,
    color: colors.placeholder,
  },
  passedRuleText: {
    color: colors.success,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.md,
  },
  resetButton: {
    alignSelf: "stretch",
    marginTop: spacing.xl,
  },
});