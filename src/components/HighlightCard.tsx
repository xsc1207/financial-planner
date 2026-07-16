import { Income } from '@/storage/income';
import { Savings } from '@/storage/savings';
import { Goal } from '@/storage/savingsgoals';
import { getThisMonthIncomeTotal } from '@/utils/incomeSummary';
import { getMonthlySavingsSummary } from '@/utils/savingsSummary';
import { StyleSheet, Text, View } from 'react-native';

type BalanceProps = {
  income: Income[];
  savings: Savings[];
  goals: Goal[];
};

export default function Balance({
  income = [],
  savings = [],
  goals = [],
}: BalanceProps) {
  const thisMonthIncomeTotal = getThisMonthIncomeTotal(income);

  const { totalMonthlySavings } = getMonthlySavingsSummary(
    savings,
    goals,
  );

  const totalMonthlyExpenses = 0;
  const totalMonthlyLoans = 0;

  const availableBalance = Math.max(
    thisMonthIncomeTotal -
      totalMonthlySavings -
      totalMonthlyExpenses -
      totalMonthlyLoans,
    0,
  );

  return (
    <View style={styles.balanceCard}>
      <View>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceSubtitle}>After planned expenses</Text>
      </View>

      <Text style={styles.balanceAmount}>£{availableBalance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: '#172344',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginTop: 24,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  balanceSubtitle: {
    color: '#A5A5B8',
    fontSize: 13,
  },

  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },
});