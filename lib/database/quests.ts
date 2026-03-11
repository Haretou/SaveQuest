import { supabase } from "../supabase"
import { QuestStates } from "../types"
import { addXP } from "./userProfile"



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
    const state = (data?.[0] ?? null) as QuestStates | null;
    return {
    data: (data?.[0] ?? null) as QuestStates | null,
    message: "[Quests] Successfully fetched quest state",
  };
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