import { getLessonsByChapter, getLessonStateByUserId } from '@/lib/database/lessons';
import { supabase } from '@/lib/supabase';
import { getChapters } from '@/lib/database/chapter';
import { Chapter } from '@/lib/types';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import ChapterCard from '../../../components/ui/chapter_card';
import colors from '../../../styles/colors';

type Progress = { total: number; completed: number };

export default function ChapterTab() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [progress, setProgress] = useState<Record<number, Progress>>({});

    const handleChapterPress = (chapter: Chapter) => {
        router.push({ pathname: '/(tabs)/learning/lessons', params: { id: chapter.id } });
    };

    const fetchAll = useCallback(async () => {
        const { data } = await getChapters();
        setChapters(data);

        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) return;

        const map: Record<number, Progress> = {};
        await Promise.all(
            data.map(async (ch: Chapter) => {
                try {
                    const { data: lessons } = await getLessonsByChapter(ch.id);
                    const { data: states } = await getLessonStateByUserId(userId, ch.id);
                    const doneIds = new Set(
                        (states || [])
                            .filter((s: any) => s.is_finished)
                            .map((s: any) => s.lesson_id ?? s.lessons?.id)
                            .filter(Boolean)
                    );
                    map[ch.id] = { total: lessons.length, completed: doneIds.size };
                } catch {
                    map[ch.id] = { total: 0, completed: 0 };
                }
            })
        );
        setProgress(map);
    }, []);

    useFocusEffect(useCallback(() => { fetchAll(); }, [fetchAll]));

    return (
        <View style={styles.container}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <Text style={styles.eyebrow}>APPRENTISSAGE</Text>
                <Text style={styles.title}>Mon Parcours</Text>

            </View>

            {/* ── Chapter list ── */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionLabel}>Chapitres</Text>
                {chapters.map((chapter) => (
                    <ChapterCard
                        key={chapter.id}
                        chapter={chapter}
                        progress={progress[chapter.id]}
                        onPress={handleChapterPress}
                    />
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

    // ── Header ──────────────────────────────────────────────
    header: {
        paddingTop: 62,
        paddingBottom: 20,
        paddingHorizontal: 24,
        borderBottomWidth: 1.5,
        borderBottomColor: colors.blue[100],
        gap: 4,
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 1.4,
        marginBottom: 2,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: colors.onBackground,
        letterSpacing: -0.5,
    },

    // ── Scroll content ───────────────────────────────────────
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 120,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.onSurface,
        opacity: 0.45,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginHorizontal: 24,
        marginBottom: 10,
    },
});
