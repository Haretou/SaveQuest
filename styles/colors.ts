
export const colors = {

	primary: '#8B6B4F',
	secondary: '#F6EDED',
	success: '#B8C2A5',
	surface: '#F5EBDD',
	muted: '#DAD2C4',
	onPrimary: '#FAF6F0',
	onSurface: '#5c432cff',
	error: '#FF6B6B',
} as const;

export type ColorKey = keyof typeof colors;

export default colors;
