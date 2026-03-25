import { AuthButton } from "@/components/auth/AuthButton";
import { RegisterInput } from "@/components/auth/RegisterInput";
import { StepHeader } from "@/components/auth/StepHeader";
import { REGISTER_STEPS } from "@/constants/RegisterSteps";
import { useToast } from "@/context/ToastContext";
import { Register, UserProfileData } from "@/lib/database/user";
import colors from "@/styles/colors";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Dimensions, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

const { width } = Dimensions.get("window");

export const RegisterPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<any>({});
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const { showToast } = useToast();

    const config = REGISTER_STEPS[currentStep];
    const value = formData[config.key] || "";

    const animate = (toValue: number, nextStep: number) => {
        Animated.timing(slideAnim, { toValue, duration: 250, useNativeDriver: true }).start(() => {
            setCurrentStep(nextStep);
            setError("");
            setShowPassword(false);
            slideAnim.setValue(-toValue);
            Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
        });
    };

    const handleNext = async () => {
        Keyboard.dismiss();
        if (!config.optional && !value.trim()) return setError("Ce champ est requis");
        if (config.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return setError("Email invalide");
        if (config.id === "password" && value.length < 6) return setError("Minimum 6 caractères");
        if (config.id === "confirmPassword" && value !== formData.password) return setError("Les mots de passe ne correspondent pas");
        if (config.id === "username" && !/^[a-zA-Z0-9_]+$/.test(value)) return setError("Lettres, chiffres et _ uniquement");
        if (config.id === "age" && value.trim() && (parseInt(value) < 13 || parseInt(value) > 120)) return setError("Âge invalide (13–120)");

        if (currentStep === REGISTER_STEPS.length - 1) {
            setIsLoading(true);
            try {
                const profileData: UserProfileData = {
                    username: formData.username, firstName: formData.firstName, lastName: formData.lastName,
                    age: parseInt(formData.age) || 0, monthlyIncome: parseFloat(formData.monthlyIncome) || 0, city: formData.city,
                };
                await Register(formData.email, formData.password, profileData);
                router.replace("/(auth)/login");
                showToast({
                    message: "Compte créé ! Confirme ton adresse mail avant de te connecter.",
                    type: "info",
                    duration: 6000,
                });
            } catch (e: any) { setError(e.message); setIsLoading(false); }
        } else animate(-width, currentStep + 1);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <StepHeader
                    currentStep={currentStep + 1}
                    totalSteps={REGISTER_STEPS.length}
                    onBack={() => currentStep === 0 ? router.replace("/?startStep=2") : animate(width, currentStep - 1)}
                />

                <Animated.View style={[styles.content, { transform: [{ translateX: slideAnim }] }]}>
                    {config.optional && <View style={styles.optionalBadge}><Text style={styles.optionalText}>Optionnel</Text></View>}
                    <Text style={styles.title}>{config.title}</Text>
                    <RegisterInput config={config} value={value} onChange={(t) => { setFormData({ ...formData, [config.key]: t }); setError(""); }} showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} error={!!error} />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </Animated.View>

                <View style={styles.footer}>
                    <View style={styles.loginRow}>
                        <Text style={styles.loginLabel}>Déjà un compte ?</Text>
                        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                            <Text style={styles.loginLink}>Se connecter</Text>
                        </TouchableOpacity>
                    </View>

                    <AuthButton title={currentStep === REGISTER_STEPS.length - 1 ? "Terminer" : "Continuer"} onPress={handleNext} isLoading={isLoading} />

                    {config.optional && (
                        <TouchableOpacity style={styles.skipBtn} onPress={handleNext} disabled={isLoading}>
                            <Text style={styles.skipText}>Passer</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
    optionalBadge: { backgroundColor: colors.blue[100], paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: "flex-start", marginBottom: 16 },
    optionalText: { fontSize: 12, fontWeight: "700", color: colors.blue[800] },
    title: { fontSize: 28, fontWeight: "900", color: colors.text, marginBottom: 32 },
    errorText: { color: colors.error, fontSize: 14, marginTop: 8, fontWeight: "700" },
    footer: { padding: 24, paddingBottom: 40, gap: 12 },
    skipBtn: { alignItems: "center" },
    skipText: { fontSize: 16, fontWeight: "700", color: colors.text, opacity: 0.5 },
    loginRow: { flexDirection: "row", justifyContent: "center", marginBottom: 4, gap: 8 },
    loginLabel: { fontSize: 14, color: colors.text, fontWeight: "600", opacity: 0.7 },
    loginLink: { fontSize: 14, color: colors.primary, fontWeight: "800" },
});
