import { Goal } from '@/storage/goals';
import { Savings } from '@/storage/savings';
import {
  getMonthlyTargetForGoal,
  getMonthlyTotalForGoal,
} from '@/utils/savingsSummary';
import { StyleSheet, View } from 'react-native';
import SavingsItem from './SavingsItems';

type MonthlySavingsGridProps = {
  savings: Savings[];
  goals: Goal[];
};

export default function MonthlySavingsGrid({
  savings = [],
  goals = [],
}: MonthlySavingsGridProps) {
  return (
    <View style={styles.grid}>
      {goals.map((goal) => {
        const thisMonthTotal = getMonthlyTotalForGoal(savings, goal.name);
        const monthlyTarget = getMonthlyTargetForGoal(goal);

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