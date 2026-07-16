import { Loan, LoanPayment } from '@/storage/loans';
import { colors } from '@/styles/global';
import {
  getMonthlyTotalForLoan,
  getTotalPaidForLoan,
} from '@/utils/loansSummary';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type MonthlyLoansGridProps = {
  loanPayments: LoanPayment[];
  loans: Loan[];
  allLoanPayments: LoanPayment[];
};

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-GB');
};

export default function MonthlyLoansGrid({
  loanPayments = [],
  loans = [],
  allLoanPayments = [],
}: MonthlyLoansGridProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const sortedLoans = [...loans].sort((a, b) => {
    const totalA = getMonthlyTotalForLoan(loanPayments, a.id);
    const totalB = getMonthlyTotalForLoan(loanPayments, b.id);

    return totalB - totalA;
  });

  const loanPages = chunkArray(sortedLoans, 4);

  return (
    <View
      style={styles.wrapper}
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width);
      }}
    >
      {containerWidth > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {loanPages.map((pageLoans, pageIndex) => (
            <View
              key={pageIndex}
              style={[
                styles.page,
                {
                  width: containerWidth,
                },
              ]}
            >
              {pageLoans.map((loan) => {
                const thisMonthTotal = getMonthlyTotalForLoan(
                  loanPayments,
                  loan.id,
                );

                const totalPaid = getTotalPaidForLoan(
                  allLoanPayments,
                  loan.id,
                );

                const remainingAmount = Math.max(
                  Number(loan.monthlyPayment || 0) - totalPaid,
                  0,
                );

                const percentage =
                  loan.monthlyPayment > 0
                    ? Math.min(
                        (totalPaid / loan.monthlyPayment) * 100,
                        100,
                      )
                    : 0;

                return (
                  <View
                    key={loan.id}
                    style={[
                      styles.card,
                      {
                        borderLeftColor: loan.color,
                      },
                    ]}
                  >
                    <View style={styles.topRow}>
                      <Text style={styles.loanName} numberOfLines={1}>
                        {loan.name}
                      </Text>

                      <Text style={styles.percentage}>
                        {Math.round(percentage)}%
                      </Text>
                    </View>

                    <View style={styles.amountRow}>
  <Text style={styles.amount}>
    £{formatCurrency(totalPaid)}
  </Text>

  <Text style={styles.targetText}>
    of £{formatCurrency(loan.monthlyPayment)}
  </Text>
</View>

<Text style={styles.meta}>Paid this month</Text>

<View style={styles.progressTrack}>
  <View
    style={[
      styles.progressFill,
      {
        width: `${percentage}%`,
        backgroundColor: loan.color,
      },
    ]}
  />
</View>

<View style={styles.bottomRow}>
  <Text style={styles.remainingLabel}>Remaining</Text>
  <Text style={styles.remainingAmount}>
    £{formatCurrency(remainingAmount)}
  </Text>
</View>

                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}

      {loans.length > 4 && (
        <Text style={styles.swipeHint}>Swipe to view more loans →</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    overflow: 'hidden',
  },

  scrollView: {
    width: '100%',
  },

  scrollContent: {
    paddingBottom: 8,
  },

  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    minHeight: 135,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  loanName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },

  percentage: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '800',
  },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
  },

  amount: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },

  targetText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  meta: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 1,
  },

  progressTrack: {
    height: 7,
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },

  progressFill: {
    height: '100%',
    borderRadius: 8,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 9,
  },

  remainingLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  remainingAmount: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

  swipeHint: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
});