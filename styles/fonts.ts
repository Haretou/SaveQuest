
export const fonts = {

    cherry: "cherry",
	mignone: "mignone",
	noto_sans_jp: "noto_sans_jp",

	size: {
		sm: 12,
		md: 16,
		lg: 20,
		xl: 24,
		xxl: 32,
	}
} as const;

export type FontKey = keyof typeof fonts;

export default fonts;