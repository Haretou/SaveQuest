import { supabase } from "../supabase";

export type LeaderboardEntry = {
    id: string;
    username: string;
    first_name: string;
    level: number;
    points: number;
    rank: number;
};

export async function getLeaderboard(): Promise<{
    data: LeaderboardEntry[];
    message: string;
}> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, username, first_name, level, points')
            .order('points', { ascending: false })
            .limit(10);

        if (error) throw error;

        const entries: LeaderboardEntry[] = (data ?? []).map((user, index) => ({
            id: user.id,
            username: user.username || 'Anonyme',
            first_name: user.first_name || '',
            level: user.level || 1,
            points: user.points || 0,
            rank: index + 1,
        }));

        return { data: entries, message: '[Leaderboard] Successfully fetched' };
    } catch (error: any) {
        return { data: [], message: error.message };
    }
}
