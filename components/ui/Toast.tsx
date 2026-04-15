import colors from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastType = "success" | "error" | "info";

export type ToastProps = {
    message: string;
    type: ToastType;
    visible: boolean;
};

const CONFIG: Record<ToastType, { bg: string; border: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string }> = {
    success: {
        bg: colors.green[50],
        border: colors.primary,
        icon: "checkmark-circle",
        iconColor: colors.primary,
    },
    error: {
        bg: "#FFF0F0",
        border: colors.red,
        icon: "close-circle",
        iconColor: colors.red,
    },
    info: {
        bg: colors.blue[50],
        border: colors.secondary,
        icon: "information-circle",
        iconColor: colors.secondary,
    },
};

export const Toast = ({ message, type, visible }: ToastProps) => {
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(-120)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const config = CONFIG[type];

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 200,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -120,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: config.bg,
                    borderLeftColor: config.border,
                    top: insets.top + 12,
                },
                { transform: [{ translateY }], opacity },
            ]}
        >
            <Ionicons name={config.icon} size={22} color={config.iconColor} />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 16,
        right: 16,
        zIndex: 9999,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
        color: colors.onSurface,
        lineHeight: 20,
    },
});
