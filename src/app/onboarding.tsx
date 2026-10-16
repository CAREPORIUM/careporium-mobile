import { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Pressable } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { colors, spacing, typography } from "@/constants/theme";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const SLIDES = [
  { image: require("@/assets/onboarding/slide1.jpg"), title: "Find the right Opportunities.", text: "Discover flexible shifts, explore trusted facilities, and take control of your careers." },
  { image: require("@/assets/onboarding/slide2.jpg"), title: "Hire with Confidence.", text: "Connect with verified and professionals, view transparent details, and fill shift quickly." },
  { image: require("@/assets/onboarding/slide3.jpg"), title: "Find the right Healthcare Professionals for your facility.", text: "Careporium brings healthcare facilities and professionals togethers, for safer hiring, and better opportunities." },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const next = () => (isLast ? router.replace("/login") : setIndex(index + 1));
  const skip = () => router.replace("/login");
  const back = () => setIndex(Math.max(0, index - 1));
  
  const { user, loading } = useAuth();

if (loading) return null; // wait while the saved session loads
if (user?.role === "worker") return <Redirect href="/(tabs)" />;
if (user?.role === "admin") return <Redirect href="/admin" />;

  return (
    <View style={styles.container}>
      <ImageBackground source={slide.image} style={styles.image} />
      <View style={styles.sheet}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.text}>{slide.text}</Text>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <PrimaryButton title={isLast ? "Get Started" : "Next"} onPress={next} style={{ marginTop: spacing.md }} />
        <Pressable onPress={isLast ? back : skip} style={{ marginTop: spacing.sm }}>
          <SecondaryButton title={isLast ? "Back" : "Skip"} onPress={isLast ? back : skip} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  image: { flex: 1 },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, marginTop: -24 },
  title: { ...typography.h2, color: colors.text },
  text: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginVertical: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderLight },
  dotActive: { backgroundColor: colors.primary },
});