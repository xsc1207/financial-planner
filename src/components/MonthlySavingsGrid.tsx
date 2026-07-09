import { Savings } from '@/storage/savings';
import { Goal } from '@/storage/savingsgoals';
import { colors } from '@/styles/global';
import { getCurrentMonthlyTarget } from '@/utils/goalSummary';
import { getMonthlyTotalForGoal } from '@/utils/savingsSummary';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SavingsItem from './SavingsItems';

type MonthlySavingsGridProps = {
  savings: Savings[];
  goals: Goal[];
  allSavings: Savings[];
};

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

export default function MonthlySavingsGrid({
  savings = [],
  goals = [],
  allSavings = [],
}: MonthlySavingsGridProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const goalPages = chunkArray(goals, 4);

  return (
    <View
      style={styles.wrapper}
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width);
      }}
    >
      {containerWidth > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {goalPages.map((pageGoals, pageIndex) => (
            <View
              key={pageIndex}
              style={[
                styles.page,
                {
                  width: containerWidth,
                },
              ]}
            >
              {pageGoals.map((goal) => {
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
          ))}
        </ScrollView>
      )}

      {goals.length > 4 && (
        <Text style={styles.swipeHint}>Swipe to view more goals →</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    overflow: 'hidden',
  },

  scrollView: {
    width: '100%',
  },

  scrollContent: {
    paddingBottom: 8,
  },

  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  swipeHint: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
});