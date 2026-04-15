import { supabase } from "@/lib/supabase";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/Text";

type Status = "loading" | "success" | "error";

/**
 * Expo Go transmet parfois les query params de la deep link
 * dans l'URL brute plutôt que dans useLocalSearchParams.
 * On parse les deux sources pour couvrir dev et prod.
 */
function useConfirmParams(): { token_hash?: string; type?: string } {
    const params = useLocalSearchParams<{ token_hash?: string; type?: string }>();
    const url = Linking.useURL();

    if (params.token_hash && params.type) return params;

    if (url) {
        const { queryParams } = Linking.parse(url);
        return {
            token_hash: queryParams?.token_hash as string | undefined,
            type: queryParams?.type as string | undefined,
        };
    }

    return {};
}

export default function ConfirmScreen() {
    const { token_hash, type } = useConfirmParams();
    const [status, setStatus] = useState<Status>("loading");

    useEffect(() => {
        if (!token_hash || !type) {
            setStatus("error");
            return;
        }
        supabase.auth
            .verifyOtp({ token_hash, type: type as any })
            .then(({ error }) => setStatus(error ? "error" : "success"))
            .catch(() => setStatus("error"));
    }, [token_hash, type]);

    if (status === "loading") {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Confirmation en cours…</Text>
            </View>
        );
    }

    if (status === "success") {
        return (
            <View style={styles.container}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="checkmark-circle" size={72} color={colors.primary} />
                </View>
                <Text style={styles.title}>Email confirmé !</Text>
                <Text style={styles.subtitle}>Ton compte est activé. Tu peux maintenant te connecter.</Text>
                <TouchableOpacity style={styles.btn} onPress={() => router.replace("/(auth)/login")}>
                    <Text style={styles.btnText}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <Ionicons name="close-circle" size={72} color={colors.red} />
            </View>
            <Text style={styles.title}>Lien invalide</Text>
            <Text style={styles.subtitle}>Ce lien de confirmation a expiré ou est déjà utilisé.</Text>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => router.replace("/(auth)/login")}>
                <Text style={styles.btnText}>Retour à la connexion</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        gap: 16,
    },
    iconWrapper: {
        marginBottom: 8,
    },
    loadingText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.onSurface,
        opacity: 0.6,
    },
    title: {
        fontSize: 26,
        fontWeight: "900",
        color: colors.text,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        fontWeight: "500",
        color: colors.onSurface,
        opacity: 0.7,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 8,
    },
    btn: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 24,
        borderTopWidth: 3,
        borderTopColor: "#33FF8C",
        borderBottomWidth: 3,
        borderBottomColor: "#00E564",
        marginTop: 8,
    },
    btnSecondary: {
        backgroundColor: colors.secondary,
        borderTopColor: colors.blue[400],
        borderBottomColor: colors.blue[600],
    },
    btnText: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.onPrimary,
    },
});
