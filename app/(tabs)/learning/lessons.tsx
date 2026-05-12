import { getLessonsByChapter, getLessonStateByUserId } from '@/lib/database/lessons';
import { supabase } from '@/lib/supabase';
import { Lesson } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import colors from '../../../styles/colors';

const { width: SW } = Dimensions.get('window');

const NODE = 80;
const SHADOW_H = 7;
const V_SPACE = 210;
const PADDING_TOP = 28;
const DASH_W = 13;
const DASH_H = 5;
const DASH_GAP = 18;
const WAVE_AMP = 18;
const WAVE_FREQ = 1.5;

const LEFT_CX = Math.round(SW * 0.27);
const RIGHT_CX = Math.round(SW * 0.73);

type ELesson = Lesson & { completed: boolean; locked: boolean; side: 'left' | 'right' };

function nodeTheme(l: ELesson) {
    if (l.locked) return { main: '#C5C5C5', shadow: '#8F8F8F', iconColor: '#FFFFFF' };
    if (l.completed) return { main: colors.green[500], shadow: colors.green[800], iconColor: '#FFFFFF' };
    return { main: '#4B8EF5', shadow: '#2255C0', iconColor: '#FFFFFF' };
}

function nodeIconName(l: ELesson): React.ComponentProps<typeof Ionicons>['name'] {
    if (l.locked) return 'lock-closed';
    if (l.completed) return 'checkmark';
    return 'book-outline';
}

// ─── Wavy dashed path ─────────────────────────────────────────────────────────

function PathWavy({ fromX, fromY, toX, toY, locked }: {
    fromX: number; fromY: number; toX: number; toY: number; locked: boolean;
}) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return null;

    // Perpendicular unit normal (90° CCW)
    const nx = -dy / len;
    const ny = dx / len;

    const count = Math.floor(len / DASH_GAP);
    const dashColor = locked ? '#D4D4D4' : colors.green[300];

    const dashes = [];
    for (let i = 1; i < count; i++) {
        const t = i / count;

        // Sine-wave offset perpendicular to the straight line
        const wave = WAVE_AMP * Math.sin(2 * Math.PI * WAVE_FREQ * t);
        const x = fromX + t * dx + nx * wave;
        const y = fromY + t * dy + ny * wave;

        // Tangent direction for dash rotation
        const dWave = WAVE_AMP * 2 * Math.PI * WAVE_FREQ * Math.cos(2 * Math.PI * WAVE_FREQ * t);
        const angle = Math.atan2(dy + ny * dWave, dx + nx * dWave) * (180 / Math.PI);

        dashes.push(
            <View
                key={i}
                style={{
                    position: 'absolute',
                    left: x - DASH_W / 2,
                    top: y - DASH_H / 2,
                    width: DASH_W,
                    height: DASH_H,
                    borderRadius: DASH_H / 2,
                    backgroundColor: dashColor,
                    transform: [{ rotate: `${angle}deg` }],
                }}
            />
        );
    }

    return <>{dashes}</>;
}

// ─── Lesson node ──────────────────────────────────────────────────────────────

