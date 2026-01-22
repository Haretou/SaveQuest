import { supabase } from "../supabase";
import { Quest, QuestProgress } from "../types";
import { addXP, getUserProfile } from "./userProfile";

/**
 * ⚠️ DONNÉES DE TEST - À REMPLACER PAR UNE TABLE EN BDD ⚠️
 *
 * TODO ADMIN :
 * 1. Créer une table `quests` en base de données avec la structure définie dans types.ts
 * 2. Créer une interface admin pour créer/modifier/supprimer des quêtes
 * 3. Remplacer cette constante par une requête SQL : SELECT * FROM quests WHERE is_active = true
 *
 * Ces quêtes sont hardcodées temporairement pour tester le système.
 */
const MOCK_QUESTS: Quest[] = [
    {
        id: 1,
        title: "Premier pas",
        description: "Complète ta première leçon pour débuter ton aventure !",
        type: "lessons_completed",
        target: 1,
        reward_xp: 50,
        icon: "",
        required_level: 1
    },
    {
        id: 2,
        title: "Étudiant assidu",
        description: "Complète 5 leçons pour prouver ta motivation",
        type: "lessons_completed",
        target: 5,
        reward_xp: 200,
        icon: "",
        required_level: 1
    },
    {
        id: 3,
        title: "Expert en quiz",
        description: "Réussis 3 quiz pour tester tes connaissances",
        type: "quizzes_passed",
        target: 3,
        reward_xp: 150,
        icon: "",
        required_level: 2
    },
    {
        id: 4,
        title: "Marathonien de l'apprentissage",
        description: "Complète 10 leçons pour devenir un vrai champion",
        type: "lessons_completed",
        target: 10,
        reward_xp: 500,
        icon: "",
        required_level: 3
    },
    {
        id: 5,
        title: "Régularité avant tout",
        description: "Connecte-toi 7 jours d'affilée pour développer une routine",
        type: "streak_days",
        target: 7,
        reward_xp: 300,
        icon: "",
        required_level: 1
    },
    {
        id: 6,
        title: "Niveau 5 atteint !",
        description: "Atteins le niveau 5 pour débloquer de nouvelles fonctionnalités",
        type: "level_reached",
        target: 5,
        reward_xp: 1000,
        icon: "",
        required_level: 1
    },
    {
        id: 7,
        title: "Collectionneur de points",
        description: "Gagne 1000 points d'XP au total",
        type: "xp_earned",
        target: 1000,
        reward_xp: 250,
        icon: "",
        required_level: 1
    }
];

/**
 * Récupère toutes les quêtes disponibles pour un utilisateur
 * Filtre selon le niveau requis
 *
 * TODO ADMIN : Remplacer MOCK_QUESTS par une requête SQL
 */
export async function getAvailableQuests(userId: string): Promise<{ data: Quest[]; message: string }> {
    try {
        const { data: profile } = await getUserProfile(userId);
        if (!profile) throw new Error("User profile not found");

        // Filtrer les quêtes selon le niveau requis
        const availableQuests = MOCK_QUESTS.filter(
            quest => !quest.required_level || profile.level >= quest.required_level
        );

        return {
            data: availableQuests,
            message: "[Quests] Successfully fetched available quests"
        };
    } catch (error: any) {
        return { data: [], message: error.message };
    }
}

/**
 * Récupère les IDs des quêtes complétées par un utilisateur
 * Les quêtes complétées sont stockées dans users.preferences.completed_quests
 */
export async function getUserCompletedQuests(userId: string): Promise<{ data: number[]; message: string }> {
    try {
        const { data: profile } = await getUserProfile(userId);
        if (!profile) throw new Error("User profile not found");

        return {
            data: profile.completed_quests,
            message: "[Quests] Successfully fetched completed quests"
        };
    } catch (error: any) {
        return { data: [], message: error.message };
    }
}

/**
 * Vérifie si une quête est complétée par un utilisateur
 */
export async function isQuestCompleted(userId: string, questId: number): Promise<boolean> {
    const { data } = await getUserCompletedQuests(userId);
    return data.includes(questId);
}

