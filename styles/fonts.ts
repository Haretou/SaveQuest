
export const fonts = {

    cherry: "cherry",
	mignone: "mignone",
	noto_sans_jp: "noto_sans_jp",
} as const;

export type FontKey = keyof typeof fonts;

export default fonts;