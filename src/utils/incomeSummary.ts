import { Income } from '@/storage/income';

export const getThisMonthIncomeTotal = (income: Income[]) => {
  const today = new Date();

  return income
    .filter((item) => {
      const incomeDate = new Date(item.createdAt);

      return (
        incomeDate.getMonth() === today.getMonth() &&
        incomeDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, item) => {
      return sum + Number(item.value || 0);
    }, 0);
};