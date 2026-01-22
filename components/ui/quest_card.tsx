import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';
import { Quest, QuestProgress } from '@/lib/types';

type QuestCardProps = {
    quest: Quest;
    progress: QuestProgress;
    completed: boolean;
    onClaim: (quest: Quest) => void;
};

export default function QuestCard({ quest, progress, completed, onClaim }: QuestCardProps) {
    const canClaim = progress.is_completed && !completed;
    const progressPercentage = (progress.current / progress.target) * 100;

    return (
        <View style={[styles.questCard, completed && styles.completedCard]}>
            <View style={styles.cardHeader}>
                <Text style={styles.questIcon}>{quest.icon || '🎯'}</Text>
                <View style={styles.headerText}>
                    <Text style={styles.questTitle}>{quest.title}</Text>
                    {quest.required_level && quest.required_level > 1 && (
                        <Text style={styles.requiredLevel}>Niveau {quest.required_level} requis</Text>
                    )}
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
                    {progress.current} / {progress.target}
                </Text>
            </View>

            {/* Récompense et bouton */}
            <View style={styles.footer}>
                <View style={styles.rewardContainer}>
                    <Text style={styles.rewardLabel}>Récompense</Text>
                    <Text style={styles.rewardValue}>+{quest.reward_xp} XP</Text>
                </View>

                {completed ? (
                    <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✓ Terminée</Text>
                    </View>
                ) : canClaim ? (
                    <TouchableOpacity
                        style={styles.claimButton}
                        onPress={() => onClaim(quest)}
                        activeOpacity={0.8}
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
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginHorizontal: 20,
        marginVertical: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: colors.primary + '20',
    },
    completedCard: {
        opacity: 0.7,
        borderColor: '#10B981' + '40',
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
        color: colors.onSurface,
        marginBottom: 2,
    },
    requiredLevel: {
        fontSize: 11,
        color: colors.primary,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    questDescription: {
        fontSize: 14,
        color: colors.onSurface,
        opacity: 0.7,
        lineHeight: 20,
        marginBottom: 16,
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: colors.primary + '20',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    completedProgressFill: {
        backgroundColor: '#10B981',
    },
    progressText: {
        fontSize: 12,
        color: colors.onSurface,
        opacity: 0.6,
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
        color: colors.onSurface,
        opacity: 0.5,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    rewardValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F59E0B',
    },
    claimButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
    claimButtonText: {
        color: colors.onPrimary,
        fontSize: 14,
        fontWeight: '700',
    },
    completedBadge: {
        backgroundColor: '#10B981' + '20',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    completedText: {
        color: '#10B981',
        fontSize: 13,
        fontWeight: '700',
    },
    inProgressBadge: {
        backgroundColor: colors.primary + '10',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    inProgressText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '600',
    },
});
