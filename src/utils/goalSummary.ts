import { Savings } from '@/storage/savings';
import { Goal, GoalPlan } from '@/storage/savingsgoals';

export const getMonthValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
};

export const getMonthStart = (monthString: string) => {
  return new Date(`${monthString}-01`);
};

export const getRemainingMonths = (
  fromMonth: string,
  deadline: string,
) => {
  if (!fromMonth || !deadline) return 0;

  const fromDate = getMonthStart(fromMonth);
  const deadlineDate = getMonthStart(deadline);

  if (
    Number.isNaN(fromDate.getTime()) ||
    Number.isNaN(deadlineDate.getTime())
  ) {
    return 0;
  }

  const months =
    (deadlineDate.getFullYear() - fromDate.getFullYear()) * 12 +
    (deadlineDate.getMonth() - fromDate.getMonth()) +
    1;

  return Math.max(months, 0);
};

export const getSavedAmountBeforeMonth = (
  savings: Savings[],
  goalId: string,
  monthString: string,
) => {
  const monthStart = getMonthStart(monthString);

  return savings
    .filter((saving) => {
      if (saving.goalId !== goalId) return false;

      const dateValue = saving.date || saving.createdAt;
      if (!dateValue) return false;

      const savingDate = new Date(dateValue);

      return savingDate < monthStart;
    })
    .reduce((sum, saving) => sum + Number(saving.value || 0), 0);
};

export const getPlanForMonth = (
  goal: Goal,
  selectedMonth: Date,
): GoalPlan | null => {
  const selectedMonthValue = getMonthValue(selectedMonth);

  const plans = goal.plans || [];

  if (plans.length === 0) return null;

  const availablePlans = plans
    .filter((plan) => plan.effectiveMonth <= selectedMonthValue)
    .sort((a, b) => b.effectiveMonth.localeCompare(a.effectiveMonth));

  return availablePlans[0] || null;
};

export const getMonthlyTargetForSelectedMonth = (
  goal: Goal,
  allSavings: Savings[],
  selectedMonth: Date,
) => {
  const selectedMonthValue = getMonthValue(selectedMonth);

  const plan = getPlanForMonth(goal, selectedMonth);

  if (!plan) return 0;

  const savedBeforeSelectedMonth = getSavedAmountBeforeMonth(
    allSavings,
    goal.id,
    selectedMonthValue,
  );

  const remainingAmount = Math.max(
    Number(plan.target || 0) - savedBeforeSelectedMonth,
    0,
  );

  const remainingMonths = getRemainingMonths(
    selectedMonthValue,
    plan.deadline,
  );

  if (remainingMonths <= 0) return 0;

  return Math.ceil(remainingAmount / remainingMonths);
};