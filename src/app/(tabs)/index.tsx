import CardGrid from '@/components/CardGrid';
import {
  FixedExpense,
  FlexibleExpense,
  getFixedExpenses,
  getFlexibleExpenses,
} from '@/storage/expenses';
import { Income, getIncome } from '@/storage/income';
import {
  Loan,
  LoanPayment,
  getLoanPayments,
  getLoans,
} from '@/storage/loans';
import { Savings, getSavings } from '@/storage/savings';
import { Goal, getGoals } from '@/storage/savingsgoals';
import { colors, globalStyles } from '@/styles/global';
import { getExpenseOverview } from '@/utils/expensesSummary';
import { getThisMonthIncomeTotal } from '@/utils/incomeSummary';
import { getMonthlySavingsSummary } from '@/utils/savingsSummary';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [income, setIncome] = useState<Income[]>([]);
  const [savings, setSavings] = useState<Savings[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [flexibleExpenses, setFlexibleExpenses] = useState<FlexibleExpense[]>(
    [],
  );

  const [loans, setLoans] = useState<Loan[]>([]);
  const [loanPayments, setLoanPayments] = useState<LoanPayment[]>([]);

  const selectedMonth = new Date();

  const loadHomeData = async () => {
    const incomeData = await getIncome();
    const savingsData = await getSavings();
    const goalsData = await getGoals();

    const fixedExpenseData = await getFixedExpenses();
    const flexibleExpenseData = await getFlexibleExpenses();

    const loansData = await getLoans();
    const loanPaymentsData = await getLoanPayments();

    setIncome(incomeData);
    setSavings(savingsData);
    setGoals(goalsData);

    setFixedExpenses(fixedExpenseData);
    setFlexibleExpenses(flexibleExpenseData);

    setLoans(loansData);
    setLoanPayments(loanPaymentsData);
  };

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, []),
  );

  const formatCurrency = (amount: number) => {
    return Number(amount || 0).toLocaleString('en-GB');
  };

  const isSameMonth = (dateString?: string) => {
    if (!dateString) return false;

    const date = new Date(dateString);

    return (
      date.getMonth() === selectedMonth.getMonth() &&
      date.getFullYear() === selectedMonth.getFullYear()
    );
  };

  const thisMonthIncomeTotal = getThisMonthIncomeTotal(income);

  const { totalMonthlySavings } = getMonthlySavingsSummary(savings, goals);

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

  const totalOutgoings =
    totalExpenses + totalMonthlySavings + thisMonthLoanPaymentTotal;

  const availableBalance =
    thisMonthIncomeTotal -
    totalExpenses -
    totalMonthlySavings -
    thisMonthLoanPaymentTotal;

  const safeAvailableBalance = Math.max(availableBalance, 0);

  const spendingRatio =
    thisMonthIncomeTotal > 0
      ? Math.round((totalOutgoings / thisMonthIncomeTotal) * 100)
      : 0;

  const progressWidth = Math.min(spendingRatio, 100);

  const getHealthStatus = () => {
    if (thisMonthIncomeTotal <= 0) return 'Not Started';
    if (availableBalance >= 0) return 'On Track';
    return 'Over Plan';
  };

  const isHealthy = thisMonthIncomeTotal > 0 && availableBalance >= 0;

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>FinPlanner</Text>

          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroMainInfo}>
            <Text style={styles.heroLabel}>Available Balance</Text>

            <Text style={styles.heroAmount}>
              £{formatCurrency(safeAvailableBalance)}
            </Text>
          </View>

          <View
            style={[
              styles.healthPill,
              isHealthy ? styles.healthPillGood : styles.healthPillWarning,
            ]}
          >
            <Text
              style={[
                styles.healthPillText,
                isHealthy
                  ? styles.healthPillTextGood
                  : styles.healthPillTextWarning,
              ]}
            >
              {getHealthStatus()}
            </Text>
          </View>
        </View>

        <Text style={styles.heroSubText}>
          After planned expenses, savings and loans
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>{spendingRatio}% used</Text>

            <Text style={styles.progressAmount}>
              £{formatCurrency(totalOutgoings)} planned outgoing
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressWidth}%`,
                  backgroundColor: isHealthy ? '#4ecdc4' : '#ff6b6b',
                },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Monthly Overview</Text>

        <Text style={styles.sectionMonth}>
          {selectedMonth.toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>

      <CardGrid
        income={income}
        savings={savings}
        goals={goals}
        fixedExpenses={fixedExpenses}
        flexibleExpenses={flexibleExpenses}
        loans={loans}
        loanPayments={loanPayments}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 2,
    paddingBottom: 26,
  },

  header: {
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: -0.6,
  },

  dateText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },

  monthBadge: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 2,
  },

  monthBadgeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },

  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
  },

  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  heroMainInfo: {
    flex: 1,
    marginRight: 12,
  },

  heroLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },

  heroAmount: {
    color: colors.text,
    fontSize: 38,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: -0.7,
  },

  heroSubText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },

  healthPill: {
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 11,
    marginTop: 4,
  },

  healthPillGood: {
    backgroundColor: '#203f38',
  },

  healthPillWarning: {
    backgroundColor: '#3d2a2f',
  },

  healthPillText: {
    fontSize: 12,
    fontWeight: '900',
  },

  healthPillTextGood: {
    color: '#4ecdc4',
  },

  healthPillTextWarning: {
    color: '#ff6b6b',
  },

  progressSection: {
    backgroundColor: colors.background,
    borderRadius: 17,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 13,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },

  progressTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },

  progressAmount: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },

  progressTrack: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 20,
  },

  sectionHeader: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },

  sectionMonth: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
});