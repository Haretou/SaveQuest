/**
 * ⚠️ COMPOSANT DE TEST - À SUPPRIMER EN PRODUCTION ⚠️
 *
 * Ce bouton permet de tester le système de quêtes et de niveaux
 * en simulant la complétion de leçons.
 */

import React, { useState } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { Button } from 'react-native-paper';
import { supabase } from '@/lib/supabase';
import { completeLesson } from '@/lib/database/lessons';
import colors from '@/styles/colors';

type TestButtonProps = {
    onSuccess?: () => void;
};

export default function TestButton({ onSuccess }: TestButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleCompleteLesson = async () => {
        setLoading(true);
        try {
            // Récupérer l'utilisateur connecté
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                Alert.alert('Erreur', 'Non connecté');
                return;
            }

            // Récupérer toutes les leçons
            const { data: allLessons, error: lessonError } = await supabase
                .from('lessons')
                .select('id, title, xp_gain')
                .order('id');

            if (lessonError || !allLessons || allLessons.length === 0) {
                Alert.alert('Erreur', 'Aucune leçon trouvée en BDD. Exécute test_data.sql d\'abord !');
                return;
            }

            // Récupérer les leçons déjà complétées
            const { data: completedLessons } = await supabase
                .from('lesson_states')
                .select('lesson_id')
                .eq('user_id', session.user.id)
                .eq('is_finished', true);

            const completedIds = completedLessons?.map(ls => ls.lesson_id) || [];

            // Trouver une leçon non complétée
            const availableLesson = allLessons.find(l => !completedIds.includes(l.id));

            if (!availableLesson) {
                Alert.alert('Info', 'Toutes les leçons sont déjà complétées ! Utilisez le bouton de réinitialisation.');
                return;
            }

            // Compléter la leçon
            const result = await completeLesson(session.user.id, availableLesson.id);

            if (result.success) {
                let message = `✅ Leçon "${availableLesson.title}" complétée !\n+${result.xpGained} XP`;

                if (result.leveledUp) {
                    message += `\n\n🎉 NIVEAU UP ! Niveau ${result.newLevel}`;
                }

                Alert.alert('Succès', message, [
                    { text: 'OK', onPress: () => onSuccess?.() }
                ]);
            } else {
                Alert.alert('Info', result.message);
            }
        } catch (error: any) {
            Alert.alert('Erreur', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        Alert.alert(
            'Réinitialisation',
            'Voulez-vous vraiment réinitialiser toutes vos données de test ? (XP, niveau, leçons, quêtes)',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Réinitialiser',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const { data: { session } } = await supabase.auth.getSession();
                            if (!session?.user) {
                                Alert.alert('Erreur', 'Non connecté');
                                return;
                            }

                            // Supprimer tous les lesson_states
                            await supabase
                                .from('lesson_states')
                                .delete()
                                .eq('user_id', session.user.id);

                            // Supprimer tous les user_progress (quêtes)
                            await supabase
                                .from('user_progress')
                                .delete()
                                .eq('user_id', session.user.id);

                            // Réinitialiser le profil utilisateur
                            await supabase
                                .from('users')
                                .update({
                                    level: 1,
                                    points: 0,
                                    preferences: { completed_quests: [] }
                                })
                                .eq('id', session.user.id);

                            Alert.alert('Succès', 'Données réinitialisées ! Niveau 1, 0 XP', [
                                { text: 'OK', onPress: () => onSuccess?.() }
                            ]);
                        } catch (error: any) {
                            Alert.alert('Erreur', error.message);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Button
                mode="contained"
                onPress={handleCompleteLesson}
                loading={loading}
                disabled={loading}
                icon="flask"
                buttonColor={colors.secondary}
                style={styles.testButton}
            >
                Tester : Compléter une leçon
            </Button>

            <Button
                mode="outlined"
                onPress={handleReset}
                loading={loading}
                disabled={loading}
                icon="refresh"
                textColor={colors.error}
                style={styles.resetButton}
            >
                Réinitialiser les données de test
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 10,
        gap: 8,
    },
    testButton: {
        borderRadius: 12,
    },
    resetButton: {
        borderRadius: 12,
        borderColor: colors.error,
    },
});
