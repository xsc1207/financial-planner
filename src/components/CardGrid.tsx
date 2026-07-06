import { Goal } from '@/storage/goals';
import { Income } from '@/storage/income';
import { Savings } from '@/storage/savings';
import { getThisMonthIncomeTotal } from '@/utils/incomeSummary';
import { getMonthlySavingsSummary } from '@/utils/savingsSummary';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Card from './Card';

type CardGridProps = {
  income: Income[];
  savings: Savings[];
  goals: Goal[];
};

export default function CardGrid({ income = [], savings = [], goals = [] }: CardGridProps) {
  const {
    totalMonthlySavings,
    totalMonthlyTarget,
    percentage,
  } = getMonthlySavingsSummary(savings, goals);

  const thisMonthIncomeTotal = getThisMonthIncomeTotal(income);

  return (
    <View style={styles.grid}>
      <TouchableOpacity
  style={styles.cardWrapper}
  onPress={() => router.replace('/(tabs)/income')}
  activeOpacity={0.8}
>
  <Card
    label="Income"
    percentage=""
    value={`£${thisMonthIncomeTotal}`}
    goal=""
    color="#ff6b6b"
  />
</TouchableOpacity>

      <View style={styles.cardWrapper}>
        <Card
          label="Expenses"
          percentage="50"
          value="£0"
          goal="£2000"
          color="#4ecdc4"
        />
      </View>

      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => router.replace('/(tabs)/savings')}
        activeOpacity={0.8}
      >
        <Card
          label="Savings"
          percentage={`${percentage}`}
          value={`£${totalMonthlySavings}`}
          goal={`£${totalMonthlyTarget}`}
          color="blue"
        />
      </TouchableOpacity>

      <View style={styles.cardWrapper}>
        <Card
          label="Loans"
          percentage="50"
          value="£0"
          goal="£2000"
          color="orange"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  cardWrapper: {
    width: '100%',
  },
});