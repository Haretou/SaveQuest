import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/styles/colors';

interface AuthHeaderProps {
  appName: string;
  logoLetter: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ appName, logoLetter }) => {
  return (
    <>
      <View style={styles.logoContainer}>
        <LinearGradient colors={[colors.primary, colors.green[400]]} style={styles.logo}>
          <Text style={styles.logoText}>{logoLetter}</Text>
        </LinearGradient>
        <Text style={styles.appName}>{appName}</Text>
      </View>
      <View style={styles.separator} />
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.onPrimary,
  },
  appName: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: colors.blue[200],
    marginVertical: 24,
    width: "10%",
    alignSelf: "center",
  },
});
