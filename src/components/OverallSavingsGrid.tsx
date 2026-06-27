import { Goal } from '@/storage/goals';
import { Savings } from '@/storage/savings';
import { StyleSheet, View } from 'react-native';
import SavingsItem from './SavingsItems';

type SavingsGridProps = {
  savings: Savings[];
  goals: Goal[];
};

const formatMonthYear = (deadline?: string | number) => {
  if (!deadline) return 'No deadline';

  const deadlineString = String(deadline);

  let date: Date;

  if (deadlineString.length === 7) {
    // example: 2027-08
    date = new Date(`${deadlineString}-01`);
  } else {
    // example: 2027-08-25
    date = new Date(deadlineString);
  }

  if (Number.isNaN(date.getTime())) {
    return 'No deadline';
  }

  return date.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
};

export default function OverallSavingsGrid({
  savings = [],
  goals = [],
}: SavingsGridProps) {
  return (
    <View style={styles.grid}>
      {goals.map((goal) => {
        const total = savings
          .filter((saving) => saving.types === goal.name)
          .reduce((sum, saving) => sum + saving.value, 0);

        return (
          <SavingsItem
            key={goal.id}
            label={goal.name}
            value={`${total}`}
            goal={`${goal.target}`}
            deadline={`${formatMonthYear(goal.deadline)}`}
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