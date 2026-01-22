/**
 * 🎨 THÈME REACT NATIVE PAPER - SAVEQUEST
 *
 * Configuration du thème Material Design 3 avec les couleurs Savequest
 */

import { MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import colors from './colors';

/**
 * Configuration des fonts (optionnel)
 * Tu peux ajuster selon tes besoins
 */
const fontConfig = {
	web: {
		regular: {
			fontFamily: 'sans-serif',
			fontWeight: '400',
		},
		medium: {
			fontFamily: 'sans-serif-medium',
			fontWeight: '500',
		},
		light: {
			fontFamily: 'sans-serif-light',
			fontWeight: '300',
		},
		thin: {
			fontFamily: 'sans-serif-thin',
			fontWeight: '100',
		},
	},
	ios: {
		regular: {
			fontFamily: 'System',
			fontWeight: '400',
		},
		medium: {
			fontFamily: 'System',
			fontWeight: '500',
		},
		light: {
			fontFamily: 'System',
			fontWeight: '300',
		},
		thin: {
			fontFamily: 'System',
			fontWeight: '100',
		},
	},
	default: {
		regular: {
			fontFamily: 'sans-serif',
			fontWeight: 'normal',
		},
		medium: {
			fontFamily: 'sans-serif-medium',
			fontWeight: 'normal',
		},
		light: {
			fontFamily: 'sans-serif-light',
			fontWeight: 'normal',
		},
		thin: {
			fontFamily: 'sans-serif-thin',
			fontWeight: 'normal',
		},
	},
} as const;

/**
 * Thème principal Savequest basé sur Material Design 3
 */
export const paperTheme: MD3Theme = {
	...MD3LightTheme,
	// @ts-ignore - Fonts config
	fonts: configureFonts({ config: fontConfig }),
	colors: {
		...MD3LightTheme.colors,

		// 🟢 Couleur primaire (Vert)
		primary: colors.green[600],           // Boutons principaux, FAB, accents
		primaryContainer: colors.green[100],  // Fond de containers primaires
		onPrimary: colors.onPrimary,          // Texte sur primaire
		onPrimaryContainer: colors.green[900], // Texte sur container primaire

		// 🔵 Couleur secondaire (Bleu)
		secondary: colors.blue[500],          // Boutons secondaires, chips
		secondaryContainer: colors.blue[100], // Fond de containers secondaires
		onSecondary: colors.onSecondary,      // Texte sur secondaire
		onSecondaryContainer: colors.blue[900], // Texte sur container secondaire

		// 🟡 Couleur tertiaire (Success - Vert vibrant)
		tertiary: colors.green[500],          // Actions tertiaires, succès
		tertiaryContainer: colors.green[50],  // Fond de containers tertiaires
		onTertiary: colors.onPrimary,         // Texte sur tertiaire
		onTertiaryContainer: colors.green[900], // Texte sur container tertiaire

		// 🔴 Erreurs
		error: colors.error,                  // Erreurs, boutons destructifs
		errorContainer: '#FFEBEE',            // Fond d'erreur
		onError: '#FFFFFF',                   // Texte sur erreur
		onErrorContainer: '#B71C1C',          // Texte sur container erreur

		// 📄 Surfaces et backgrounds
		background: colors.background,        // Fond principal de l'app
		onBackground: colors.onBackground,    // Texte sur fond principal
		surface: colors.blue[50],             // Fond des cards, surfaces
		onSurface: colors.blue[950],          // Texte sur surface
		surfaceVariant: colors.blue[100],     // Variante de surface
		onSurfaceVariant: colors.blue[800],   // Texte sur variante

		// 📐 Outlines et dividers
		outline: colors.blue[200],            // Borders, dividers
		outlineVariant: colors.blue[100],     // Borders plus subtiles

		// 🎨 Autres
		surfaceDisabled: colors.blue[50] + '60', // Surface désactivée (opacité)
		onSurfaceDisabled: colors.blue[950] + '60', // Texte désactivé
		backdrop: '#000000' + '80',           // Fond de modal (semi-transparent)

		// Shadow (pour elevation)
		shadow: '#000000',
		scrim: '#000000',

		// Inverse (pour dark mode si besoin plus tard)
		inverseSurface: colors.green[900],
		inverseOnSurface: colors.green[50],
		inversePrimary: colors.green[300],

		// Elevation (surfaces surélevées)
		elevation: {
			level0: 'transparent',
			level1: colors.blue[50],
			level2: colors.blue[50],
			level3: colors.blue[100],
			level4: colors.blue[100],
			level5: colors.blue[200],
		},
	},
	// Arrondis des coins
	roundness: 12,
};

export default paperTheme;
