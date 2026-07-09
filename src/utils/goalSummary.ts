import { Savings } from '@/storage/savings';
import { Goal } from '@/storage/savingsgoals';

export const getGoalSavedAmount = (
  savings: Savings[],
  goalId: string,
) => {
  return savings
    .filter((saving) => saving.goalId === goalId)
    .reduce((sum, saving) => sum + saving.value, 0);
};

export const getSavedAmountBeforeMonth = (
  savings: Savings[],
  goalId: string,
  monthDate: Date,
) => {
  const monthStart = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1,
  );

  return savings
    .filter((saving) => {
      if (saving.goalId !== goalId) return false;
      if (!saving.date) return false;

      const savingDate = new Date(saving.date);

      return savingDate < monthStart;
    })
    .reduce((sum, saving) => sum + saving.value, 0);
};

export const getRemainingMonths = (
  fromMonth: Date,
  deadline: string,
) => {
  if (!deadline) return 0;

  const fromMonthStart = new Date(
    fromMonth.getFullYear(),
    fromMonth.getMonth(),
    1,
  );

  const deadlineDate = new Date(`${deadline}-01`);

  const deadlineMonthStart = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    1,
  );

  const months =
    (deadlineMonthStart.getFullYear() - fromMonthStart.getFullYear()) * 12 +
    (deadlineMonthStart.getMonth() - fromMonthStart.getMonth()) +
    1;

  return Math.max(months, 0);
};

export const getCurrentMonthlyTarget = (
  goal: Goal,
  allSavings: Savings[],
) => {
  const today = new Date();

  const savedBeforeCurrentMonth = getSavedAmountBeforeMonth(
    allSavings,
    goal.id,
    today,
  );

  const remainingAmount = Math.max(
    goal.target - savedBeforeCurrentMonth,
    0,
  );

  const remainingMonths = getRemainingMonths(today, goal.deadline);

  if (remainingMonths <= 0) return 0;

  return Math.ceil(remainingAmount / remainingMonths);
};