import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';

type UserLevelHeaderProps = {
    level: number;
    currentXP: number;
    requiredXP: number;
    percentage: number;
};

export default function UserLevelHeader({ level, currentXP, requiredXP, percentage }: UserLevelHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.levelBadge}>
                <Text style={styles.levelLabel}>Niveau</Text>
                <Text style={styles.levelNumber}>{level}</Text>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressInfo}>
                    <Text style={styles.progressLabel}>Progression vers niveau {level + 1}</Text>
                    <Text style={styles.xpText}>
                        {currentXP} / {requiredXP} XP ({percentage}%)
                    </Text>
                </View>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${Math.min(percentage, 100)}%` }
                        ]}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,            // Blanc pur - style Figma
        marginHorizontal: 20,
        marginVertical: 16,
        padding: 20,
        borderRadius: 20,                              // Corners bien arrondis
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        gap: 16,
    },
    levelBadge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.green[500],            // Vert vibrant - style Figma
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.green[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    levelLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#000000',                              // Noir sur vert - style Figma
        opacity: 0.7,
        textTransform: 'uppercase',
    },
    levelNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',                              // Noir sur vert - style Figma
        marginTop: 2,
    },
    progressSection: {
        flex: 1,
        gap: 8,
    },
    progressInfo: {
        flexDirection: 'column',
        gap: 4,
    },
    progressLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000000',                              // Noir - style Figma
    },
    xpText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',                              // Noir - style Figma
        opacity: 0.6,
    },
    progressBar: {
        height: 12,
        backgroundColor: '#E5E7EB',                    // Gris léger - background barre
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.green[500],            // Vert vibrant - progression
        borderRadius: 6,
    },
});
