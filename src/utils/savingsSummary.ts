import { Goal } from '@/storage/goals';
import { Savings } from '@/storage/savings';

export const getMonthsUntilDeadline = (deadline: string) => {
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

export const getMonthlyTotalForGoal = (
  savings: Savings[],
  goalName: string
) => {
  const today = new Date();

  return savings
    .filter((saving) => {
      const savingDate = new Date(saving.createdAt);

      return (
        saving.types === goalName &&
        savingDate.getMonth() === today.getMonth() &&
        savingDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, saving) => sum + Number(saving.value || 0), 0);
};

export const getMonthlyTargetForGoal = (goal: Goal) => {
  const monthsLeft = getMonthsUntilDeadline(goal.deadline);
  return Math.ceil(Number(goal.target || 0) / monthsLeft);
};

export const getMonthlySavingsSummary = (
  savings: Savings[],
  goals: Goal[]
) => {
  const totalMonthlySavings = goals.reduce((sum, goal) => {
    return sum + getMonthlyTotalForGoal(savings, goal.name);
  }, 0);

  const totalMonthlyTarget = goals.reduce((sum, goal) => {
    return sum + getMonthlyTargetForGoal(goal);
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