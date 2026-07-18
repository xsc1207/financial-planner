import {
  FixedExpense,
  FlexibleExpense,
  FlexibleExpenseCategory,
} from '@/storage/expenses';

export const getFlexibleExpensesForMonth = (
  flexibleExpenses: FlexibleExpense[],
  selectedMonth: Date,
): FlexibleExpense[] => {
  return flexibleExpenses.filter((expense) => {
    const dateValue = expense.date || expense.createdAt;

    if (!dateValue) return false;

    const expenseDate = new Date(dateValue);

    return (
      expenseDate.getMonth() === selectedMonth.getMonth() &&
      expenseDate.getFullYear() === selectedMonth.getFullYear()
    );
  });
};

export const getActiveFixedExpenses = (
  fixedExpenses: FixedExpense[],
): FixedExpense[] => {
  return fixedExpenses.filter((expense) => expense.isActive === 'yes');
};

export const getDirectDebitDateForMonth = (
  expense: FixedExpense,
  selectedMonth: Date,
): Date | null => {
  if (
    expense.paymentMethod !== 'directDebit' ||
    !expense.paymentDayOfMonth
  ) {
    return null;
  }

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  const validDay = Math.min(
    Number(expense.paymentDayOfMonth),
    lastDayOfMonth,
  );

  return new Date(year, month, validDay);
};

export const getDueFixedExpensesForMonth = (
  fixedExpenses: FixedExpense[],
  selectedMonth: Date,
): FixedExpense[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return getActiveFixedExpenses(fixedExpenses).filter((expense) => {
    const directDebitDate = getDirectDebitDateForMonth(
      expense,
      selectedMonth,
    );

    if (!directDebitDate) return false;

    directDebitDate.setHours(0, 0, 0, 0);

    return directDebitDate <= today;
  });
};

export const getMonthlyFixedExpensesTotal = (
  fixedExpenses: FixedExpense[],
  selectedMonth: Date,
): number => {
  return getDueFixedExpensesForMonth(fixedExpenses, selectedMonth).reduce(
    (sum, expense) => sum + Number(expense.monthlyAmount || 0),
    0,
  );
};

export const getMonthlyFlexibleExpensesTotal = (
  flexibleExpenses: FlexibleExpense[],
  selectedMonth: Date,
): number => {
  const selectedMonthExpenses = getFlexibleExpensesForMonth(
    flexibleExpenses,
    selectedMonth,
  );

  return selectedMonthExpenses.reduce(
    (sum, expense) => sum + Number(expense.value || 0),
    0,
  );
};

export const getMonthlyTotalExpenses = (
  fixedExpenses: FixedExpense[],
  flexibleExpenses: FlexibleExpense[],
  selectedMonth: Date,
): number => {
  const fixedTotal = getMonthlyFixedExpensesTotal(
    fixedExpenses,
    selectedMonth,
  );

  const flexibleTotal = getMonthlyFlexibleExpensesTotal(
    flexibleExpenses,
    selectedMonth,
  );

  return fixedTotal + flexibleTotal;
};

export const getFlexibleTotalByCategory = (
  flexibleExpenses: FlexibleExpense[],
  category: FlexibleExpenseCategory,
  selectedMonth: Date,
): number => {
  const selectedMonthExpenses = getFlexibleExpensesForMonth(
    flexibleExpenses,
    selectedMonth,
  );

  return selectedMonthExpenses
    .filter((expense) => expense.category === category)
    .reduce((sum, expense) => sum + Number(expense.value || 0), 0);
};

export const getFlexibleCategorySummary = (
  flexibleExpenses: FlexibleExpense[],
  selectedMonth: Date,
) => {
  const selectedMonthExpenses = getFlexibleExpensesForMonth(
    flexibleExpenses,
    selectedMonth,
  );

  const summary = selectedMonthExpenses.reduce(
    (result, expense) => {
      const category = expense.category;

      if (!result[category]) {
        result[category] = 0;
      }

      result[category] += Number(expense.value || 0);

      return result;
    },
    {} as Record<FlexibleExpenseCategory, number>,
  );

  return summary;
};

export const getFixedExpenseTotalByCategory = (
  fixedExpenses: FixedExpense[],
  category: FixedExpense['category'],
  selectedMonth: Date,
): number => {
  return getDueFixedExpensesForMonth(fixedExpenses, selectedMonth)
    .filter((expense) => expense.category === category)
    .reduce((sum, expense) => sum + Number(expense.monthlyAmount || 0), 0);
};

export const getExpenseOverview = (
  fixedExpenses: FixedExpense[],
  flexibleExpenses: FlexibleExpense[],
  selectedMonth: Date,
) => {
  const fixedTotal = getMonthlyFixedExpensesTotal(
    fixedExpenses,
    selectedMonth,
  );

  const flexibleTotal = getMonthlyFlexibleExpensesTotal(
    flexibleExpenses,
    selectedMonth,
  );

  const total = fixedTotal + flexibleTotal;

  return {
    fixedTotal,
    flexibleTotal,
    total,
  };
};