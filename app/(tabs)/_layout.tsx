import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import React from "react";
import colors from '../../styles/colors';

export default function RootLayout() {
  
  return <Tabs screenOptions={{
    tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: colors.muted,
    tabBarStyle: { 
        backgroundColor: colors.surface,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        position: 'absolute',
        borderTopWidth: 0,
        zIndex: 10,
        height: 80,
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
          },
          tabBarShowLabel: false,
          headerShown: false,
  }} > 
    <Tabs.Screen name="coming_soon" options={{
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name={ focused ? "hourglass" : "hourglass-outline"} size={size} color={color} />
      ),
    }} />
    <Tabs.Screen name="quests" options={{ headerShown: false,
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name={ focused ? "trophy" : "trophy-outline"} size={size} color={color} />
      ), 
    }} />
    <Tabs.Screen name="learning" options={{ headerShown: false,
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name={ focused ? "book" : "book-outline"} size={size} color={color} />
      ),
    }} />
    <Tabs.Screen name="dashboard" options={{ headerShown: false,
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name={ focused ? "grid" : "grid-outline"} size={size} color={color} />
      ), 
    }} />
    <Tabs.Screen name="profile" options={{ headerShown: false,
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name={ focused ? "person" : "person-outline"} size={size} color={color} />
      ), 
    }} />
  </Tabs>
}
