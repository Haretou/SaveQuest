import { supabase } from "../supabase"

// Register a new user
export async function getLessonsByChapter(chapter_id: number) {
    const {data, error} = await supabase.from('lessons').select('*').eq('chapter_id', chapter_id).order('order_index', {ascending: true})
    if (error) throw new Error("[Lessons] " + error.message)
    if (!data) throw new Error("[Lessons] Error while fetching lessons: Data cannot be null")
    return {data, message: "[Lessons] Successfully fetched lessons"}
}

export async function getLessonStateByUserId(user_id: string, chapter_id: number) {
    const {data, error} = await supabase.from('lesson_states').select('is_finished, lessons!inner(chapter_id)').eq('user_id', user_id).eq('lessons.chapter_id', chapter_id)
    if (error) throw new Error("[Lessons] " + error.message)
    if (!data) throw new Error("[Lessons] Error while fetching lesson states: Data cannot be null")
    return {data, message: "[Lessons] Successfully fetched lesson states"}
}