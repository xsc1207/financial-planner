import HomeHeader from '@/components/HomeHeader';
import OverallMonthIncomeCard from '@/components/OverallMonthIncomeCard';
import RecentIncome from '@/components/RecentMonthIncome';
import { Income, clearAllIncome, getIncome } from '@/storage/income';
import { colors, globalStyles } from '@/styles/global';
import { getThisMonthIncomeTotal } from '@/utils/incomeSummary';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function IncomeScreen() {
    const [income, setIncome] = useState<Income[]>([]);

    const loadIncome = async () => {
        const data = await getIncome();

        setIncome(data);
        console.log('Loaded Income:', data);
    
    };

    const handleClearAll = async () => {
        await clearAllIncome();
        loadIncome();
    };

    useFocusEffect(
        useCallback(() => {
            loadIncome();
        }, []),
    );

    const thisMonthIncomeTotal = getThisMonthIncomeTotal(income);

  return (
    <ScrollView style={globalStyles.container}>
        <Text style={globalStyles.title}>Incomes</Text>
        <HomeHeader />
        <TouchableOpacity
            style={styles.addIncomeButton}
            onPress={() => router.push('/add-income')}
        >
            <Text style={styles.addIncomeButtonText}>+ Add Income</Text>
        </TouchableOpacity>

        <OverallMonthIncomeCard total={thisMonthIncomeTotal} />

        <Text style={globalStyles.sectionTitle}>Total Income</Text>
        <RecentIncome income={income} onDelete={loadIncome} />


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

    addIncomeButton: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 0,
    },
      
    addIncomeButtonText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

      