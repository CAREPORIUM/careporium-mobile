import { View, Text, Pressable, Image, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";

export type PickedFile = { uri: string; name: string; size?: number; mimeType?: string };

type UploadBoxProps = {
  file: PickedFile | null;
  onChange: (file: PickedFile | null) => void;
  height?: number;
};

const MAX_BYTES = 10 * 1024 * 1024; // 10MB, as shown in the design

export default function UploadBox({ file, onChange, height = 200 }: UploadBoxProps) {
  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/png", "image/jpeg"],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset.size && asset.size > MAX_BYTES) {
      Alert.alert("File too large", "Please choose a file under 10MB.");
      return;
    }
    onChange({ uri: asset.uri, name: asset.name, size: asset.size, mimeType: asset.mimeType });
  };

  if (!file) {
    return (
      <Pressable style={[styles.box, { height }]} onPress={pick}>
        <Ionicons name="cloud-upload-outline" size={32} color={colors.primary} />
        <Text style={styles.title}>Tap to upload</Text>
        <Text style={styles.hint}>PDF, PNG, JPG (Max 10MB)</Text>
      </Pressable>
    );
  }

  const isImage = file.mimeType?.startsWith("image/");
  const sizeText = file.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "";

  return (
    <View style={[styles.box, { minHeight: height }]}>
      <Pressable style={styles.remove} onPress={() => onChange(null)} hitSlop={10}>
        <Ionicons name="close-circle-outline" size={24} color={colors.text} />
      </Pressable>
      {isImage ? (
        <Image source={{ uri: file.uri }} style={styles.preview} resizeMode="contain" />
      ) : (
        <Ionicons name="document-text-outline" size={64} color={colors.primary} />
      )}
      <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
      {sizeText ? <Text style={styles.fileSize}>{sizeText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  title: { ...typography.label, color: colors.text, marginTop: spacing.sm },
  hint: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  remove: { position: "absolute", top: 8, right: 8, zIndex: 1 },
  preview: { width: "100%", height: 140, marginBottom: spacing.sm },
  fileName: { ...typography.bodySmall, color: colors.text, fontWeight: "600" },
  fileSize: { ...typography.bodySmall, color: colors.textSecondary },
});