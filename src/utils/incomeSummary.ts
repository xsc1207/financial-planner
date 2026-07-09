import { Income } from '@/storage/income';

export const getThisMonthIncomeTotal = (income: Income[]) => {
  const today = new Date();

  return income
    .filter((item) => {
      if (!item.date) return false;

      const incomeDate = new Date(item.date);

      return (
        incomeDate.getMonth() === today.getMonth() &&
        incomeDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, item) => sum + item.value, 0);
};