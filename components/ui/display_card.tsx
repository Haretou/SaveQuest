import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';

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

export type props = {
    lesson: Lesson;
    onPress: (lesson: Lesson) => void;
};

export default function DisplayCard({ lesson, onPress } : props) {
    return (
        <View style={[
            styles.lessonWrapper,
            lesson.side === 'left' ? styles.lessonLeft : styles.lessonRight
        ]}>
            <TouchableOpacity
                style={[
                    styles.lessonCard,
                    lesson.completed && styles.lessonCompleted,
                    lesson.locked && styles.lessonLocked,
                ]}
                onPress={() => onPress(lesson)}
                disabled={lesson.locked}
                activeOpacity={0.7}
            >
                <View style={styles.lessonIcon}>
                    {lesson.locked ? (
                        <Ionicons name="lock-closed" size={24} color={colors.muted} />
                    ) : lesson.completed ? (
                        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                    ) : (
                        <Ionicons name="play-circle" size={24} color={colors.primary} />
                    )}
                </View>
                <Text style={[
                    styles.lessonTitle,
                    lesson.locked && styles.lessonTitleLocked
                ]}>
                    {lesson.title}
                </Text>
                {lesson.xp_gain > 0 && (
                    <View style={styles.xpBadge}>
                        <Ionicons name="star" size={12} color={colors.primary} />
                        <Text style={styles.xpText}>{lesson.xp_gain} XP</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    lessonWrapper: {
        position: 'absolute',
        width: '45%',
    },
    lessonLeft: {
        left: 0,
        paddingLeft: 20,
    },
    lessonRight: {
        right: 0,
        paddingRight: 20,
    },
    lessonCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: colors.muted,
    },
    lessonCompleted: {
        borderColor: colors.success,
        backgroundColor: colors.surface,
    },
    lessonLocked: {
        opacity: 0.5,
    },
    lessonIcon: {
        marginBottom: 8,
    },
    lessonTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.onSurface,
        textAlign: 'center',
    },
    lessonTitleLocked: {
        color: colors.muted,
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: colors.onPrimary,
        borderRadius: 12,
        gap: 4,
    },
    xpText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary,
    },
});
    