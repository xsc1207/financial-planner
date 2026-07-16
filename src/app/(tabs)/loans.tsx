import MonthlyLoansGrid from '@/components/MonthlyLoansGrid';
import RecentLoanPayments from '@/components/RecentLoanPayment';
import {
  Loan,
  LoanPayment,
  getLoanPayments,
  getLoans,
} from '@/storage/loans';
import { colors, globalStyles } from '@/styles/global';
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

export default function LoansScreen() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loanPayments, setLoanPayments] = useState<LoanPayment[]>([]);

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLoanFilter, setSelectedLoanFilter] = useState('all');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<
    'all' | 'cash' | 'bank'
  >('all');
  const [selectedBankFilter, setSelectedBankFilter] = useState('all');

  const loadLoans = async () => {
    const loansData = await getLoans();
    const loanPaymentsData = await getLoanPayments();

    setLoans(loansData);
    setLoanPayments(loanPaymentsData);

    console.log('Loaded Loans:', loansData);
    console.log('Loaded Loan Payments:', loanPaymentsData);
  };

  useFocusEffect(
    useCallback(() => {
      loadLoans();
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

  const selectedMonthLoanPayments = loanPayments.filter((payment) => {
    const dateValue = payment.date || payment.createdAt;

    if (!dateValue) return false;

    const paymentDate = new Date(dateValue);

    return (
      paymentDate.getMonth() === selectedMonth.getMonth() &&
      paymentDate.getFullYear() === selectedMonth.getFullYear()
    );
  });

  const selectedMonthLoans = loans.filter((loan) => {
    if (!loan.mortgageEndDate) return true;
  
    const selectedMonthStart = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1,
    );
  
    const mortgageEndDate = new Date(loan.mortgageEndDate);
  
    const mortgageEndMonth = new Date(
      mortgageEndDate.getFullYear(),
      mortgageEndDate.getMonth(),
      1,
    );
  
    return selectedMonthStart <= mortgageEndMonth;
  });
  
  const bankNames = Array.from(
    new Set(
      loanPayments
        .filter(
          (payment) =>
            payment.accountType === 'bank' && payment.bankName,
        )
        .map((payment) => payment.bankName as string),
    ),
  );

  const filteredLoanPaymentRecords = selectedMonthLoanPayments.filter(
    (payment) => {
      const matchLoan =
        selectedLoanFilter === 'all' ||
        payment.loanId === selectedLoanFilter;

      const matchAccount =
        selectedAccountFilter === 'all' ||
        payment.accountType === selectedAccountFilter;

      const matchBank =
        selectedBankFilter === 'all' ||
        payment.bankName === selectedBankFilter;

      return matchLoan && matchAccount && matchBank;
    },
  );

  const hasActiveFilter =
    selectedLoanFilter !== 'all' ||
    selectedAccountFilter !== 'all' ||
    selectedBankFilter !== 'all';

  const clearFilters = () => {
    setSelectedLoanFilter('all');
    setSelectedAccountFilter('all');
    setSelectedBankFilter('all');
  };

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
    >
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Loans</Text>

        <TouchableOpacity onPress={() => router.push('/add-loan-payments')}>
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

      <View style={styles.sectionHeader}>
        <Text style={globalStyles.sectionTitle}>This Month’s Loans</Text>

        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => router.push('/add-loans')}
        >
          <Text style={styles.manageButtonText}>Manage Loans</Text>
        </TouchableOpacity>
      </View>

      {selectedMonthLoans.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No Loans</Text>
          <Text style={styles.emptyText}>
            Add a loan for this month to start tracking your repayments.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/add-loans')}
          >
            <Text style={styles.emptyButtonText}>Add Loan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <MonthlyLoansGrid
          loanPayments={selectedMonthLoanPayments}
          loans={selectedMonthLoans}
          allLoanPayments={loanPayments}
        />
      )}

      <View style={styles.recordsHeader}>
        <Text style={globalStyles.sectionTitle}>Loan Payment Records</Text>

        <TouchableOpacity
          style={[
            styles.filterButton,
            hasActiveFilter && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Text
            style={[
              styles.filterButtonText,
              hasActiveFilter && styles.filterButtonTextActive,
            ]}
          >
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {filteredLoanPaymentRecords.length === 0 ? (
        <Text style={styles.noRecordText}>
          No loan payment records found
        </Text>
      ) : (
        <RecentLoanPayments
          loanPayments={filteredLoanPaymentRecords}
          onDelete={loadLoans}
        />
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

      <Modal visible={showFilterModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalBox}>
            <Text style={styles.filterModalTitle}>Filter Records</Text>

            <Text style={styles.filterSectionTitle}>Loan</Text>

            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedLoanFilter === 'all' && styles.optionButtonActive,
                ]}
                onPress={() => setSelectedLoanFilter('all')}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedLoanFilter === 'all' && styles.optionTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              {loans.map((loan) => (
                <TouchableOpacity
                  key={loan.id}
                  style={[
                    styles.optionButton,
                    selectedLoanFilter === loan.id &&
                      styles.optionButtonActive,
                  ]}
                  onPress={() => setSelectedLoanFilter(loan.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedLoanFilter === loan.id &&
                        styles.optionTextActive,
                    ]}
                  >
                    {loan.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Account</Text>

            <View style={styles.optionRow}>
              {(['all', 'cash', 'bank'] as const).map((account) => (
                <TouchableOpacity
                  key={account}
                  style={[
                    styles.optionButton,
                    selectedAccountFilter === account &&
                      styles.optionButtonActive,
                  ]}
                  onPress={() => {
                    setSelectedAccountFilter(account);

                    if (account !== 'bank') {
                      setSelectedBankFilter('all');
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedAccountFilter === account &&
                        styles.optionTextActive,
                    ]}
                  >
                    {account === 'all'
                      ? 'All'
                      : account === 'cash'
                        ? 'Cash'
                        : 'Bank'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedAccountFilter === 'bank' && (
              <>
                <Text style={styles.filterSectionTitle}>Bank</Text>

                <View style={styles.optionRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedBankFilter === 'all' &&
                        styles.optionButtonActive,
                    ]}
                    onPress={() => setSelectedBankFilter('all')}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedBankFilter === 'all' &&
                          styles.optionTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>

                  {bankNames.map((bank) => (
                    <TouchableOpacity
                      key={bank}
                      style={[
                        styles.optionButton,
                        selectedBankFilter === bank &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() => setSelectedBankFilter(bank)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedBankFilter === bank &&
                            styles.optionTextActive,
                        ]}
                      >
                        {bank}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },

  addButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  monthSelector: {
    marginTop: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },

  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 23,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  monthArrow: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '500',
  },

  monthText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    minWidth: 130,
    textAlign: 'center',
  },

  todayButton: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginBottom: 18,
  },

  todayButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },

  sectionHeader: {
    marginTop: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  manageButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 15,
  },

  manageButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
  },

  emptyButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  recordsHeader: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  filterButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 15,
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
  },

  filterButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },

  filterButtonTextActive: {
    color: colors.background,
  },

  noRecordText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 12,
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

  filterModalBox: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },

  filterModalTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },

  filterSectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 10,
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  optionButton: {
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  optionButtonActive: {
    backgroundColor: colors.primary,
  },

  optionText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },

  optionTextActive: {
    color: colors.background,
    fontWeight: '700',
  },

  applyButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },

  applyButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  clearButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },

  clearButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
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
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});