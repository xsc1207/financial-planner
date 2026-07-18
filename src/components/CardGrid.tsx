import HomeOverviewCard from '@/components/HomeOverviewCard';
import { FixedExpense, FlexibleExpense } from '@/storage/expenses';
import { Income } from '@/storage/income';
import { Loan, LoanPayment } from '@/storage/loans';
import { Savings } from '@/storage/savings';
import { Goal } from '@/storage/savingsgoals';
import { getExpenseOverview } from '@/utils/expensesSummary';
import { getThisMonthIncomeTotal } from '@/utils/incomeSummary';
import { getMonthlySavingsSummary } from '@/utils/savingsSummary';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type CardGridProps = {
  income: Income[];
  savings: Savings[];
  goals: Goal[];
  fixedExpenses: FixedExpense[];
  flexibleExpenses: FlexibleExpense[];
  loans: Loan[];
  loanPayments: LoanPayment[];
};

export default function CardGrid({
  income = [],
  savings = [],
  goals = [],
  fixedExpenses = [],
  flexibleExpenses = [],
  loans = [],
  loanPayments = [],
}: CardGridProps) {
  const selectedMonth = new Date();

  const formatCurrency = (amount: number) => {
    return `£${Number(amount || 0).toLocaleString('en-GB')}`;
  };

  const isSameMonth = (dateString?: string) => {
    if (!dateString) return false;

    const date = new Date(dateString);

    return (
      date.getMonth() === selectedMonth.getMonth() &&
      date.getFullYear() === selectedMonth.getFullYear()
    );
  };

  const getPercentage = (value: number, base: number) => {
    if (base <= 0) return 0;

    return Math.round((value / base) * 100);
  };

  const thisMonthIncomeTotal = getThisMonthIncomeTotal(income);

  const {
    totalMonthlySavings,
    totalMonthlyTarget,
    percentage: savingsPercentage,
  } = getMonthlySavingsSummary(savings, goals);

  const expenseOverview = getExpenseOverview(
    fixedExpenses,
    flexibleExpenses,
    selectedMonth,
  );

  const totalExpenses = expenseOverview.total;

  const thisMonthLoanPayments = loanPayments.filter((payment) =>
    isSameMonth(payment.date || payment.createdAt),
  );

  const thisMonthLoanPaymentTotal = thisMonthLoanPayments.reduce(
    (sum, payment) => sum + Number(payment.value || 0),
    0,
  );

  const monthlyLoanTarget = loans.reduce(
    (sum, loan) => sum + Number(loan.monthlyPayment || 0),
    0,
  );

  const loansPercentage = getPercentage(
    thisMonthLoanPaymentTotal,
    monthlyLoanTarget,
  );

  return (
    <View style={styles.grid}>
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => router.replace('/(tabs)/income')}
        activeOpacity={0.85}
      >
        <HomeOverviewCard
          label="Income"
          subtitle="Monthly income"
          value={formatCurrency(thisMonthIncomeTotal)}
          color="#ff6b6b"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => router.replace('/(tabs)/expenses')}
        activeOpacity={0.85}
      >
        <HomeOverviewCard
          label="Expenses"
          subtitle={`Fixed ${formatCurrency(
            expenseOverview.fixedTotal,
          )} · Flexible ${formatCurrency(expenseOverview.flexibleTotal)}`}
          value={formatCurrency(totalExpenses)}
          color="#4ecdc4"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => router.replace('/(tabs)/savings')}
        activeOpacity={0.85}
      >
        <HomeOverviewCard
          label="Savings"
          subtitle={`Target ${formatCurrency(
            totalMonthlyTarget,
          )} · ${savingsPercentage}% complete`}
          value={formatCurrency(totalMonthlySavings)}
          color="#625bff"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => router.replace('/(tabs)/loans')}
        activeOpacity={0.85}
      >
        <HomeOverviewCard
          label="Loans"
          subtitle={`Due ${formatCurrency(
            monthlyLoanTarget,
          )} · ${loansPercentage}% paid`}
          value={formatCurrency(thisMonthLoanPaymentTotal)}
          color="#ffb000"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 9,
  },

  cardWrapper: {
    width: '100%',
  },
});