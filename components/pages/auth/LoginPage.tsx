import { AuthButton } from "@/components/auth/AuthButton";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { useToast } from "@/context/ToastContext";
import { Login, ResendConfirmationEmail } from "@/lib/database/user";
import colors from "@/styles/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

const RESEND_COOLDOWN = 60;

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);
    const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
    }, []);

    const startCooldown = () => {
        setResendCooldown(RESEND_COOLDOWN);
        cooldownRef.current = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleLogin = async () => {
        if (!email || !password) return setError("Veuillez remplir tous les champs");
        setError("");
        setEmailNotConfirmed(false);
        setLoginFailed(false);
        setIsLoading(true);
        try {
            await Login(email, password);
            router.replace("/(tabs)/learning");
        } catch (e: any) {
            const msg: string = e.message ?? "";
            if (msg.toLowerCase().includes("email not confirmed") || msg.toLowerCase().includes("not confirmed")) {
                setEmailNotConfirmed(true);
            } else {
                setError(msg || "Erreur inconnue");
                setLoginFailed(true);
            }
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            setError("Saisis ton adresse email pour renvoyer le lien");
            return;
        }
        setIsResending(true);
        try {
            await ResendConfirmationEmail(email);
            showToast({ message: "Email de confirmation renvoyé ! Vérifie ta boîte mail.", type: "success" });
            startCooldown();
        } catch {
            showToast({ message: "Impossible d'envoyer l'email, réessaie plus tard.", type: "error" });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.content}>
                    <AuthHeader appName="Gratt App" logoLetter="G" />
                    <Text style={styles.title}>Connexion</Text>

                    <AuthInput label="Email" icon="mail-outline" placeholder="exemple@email.com" value={email} onChangeText={(t) => { setEmail(t); setEmailNotConfirmed(false); setLoginFailed(false); setError(""); }} keyboardType="email-address" autoCapitalize="none" />
                    <AuthInput label="Mot de passe" icon="lock-closed-outline" placeholder="•••••••••••" value={password} onChangeText={setPassword} secureTextEntry={!showPassword}
                        rightElement={<TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color={colors.primary} /></TouchableOpacity>}
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {loginFailed && !emailNotConfirmed && (
                        <TouchableOpacity onPress={() => { setEmailNotConfirmed(true); setLoginFailed(false); setError(""); }} style={styles.confirmHint}>
                            <Ionicons name="mail-outline" size={11} color={colors.onSurface} />
                            <Text style={styles.confirmHintText}>Tu n'as pas confirmé ton adresse email ?</Text>
                        </TouchableOpacity>
                    )}

                    {emailNotConfirmed && (
                        <View style={styles.confirmBanner}>
                            <Ionicons name="mail-unread-outline" size={20} color={colors.secondary} style={styles.bannerIcon} />
                            <View style={styles.bannerBody}>
                                <Text style={styles.bannerTitle}>Email non confirmé</Text>
                                <Text style={styles.bannerText}>
                                    Consulte ta boîte mail et clique sur le lien de confirmation.
                                </Text>
                                <View style={styles.bannerActions}>
                                    <TouchableOpacity
                                        onPress={handleResend}
                                        disabled={resendCooldown > 0 || isResending}
                                        style={[styles.resendBtn, (resendCooldown > 0 || isResending) && styles.resendBtnDisabled]}
                                    >
                                        <Text style={styles.resendBtnText}>
                                            {isResending
                                                ? "Envoi…"
                                                : resendCooldown > 0
                                                    ? `Renvoyer (${resendCooldown}s)`
                                                    : "Renvoyer l'email"}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { setEmailNotConfirmed(false); handleLogin(); }}
                                        style={styles.alreadyConfirmedBtn}
                                    >
                                        <Ionicons name="checkmark-circle-outline" size={13} color={colors.primary} />
                                        <Text style={styles.alreadyConfirmedText}>J'ai déjà confirmé</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}

                    <AuthButton title="Se connecter" onPress={handleLogin} isLoading={isLoading} />

                    <View style={styles.footerLink}>
                        <Text style={styles.footerText}>Pas encore de compte ?</Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/register")}><Text style={styles.linkText}>S'inscrire</Text></TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
    title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 32, textAlign: "center" },
    errorText: { color: colors.error, fontSize: 14, fontWeight: "700", textAlign: "center", marginBottom: 16 },
    footerLink: { flexDirection: "row", justifyContent: "center", marginTop: 28, gap: 8 },
    footerText: { fontSize: 15, color: colors.text, fontWeight: "600" },
    linkText: { fontSize: 15, color: colors.primary, fontWeight: "800" },

    confirmBanner: {
        flexDirection: "row",
        backgroundColor: colors.blue[50],
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.secondary,
        padding: 14,
        marginBottom: 20,
        gap: 10,
    },
    bannerIcon: { marginTop: 2 },
    bannerBody: { flex: 1, gap: 4 },
    bannerTitle: { fontSize: 14, fontWeight: "800", color: colors.onSurface },
    bannerText: { fontSize: 13, fontWeight: "500", color: colors.onSurface, opacity: 0.8, lineHeight: 18 },
    resendBtn: {
        marginTop: 8,
        alignSelf: "flex-start",
        backgroundColor: colors.secondary,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
    },
    resendBtnDisabled: { opacity: 0.4 },
    resendBtnText: { fontSize: 13, fontWeight: "700", color: colors.onSecondary },
    bannerActions: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 8 },
    alreadyConfirmedBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
    alreadyConfirmedText: { fontSize: 12, fontWeight: "600", color: colors.primary, textDecorationLine: "underline" },

    confirmHint: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 16,
        alignSelf: "center",
        opacity: 0.45,
    },
    confirmHintText: { fontSize: 11, fontWeight: "500", color: colors.onSurface, textDecorationLine: "underline" },
});
