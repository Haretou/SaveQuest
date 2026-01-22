import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../../styles/colors';
import QuestCard from '../../../components/ui/quest_card';
import UserLevelHeader from '../../../components/ui/user_level_header';
import TestButton from '../../../components/ui/test_button';
import { Quest } from '@/lib/types';
import { getQuestsWithProgress, completeQuest } from '@/lib/database/quests';
import { getUserStats } from '@/lib/database/userProfile';
import { supabase } from '@/lib/supabase';

export default function QuestsTab() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [userStats, setUserStats] = useState<any>(null);
    const [questsData, setQuestsData] = useState<any[]>([]);

    // Récupérer l'utilisateur connecté
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    Alert.alert('Erreur', 'Impossible de récupérer la session. Veuillez vous reconnecter.');
                    setLoading(false);
                    return;
                }

                if (session?.user) {
                    setUserId(session.user.id);
                } else {
                    Alert.alert('Non connecté', 'Veuillez vous connecter pour accéder aux quêtes.');
                    setLoading(false);
                }
            } catch {
                Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération de votre profil.');
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Charger les données
    const loadData = async () => {
        if (!userId) {
            return;
        }

        try {
            // Récupérer les stats utilisateur
            const { data: stats } = await getUserStats(userId);

            if (stats) {
                setUserStats(stats);
            } else {
                throw new Error('Failed to fetch user stats');
            }

            // Récupérer les quêtes avec progression
            const { data: quests } = await getQuestsWithProgress(userId);

            setQuestsData(quests);
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Impossible de charger les quêtes');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    // Gérer la réclamation d'une quête
    const handleClaimQuest = async (quest: Quest) => {
        if (!userId) return;

        try {
            const { success, message, leveledUp, newLevel } = await completeQuest(userId, quest.id);

            if (success) {
                // Afficher un message de succès
                if (leveledUp) {
                    Alert.alert(
                        '🎉 Félicitations !',
                        `Quête terminée ! +${quest.reward_xp} XP\n\n✨ Tu es passé niveau ${newLevel} !`,
                        [{ text: 'Super !', onPress: () => loadData() }]
                    );
                } else {
                    Alert.alert(
                        '✅ Quête terminée !',
                        `Tu as gagné ${quest.reward_xp} XP !`,
                        [{ text: 'Continuer', onPress: () => loadData() }]
                    );
                }
            } else {
                Alert.alert('Erreur', message);
            }
        } catch {
            Alert.alert('Erreur', 'Impossible de réclamer la quête');
        }
    };

    // Rafraîchir les données
    const handleRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Chargement des quêtes...</Text>
            </View>
        );
    }

    if (!userStats) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erreur : Impossible de charger votre profil</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quêtes</Text>
                <Text style={styles.subtitle}>Complète des quêtes pour gagner de l&apos;XP</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {/* En-tête avec niveau et progression */}
                <UserLevelHeader
                    level={userStats.profile.level}
                    currentXP={userStats.progressToNextLevel.current}
                    requiredXP={userStats.progressToNextLevel.required}
                    percentage={userStats.progressToNextLevel.percentage}
                />

                {/* ⚠️ BOUTON DE TEST - À SUPPRIMER EN PRODUCTION */}
                <TestButton onSuccess={loadData} />

                {/* Section des quêtes */}
                <View style={styles.questsSection}>
                    <Text style={styles.sectionTitle}>
                        Quêtes disponibles ({questsData.length})
                    </Text>

                    {questsData.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Aucune quête disponible pour le moment</Text>
                        </View>
                    ) : (
                        questsData.map((item) => (
                            <QuestCard
                                key={item.quest.id}
                                quest={item.quest}
                                progress={item.progress}
                                completed={item.completed}
                                onClaim={handleClaimQuest}
                            />
                        ))
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
        backgroundColor: colors.onPrimary,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        backgroundColor: colors.surface,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.onSurface,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: colors.primary,
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
        color: colors.onSurface,
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.onPrimary,
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: colors.onSurface,
        opacity: 0.7,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.onPrimary,
        padding: 40,
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: colors.onSurface,
        opacity: 0.5,
        textAlign: 'center',
    },
    adminNote: {
        marginHorizontal: 20,
        marginTop: 24,
        padding: 16,
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FCD34D',
    },
    adminNoteText: {
        fontSize: 13,
        color: '#78350F',
        lineHeight: 20,
    },
});
