import { supabase } from "../supabase"
import { Quest, QuestStates } from "../types"
import { addXP } from "./userProfile"

/**
 * Vérifie et marque comme complètes les quêtes de streak dont le seuil est atteint.
 * À appeler après updateStreak().
 */
export async function checkStreakQuests(userId: string): Promise<void> {
    try {
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('streak')
            .eq('id', userId)
            .single();

        if (userError || !userData) return;

        const currentStreak = userData.streak ?? 0;
        if (currentStreak === 0) return;

        const { data: streakQuests, error: questsError } = await supabase
            .from('quests')
            .select('id, steps')
            .eq('goal', 'maintain_streak');

        if (questsError || !streakQuests || streakQuests.length === 0) return;

        await Promise.all(
            streakQuests.map(async (quest) => {
                const isComplete = quest.steps <= currentStreak;
                const newProgress = isComplete ? quest.steps : currentStreak;

                const { data: existingState } = await supabase
                    .from('quest_states')
                    .select('id, is_complete')
                    .eq('user_id', userId)
                    .eq('quest_id', quest.id)
                    .single();

                if (existingState?.is_complete) return; // déjà réclamée, on ne touche plus

                if (existingState) {
                    await supabase
                        .from('quest_states')
                        .update({ step_progress: newProgress, is_complete: isComplete })
                        .eq('id', existingState.id);
                } else {
                    await supabase
                        .from('quest_states')
                        .insert({
                            user_id: userId,
                            quest_id: quest.id,
                            step_progress: newProgress,
                            is_complete: isComplete,
                        });
                }
            })
        );
    } catch (error) {
        console.error('[Quests] checkStreakQuests error:', error);
    }
}



export async function getQuests() {
    const {data, error} = await supabase.from('quests').select('*')
    if (error) throw new Error("[Quests] " + error.message)
    if (!data) throw new Error("[Quests] Error while fetching quests: Data cannot be null")
    return {data, message: "[Quests] Successfully fetched quests"}
}


export async function getQuetesStateByUserId(user_id: string, quest_id: number) {
    const {data, error} = await supabase.from('quest_states').select('*').eq('user_id', user_id).eq('quest_id', quest_id).limit(1);
    console.log("Data fetched for quest states:", data);
    if (error) throw new Error("[Quests] " + error.message)
    return {
        data: (data?.[0] ?? null) as QuestStates | null,
        message: "[Quests] Successfully fetched quest state",
    };
}


/**
 * Incrémente la progression des quêtes d'un utilisateur selon le type d'action réalisée.
 * À appeler après chaque action (fin de leçon, etc.)
 */
export async function incrementQuestProgress(
    userId: string,
    goalType: string
): Promise<void> {
    try {
        // Récupérer toutes les quêtes dont le goal correspond
        const { data: matchingQuests, error: questsError } = await supabase
            .from('quests')
            .select('id, steps')
            .eq('goal', goalType);

        if (questsError || !matchingQuests || matchingQuests.length === 0) return;

        await Promise.all(
            matchingQuests.map(async (quest) => {
                // Récupérer l'état actuel (ou créer si inexistant)
                const { data: existingState } = await supabase
                    .from('quest_states')
                    .select('id, step_progress, is_complete')
                    .eq('user_id', userId)
                    .eq('quest_id', quest.id)
                    .single();

                if (existingState?.is_complete) return; // déjà terminée, on touche pas

                const currentProgress = existingState?.step_progress ?? 0;
                const newProgress = currentProgress + 1;
                const isNowComplete = newProgress >= quest.steps;

                if (existingState) {
                    await supabase
                        .from('quest_states')
                        .update({ step_progress: newProgress, is_complete: isNowComplete })
                        .eq('id', existingState.id);
                } else {
                    await supabase
                        .from('quest_states')
                        .insert({
                            user_id: userId,
                            quest_id: quest.id,
                            step_progress: newProgress,
                            is_complete: isNowComplete,
                        });
                }
            })
        );
    } catch (error) {
        console.error('[Quests] incrementQuestProgress error:', error);
    }
}


