import React from "react";
import { Text as RNText, TextProps, StyleSheet } from "react-native";

const weightToFont: Record<string, string> = {
  "100": "BricolageGrotesque_200ExtraLight",
  "200": "BricolageGrotesque_200ExtraLight",
  "300": "BricolageGrotesque_300Light",
  normal: "BricolageGrotesque_400Regular",
  "400": "BricolageGrotesque_400Regular",
  "500": "BricolageGrotesque_500Medium",
  "600": "BricolageGrotesque_600SemiBold",
  "700": "BricolageGrotesque_700Bold",
  bold: "BricolageGrotesque_700Bold",
  "800": "BricolageGrotesque_800ExtraBold",
  "900": "BricolageGrotesque_800ExtraBold",
};

export function Text({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  const fontFamily =
    flat.fontFamily ??
    weightToFont[flat.fontWeight as string] ??
    "BricolageGrotesque_400Regular";

  return <RNText style={[{ fontFamily }, style]} {...props} />;
}

export default Text;
