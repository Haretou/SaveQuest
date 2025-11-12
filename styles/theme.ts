import colors from './colors';
import fonts from './fonts';


export const theme = {
	colors,
	fonts,

	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 40,
	},
	radii: {
		sm: 6,
		md: 10,
		lg: 16,
	},
};

export type Theme = typeof theme;

export default theme;
