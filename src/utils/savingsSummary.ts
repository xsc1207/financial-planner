import { Savings } from '@/storage/savings';
import { Goal } from '@/storage/savingsgoals';
import { getMonthlyTargetForSelectedMonth } from '@/utils/goalSummary';

export const getMonthlyTotalForGoal = (
  savings: Savings[],
  goalId: string,
) => {
  return savings
    .filter((saving) => saving.goalId === goalId)
    .reduce((sum, saving) => sum + Number(saving.value || 0), 0);
};

export const getMonthlySavingsSummary = (
  savings: Savings[],
  goals: Goal[],
  allSavings: Savings[] = savings,
  selectedMonth: Date = new Date(),
) => {
  const totalMonthlySavings = goals.reduce((sum, goal) => {
    return sum + getMonthlyTotalForGoal(savings, goal.id);
  }, 0);

  const totalMonthlyTarget = goals.reduce((sum, goal) => {
    return (
      sum +
      getMonthlyTargetForSelectedMonth(
        goal,
        allSavings,
        selectedMonth,
      )
    );
  }, 0);

  const percentage =
    totalMonthlyTarget > 0
      ? Math.round((totalMonthlySavings / totalMonthlyTarget) * 100)
      : 0;

  return {
    totalMonthlySavings,
    totalMonthlyTarget,
    percentage,
  };
};