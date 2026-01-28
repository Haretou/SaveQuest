import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import colors from '../../../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { getUserProfile } from '@/lib/database/userProfile';
import { GetUserById, userID } from "../../../lib/database/user"

export default function ProfileTab() {
    console.log(userID)
    return (
        <>
        <SafeAreaView>
                <Text>User: ${}</Text>
        </SafeAreaView>
        </>
    )
}