export async function claimQuest(
    userId: string,
    quest: Quest
): Promise<{ success: boolean; message: string; xpGained?: number }> {
    try {
        // 1. Vérifier si la quête est déjà réclamée avant toute modification
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('preferences')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        const currentPrefs = userData?.preferences || {};
        const completedQuests: number[] = currentPrefs.completed_quests || [];

        if (completedQuests.includes(quest.id)) {
            return { success: false, message: 'Cette quête a déjà été réclamée.' };
        }

        // 2. Marquer comme réclamée en premier pour éviter les doublons
        const { error: updateError } = await supabase
            .from('users')
            .update({
                preferences: { ...currentPrefs, completed_quests: [...completedQuests, quest.id] }
            })
            .eq('id', userId);

        if (updateError) throw updateError;

        // 3. Ajouter l'XP au profil
        const { data: xpResult, message } = await addXP(userId, quest.xp_gain);
        if (!xpResult) throw new Error(message);

        return {
            success: true,
            message: `[Quests] Quest claimed! +${quest.xp_gain} XP`,
            xpGained: quest.xp_gain,
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}









// // Register a new user
// export async function getLessonsByChapter(chapter_id: number) {
//     const {data, error} = await supabase.from('lessons').select('*').eq('chapter_id', chapter_id).order('order_index', {ascending: true})
//     if (error) throw new Error("[Lessons] " + error.message)
//     if (!data) throw new Error("[Lessons] Error while fetching lessons: Data cannot be null")
//     return {data, message: "[Lessons] Successfully fetched lessons"}
// }



// /**
//  * Marque une leçon comme complétée et donne l'XP à l'utilisateur
//  * @param userId - ID de l'utilisateur
//  * @param lessonId - ID de la leçon
//  * @returns Résultat avec indication de montée de niveau
//  */
// export async function completeLesson(userId: string, lessonId: number): Promise<{
//     success: boolean;
//     message: string;
//     xpGained?: number;
//     leveledUp?: boolean;
//     newLevel?: number;
// }> {
//     try {
//         // Vérifier si la leçon est déjà complétée
//         const { data: existingState, error: checkError } = await supabase
//             .from('lesson_states')
//             .select('is_finished')
//             .eq('user_id', userId)
//             .eq('lesson_id', lessonId)
//             .single();

//         if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
//             throw checkError;
//         }

//         if (existingState?.is_finished) {
//             return {
//                 success: false,
//                 message: "[Lessons] Lesson already completed"
//             };
//         }

//         // Récupérer les infos de la leçon (notamment l'XP)
//         const { data: lesson, error: lessonError } = await supabase
//             .from('lessons')
//             .select('xp_gain')
//             .eq('id', lessonId)
//             .single();

//         if (lessonError) throw lessonError;
//         if (!lesson) throw new Error("Lesson not found");

//         // Marquer la leçon comme complétée
//         if (existingState) {
//             // Mettre à jour
//             const { error: updateError } = await supabase
//                 .from('lesson_states')
//                 .update({ is_finished: true })
//                 .eq('user_id', userId)
//                 .eq('lesson_id', lessonId);

//             if (updateError) throw updateError;
//         } else {
//             // Créer
//             const { error: insertError } = await supabase
//                 .from('lesson_states')
//                 .insert({
//                     user_id: userId,
//                     lesson_id: lessonId,
//                     is_finished: true
//                 });

//             if (insertError) throw insertError;
//         }

//         // Donner l'XP à l'utilisateur
//         const xpGain = lesson.xp_gain || 0;
//         if (xpGain > 0) {
//             const { data: xpResult } = await addXP(userId, xpGain);

//             return {
//                 success: true,
//                 message: `[Lessons] Lesson completed! +${xpGain} XP`,
//                 xpGained: xpGain,
//                 leveledUp: xpResult?.leveledUp,
//                 newLevel: xpResult?.newLevel
//             };
//         }

//         return {
//             success: true,
//             message: "[Lessons] Lesson completed!",
//             xpGained: 0
//         };
//     } catch (error: any) {
//         return {
//             success: false,
//             message: error.message
//         };
//     }
// }