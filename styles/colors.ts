/**
 * 🎨 SYSTÈME DE COULEURS - SAVEQUEST
 *
 * Palettes complètes avec hiérarchie 50 → 950
 *
 * GUIDE D'UTILISATION :
 *
 * 50-100   → Backgrounds très légers (cards, surfaces)
 * 200-300  → Borders, dividers, hover states légers
 * 400-500  → Couleurs moyennes (badges, tags)
 * 600      → LA couleur principale de référence (boutons, liens, accents)
 * 700-800  → Hover states foncés, états actifs
 * 900-950  → Textes foncés, éléments très contrastés
 *
 * VERT (Primaire) : Actions principales, succès, progression
 * BLEU (Secondaire) : UI générale, information, surfaces
 */

export const colors = {
	// ============================================
	// 🟢 PALETTE VERTE (Primaire - Spring Green)
	// ============================================
	green: {
		50: '#EDFFF4',   // Backgrounds très légers, success messages
		100: '#D5FFE8',  // Backgrounds légers, hover states
		200: '#AEFFD1',  // Borders subtiles sur cards
		300: '#70FFB0',  // Éléments secondaires, tags
		400: '#2BFD86',  // Hover sur boutons, badges actifs
		500: '#00FF6F',  // Succès vibrant, animations
		600: '#00C04F',  // ⭐ COULEUR PRINCIPALE - Boutons, liens, accents
		700: '#009641',  // Hover foncé, états actifs
		800: '#067537',  // Texte sur fond clair, icônes
		900: '#076030',  // Texte important
		950: '#003719',  // Texte très foncé, headers
	},

	// ============================================
	// 🔵 PALETTE BLEUE (Secondaire - Blue)
	// ============================================
	blue: {
		50: '#E8F1FF',   // ⭐ Fond principal cards, surfaces
		100: '#D5E4FF',  // Backgrounds légers, hover
		200: '#B3CCFF',  // Borders, dividers
		300: '#85A8FF',  // Éléments secondaires
		400: '#5676FF',  // Hover, badges info
		500: '#2F45FF',  // ⭐ COULEUR SECONDAIRE - Boutons secondaires
		600: '#0C0EFF',  // Accents secondaires
		700: '#0000FF',  // États actifs, focus
		800: '#0609CD',  // Texte sur fond clair
		900: '#10169F',  // Texte important
		950: '#0A0B5C',  // ⭐ Texte principal sur fond clair
	},

	// ============================================
	// 📌 RACCOURCIS SÉMANTIQUES (pour compatibilité)
	// ============================================
	primary: '#00C04F',        // green-600
	secondary: '#2F45FF',      // blue-500
	success: '#00FF6F',        // green-500
	error: '#FF6B6B',

	// Surfaces
	surface: '#E8F1FF',        // blue-50 - Fond cards
	surfaceVariant: '#D5E4FF', // blue-100 - Fond hover
	background: '#FFFFFF',     // Fond principal app

	// Textes
	onPrimary: '#FFFFFF',      // Texte sur vert
	onSecondary: '#FFFFFF',    // Texte sur bleu
	onSurface: '#0A0B5C',      // blue-950 - Texte sur surface claire
	onBackground: '#003719',   // green-950 - Texte sur fond blanc

	// Autres
	muted: '#D5E4FF',          // blue-100
	red: '#FF3B30',
	text: '#000000',
} as const;

// Types pour autocomplétion
export type ColorKey = keyof typeof colors;
export type GreenShade = keyof typeof colors.green;
export type BlueShade = keyof typeof colors.blue;

export default colors;
