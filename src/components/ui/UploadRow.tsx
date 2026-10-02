import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";
import type { PickedFile } from "./UploadBox";

type UploadRowProps = {
  placeholder: string;
  file: PickedFile | null;
  onChange: (file: PickedFile | null) => void;
};

export default function UploadRow({ placeholder, file, onChange }: UploadRowProps) {
  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/png", "image/jpeg"],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    onChange({ uri: asset.uri, name: asset.name, size: asset.size, mimeType: asset.mimeType });
  };

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={file?.name ?? ""}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        editable={false}
      />
      <Pressable style={styles.button} onPress={pick}>
        <Ionicons name="cloud-upload-outline" size={20} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", height: 56 },
  input: { flex: 1, borderWidth: 1, borderColor: colors.border, borderTopLeftRadius: radius.md, borderBottomLeftRadius: radius.md, paddingHorizontal: spacing.md, height: 56, fontSize: typography.body.fontSize, color: colors.text },
  button: { width: 56, height: 56, backgroundColor: colors.primary, borderTopRightRadius: radius.md, borderBottomRightRadius: radius.md, alignItems: "center", justifyContent: "center" },
});