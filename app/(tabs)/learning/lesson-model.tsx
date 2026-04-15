import { completeLesson } from '@/lib/database/lessons';
import { supabase } from '@/lib/supabase';
import { Lesson } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../styles/colors';

export default function LessonPage() {
    const params = useLocalSearchParams();
    const lesson = JSON.parse(params.object_lesson as string) as Lesson;
    const [completing, setCompleting] = useState(false);
    const [done, setDone] = useState(lesson.completed ?? false);
    const insets = useSafeAreaInsets();

    const handleComplete = async () => {
        if (done) return;
        setCompleting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;
            if (!userId) {
                Alert.alert('Erreur', 'Utilisateur non connecté');
                return;
            }
            const result = await completeLesson(userId, lesson.id);
            if (result.success) {
                setDone(true);
                const msg = result.leveledUp
                    ? `+${result.xpGained} XP — Niveau ${result.newLevel} atteint !`
                    : `+${result.xpGained} XP gagnés !`;
                Alert.alert('Leçon terminée !', msg, [
                    { text: 'Super !', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('Erreur', result.message);
            }
        } finally {
            setCompleting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#000000" />
                    <Text style={styles.backText}>Retour</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{lesson.title}</Text>
                {lesson.description && (
                    <Text style={styles.subtitle}>{lesson.description}</Text>
                )}
                <View style={styles.xpBadge}>
                    <Ionicons name="star" size={14} color={colors.primary} />
                    <Text style={styles.xpText}>{lesson.xp_gain} XP</Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {lesson.content ? (
                    <Text style={styles.content}>{lesson.content}</Text>
                ) : (
                    <Text style={styles.emptyContent}>Contenu bientôt disponible.</Text>
                )}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 80 + 16 }]}>
                {done ? (
                    <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                        <Text style={styles.completedText}>Leçon terminée</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.completeButton, completing && styles.completeButtonDisabled]}
                        onPress={handleComplete}
                        activeOpacity={0.8}
                        disabled={completing}
                    >
                        {completing ? (
                            <ActivityIndicator size="small" color="#000000" />
                        ) : (
                            <Text style={styles.completeButtonText}>Terminer la leçon</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        backgroundColor: colors.background,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 20,
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#000000',
        opacity: 0.6,
        lineHeight: 22,
        marginBottom: 12,
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        backgroundColor: colors.green[50],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    xpText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.primary,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 32,
    },
    content: {
        fontSize: 16,
        color: '#000000',
        lineHeight: 28,
    },
    emptyContent: {
        fontSize: 15,
        color: '#000000',
        opacity: 0.4,
        textAlign: 'center',
        marginTop: 48,
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        backgroundColor: colors.background,
    },
    completeButton: {
        backgroundColor: colors.green[500],
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: colors.green[600],
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 3,
    },
    completeButtonDisabled: {
        opacity: 0.6,
        shadowOpacity: 0,
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.green[50],
        borderRadius: 16,
        paddingVertical: 16,
    },
    completedText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
});
