
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../../styles/colors';
import { useLocalSearchParams } from 'expo-router';
import { Lesson } from '@/lib/types';
import { useEffect } from 'react';
import React from 'react';


export default function LessonPage() {
   
    const params = useLocalSearchParams();
    const lesson = JSON.parse(params.object_lesson as string) as Lesson;
  
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{lesson.title}</Text>
                <Text style={styles.subtitle}>{lesson.description}</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
            >

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
    },
});