import {
  FixedExpense,
  FlexibleExpense,
  getFixedExpenses,
  getFlexibleExpenses,
} from '@/storage/expenses';
import { colors, globalStyles } from '@/styles/global';
import {
  getActiveFixedExpenses,
  getExpenseOverview,
  getFlexibleExpensesForMonth,
} from '@/utils/expensesSummary';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function ExpensesScreen() {
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [flexibleExpenses, setFlexibleExpenses] = useState<FlexibleExpense[]>(
    [],
  );

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const loadExpenses = async () => {
    const fixedData = await getFixedExpenses();
    const flexibleData = await getFlexibleExpenses();

    setFixedExpenses(fixedData);
    setFlexibleExpenses(flexibleData);
  };

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, []),
  );

  const goToPreviousMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setSelectedMonth(new Date());
  };

  const goToPreviousYear = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() - 1);
      return newDate;
    });
  };

  const goToNextYear = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    });
  };

  const selectMonth = (monthIndex: number) => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(monthIndex);
      return newDate;
    });

    setShowMonthPicker(false);
  };

  const activeFixedExpenses = getActiveFixedExpenses(fixedExpenses);

  const selectedMonthFlexibleExpenses = getFlexibleExpensesForMonth(
    flexibleExpenses,
    selectedMonth,
  );

  const overview = getExpenseOverview(
    fixedExpenses,
    flexibleExpenses,
    selectedMonth,
  );

  const formatCurrency = (amount: number) => {
    return Number(amount || 0).toLocaleString('en-GB');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';

    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getFixedCategoryLabel = (category: FixedExpense['category']) => {
    const labels: Record<FixedExpense['category'], string> = {
      rent: 'Rent',
      councilTax: 'Council Tax',
      electricity: 'Electricity',
      gas: 'Gas',
      water: 'Water',
      internet: 'Internet',
      phone: 'Phone',
      insurance: 'Insurance',
      subscription: 'Subscription',
      nursery: 'Nursery',
      transport: 'Transport',
      other: 'Other',
    };

    return labels[category];
  };

  const getFlexibleCategoryLabel = (
    category: FlexibleExpense['category'],
  ) => {
    const labels: Record<FlexibleExpense['category'], string> = {
      groceries: 'Groceries',
      eatingOut: 'Eating Out',
      transport: 'Transport',
      shopping: 'Shopping',
      baby: 'Baby / Child',
      entertainment: 'Entertainment',
      health: 'Health',
      beauty: 'Beauty',
      home: 'Home',
      other: 'Other',
    };

    return labels[category];
  };

  const getAccountText = (
    accountType?: 'bank' | 'card' | 'cash',
    bankName?: string,
  ) => {
    if (accountType === 'cash') return 'Cash';

    if (accountType === 'card') {
      return bankName ? `Card · ${bankName}` : 'Card';
    }

    if (accountType === 'bank') {
      return bankName || 'Bank';
    }

    return '';
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Expenses</Text>

        <TouchableOpacity onPress={() => router.push('/add-flexible-expenses')}>
          <Text style={styles.addButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity
          onPress={goToPreviousMonth}
          style={styles.monthButton}
        >
          <Text style={styles.monthArrow}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
          <Text style={styles.monthText}>
            {selectedMonth.toLocaleDateString('en-GB', {
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
          <Text style={styles.monthArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overviewCard}>
        <Text style={styles.overviewLabel}>Total Expenses</Text>

        <Text style={styles.overviewAmount}>
          £{formatCurrency(overview.total)}
        </Text>

        <View style={styles.overviewBreakdown}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Fixed</Text>
            <Text style={styles.breakdownValue}>
              £{formatCurrency(overview.fixedTotal)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Flexible</Text>
            <Text style={styles.breakdownValue}>
              £{formatCurrency(overview.flexibleTotal)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/add-flexible-expenses')}
        >
          <Text style={styles.actionButtonText}>+ Flexible</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonSecondary}
          onPress={() => router.push('/add-fixed-expenses')}
        >
          <Text style={styles.actionButtonSecondaryText}>Manage Fixed</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fixed Expenses</Text>

        <Text style={styles.sectionMeta}>
          {activeFixedExpenses.length} active
        </Text>
      </View>

      {activeFixedExpenses.length === 0 ? (
        <Text style={styles.emptyText}>No fixed expenses yet</Text>
      ) : (
        activeFixedExpenses.map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.itemLeft}>
              <Text style={styles.itemName} numberOfLines={1}>
                {expense.name}
              </Text>

              <Text style={styles.itemMeta} numberOfLines={1}>
                {getFixedCategoryLabel(expense.category)}
                {expense.paymentDayOfMonth
                  ? ` · Day ${expense.paymentDayOfMonth}`
                  : ''}
              </Text>

              {!!expense.bankName && (
                <Text style={styles.itemMetaSmall} numberOfLines={1}>
                  {getAccountText(expense.accountType, expense.bankName)}
                </Text>
              )}
            </View>

            <View style={styles.itemRight}>
              <Text style={styles.itemAmount}>
                £{formatCurrency(expense.monthlyAmount)}
              </Text>

              <Text style={styles.itemAmountLabel}>monthly</Text>
            </View>
          </View>
        ))
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Flexible Records</Text>

        <Text style={styles.sectionMeta}>
          {selectedMonthFlexibleExpenses.length} records
        </Text>
      </View>

      {selectedMonthFlexibleExpenses.length === 0 ? (
        <Text style={styles.emptyText}>
          No flexible expenses for this month
        </Text>
      ) : (
        selectedMonthFlexibleExpenses.map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.itemLeft}>
              <Text style={styles.itemName} numberOfLines={1}>
                {expense.name}
              </Text>

              <Text style={styles.itemMeta} numberOfLines={1}>
                {formatDate(expense.date)} ·{' '}
                {getFlexibleCategoryLabel(expense.category)}
              </Text>

              <Text style={styles.itemMetaSmall} numberOfLines={1}>
                {getAccountText(expense.accountType, expense.bankName)}
              </Text>
            </View>

            <Text style={styles.recordAmount}>
              £{formatCurrency(expense.value)}
            </Text>
          </View>
        ))
      )}

      <Modal visible={showMonthPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.yearHeader}>
              <TouchableOpacity onPress={goToPreviousYear}>
                <Text style={styles.yearArrow}>‹</Text>
              </TouchableOpacity>

              <Text style={styles.yearText}>{selectedMonth.getFullYear()}</Text>

              <TouchableOpacity onPress={goToNextYear}>
                <Text style={styles.yearArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.monthGrid}>
              {months.map((month, index) => {
                const isSelected = selectedMonth.getMonth() === index;

                return (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthOption,
                      isSelected && styles.monthOptionActive,
                    ]}
                    onPress={() => selectMonth(index)}
                  >
                    <Text
                      style={[
                        styles.monthOptionText,
                        isSelected && styles.monthOptionTextActive,
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.modalTodayButton}
              onPress={() => {
                goToToday();
                setShowMonthPicker(false);
              }}
            >
              <Text style={styles.modalTodayButtonText}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowMonthPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  monthSelector: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },

  monthButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  monthArrow: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 30,
  },

  monthText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    minWidth: 150,
    textAlign: 'center',
  },

  overviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    marginTop: 20,
  },

  overviewLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },

  overviewAmount: {
    color: colors.text,
    fontSize: 38,
    fontWeight: '900',
    marginTop: 8,
  },

  overviewBreakdown: {
    flexDirection: 'row',
    marginTop: 18,
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  breakdownItem: {
    flex: 1,
  },

  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },

  breakdownValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },

  divider: {
    width: 1,
    backgroundColor: colors.surface,
    marginHorizontal: 14,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    marginBottom: 18,
  },

  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  actionButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },

  actionButtonSecondary: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  actionButtonSecondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },

  sectionHeader: {
    marginTop: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },

  sectionMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 18,
    textAlign: 'center',
  },

  expenseCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemLeft: {
    flex: 1,
    marginRight: 12,
  },

  itemRight: {
    alignItems: 'flex-end',
  },

  itemName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },

  itemMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
    fontWeight: '600',
  },

  itemMetaSmall: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },

  itemAmount: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },

  itemAmountLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },

  recordAmount: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 24,
  },

  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
  },

  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  yearArrow: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '700',
    paddingHorizontal: 12,
  },

  yearText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },

  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  monthOption: {
    width: '30%',
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  monthOptionActive: {
    backgroundColor: colors.primary,
  },

  monthOptionText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },

  monthOptionTextActive: {
    color: colors.background,
    fontWeight: '700',
  },

  modalTodayButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  modalTodayButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },

  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});