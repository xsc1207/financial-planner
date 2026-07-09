import { Savings } from '@/storage/savings';
import { Goal } from '@/storage/savingsgoals';
import { getCurrentMonthlyTarget } from '@/utils/goalSummary';
import { getMonthlyTotalForGoal } from '@/utils/savingsSummary';
import { StyleSheet, View } from 'react-native';
import SavingsItem from './SavingsItems';

type MonthlySavingsGridProps = {
  savings: Savings[];
  goals: Goal[];
  allSavings: Savings[];
};

export default function MonthlySavingsGrid({
  savings = [],
  goals = [],
  allSavings = [],
}: MonthlySavingsGridProps) {
  return (
    <View style={styles.grid}>
      {goals.map((goal) => {
        const thisMonthTotal = getMonthlyTotalForGoal(
          savings,
          goal.id,
        );

        const monthlyTarget = getCurrentMonthlyTarget(
          goal,
          allSavings,
        );

        return (
          <SavingsItem
            key={goal.id}
            label={goal.name}
            value={`${thisMonthTotal}`}
            goal={`${monthlyTarget}`}
            color={goal.color}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});