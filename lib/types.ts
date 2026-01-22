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

// ============================================
// SYSTÈME DE QUÊTES ET NIVEAUX
// ============================================

/**
 * TODO ADMIN : À terme, ces quêtes devront être créées via une interface admin
 * et stockées dans une table `quests` en base de données avec les colonnes :
 * - id (bigint)
 * - title (varchar)
 * - description (text)
 * - type (varchar) - type de quête
 * - target (integer) - objectif à atteindre
 * - reward_xp (integer) - XP gagnés
 * - icon (varchar) - icône de la quête
 * - required_level (integer) - niveau minimum requis
 * - is_active (boolean) - quête active ou non
 * - created_at (timestamp)
 */
export type Quest = {
    id: number;
    title: string;
    description: string;
    type: QuestType;
    target: number;
    reward_xp: number;
    icon?: string;
    required_level?: number;
};

export type QuestType =
    | 'lessons_completed'      // Compléter X leçons
    | 'quizzes_passed'         // Réussir X quiz
    | 'streak_days'            // Se connecter X jours consécutifs
    | 'level_reached'          // Atteindre le niveau X
    | 'xp_earned';             // Gagner X points d'XP

export type QuestProgress = {
    quest_id: number;
    current: number;
    target: number;
    is_completed: boolean;
};

export type UserProfile = {
    id: string;
    level: number;
    points: number;
    streak: number;
    completed_quests: number[]; // IDs des quêtes complétées (stocké dans users.preferences)
};