import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';

export default function HomeTab() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>Page d'accueil des onglets</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: '600', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#555' },
});