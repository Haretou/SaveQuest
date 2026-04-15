import { getLessonsByChapter, getLessonStateByUserId } from '@/lib/database/lessons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import ChapterCard from '../../../components/ui/chapter_card';
import colors from '../../../styles/colors';
import { getChapters } from '@/lib/database/chapter';
import { router } from 'expo-router';
import { Chapter } from '@/lib/types';



export default function ChapterTab() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    

    const handleChapterPress = (chapter: Chapter) => {
        console.log('Ouvrir le chapitre:', chapter.title);
        router.push({ pathname: '/(tabs)/learning/lessons', params: { id: chapter.id } });
    };

    useEffect(() => {
        const fetchChapters = async () => {
        const {data, message} = await getChapters();
        const enrichedChapters = data.map((chapter: any, index: number) => {
              
            return {
                ...chapter,
            };
        });
        setChapters(enrichedChapters);
        };

        fetchChapters();
    }, []);
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mon Parcours</Text>
                <Text style={styles.subtitle}>Continue ton apprentissage</Text>
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {chapters.map((chapter) => (
                    <ChapterCard 
                        key={chapter.id} 
                        chapter={chapter} 
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
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#000000',
        opacity: 0.6,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 16,
        paddingBottom: 120,
    },
});