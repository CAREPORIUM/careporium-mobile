import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

export default function ResetPasswordScreen() {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/[^0-9]/g, "").slice(0, 6));
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.title}>Reset Password</Text>

      <Text style={styles.subtitle}>
        Enter the OTP sent to your email and phone number.
      </Text>

      <Pressable
        style={styles.codeRow}
        onPress={() => inputRef.current?.focus()}
        accessibilityLabel="Enter six-digit verification code"
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            style={[
              styles.codeBox,
              code.length === index && styles.activeCodeBox,
            ]}
          >
            <Text style={styles.digit}>
              {code[index] ?? ""}
            </Text>
          </View>
        ))}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleCodeChange}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus={false}
        caretHidden
        accessibilityLabel="Verification code"
        style={styles.hiddenInput}
      />

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Didn't receive the code?{" "}
        </Text>

        <Pressable onPress={() => setCode("")}>
          <Text style={styles.resendLink}>Resend (00:30)</Text>
        </Pressable>
      </View>

      <PrimaryButton
        title="Verify"
        onPress={() => router.push("/create-password")}
        disabled={code.length !== 6}
        style={styles.verifyButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
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
  title: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.xl,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text,
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl,
  },
  codeBox: {
    width: 46,
    height: 58,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  activeCodeBox: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  digit: {
    ...typography.h3,
    color: colors.text,
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    opacity: 0,
  },
  resendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  resendText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  resendLink: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "600",
  },
  verifyButton: {
    alignSelf: "stretch",
    marginTop: spacing.xl,
  },
});