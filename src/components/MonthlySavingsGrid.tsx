import { Goal } from '@/storage/goals';
import { Savings } from '@/storage/savings';
import { StyleSheet, View } from 'react-native';
import SavingsItem from './SavingsItems';

type MonthlySavingsGridProps = {
  savings: Savings[];
  goals: Goal[];
};

const getMonthsUntilDeadline = (deadline: string) => {
  const today = new Date();
  const endDate = new Date(deadline);

  if (Number.isNaN(endDate.getTime())) {
    return 1;
  }

  const yearDiff = endDate.getFullYear() - today.getFullYear();
  const monthDiff = endDate.getMonth() - today.getMonth();

  const totalMonths = yearDiff * 12 + monthDiff + 1;

  return Math.max(totalMonths, 1);
};

export default function MonthlySavingsGrid({
  savings = [],
  goals = [],
}: MonthlySavingsGridProps) {
  return (
    <View style={styles.grid}>
      {goals.map((goal) => {
        const thisMonthTotal = savings
          .filter((saving) => {
            const savingDate = new Date(saving.createdAt);
            const today = new Date();

            return (
              saving.types === goal.name &&
              savingDate.getMonth() === today.getMonth() &&
              savingDate.getFullYear() === today.getFullYear()
            );
          })
          .reduce((sum, saving) => sum + saving.value, 0);

        const monthsLeft = getMonthsUntilDeadline(goal.deadline);
        const monthlyTarget = Math.ceil(goal.target / monthsLeft);

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