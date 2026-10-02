import { useState } from "react";
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";

type AppSelectProps = {
  placeholder: string;
  value: string | null;
  options: string[];
  onChange: (value: string) => void;
  leftIcon?: React.ReactNode;
};

export default function AppSelect({ placeholder, value, options, onChange, leftIcon }: AppSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.wrapper} onPress={() => setOpen(true)}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <Text style={[styles.text, !value && styles.placeholder]}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.placeholder} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable style={styles.option} onPress={() => { onChange(item); setOpen(false); }}>
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface, paddingHorizontal: spacing.md, height: 56 },
  icon: { marginRight: spacing.sm },
  text: { flex: 1, fontSize: typography.body.fontSize, color: colors.text },
  placeholder: { color: colors.placeholder },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, maxHeight: "50%", paddingVertical: spacing.sm },
  option: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  optionText: { fontSize: typography.body.fontSize, color: colors.text },
});