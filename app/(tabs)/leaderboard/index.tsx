import { getLeaderboard, LeaderboardEntry } from '@/lib/database/leaderboard';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import colors from '../../../styles/colors';

const MEDAL_COLORS = {
    1: '#F59E0B', // or
    2: '#9CA3AF', // argent
    3: '#CD7F32', // bronze
} as const;

const MEDAL_LABELS = { 1: '🥇', 2: '🥈', 3: '🥉' } as const;

function PodiumCard({ entry, currentUserId }: { entry: LeaderboardEntry; currentUserId: string | null }) {
    const isMe = entry.id === currentUserId;
    const color = MEDAL_COLORS[entry.rank as 1 | 2 | 3];
    const heights = { 1: 130, 2: 105, 3: 90 };
    const height = heights[entry.rank as 1 | 2 | 3];

    return (
        <View style={[styles.podiumCard, isMe && styles.podiumCardMe, { borderTopColor: color, height }]}>
            <Text style={[styles.podiumMedal]}>{MEDAL_LABELS[entry.rank as 1 | 2 | 3]}</Text>
            <Text style={styles.podiumName} numberOfLines={1}>
                {entry.first_name || entry.username}
            </Text>
            <Text style={[styles.podiumLevel, { color }]}>Niv. {entry.level}</Text>
            <Text style={styles.podiumXP}>{entry.points} XP</Text>
        </View>
    );
}

function RankRow({ entry, currentUserId }: { entry: LeaderboardEntry; currentUserId: string | null }) {
    const isMe = entry.id === currentUserId;

    return (
        <View style={[styles.rankRow, isMe && styles.rankRowMe]}>
            <Text style={[styles.rankNumber, isMe && styles.rankNumberMe]}>
                {entry.rank}
            </Text>
            <View style={styles.rankAvatar}>
                <Text style={styles.rankAvatarText}>
                    {(entry.first_name || entry.username || '?')[0].toUpperCase()}
                </Text>
            </View>
            <View style={styles.rankInfo}>
                <Text style={[styles.rankName, isMe && styles.rankNameMe]} numberOfLines={1}>
                    {entry.first_name || entry.username}
                    {isMe && <Text style={styles.youBadge}> (moi)</Text>}
                </Text>
                <Text style={styles.rankLevel}>Niveau {entry.level}</Text>
            </View>
            <Text style={[styles.rankXP, isMe && styles.rankXPMe]}>{entry.points} XP</Text>
        </View>
    );
}

export default function LeaderboardTab() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            const [{ data: { session } }, { data }] = await Promise.all([
                supabase.auth.getSession(),
                getLeaderboard(),
            ]);
            setCurrentUserId(session?.user?.id ?? null);
            setEntries(data);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    const onRefresh = () => {
        setRefreshing(true);
        load();
    };

    const top3 = entries.filter(e => e.rank <= 3);
    const rest = entries.filter(e => e.rank > 3);

    // Ordre podium : 2 - 1 - 3
    const podiumOrder = [
        top3.find(e => e.rank === 2),
        top3.find(e => e.rank === 1),
        top3.find(e => e.rank === 3),
    ].filter(Boolean) as LeaderboardEntry[];

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Classement</Text>
                <Text style={styles.subtitle}>Top 10 des apprenants</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {/* Podium top 3 */}
                {podiumOrder.length > 0 && (
                    <View style={styles.podiumRow}>
                        {podiumOrder.map(entry => (
                            <PodiumCard
                                key={entry.id}
                                entry={entry}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </View>
                )}

                {/* Séparateur */}
                {rest.length > 0 && (
                    <View style={styles.separator}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>Suite du classement</Text>
                        <View style={styles.separatorLine} />
                    </View>
                )}

                {/* Positions 4-10 */}
                {rest.map(entry => (
                    <RankRow
                        key={entry.id}
                        entry={entry}
                        currentUserId={currentUserId}
                    />
                ))}

                {entries.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Aucun classement disponible</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#000000',
        opacity: 0.6,
    },
    scrollContent: {
        paddingBottom: 120,
    },

    // Podium
    podiumRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 20,
        gap: 10,
        marginTop: 8,
        marginBottom: 8,
    },
    podiumCard: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 20,
        borderTopWidth: 4,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    podiumCardMe: {
        shadowOpacity: 0.18,
        elevation: 6,
    },
    podiumMedal: {
        fontSize: 24,
        marginBottom: 4,
    },
    podiumName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
    },
    podiumLevel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    podiumXP: {
        fontSize: 11,
        color: '#000000',
        opacity: 0.5,
        marginTop: 2,
    },

    // Séparateur
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 16,
        gap: 10,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    separatorText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',
        opacity: 0.4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Rows 4-10
    rankRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 14,
        backgroundColor: colors.background,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        gap: 12,
    },
    rankRowMe: {
        backgroundColor: colors.green[50],
        shadowOpacity: 0.1,
    },
    rankNumber: {
        width: 24,
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        opacity: 0.4,
        textAlign: 'center',
    },
    rankNumberMe: {
        color: colors.primary,
        opacity: 1,
    },
    rankAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.green[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankAvatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    rankInfo: {
        flex: 1,
    },
    rankName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
    },
    rankNameMe: {
        color: colors.primary,
    },
    youBadge: {
        fontSize: 12,
        fontWeight: '400',
        color: colors.primary,
        opacity: 0.7,
    },
    rankLevel: {
        fontSize: 12,
        color: '#000000',
        opacity: 0.5,
        marginTop: 1,
    },
    rankXP: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
    },
    rankXPMe: {
        color: colors.primary,
    },
    emptyState: {
        padding: 60,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#000000',
        opacity: 0.4,
    },
});
