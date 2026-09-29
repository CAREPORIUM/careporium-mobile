import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const roles = [
    "Doctor",
    "Nurse",
    "Pharmacist",
    "Lab Technician",
    "Other",
  ];

  const handleContinue = () => {
    if (
      !name ||
      !email ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Incomplete form", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      Alert.alert(
        "Terms and Conditions",
        "Please accept the terms and conditions."
      );
      return;
    }

    Alert.alert("Success", "Your information has been submitted.");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.step}>Step 1 of 3</Text>

      <Text style={styles.title}>Basic Identity</Text>

      <Text style={styles.label}>Full Name</Text>

      <AppInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Email</Text>

      <AppInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Professional Role</Text>

      <Pressable
        style={styles.dropdown}
        onPress={() => setDropdownVisible(true)}
      >
        <Text
          style={role ? styles.dropdownText : styles.placeholder}
        >
          {role || "Select professional role"}
        </Text>

        <Text style={styles.arrow}>▼</Text>
      </Pressable>

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            <Text style={styles.menuTitle}>
              Select Professional Role
            </Text>

            {roles.map((item) => (
              <Pressable
                key={item}
                style={styles.roleOption}
                onPress={() => {
                  setRole(item);
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.roleText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Text style={styles.label}>Password</Text>

      <AppInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password</Text>

      <AppInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Pressable
        style={styles.checkboxRow}
        onPress={() => setTermsAccepted(!termsAccepted)}
      >
        <View
          style={[
            styles.checkbox,
            termsAccepted && styles.checkboxChecked,
          ]}
        >
          {termsAccepted && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>

        <Text style={styles.termsText}>
          I agree to the terms and conditions
        </Text>
      </Pressable>

      <PrimaryButton
        title="Continue"
        onPress={handleContinue}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },

  step: {
    fontSize: 14,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },

  dropdown: {
    height: 56,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownText: {
    fontSize: 16,
    color: "#111827",
  },

  placeholder: {
    fontSize: 16,
    color: "#9CA3AF",
  },

  arrow: {
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    padding: 24,
  },

  dropdownMenu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },

  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  roleOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  roleText: {
    fontSize: 16,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },

  checkmark: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  termsText: {
    flex: 1,
    fontSize: 14,
  },
});