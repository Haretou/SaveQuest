import { getLessonsByChapter, getLessonStateByUserId } from '@/lib/database/lessons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DisplayCard from '../../../components/ui/display_card';
import colors from '../../../styles/colors';

type Lesson = {
    id: number;
    title: string;
    description: string | null;
    content: string;
    xp_gain: number;
    order_index: number;
    chapter_id: number;
    completed?: boolean;
    locked?: boolean;
    side?: 'left' | 'right';
};

export default function LearningTab() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    

    const handleLessonPress = (lesson: Lesson) => {
        if (!lesson.locked) {
            console.log('Ouvrir la leçon:', lesson.title);
            console.log('XP à gagner:', lesson.xp_gain);
        }
    };

    useEffect(() => {
        const fetchLessons = async () => {
            const {data, message} = await getLessonsByChapter(1);
            const {data: lessons_states, message: statesMessage} = await getLessonStateByUserId("129dafbd-f242-42e8-8288-1d9e6c343e6b", 1);

            const enrichedLessons = data.map((lesson: any, index: number) => {
                const lessonState = lessons_states.find((state: any) => state.lessons.id === lesson.id);
                const isCompleted = lessonState?.state === "completed";
                
                return {
                    ...lesson,
                    side: index % 2 === 0 ? 'right' : 'left',
                    completed: index < 2,
                    locked: !isCompleted && index > 2, // Verrouillé si non complété et pas la première leçon
                };
            });
            setLessons(enrichedLessons);
        };

        fetchLessons();
    }, []);
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mon Parcours</Text>
                <Text style={styles.subtitle}>Continue ton apprentissage</Text>
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.pathContainer}
                showsVerticalScrollIndicator={false}
            >
                {lessons.map((lesson, index) => (
                    <View key={lesson.id} style={styles.lessonRow}>
                        {/* Path line */}
                        {index > 0 && (
                            <View style={[
                                styles.pathLine,
                                lesson.side === 'left' ? styles.pathLineLeft : styles.pathLineRight
                            ]} />
                        )}

                        {/* Lesson card */}
                        <DisplayCard lesson={lesson} onPress={handleLessonPress} />

                        {/* Center dot */}
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
        backgroundColor: colors.onPrimary,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        backgroundColor: colors.surface,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.onSurface,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: colors.primary,
    },
    scrollView: {
        flex: 1,
    },
    pathContainer: {
        paddingVertical: 40,
        paddingBottom: 120,
    },
    lessonRow: {
        height: 120,
        position: 'relative',
        justifyContent: 'center',
    },
    pathLine: {
        position: 'absolute',
        width: 3,
        height: 120,
        backgroundColor: colors.muted,
        left: '50%',
        marginLeft: -1.5,
        top: -60,
    },
    pathLineLeft: {
        transform: [{ translateX: -30 }],
    },
    pathLineRight: {
        transform: [{ translateX: 30 }],
    },
    centerDot: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.muted,
        left: '50%',
        marginLeft: -8,
        borderWidth: 3,
        borderColor: colors.onPrimary,
    },
    centerDotCompleted: {
        backgroundColor: colors.success,
    }
});