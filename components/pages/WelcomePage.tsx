import { AuthButton } from "@/components/auth/AuthButton";
import colors from "@/styles/colors";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Text } from "@/components/ui/Text";

const { width } = Dimensions.get("window");

const WELCOME_STEPS = [
  {
    id: 1,
    title: "Bienvenue sur Grat App",
    description:
      "L'application qui vous aide à transformer vos habitudes financières pour de bon.",
    image: require("@/assets/images/icons/hello.png"),
  },
  {
    id: 2,
    title: "Suivez votre argent",
    description:
      "Gérez vos revenus et dépenses en toute simplicité pour ne plus jamais être à découvert.",
    image: require("@/assets/images/icons/coins.png"),
  },
  {
    id: 3,
    title: "Devenez un expert",
    description:
      "Apprenez les meilleures stratégies d'épargne et atteignez vos objectifs sereinement.",
    image: require("@/assets/images/icons/expert.png"),
  },
];

export const WelcomePage = () => {
  const params = useLocalSearchParams<{ startStep?: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialisation sur le step demandé (pour le retour de register)
  useEffect(() => {
    if (params.startStep) {
      const stepIdx = parseInt(params.startStep);
      if (!isNaN(stepIdx) && stepIdx >= 0 && stepIdx < WELCOME_STEPS.length) {
        // On attend un petit peu que le ScrollView soit prêt
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: stepIdx * width,
            animated: false,
          });
          setCurrentStep(stepIdx);
        }, 50);
      }
    }
  }, [params.startStep]);

  const handleNext = () => {
    if (currentStep === WELCOME_STEPS.length - 1) {
      router.replace("/(auth)/register");
    } else {
      const nextStep = currentStep + 1;
      scrollViewRef.current?.scrollTo({ x: nextStep * width, animated: true });
      setCurrentStep(nextStep);
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(scrollOffset / width);
    if (pageIndex !== currentStep) {
      setCurrentStep(pageIndex);
    }
  };

  return (
    <View style={styles.container}>
      {/* ScrollView horizontal pour le swipe au doigt */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {WELCOME_STEPS.map((step) => (
          <View key={step.id} style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image source={step.image} style={styles.image} />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.description}>{step.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer fixe */}
      <View style={styles.footer}>
        <View style={styles.bottomRow}>
          {/* Points de progression au centre */}
          <View style={styles.pagination}>
            {WELCOME_STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentStep === index ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        <AuthButton
          title={
            currentStep === WELCOME_STEPS.length - 1 ? "Commencer" : "Continuer"
          }
          onPress={handleNext}
        />

        <View style={styles.loginRow}>
          <Text style={styles.loginLabel}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  slide: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 52,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 48,
    marginTop: -40,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  textContainer: { alignItems: "center" },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 26,
  },
  footer: { padding: 32, paddingBottom: 50 },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  pagination: { flexDirection: "row", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  activeDot: { backgroundColor: colors.text, width: 24 },
  inactiveDot: { backgroundColor: colors.blue[200] },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    gap: 8,
  },
  loginLabel: { fontSize: 15, color: colors.text, fontWeight: "600" },
  loginLink: { fontSize: 15, color: colors.primary, fontWeight: "800" },
});
