import { AuthButton } from "@/components/auth/AuthButton";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { Login } from "@/lib/database/user";
import colors from "@/styles/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) return setError("Veuillez remplir tous les champs");
        setError("");
        setIsLoading(true);
        try {
            await Login(email, password);
            router.replace("/(tabs)/learning");
        } catch (e: any) {
            setError(e.message || "Erreur de connexion");
            setIsLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.content}>
                    <AuthHeader appName="Gratt App" logoLetter="G" />
                    <Text style={styles.title}>Connexion</Text>

                    <AuthInput label="Email" icon="mail-outline" placeholder="exemple@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <AuthInput label="Mot de passe" icon="lock-closed-outline" placeholder="•••••••••••" value={password} onChangeText={setPassword} secureTextEntry={!showPassword}
                        rightElement={<TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color={colors.primary} /></TouchableOpacity>}
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
});
