import { supabase } from "../supabase"

// Register a new user
export async function getChapters() {
    const {data, error} = await supabase.from('chapters').select('*').order('order_index', {ascending: true})
    if (error) throw new Error("[Chapters] " + error.message)
    if (!data) throw new Error("[Chapters] Error while fetching chapters: Data cannot be null")
    return {data, message: "[Chapters] Successfully fetched chapters"}
}
