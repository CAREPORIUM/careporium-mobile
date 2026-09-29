import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function RoleSelection() {
  const router = useRouter();

  const handleHealthcareProfessional = () => {
    router.push("/signup");
  };

  const handleHealthcareFacility = () => {
    Alert.alert("Coming soon");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Choose how you want to create your account
      </Text>

      <View style={styles.buttons}>
        <PrimaryButton
          title="I'm a Healthcare Professional"
          onPress={handleHealthcareProfessional}
        />

        <PrimaryButton
          title="Healthcare Facility"
          onPress={handleHealthcareFacility}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },

  buttons: {
    gap: 16,
  },
});










