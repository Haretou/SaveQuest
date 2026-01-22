import { Stack } from "expo-router";
import React from "react";
import { PaperProvider } from "react-native-paper";
import paperTheme from "@/styles/paperTheme";
import "../global.css";

export default function RootLayout() {
  return (
    <PaperProvider theme={paperTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
