import { supabase } from "../supabase";
import { UserProfile } from "../types";
import {
    calculateLevel,
    getProgressToNextLevel,
    hasLeveledUp,
    getLevelsGained
} from "../utils/levelSystem";

/**
 * Récupère le profil complet d'un utilisateur (niveau, points, streak)
 * @param userId - ID de l'utilisateur
 * @returns Profil utilisateur
 */
export async function getUserProfile(userId: string): Promise<{ data: UserProfile | null; message: string }> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, level, points, streak, preferences')
            .eq('id', userId)
            .single();

        if (error) throw error;
        if (!data) return { data: null, message: "[UserProfile] User not found" };

        // Récupérer les quêtes complétées depuis preferences
        const completedQuests = data.preferences?.completed_quests || [];

        const profile: UserProfile = {
            id: data.id,
            level: data.level || 1,
            points: data.points || 0,
            streak: data.streak || 0,
            completed_quests: completedQuests
        };

        return { data: profile, message: "[UserProfile] Successfully fetched user profile" };
    } catch (error: any) {
        return { data: null, message: error.message };
    }
}

/**
 * Ajoute des points d'XP à un utilisateur et met à jour son niveau automatiquement
 * @param userId - ID de l'utilisateur
 * @param xpAmount - Nombre de points d'XP à ajouter
 * @returns Nouveau profil + indicateur de montée de niveau
 */
export async function addXP(
    userId: string,
    xpAmount: number
): Promise<{
    data: {
        profile: UserProfile;
        leveledUp: boolean;
        levelsGained: number;
        oldLevel: number;
        newLevel: number;
    } | null;
    message: string;
}> {
    try {
        // Récupérer le profil actuel
        const { data: currentProfile } = await getUserProfile(userId);
        if (!currentProfile) throw new Error("User profile not found");

        const oldXP = currentProfile.points;
        const newXP = oldXP + xpAmount;
        const oldLevel = currentProfile.level;
        const newLevel = calculateLevel(newXP);

        // Vérifier si l'utilisateur a monté de niveau
        const leveledUp = hasLeveledUp(oldXP, newXP);
        const levelsGained = getLevelsGained(oldXP, newXP);

        // Mettre à jour en base de données
        const { error } = await supabase
            .from('users')
            .update({
                points: newXP,
                level: newLevel
            })
            .eq('id', userId);

        if (error) throw error;

        // Retourner le nouveau profil
        const updatedProfile: UserProfile = {
            ...currentProfile,
            points: newXP,
            level: newLevel
        };

        return {
            data: {
                profile: updatedProfile,
                leveledUp,
                levelsGained,
                oldLevel,
                newLevel
            },
            message: `[UserProfile] Successfully added ${xpAmount} XP${leveledUp ? ` - Level up to ${newLevel}!` : ''}`
        };
    } catch (error: any) {
        return { data: null, message: error.message };
    }
}

/**
 * Récupère les statistiques complètes d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Stats complètes (leçons, quiz, quêtes)
 */
export async function getUserStats(userId: string): Promise<{
    data: {
        profile: UserProfile;
        lessonsCompleted: number;
        quizzesPassed: number;
        totalXPGained: number;
        progressToNextLevel: { current: number; required: number; percentage: number };
    } | null;
    message: string;
}> {
    try {
        // Récupérer le profil
        const { data: profile } = await getUserProfile(userId);
        if (!profile) throw new Error("User profile not found");

        let lessonsCompleted = 0;
        let quizzesPassed = 0;

        // Compter les leçons complétées (avec gestion d'erreur)
        try {
            const { data: lessonStates, error: lessonError } = await supabase
                .from('lesson_states')
                .select('id')
                .eq('user_id', userId)
                .eq('is_finished', true);

            if (!lessonError && lessonStates) {
                lessonsCompleted = lessonStates.length;
            }
        } catch {
            // Erreur silencieuse
        }

        // Compter les quiz réussis (avec gestion d'erreur)
        try {
            const { data: quizAttempts, error: quizError } = await supabase
                .from('quiz_attempts')
                .select('id')
                .eq('user_id', userId)
                .eq('is_passed', true);

            if (!quizError && quizAttempts) {
                quizzesPassed = quizAttempts.length;
            }
        } catch {
            // Erreur silencieuse
        }

        // Calculer la progression vers le niveau suivant
        const progressToNextLevel = getProgressToNextLevel(profile.points, profile.level);

        return {
            data: {
                profile,
                lessonsCompleted,
                quizzesPassed,
                totalXPGained: profile.points,
                progressToNextLevel
            },
            message: "[UserProfile] Successfully fetched user stats"
        };
    } catch (error: any) {
        return { data: null, message: error.message };
    }
}

/**
 * Initialise le profil d'un nouvel utilisateur avec les valeurs par défaut
 * @param userId - ID de l'utilisateur
 */
export async function initializeUserProfile(userId: string): Promise<{ success: boolean; message: string }> {
    try {
        const { error } = await supabase
            .from('users')
            .update({
                level: 1,
                points: 0,
                streak: 0,
                preferences: { completed_quests: [] }
            })
            .eq('id', userId);

        if (error) throw error;

        return { success: true, message: "[UserProfile] User profile initialized" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
