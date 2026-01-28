import colors from '@/styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface StepHeaderProps {
    currentStep: number;
    totalSteps: number;
    onBack?: () => void;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ currentStep, totalSteps, onBack }) => {
    const handleBack = onBack || (() => router.back());

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                <Ionicons name="arrow-back" size={28} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${(currentStep / totalSteps) * 100}%` }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 60,
        gap: 16,
        marginBottom: 24,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.blue[50],
        alignItems: "center",
        justifyContent: "center",
    },
    progressBar: {
        flex: 1,
        height: 12,
        backgroundColor: colors.blue[100],
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: "100%",
        backgroundColor: colors.primary,
        borderRadius: 6,
    },
});
