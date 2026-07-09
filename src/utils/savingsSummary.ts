import { Savings } from '@/storage/savings';
import { Goal } from '@/storage/savingsgoals';
import { getCurrentMonthlyTarget } from '@/utils/goalSummary';

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
) => {
  const totalMonthlySavings = goals.reduce((sum, goal) => {
    return sum + getMonthlyTotalForGoal(savings, goal.id);
  }, 0);

  const totalMonthlyTarget = goals.reduce((sum, goal) => {
    return sum + getCurrentMonthlyTarget(goal, allSavings);
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