function LessonNode({ lesson, index, isCurrent, onPress }: {
    lesson: ELesson; index: number; isCurrent: boolean;
    onPress: (l: ELesson) => void;
}) {
    const { main, shadow, iconColor } = nodeTheme(lesson);
    const cx = lesson.side === 'left' ? LEFT_CX : RIGHT_CX;
    const top = PADDING_TOP + index * V_SPACE;
    const nodeLeft = cx - NODE / 2;
    const isLeft = lesson.side === 'left';

    // Label area bounds
    const labelTop = top + NODE / 2 - 22;
    const labelStyle = isLeft
        ? { left: LEFT_CX + NODE / 2 + 14, right: 12, top: labelTop }
        : { right: SW - RIGHT_CX + NODE / 2 + 14, left: 12, top: labelTop };

    return (
        <>
            {/* "À faire" bubble above the current lesson */}
            {isCurrent && (
                <View style={[styles.bubble, { left: cx - 46, top: top - 52 }]}>
                    <Text style={styles.bubbleText}>À faire !</Text>
                    <View style={styles.bubbleTail} />
                </View>
            )}

            {/* 3D circle node */}
            <TouchableOpacity
                style={[styles.nodeWrapper, { left: nodeLeft, top }]}
                onPress={() => onPress(lesson)}
                disabled={lesson.locked}
                activeOpacity={lesson.locked ? 1 : 0.8}
            >
                {/* Shadow layer — peeks out at the bottom for 3D depth */}
                <View style={[styles.nodeShadow, { backgroundColor: shadow }]} />
                {/* Main circle */}
                <View style={[
                    styles.nodeCircle,
                    { backgroundColor: main },
                    isCurrent && styles.nodeCurrentGlow,
                ]}>
                    <Ionicons name={nodeIconName(lesson)} size={34} color={iconColor} />
                </View>
            </TouchableOpacity>

            {/* Label */}
            <View style={[styles.labelWrapper, labelStyle]}>
                <Text
                    style={[styles.labelTitle, lesson.locked && styles.labelLocked, !isLeft && styles.labelRight]}
                    numberOfLines={2}
                >
                    {lesson.title}
                </Text>
                {!lesson.locked && (
                    <View style={[styles.xpRow, { justifyContent: isLeft ? 'flex-start' : 'flex-end' }]}>
                        <Ionicons
                            name="flash"
                            size={11}
                            color={lesson.completed ? colors.green[700] : '#4B8EF5'}
                        />
                        <Text style={[styles.xpText, { color: lesson.completed ? colors.green[700] : '#4B8EF5' }]}>
                            {lesson.xp_gain} XP
                        </Text>
                    </View>
                )}
            </View>
        </>
    );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function LearningTab() {
    const [lessons, setLessons] = useState<ELesson[]>([]);
    const params = useLocalSearchParams();
    const chapter_id = Number(params.id || 1);

    const handleLessonPress = (lesson: ELesson) => {
        if (!lesson.locked) {
            router.push({
                pathname: '/(tabs)/learning/lesson-model',
                params: { object_lesson: JSON.stringify(lesson) },
            });
        }
    };

    const fetchLessons = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        const { data } = await getLessonsByChapter(chapter_id);

        let completedIds = new Set<number>();
        if (userId) {
            try {
                const { data: states } = await getLessonStateByUserId(userId, chapter_id);
                completedIds = new Set(
                    states
                        .filter((s: any) => s.is_finished)
                        .map((s: any) => s.lesson_id ?? s.lessons?.id)
                        .filter(Boolean)
                );
            } catch {}
        }

        setLessons(
            data.map((lesson: any, index: number) => {
                const isCompleted = completedIds.has(lesson.id);
                const prevCompleted = index === 0 ? true : completedIds.has(data[index - 1].id);
                return {
                    ...lesson,
                    side: index % 2 === 0 ? 'right' : 'left',
                    completed: isCompleted,
                    locked: index > 0 && !prevCompleted,
                };
            })
        );
    }, [chapter_id]);

    useFocusEffect(useCallback(() => { fetchLessons(); }, [fetchLessons]));

    const completedCount = lessons.filter(l => l.completed).length;
    const currentIndex = lessons.findIndex(l => !l.locked && !l.completed);
    const contentHeight = PADDING_TOP + lessons.length * V_SPACE + NODE + SHADOW_H + 140;
    const progress = lessons.length > 0 ? completedCount / lessons.length : 0;

    return (
        <View style={styles.container}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#000" />
                    <Text style={styles.backText}>Retour</Text>
                </TouchableOpacity>

                <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
                    </View>
                    <Text style={styles.progressLabel}>
                        {completedCount}/{lessons.length}
                    </Text>
                </View>
            </View>

            {/* ── Path ── */}
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={{ height: contentHeight, position: 'relative' }}>

                    {/* Connecting dot paths between consecutive nodes */}
                    {lessons.map((lesson, i) => {
                        if (i === 0) return null;
                        const prev = lessons[i - 1];
                        const prevCX = prev.side === 'left' ? LEFT_CX : RIGHT_CX;
                        const currCX = lesson.side === 'left' ? LEFT_CX : RIGHT_CX;
                        const fromY = PADDING_TOP + (i - 1) * V_SPACE + NODE + SHADOW_H;
                        const toY = PADDING_TOP + i * V_SPACE;
                        return (
                            <PathWavy
                                key={`path-${i}`}
                                fromX={prevCX}
                                fromY={fromY}
                                toX={currCX}
                                toY={toY}
                                locked={lesson.locked}
                            />
                        );
                    })}

                    {/* Lesson nodes */}
                    {lessons.map((lesson, i) => (
                        <LessonNode
                            key={lesson.id}
                            lesson={lesson}
                            index={i}
                            isCurrent={i === currentIndex}
                            onPress={handleLessonPress}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 58,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: colors.background,
        borderBottomWidth: 1.5,
        borderBottomColor: colors.blue[100],
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 16,
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    progressTrack: {
        flex: 1,
        height: 12,
        backgroundColor: colors.blue[100],
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.green[500],
        borderRadius: 6,
    },
    progressLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.blue[900],
        minWidth: 38,
        textAlign: 'right',
    },
    scroll: {
        flex: 1,
    },

    // ── Node ──
    nodeWrapper: {
        position: 'absolute',
        width: NODE,
        height: NODE + SHADOW_H,
    },
    nodeShadow: {
        position: 'absolute',
        top: SHADOW_H,
        left: 0,
        right: 0,
        height: NODE,
        borderRadius: NODE / 2,
    },
    nodeCircle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: NODE,
        borderRadius: NODE / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nodeCurrentGlow: {
        shadowColor: '#4B8EF5',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },

    // ── Label ──
    labelWrapper: {
        position: 'absolute',
    },
    labelTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.onBackground,
        lineHeight: 18,
    },
    labelLocked: {
        color: '#BEBEBE',
    },
    labelRight: {
        textAlign: 'right',
    },
    xpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginTop: 5,
    },
    xpText: {
        fontSize: 11,
        fontWeight: '700',
    },

    // ── "À faire" bubble ──
    bubble: {
        position: 'absolute',
        width: 92,
        backgroundColor: '#4B8EF5',
        borderRadius: 14,
        paddingHorizontal: 10,
        paddingVertical: 7,
        alignItems: 'center',
        zIndex: 20,
        shadowColor: '#4B8EF5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    bubbleText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    bubbleTail: {
        position: 'absolute',
        bottom: -7,
        alignSelf: 'center',
        width: 0,
        height: 0,
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderTopWidth: 7,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#4B8EF5',
    },
});
