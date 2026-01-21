/** Group row shape */
export type Group = { id: string; name: string; created_by: string | null; created_at: string };
/** Minimal user representation used in membership lookups */
export type UserLite = { id: string; username: string };
/** Activity entity for both pending and completed tasks */

export type Activity = {
  id: string;
  group_id: string;
  title: string;
  description?: string | null;
  is_done: boolean;
  completed_at?: string | null;
  photo_url?: string | null;
  created_by?: string | null;
  created_at: string;
};

export type Lesson = {
    id: number;
    title: string;
    description: string | null;
    content: string;
    xp_gain: number;
    order_index: number;
    chapter_id: number;
    completed?: boolean;
    locked?: boolean;
    side?: 'left' | 'right';
};

export type Chapter = {
    id: number;
    title: string;
    description: string | null;
    order_index: number;
};