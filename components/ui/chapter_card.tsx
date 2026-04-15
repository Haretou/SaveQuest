import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import colors from '../../styles/colors';

type Chapter = {
    id: number;
    title: string;
    description: string | null;
    order_index: number;
};

export type props = {
    chapter: Chapter;
    onPress: (chapter: Chapter) => void;
};

export default function ChapterCard({ chapter, onPress } : props) {
    return (
        <TouchableOpacity
            style={styles.chapterCard}
            onPress={() => onPress(chapter)}
            activeOpacity={0.8}
        >
            <View style={styles.cardContent}>
                <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="book" size={28} color={colors.onPrimary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.chapterNumber}>Chapitre {chapter.order_index}</Text>
                        <Text style={styles.chapterTitle}>{chapter.title}</Text>
                        {chapter.description && (
                            <Text style={styles.chapterDescription} numberOfLines={2}>
                                {chapter.description}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={styles.rightSection}>
                    <Ionicons name="chevron-forward" size={24} color={colors.primary} />
                </View>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    chapterCard: {
        backgroundColor: colors.background,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    chapterNumber: {
        fontSize: 11,
        fontWeight: '600',
        color: '#000000',
        opacity: 0.5,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    chapterTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 2,
    },
    chapterDescription: {
        fontSize: 13,
        color: '#000000',
        opacity: 0.6,
        lineHeight: 18,
    },
    rightSection: {
        marginLeft: 12,
        opacity: 0.6,
    },
});