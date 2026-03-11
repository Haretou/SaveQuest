import { StepConfig } from "@/constants/RegisterSteps";
import colors from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface RegisterInputProps {
    config: StepConfig;
    value: string;
    onChange: (text: string) => void;
    showPassword: boolean;
    onTogglePassword: () => void;
    error: boolean;
}

export const RegisterInput: React.FC<RegisterInputProps> = ({ config, value, onChange, showPassword, onTogglePassword, error }) => {
    return (
        <View style={[styles.inputContainer, error && styles.inputError]}>
            {config.prefix && <Text style={styles.prefix}>{config.prefix}</Text>}

            <TextInput
                style={styles.input}
                placeholder={config.placeholder}
                placeholderTextColor={colors.blue[300]}
                value={value}
                onChangeText={onChange}
                keyboardType={config.keyboardType as any || "default"}
                autoCapitalize={config.autoCapitalize as any || "words"}
                secureTextEntry={config.secure && !showPassword}
                autoFocus
                autoCorrect={false}
            />

            {config.secure && (
                <TouchableOpacity onPress={onTogglePassword}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={colors.primary} />
                </TouchableOpacity>
            )}

            {config.suffix && <Text style={styles.suffix}>{config.suffix}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: { flexDirection: "row", alignItems: "center", borderBottomWidth: 2, borderBottomColor: colors.primary },
    inputError: { borderBottomColor: colors.error },
    prefix: { fontSize: 22, fontWeight: "800", color: colors.primary, marginRight: 4 },
    suffix: { fontSize: 22, fontWeight: "800", color: colors.primary, marginLeft: 4 },
    input: { flex: 1, fontSize: 22, fontWeight: "700", color: colors.text, paddingVertical: 16 },
});
