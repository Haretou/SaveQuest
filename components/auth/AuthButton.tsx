import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface AuthButtonProps extends TouchableOpacityProps {
    title: string;
    isLoading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ title, isLoading, style, ...props }) => {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            activeOpacity={0.8}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color="#003719" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 24,
        marginTop: 12,
        paddingVertical: 18,
        alignItems: "center",
        backgroundColor: "#00FF6F",
        // Drop shadow (Figma: Y=3, Color=#00E564)
        borderBottomWidth: 3,
        borderBottomColor: "#00E564",
        // Inner shadow (Figma: Y=3, Color=#33FF8C)
        borderTopWidth: 3,
        borderTopColor: "#33FF8C",
    },
    text: {
        color: "#003719",
        fontSize: 18,
        fontWeight: "900",
    },
});
