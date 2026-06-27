import HomeHeader from '@/components/HomeHeader';
import MonthlySavingsGrid from '@/components/MonthlySavingsGrid';
import OverallSavingsGrid from '@/components/OverallSavingsGrid';
import RecentTransactions from '@/components/RecentTransactions';
import { Goal, getGoals } from '@/storage/goals';
import { Savings, clearAllSavings, getSavings } from '@/storage/savings';
import { colors, globalStyles } from '@/styles/global';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SavingsScreen() {
    const [savings, setSavings] = useState<Savings[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);

    const loadSavings = async () => {
        const data = await getSavings();
        const goalsData = await getGoals();

        setSavings(data);
        console.log('Loaded Savings:', data);
        setGoals(goalsData);
        console.log('Loaded Goals:', goalsData)
    
    };

    const handleClearAll = async () => {
        await clearAllSavings();
        loadSavings();
    };

    useFocusEffect(
        useCallback(() => {
            loadSavings();
        }, []),
    );

    return (
        <ScrollView style={globalStyles.container}>
            <Text style={globalStyles.title}>Savings Goals</Text>
            <HomeHeader />

            <TouchableOpacity style={styles.addSavingButton} onPress={() => router.push('/add-savings')}>
                <Text style={styles.addSavingButtonText}>+ Add Saving</Text>
            </TouchableOpacity>

            <Text style={globalStyles.sectionTitle}>This Month’s Goals</Text>
            <MonthlySavingsGrid savings={savings} goals={goals} />

            <View style={globalStyles.header}>
                <Text style={globalStyles.sectionTitle}>Overall Goals Summary</Text>
                <TouchableOpacity onPress={() => router.push('/add-goals')}>
                    <Text style={styles.manageButton}>Manage Goals</Text>
                </TouchableOpacity>
            </View>
            <OverallSavingsGrid savings={savings} goals={goals} />

            <Text style={globalStyles.sectionTitle}>Recent Savings</Text>
            <RecentTransactions savings={savings} onDelete={loadSavings} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    manageButton: {
        color: colors.primary,
        opacity: 0.85,
        fontSize: 16,
        
        marginTop: 20,
        marginBottom: 16,
    },

    addSavingButton: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 0,
    },
      
    addSavingButtonText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

      