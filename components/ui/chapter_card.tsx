import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import colors from '../../styles/colors';

const BADGE = 54;
const BADGE_SHADOW = 4;

const THEMES = [
    { main: colors.primary,  shadow: colors.green[800] },
    { main: '#4B8EF5',       shadow: '#1E3FA0' },
    { main: colors.green[400], shadow: colors.green[700] },
];

type Chapter = {
    id: number;
    title: string;
    description: string | null;
    order_index: number;
};

export type props = {
    chapter: Chapter;
    progress?: { total: number; completed: number };
    onPress: (chapter: Chapter) => void;
};

export default function ChapterCard({ chapter, progress, onPress }: props) {
    const theme = THEMES[(chapter.order_index - 1) % THEMES.length];
    const pct = progress && progress.total > 0
        ? Math.round((progress.completed / progress.total) * 100)
        : 0;
    const isDone = !!progress && progress.completed === progress.total && progress.total > 0;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(chapter)}
            activeOpacity={0.75}
        >
            {/* 3D badge */}
            <View style={styles.badgeWrap}>
                <View style={[styles.badgeShadow, { backgroundColor: theme.shadow }]} />
                <View style={[styles.badge, { backgroundColor: theme.main }]}>
                    {isDone
                        ? <Ionicons name="checkmark" size={26} color="#fff" />
                        : <Text style={styles.badgeNum}>{String(chapter.order_index).padStart(2, '0')}</Text>
                    }
                </View>
            </View>

            {/* Text + progress */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{chapter.title}</Text>
                {chapter.description && (
                    <Text style={styles.desc} numberOfLines={2}>{chapter.description}</Text>
                )}
                {progress !== undefined && progress.total > 0 && (
                    <View style={styles.progressRow}>
                        <View style={styles.progressTrack}>
                            <View style={[
                                styles.progressFill,
                                { width: `${pct}%`, backgroundColor: isDone ? colors.green[500] : colors.primary },
                            ]} />
                        </View>
                        <Text style={[styles.progressCount, isDone && styles.progressCountDone]}>
                            {progress.completed}/{progress.total}
                        </Text>
                    </View>
                )}
            </View>

            <Ionicons name="chevron-forward" size={18} color={colors.primary} style={styles.arrow} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 6,
        paddingHorizontal: 18,
        paddingVertical: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
        gap: 16,
    },
    badgeWrap: {
        width: BADGE,
        height: BADGE + BADGE_SHADOW,
        position: 'relative',
        flexShrink: 0,
    },
    badgeShadow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: BADGE,
        borderRadius: BADGE / 2,
    },
    badge: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: BADGE,
        borderRadius: BADGE / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeNum: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
        gap: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.onBackground,
        lineHeight: 22,
    },
    desc: {
        fontSize: 12,
        color: colors.onBackground,
        opacity: 0.5,
        lineHeight: 17,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 7,
    },
    progressTrack: {
        flex: 1,
        height: 6,
        backgroundColor: colors.blue[100],
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressCount: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.primary,
        minWidth: 28,
        textAlign: 'right',
    },
    progressCountDone: {
        color: colors.green[600],
    },
    arrow: {
        opacity: 0.6,
        flexShrink: 0,
    },
});
