import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router, useFocusEffect } from 'expo-router';
import colors from '../../../styles/colors';
import { supabase } from '@/lib/supabase';
import { Logout } from '@/lib/database/user';
import { getUserProfile } from '@/lib/database/userProfile';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilTab() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    useFocusEffect(
        useCallback(() => {
            loadUserData();
        }, [])
    );

    const loadUserData = async () => {
        try {
            // Récupérer l'utilisateur connecté
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                router.replace('/(auth)/login');
                return;
            }

            setUser(session.user);

            // Récupérer le profil
            const { data: userProfile } = await getUserProfile(session.user.id);
            if (userProfile) {
                setProfile(userProfile);
            }
        } catch {
            // Erreur silencieuse
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await Logout();
                            router.replace('/(auth)/login');
                        } catch {
                            Alert.alert('Erreur', 'Impossible de se déconnecter');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profil</Text>
                <Text style={styles.subtitle}>Gérer votre compte</Text>
            </View>

            <View style={styles.content}>
                {/* Carte utilisateur */}
                <View style={styles.userCard}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={48} color={colors.onPrimary} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                            {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Utilisateur'}
                        </Text>
                        <Text style={styles.userEmail}>{user?.email}</Text>
                    </View>
                </View>

                {/* Stats */}
                {profile && (
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Ionicons name="trophy" size={24} color={colors.primary} />
                            <Text style={styles.statValue}>{profile.level}</Text>
                            <Text style={styles.statLabel}>Niveau</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="star" size={24} color="#F59E0B" />
                            <Text style={styles.statValue}>{profile.points}</Text>
                            <Text style={styles.statLabel}>Points XP</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="flame" size={24} color="#EF4444" />
                            <Text style={styles.statValue}>{profile.streak}</Text>
                            <Text style={styles.statLabel}>Jours</Text>
                        </View>
                    </View>
                )}

                {/* Bouton déconnexion */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>
            </View>
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
    content: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#000000',
        opacity: 0.6,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#000000',
        opacity: 0.6,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#000000',
        opacity: 0.6,
        textTransform: 'uppercase',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: 16,
        gap: 8,
        borderWidth: 2,
        borderColor: '#EF4444' + '40',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#EF4444',
    },
});
