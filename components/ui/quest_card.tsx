import { Quest, QuestStates } from '@/lib/types';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import colors from '../../styles/colors';

type QuestCardProps = {
    quest: Quest;
    progress: QuestStates;
    completed: boolean;
    onClaim: (quest: Quest) => Promise<void>;
};

function parseBadgeName(badgeName?: string): { emoji: string; label: string } {
    if (!badgeName) return { emoji: '🏅', label: 'Badge' };
    const spaceIndex = badgeName.indexOf(' ');
    if (spaceIndex === -1) return { emoji: badgeName, label: '' };
    return {
        emoji: badgeName.slice(0, spaceIndex),
        label: badgeName.slice(spaceIndex + 1),
    };
}

export default function QuestCard({ quest, progress, completed, onClaim }: QuestCardProps) {
    const [isPressed, setIsPressed] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const isBadge = quest.reward_type === 'badge';
    const canClaim = progress.is_complete && !completed;
    const progressPercentage = (progress.step_progress / quest.steps) * 100;
    const badge = isBadge ? parseBadgeName(quest.badge_name) : null;

    return (
        <View style={[
            styles.questCard,
            (completed || canClaim) && styles.completedCard,
        ]}>
            <View style={styles.cardHeader}>
                <View style={styles.headerText}>
                    <Text style={styles.questTitle}>{quest.title}</Text>
                </View>
                {isBadge && badge && (
                    <View style={[styles.badgeIcon, completed && styles.badgeIconCompleted]}>
                        <Text style={styles.badgeIconEmoji}>{badge.emoji}</Text>
                    </View>
                )}
            </View>

            <Text style={styles.questDescription}>{quest.description}</Text>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${Math.min(progressPercentage, 100)}%` },
                            completed && styles.completedProgressFill,
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {progress.step_progress} / {quest.steps}
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.rewardContainer}>
                    <Text style={styles.rewardLabel}>Récompense</Text>
                    {isBadge && badge ? (
                        <Text style={styles.rewardBadgeText}>{badge.label}</Text>
                    ) : (
                        <Text style={styles.rewardValue}>+{quest.xp_gain} XP</Text>
                    )}
                </View>

                {completed ? (
                    <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>
                            {isBadge ? '✓ Obtenu' : '✓ Terminée'}
                        </Text>
                    </View>
                ) : canClaim ? (
                    <TouchableOpacity
                        style={[
                            styles.claimButton,
                            (isPressed || isClaiming) && styles.claimButtonPressed,
                        ]}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                        onPress={async () => {
                            if (isClaiming) return;
                            setIsClaiming(true);
                            try {
                                await onClaim(quest);
                            } finally {
                                setIsClaiming(false);
                            }
                        }}
                        activeOpacity={1}
                        disabled={isClaiming}
                    >
                        <Text style={styles.claimButtonText}>
                            {isClaiming ? '...' : isBadge ? 'Obtenir' : 'Réclamer'}
                        </Text>
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
        backgroundColor: colors.background,
        borderRadius: 20,
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
        backgroundColor: colors.green[400],
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    headerText: {
        flex: 1,
    },
    questTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 2,
    },
    badgeIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.green[50],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.green[200],
    },
    badgeIconCompleted: {
        backgroundColor: colors.green[500],
        borderColor: colors.green[600],
    },
    badgeIconEmoji: {
        fontSize: 26,
    },
    questDescription: {
        fontSize: 14,
        color: '#000000',
        opacity: 0.6,
        lineHeight: 20,
        marginBottom: 16,
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.green[500],
        borderRadius: 4,
    },
    completedProgressFill: {
        backgroundColor: colors.green[600],
    },
    progressText: {
        fontSize: 12,
        color: '#000000',
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
        color: '#000000',
        opacity: 0.5,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    rewardValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
    },
    rewardBadgeText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.primary,
    },
    claimButton: {
        backgroundColor: colors.green[500],
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: colors.green[600],
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 3,
    },
    claimButtonPressed: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        transform: [{ translateY: 2 }],
        elevation: 2,
    },
    claimButtonText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '700',
    },
    completedBadge: {
        backgroundColor: colors.green[500],
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        opacity: 0.7,
    },
    completedText: {
        color: '#000000',
        fontSize: 13,
        fontWeight: '700',
    },
    inProgressBadge: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    inProgressText: {
        color: '#000000',
        fontSize: 13,
        fontWeight: '600',
    },
});
