import { getLessonsByChapter, getLessonStateByUserId } from '@/lib/database/lessons';
import { supabase } from '@/lib/supabase';
import { Lesson } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import DisplayCard from '../../../components/ui/display_card';
import colors from '../../../styles/colors';

const ROW_HEIGHT = 160;

export default function LearningTab() {
    const [lessons, setLessons] = useState<Lesson[]>([]);

    const params = useLocalSearchParams();
    const chapter_id = Number(params.id || 1);

    const handleLessonPress = (lesson: Lesson) => {
        if (!lesson.locked) {
            router.push({ pathname: '/(tabs)/learning/lesson-model', params: { object_lesson: JSON.stringify(lesson) } });
        }
    };

    const fetchLessons = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        const { data } = await getLessonsByChapter(chapter_id);

        let completedIds = new Set<number>();
        if (userId) {
            try {
                const { data: lessonStates } = await getLessonStateByUserId(userId, chapter_id);
                completedIds = new Set(
                    lessonStates
                        .filter((s: any) => s.is_finished)
                        .map((s: any) => s.lesson_id ?? s.lessons?.id)
                        .filter(Boolean)
                );
            } catch {
                // silencieux si pas d'état encore
            }
        }

        const enrichedLessons = data.map((lesson: any, index: number) => {
            const isCompleted = completedIds.has(lesson.id);
            const prevLesson = index > 0 ? data[index - 1] : null;
            const prevCompleted = prevLesson ? completedIds.has(prevLesson.id) : true;
            const locked = index > 0 && !prevCompleted;

            return {
                ...lesson,
                side: index % 2 === 0 ? 'right' : 'left',
                completed: isCompleted,
                locked,
            };
        });

        setLessons(enrichedLessons);
    }, [chapter_id]);

    // Recharge les leçons à chaque retour sur cet écran
    useFocusEffect(
        useCallback(() => {
            fetchLessons();
        }, [fetchLessons])
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#000000" />
                    <Text style={styles.backText}>Retour</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.pathContainer}
                showsVerticalScrollIndicator={false}
            >
                {lessons.map((lesson, index) => (
                    <View key={lesson.id} style={styles.lessonRow}>
                        {index > 0 && (
                            <View style={[
                                styles.pathLine,
                                lesson.side === 'left' ? styles.pathLineLeft : styles.pathLineRight
                            ]} />
                        )}
                        <DisplayCard lesson={lesson} onPress={handleLessonPress} />
                        <View style={[
                            styles.centerDot,
                            lesson.completed && styles.centerDotCompleted
                        ]} />
                    </View>
                ))}
            </ScrollView>
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
        paddingBottom: 16,
        paddingHorizontal: 24,
        backgroundColor: colors.background,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    scrollView: {
        flex: 1,
    },
    pathContainer: {
        paddingTop: 24,
        paddingBottom: 120,
    },
    lessonRow: {
        height: ROW_HEIGHT,
        position: 'relative',
        justifyContent: 'center',
    },
    pathLine: {
        position: 'absolute',
        width: 3,
        height: ROW_HEIGHT,
        backgroundColor: '#E5E7EB',
        left: '50%',
        marginLeft: -1.5,
        top: -(ROW_HEIGHT / 2),
    },
    pathLineLeft: {
        transform: [{ translateX: -30 }],
    },
    pathLineRight: {
        transform: [{ translateX: 30 }],
    },
    centerDot: {
        position: 'absolute',
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#E5E7EB',
        left: '50%',
        marginLeft: -7,
        borderWidth: 3,
        borderColor: colors.background,
    },
    centerDotCompleted: {
        backgroundColor: colors.success,
    },
});
