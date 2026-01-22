/**
 * SYSTÈME DE CALCUL NIVEAU / XP
 *
 * Formule de progression : XP requis = niveau * 100
 * Exemple :
 * - Niveau 1 → 2 : 100 XP
 * - Niveau 2 → 3 : 200 XP
 * - Niveau 3 → 4 : 300 XP
 *
 * Cette formule peut être ajustée selon vos besoins.
 */

/**
 * Calcule le niveau d'un utilisateur en fonction de son XP total
 * @param totalXP - Points d'expérience totaux
 * @returns Le niveau actuel
 */
export function calculateLevel(totalXP: number): number {
    if (totalXP < 0) return 1;

    let level = 1;
    let xpRequired = 0;

    // On additionne l'XP requis pour chaque niveau jusqu'à dépasser l'XP total
    while (xpRequired + (level * 100) <= totalXP) {
        xpRequired += level * 100;
        level++;
    }

    return level;
}

/**
 * Calcule l'XP total requis pour atteindre un niveau donné
 * @param level - Niveau cible
 * @returns XP total nécessaire pour atteindre ce niveau
 */
export function getTotalXPForLevel(level: number): number {
    if (level <= 1) return 0;

    let totalXP = 0;
    for (let i = 1; i < level; i++) {
        totalXP += i * 100;
    }

    return totalXP;
}

/**
 * Calcule l'XP nécessaire pour passer au niveau suivant
 * @param currentLevel - Niveau actuel
 * @returns XP nécessaire pour le prochain niveau
 */
export function getXPForNextLevel(currentLevel: number): number {
    return currentLevel * 100;
}

/**
 * Calcule la progression vers le niveau suivant
 * @param currentXP - XP actuel de l'utilisateur
 * @param currentLevel - Niveau actuel
 * @returns Objet avec current (XP actuel dans le niveau), required (XP requis), percentage
 */
export function getProgressToNextLevel(currentXP: number, currentLevel: number): {
    current: number;
    required: number;
    percentage: number;
} {
    const xpForCurrentLevel = getTotalXPForLevel(currentLevel);
    const xpInCurrentLevel = currentXP - xpForCurrentLevel;
    const xpRequiredForNext = getXPForNextLevel(currentLevel);

    const percentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNext) * 100));

    return {
        current: xpInCurrentLevel,
        required: xpRequiredForNext,
        percentage: Math.round(percentage)
    };
}

/**
 * Vérifie si l'utilisateur a monté de niveau après un gain d'XP
 * @param oldXP - XP avant le gain
 * @param newXP - XP après le gain
 * @returns true si l'utilisateur a monté de niveau
 */
export function hasLeveledUp(oldXP: number, newXP: number): boolean {
    const oldLevel = calculateLevel(oldXP);
    const newLevel = calculateLevel(newXP);
    return newLevel > oldLevel;
}

/**
 * Calcule les niveaux gagnés après un gain d'XP
 * @param oldXP - XP avant le gain
 * @param newXP - XP après le gain
 * @returns Nombre de niveaux gagnés
 */
export function getLevelsGained(oldXP: number, newXP: number): number {
    const oldLevel = calculateLevel(oldXP);
    const newLevel = calculateLevel(newXP);
    return Math.max(0, newLevel - oldLevel);
}
