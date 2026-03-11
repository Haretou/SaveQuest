import { Quest, QuestStates } from '@/lib/types';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';

type QuestCardProps = {
    quest: Quest;
    progress: QuestStates;
    completed: boolean;
    onClaim: (quest: Quest) => void;
};

export default function QuestCard({ quest, progress, completed, onClaim }: QuestCardProps) {
    const [isPressed, setIsPressed] = useState(false);
    const canClaim = progress.is_complete && !completed;
    const progressPercentage = (progress.step_progress / quest.steps) * 100;

    return (
        <View style={[styles.questCard, (completed || canClaim) && styles.completedCard]}>
            <View style={styles.cardHeader}>
                <View style={styles.headerText}>
                    <Text style={styles.questTitle}>{quest.title}</Text>
                    
                </View>
            </View>

            <Text style={styles.questDescription}>{quest.description}</Text>

            {/* Barre de progression */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${Math.min(progressPercentage, 100)}%` },
                            completed && styles.completedProgressFill
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {progress.step_progress} / {quest.steps}
                </Text>
            </View>

            {/* Récompense et bouton */}
            <View style={styles.footer}>
                <View style={styles.rewardContainer}>
                    <Text style={styles.rewardLabel}>Récompense</Text>
                    <Text style={styles.rewardValue}>+{quest.xp_gain} XP</Text>
                </View>

                {completed ? (
                    <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✓ Terminée</Text>
                    </View>
                ) : canClaim ? (
                    <TouchableOpacity
                        style={[
                            styles.claimButton,
                            isPressed && styles.claimButtonPressed
                        ]}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                        onPress={() => onClaim(quest)}
                        activeOpacity={1}
                    >
                        <Text style={styles.claimButtonText}>Réclamer</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.inProgressBadge}>
                        <Text style={styles.inProgressText}>En cours</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    questCard: {
        backgroundColor: colors.background,            // Blanc - style Figma
        borderRadius: 20,                              // Corners arrondis - style Figma
        marginHorizontal: 20,
        marginVertical: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    completedCard: {
        opacity: 0.6,
        backgroundColor: colors.green[400],            // Vert vibrant - completed style Figma
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    questIcon: {
        fontSize: 36,
    },
    headerText: {
        flex: 1,
    },
    questTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',                              // Noir - style Figma
        marginBottom: 2,
    },
    requiredLevel: {
        fontSize: 11,
        color: '#000000',                              // Noir - style Figma
        opacity: 0.5,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    questDescription: {
        fontSize: 14,
        color: '#000000',                              // Noir - style Figma
        opacity: 0.6,
        lineHeight: 20,
        marginBottom: 16,
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E7EB',                    // Gris léger - background barre
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.green[500],            // Vert vibrant - progression
        borderRadius: 4,
    },
    completedProgressFill: {
        backgroundColor: colors.green[600],            // Vert foncé - completed
    },
    progressText: {
        fontSize: 12,
        color: '#000000',                              // Noir - style Figma
        opacity: 0.5,
        textAlign: 'right',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rewardContainer: {
        gap: 2,
    },
    rewardLabel: {
        fontSize: 11,
        color: '#000000',                              // Noir - style Figma
        opacity: 0.5,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    rewardValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',                              // Noir - style Figma
    },
    claimButton: {
        backgroundColor: colors.green[500],            // Vert vibrant - bouton claim style Figma
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: colors.green[600],
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,

        elevation: 3,
    },
    claimButtonPressed: {
        shadowOffset: { width: 0, height: 0 },         // Ombre réduite quand pressé
        shadowOpacity: 0.15,
        transform: [{ translateY: 2 }],                // Légère descente pour effet 3D
        elevation: 2,
    },
    claimButtonText: {
        color: '#000000',                              // Noir sur vert - style Figma
        fontSize: 14,
        fontWeight: '700',
    },
    completedBadge: {
        backgroundColor: colors.green[500],            // Vert vibrant - badge completed
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        opacity: 0.7,
    },
    completedText: {
        color: '#000000',                              // Noir - texte completed
        fontSize: 13,
        fontWeight: '700',
    },
    inProgressBadge: {
        backgroundColor: '#E5E7EB',                    // Gris léger - badge en cours
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    inProgressText: {
        color: '#000000',                              // Noir - texte en cours
        fontSize: 13,
        fontWeight: '600',
    },
});
