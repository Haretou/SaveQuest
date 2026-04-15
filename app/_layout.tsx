import { Stack } from "expo-router";
import React from "react";
import { PaperProvider } from "react-native-paper";
import paperTheme from "@/styles/paperTheme";
import { ToastProvider } from "@/context/ToastContext";
import { useFonts } from "@expo-google-fonts/bricolage-grotesque";
import {
  BricolageGrotesque_200ExtraLight,
  BricolageGrotesque_300Light,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_200ExtraLight,
    BricolageGrotesque_300Light,
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <PaperProvider theme={paperTheme}>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="confirm" options={{ headerShown: false }} />
        </Stack>
      </ToastProvider>
    </PaperProvider>
  );
}
