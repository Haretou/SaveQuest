import { getCategories } from '@/lib/database/categories';
import { claimQuest, getQuests, getQuetesStateByUserId } from '@/lib/database/quests';
import { getUserProfile } from '@/lib/database/userProfile';
import { supabase } from '@/lib/supabase';
import { Quest, QuestCategory, QuestStates } from '@/lib/types';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import QuestCard from '../../../components/ui/quest_card';
import colors from '../../../styles/colors';

type CategoryGroup = {
    category: QuestCategory;
    quests: Quest[];
};

export default function QuestsTab() {
    const [refreshing, setRefreshing] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [groups, setGroups] = useState<CategoryGroup[]>([]);
    const [uncategorized, setUncategorized] = useState<Quest[]>([]);
    const [userQuest, setUserQuest] = useState<QuestStates[]>([]);
    const [completedQuestIds, setCompletedQuestIds] = useState<number[]>([]);

    const loadAll = useCallback(async () => {
        setRefreshing(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const uid = session?.user?.id ?? null;
            setUserId(uid);
            if (!uid) return;

            const [{ data: questsData }, { data: profile }, { data: categoriesData }] = await Promise.all([
                getQuests(),
                getUserProfile(uid),
                getCategories(),
            ]);

            setCompletedQuestIds(profile?.completed_quests ?? []);

            // Grouper les quêtes par catégorie
            const grouped: CategoryGroup[] = categoriesData
                .map(cat => ({
                    category: cat,
                    quests: questsData.filter((q: Quest) => q.category_id === cat.id),
                }))
                .filter(g => g.quests.length > 0);

            const uncat = questsData.filter(
                (q: Quest) => !categoriesData.find(c => c.id === q.category_id)
            );

            setGroups(grouped);
            setUncategorized(uncat);

            // Charger les états de toutes les quêtes
            const allQuests: Quest[] = questsData;
            const states: QuestStates[] = await Promise.all(
                allQuests.map(async (quest: Quest) => {
                    const { data } = await getQuetesStateByUserId(uid, quest.id);
                    return data ?? {
                        id: 0,
                        quest_id: quest.id,
                        user_id: uid,
                        step_progress: 0,
                        is_complete: false,
                    };
                })
            );
            setUserQuest(states);
        } catch (e) {
            console.error('[Quests] loadAll error:', e);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadAll();
        }, [loadAll])
    );

    const handleClaim = async (quest: Quest) => {
        if (!userId) return;
        const { success, message, xpGained } = await claimQuest(userId, quest);
        if (success) {
            setCompletedQuestIds(prev => [...prev, quest.id]);
            setUserQuest(prev =>
                prev.map(uq =>
                    uq.quest_id === quest.id ? { ...uq, is_complete: true } : uq
                )
            );
            if (quest.reward_type === 'badge') {
                Alert.alert('Badge obtenu !', `${quest.badge_name ?? '🏅'} débloqué !`);
            } else {
                Alert.alert('Quête terminée !', `+${xpGained} XP gagnés !`);
            }
        } else {
            Alert.alert('Erreur', message);
        }
    };

    const renderQuestCard = (quest: Quest) => {
        const progress = userQuest.find(uq => uq.quest_id === quest.id) ?? {
            id: 0,
            quest_id: quest.id,
            user_id: userId ?? '',
            step_progress: 0,
            is_complete: false,
        };
        return (
            <QuestCard
                key={quest.id}
                quest={quest}
                progress={progress}
                completed={completedQuestIds.includes(quest.id)}
                onClaim={handleClaim}
            />
        );
    };

    const totalQuests = groups.reduce((acc, g) => acc + g.quests.length, 0) + uncategorized.length;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quêtes</Text>
                <Text style={styles.subtitle}>Complète des quêtes pour gagner de l'XP</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={loadAll}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {totalQuests === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Aucune quête disponible pour le moment</Text>
                    </View>
                ) : (
                    <>
                        {groups.map(({ category, quests: catQuests }) => (
                            <View key={category.id} style={styles.categorySection}>
                                <View style={styles.categoryHeader}>
                                    <Text style={[styles.categoryName, { color: category.color }]}>
                                        {category.name}
                                    </Text>
                                    <View style={[styles.categoryPill, { backgroundColor: category.color + '22' }]}>
                                        <Text style={[styles.categoryCount, { color: category.color }]}>
                                            {catQuests.length}
                                        </Text>
                                    </View>
                                </View>
                                {catQuests.map(renderQuestCard)}
                            </View>
                        ))}

                        {uncategorized.length > 0 && (
                            <View style={styles.categorySection}>
                                <View style={styles.categoryHeader}>
                                    <Text style={styles.categoryName}>Autres</Text>
                                </View>
                                {uncategorized.map(renderQuestCard)}
                            </View>
                        )}
                    </>
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
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 120,
    },
    categorySection: {
        marginTop: 16,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 8,
        gap: 8,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        flex: 1,
    },
    categoryPill: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    categoryCount: {
        fontSize: 13,
        fontWeight: '700',
    },
    emptyState: {
        padding: 60,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#000000',
        opacity: 0.5,
        textAlign: 'center',
    },
});
