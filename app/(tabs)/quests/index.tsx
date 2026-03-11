import React, { use, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../../styles/colors';
import QuestCard from '../../../components/ui/quest_card';
import UserLevelHeader from '../../../components/ui/user_level_header';
import TestButton from '../../../components/ui/test_button';
import { Quest, QuestStates } from '@/lib/types';
import { getUserStats } from '@/lib/database/userProfile';
import { supabase } from '@/lib/supabase';
import { getQuests, getQuetesStateByUserId } from '@/lib/database/quests';

export default function QuestsTab() {
    const [refreshing, setRefreshing] = useState(false);
    const [userId, setUserId] = useState<string | null>("ef67f015-ac61-4970-b88f-c2aba7650365");


    const [quests, setQuests] = useState<Quest[]>([]);
    const [userQuest, setUserQuest] = useState<QuestStates[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const {data, message} = await getQuests();
            const enrichedQuests = data.map((quest: any, index: number) => {
                    
                return {
                    ...quest,
                };
            });
            setQuests(enrichedQuests);
            console.log("Quests loaded:", enrichedQuests);
            };
            loadData();

    }, []);

  useEffect(() => {
    if (!userId) return;
    if (quests.length === 0) return;

    let cancelled = false;

    const loadUserQuestStates = async () => {
        try {
        const results: QuestStates[] = await Promise.all(
            quests.map(async (quest) => {
            const { data } = await getQuetesStateByUserId(userId, quest.id);

            if (data) {
                return data;
            }

            return {
                id: 0, 
                quest_id: quest.id,
                user_id: userId,
                step_progress: 0,
                is_completed: false,
            };
            })
        );

        if (!cancelled) {
            setUserQuest(results);
        }
        } catch (error) {
            console.error("Failed to load user quest states:", error);
        if (!cancelled) setUserQuest([]);
        }
    };

    loadUserQuestStates();

    return () => {
        cancelled = true;
    };
    }, [userId, quests]);
  

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
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                

                {/* Section des quêtes */}
                <View style={styles.questsSection}>
                    <Text style={styles.sectionTitle}>
                        Quêtes disponibles ({quests.length})
                    </Text>

                    {quests.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Aucune quête disponible pour le moment</Text>
                        </View>
                    ) : (
                        quests.map((quest) => {
                            const progress = userQuest.find(
                                (uq) => uq.quest_id === quest.id
                            );

                            return (
                                <QuestCard
                                key={quest.id}
                                quest={quest}
                                progress={progress || { id: 0, quest_id: quest.id, user_id: userId ?? '', step_progress: 0, is_completed: false }} 
                                completed={false}
                                onClaim={() => {}}
                                />
                            );
                        })
                    )}
                </View>

                {/* Note pour l'admin */}
                <View style={styles.adminNote}>
                    <Text style={styles.adminNoteText}>
                        ℹ️ Les quêtes affichées sont des données de test.
                        {'\n'}À terme, elles seront gérées via une interface admin.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,           // Blanc - fond principal style Figma
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        backgroundColor: colors.background,           // Blanc - header style Figma
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000000',                             // Noir - titre style Figma
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#000000',                             // Noir - sous-titre style Figma
        opacity: 0.6,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 120,
    },
    questsSection: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',                             // Noir - section title style Figma
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#000000',                             // Noir - texte loading style Figma
        opacity: 0.6,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 40,
    },
    errorText: {
        fontSize: 16,
        color: colors.error,                          // Rouge - erreur
        textAlign: 'center',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#000000',                             // Noir - texte vide style Figma
        opacity: 0.5,
        textAlign: 'center',
    },
    adminNote: {
        marginHorizontal: 20,
        marginTop: 24,
        padding: 16,
        backgroundColor: colors.green[400],           // Vert vibrant - note admin style Figma
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    adminNoteText: {
        fontSize: 13,
        color: '#000000',                             // Noir - texte style Figma
        lineHeight: 20,
    },
});
