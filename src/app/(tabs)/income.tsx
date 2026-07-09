import OverallMonthIncomeCard from '@/components/OverallMonthIncomeCard';
import RecentIncomeItems from '@/components/RecentMonthIncomeItems';
import { Income, deleteIncome, getIncome } from '@/storage/income';
import { colors, globalStyles } from '@/styles/global';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function IncomeScreen() {
  const [income, setIncome] = useState<Income[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const loadIncome = async () => {
    const data = await getIncome();
    setIncome(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadIncome();
    }, [])
  );

  const goToPreviousMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const selectedMonthIncome = income.filter((item) => {
    if (!item.date) return false;

    const incomeDate = new Date(item.date);

    return (
      incomeDate.getMonth() === selectedMonth.getMonth() &&
      incomeDate.getFullYear() === selectedMonth.getFullYear()
    );
  });

  const selectedMonthIncomeTotal = selectedMonthIncome.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const handleDeleteIncome = async (id: string) => {
    await deleteIncome(id);
    loadIncome();
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Income</Text>

        <TouchableOpacity onPress={() => router.push('/add-income')}>
          <Text style={styles.addButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.monthSelector}>
  <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
    <Text style={styles.monthArrow}>‹</Text>
  </TouchableOpacity>

  <Text style={styles.monthText}>
    {selectedMonth.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })}
  </Text>

  <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
    <Text style={styles.monthArrow}>›</Text>
  </TouchableOpacity>
</View>

      <OverallMonthIncomeCard
  total={selectedMonthIncomeTotal}
  count={selectedMonthIncome.length}
/>

      <Text style={styles.sectionTitle}>Income Records</Text>

      {selectedMonthIncome.length === 0 ? (
        <Text style={styles.emptyText}>No income for this month</Text>
      ) : (
        selectedMonthIncome.map((income) => (
            <RecentIncomeItems
            key={income.id}
            id={income.id}
            name={income.name}
            value={`${income.value}`}
            date={income.date}
            accountType={income.accountType}
            bankName={income.bankName}
            onDelete={handleDeleteIncome}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  monthSelector: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  
  monthButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  monthArrow: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 30,
  },
  
  monthText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    minWidth: 150,
    textAlign: 'center',
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 12,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },

  
});