import { supabase } from "../supabase";
import { QuestCategory } from "../types";

export async function getCategories(): Promise<{ data: QuestCategory[]; message: string }> {
    try {
        const { data, error } = await supabase
            .from('quest_categories')
            .select('id, name, icon, color')
            .order('id', { ascending: true });

        if (error) throw error;

        return { data: data ?? [], message: "[Categories] Successfully fetched" };
    } catch (error: any) {
        return { data: [], message: error.message };
    }
}