/**
 * Calcule la progression d'un utilisateur pour une quête donnée
 */
export async function getQuestProgress(
    userId: string,
    quest: Quest
): Promise<{ data: QuestProgress | null; message: string }> {
    try {
        const { data: profile } = await getUserProfile(userId);
        if (!profile) throw new Error("User profile not found");

        let current = 0;

        // Calculer la progression selon le type de quête
        switch (quest.type) {
            case "lessons_completed":
                const { data: lessonStates } = await supabase
                    .from('lesson_states')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('is_finished', true);
                current = lessonStates?.length || 0;
                break;

            case "quizzes_passed":
                const { data: quizAttempts } = await supabase
                    .from('quiz_attempts')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('is_passed', true);
                current = quizAttempts?.length || 0;
                break;

            case "streak_days":
                current = profile.streak;
                break;

            case "level_reached":
                current = profile.level;
                break;

            case "xp_earned":
                current = profile.points;
                break;

            default:
                current = 0;
        }

        const isCompleted = current >= quest.target;

        return {
            data: {
                quest_id: quest.id,
                current: Math.min(current, quest.target),
                target: quest.target,
                is_completed: isCompleted
            },
            message: "[Quests] Successfully calculated quest progress"
        };
    } catch (error: any) {
        return { data: null, message: error.message };
    }
}

/**
 * Marque une quête comme complétée et donne la récompense XP à l'utilisateur
 * Ajoute l'ID de la quête à users.preferences.completed_quests
 */
export async function completeQuest(
    userId: string,
    questId: number
): Promise<{ success: boolean; message: string; leveledUp?: boolean; newLevel?: number }> {
    try {
        // Vérifier que la quête existe
        const quest = MOCK_QUESTS.find(q => q.id === questId);
        if (!quest) throw new Error("Quest not found");

        // Vérifier que la quête n'est pas déjà complétée
        const alreadyCompleted = await isQuestCompleted(userId, questId);
        if (alreadyCompleted) {
            return { success: false, message: "[Quests] Quest already completed" };
        }

        // Vérifier que la quête est effectivement terminée
        const { data: progress } = await getQuestProgress(userId, quest);
        if (!progress || !progress.is_completed) {
            return { success: false, message: "[Quests] Quest objectives not met" };
        }

        // Récupérer le profil actuel
        const { data: profile } = await getUserProfile(userId);
        if (!profile) throw new Error("User profile not found");

        // Ajouter l'ID de la quête aux quêtes complétées
        const updatedCompletedQuests = [...profile.completed_quests, questId];

        // Mettre à jour en base de données
        const { error: updateError } = await supabase
            .from('users')
            .update({
                preferences: { completed_quests: updatedCompletedQuests }
            })
            .eq('id', userId);

        if (updateError) throw updateError;

        // Donner la récompense XP
        const { data: xpResult } = await addXP(userId, quest.reward_xp);
        if (!xpResult) throw new Error("Failed to add XP reward");

        return {
            success: true,
            message: `[Quests] Quest completed! +${quest.reward_xp} XP`,
            leveledUp: xpResult.leveledUp,
            newLevel: xpResult.newLevel
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

/**
 * Récupère toutes les quêtes avec leur progression pour un utilisateur
 */
export async function getQuestsWithProgress(userId: string): Promise<{
    data: { quest: Quest; progress: QuestProgress; completed: boolean }[];
    message: string;
}> {
    try {
        const { data: quests } = await getAvailableQuests(userId);
        const { data: completedQuestIds } = await getUserCompletedQuests(userId);

        const questsWithProgress = await Promise.all(
            quests.map(async (quest) => {
                const { data: progress } = await getQuestProgress(userId, quest);
                const completed = completedQuestIds.includes(quest.id);

                return {
                    quest,
                    progress: progress!,
                    completed
                };
            })
        );

        return {
            data: questsWithProgress,
            message: "[Quests] Successfully fetched quests with progress"
        };
    } catch (error: any) {
        return { data: [], message: error.message };
    }
}
