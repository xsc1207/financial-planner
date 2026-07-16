import {
  Loan,
  LoanPayment,
  LoanType,
  addLoan,
  getLoanPayments,
  getLoans,
  removeLoan,
  updateLoan,
} from '@/storage/loans';
import { colors, globalStyles } from '@/styles/global';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type DatePickerType = 'fixedRateEndDate' | 'mortgageEndDate' | null;

const loanTypeOptions: { label: string; value: LoanType }[] = [
  { label: 'House', value: 'house' },
  { label: 'Car', value: 'car' },
  { label: 'Investment', value: 'investment' },
  { label: 'Student', value: 'student' },
  { label: 'Personal', value: 'personal' },
  { label: 'Credit Card', value: 'creditCard' },
  { label: 'Other', value: 'other' },
];

export default function AddLoansScreen() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loanPayments, setLoanPayments] = useState<LoanPayment[]>([]);

  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [showLoanModal, setShowLoanModal] = useState(false);

  const [loanName, setLoanName] = useState('');
  const [loanType, setLoanType] = useState<LoanType>('house');

  const [currentBalance, setCurrentBalance] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');

  const [interestRate, setInterestRate] = useState('');
  const [fixedRateEndDate, setFixedRateEndDate] = useState('');
  const [followOnRate, setFollowOnRate] = useState('');

  const [mortgageEndDate, setMortgageEndDate] = useState('');

  const [allowsExtraPayment, setAllowsExtraPayment] =
    useState<'yes' | 'no'>('yes');
  const [extraPaymentAllowedPercent, setExtraPaymentAllowedPercent] =
    useState('');
  const [extraPaymentChargeRate, setExtraPaymentChargeRate] = useState('');

  const [notes, setNotes] = useState('');
  const [datePickerType, setDatePickerType] = useState<DatePickerType>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loansData = await getLoans();
    const loanPaymentsData = await getLoanPayments();

    setLoans(loansData);
    setLoanPayments(loanPaymentsData);
  };

  const getRandomColor = () => {
    const colorOptions = [
      '#4ecdc4',
      '#ff6b6b',
      '#ffd93d',
      '#6bdb7d',
      '#a78bfa',
      '#f97316',
      '#38bdf8',
      '#f472b6',
    ];

    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
  };

  const optionalNumber = (value: string) => {
    if (!value.trim()) return undefined;
    return Number(value) || 0;
  };

  const formatDateValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return '';

    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount?: number) => {
    return Number(amount || 0).toLocaleString('en-GB');
  };

  const getPickerValue = () => {
    if (datePickerType === 'fixedRateEndDate' && fixedRateEndDate) {
      return new Date(fixedRateEndDate);
    }

    if (datePickerType === 'mortgageEndDate' && mortgageEndDate) {
      return new Date(mortgageEndDate);
    }

    return new Date();
  };

  const getLoanPaidAmount = (loanId: string) => {
    return loanPayments
      .filter((payment) => payment.loanId === loanId)
      .reduce((sum, payment) => sum + Number(payment.value || 0), 0);
  };

  const getLoanTypeLabel = (type?: LoanType) => {
    return (
      loanTypeOptions.find((option) => option.value === type)?.label ||
      'Other'
    );
  };

  const clearForm = () => {
    setEditingLoan(null);

    setLoanName('');
    setLoanType('house');

    setCurrentBalance('');
    setMonthlyPayment('');

    setInterestRate('');
    setFixedRateEndDate('');
    setFollowOnRate('');

    setMortgageEndDate('');

    setAllowsExtraPayment('yes');
    setExtraPaymentAllowedPercent('');
    setExtraPaymentChargeRate('');

    setNotes('');
    setDatePickerType(null);
  };

  const closeLoanModal = () => {
    clearForm();
    setShowLoanModal(false);
  };

  const openAddLoanModal = () => {
    clearForm();
    setShowLoanModal(true);
  };

  const openEditLoanModal = (loan: Loan) => {
    setEditingLoan(loan);

    setLoanName(loan.name || '');
    setLoanType(loan.loanType || 'house');

    setCurrentBalance(
      loan.currentBalance !== undefined
        ? String(loan.currentBalance)
        : '',
    );

    setMonthlyPayment(
      loan.monthlyPayment !== undefined
        ? String(loan.monthlyPayment)
        : '',
    );

    setInterestRate(
      loan.interestRate !== undefined ? String(loan.interestRate) : '',
    );

    setFixedRateEndDate(loan.fixedRateEndDate || '');

    setFollowOnRate(
      loan.followOnRate !== undefined ? String(loan.followOnRate) : '',
    );

    setMortgageEndDate(loan.mortgageEndDate || '');

    setAllowsExtraPayment(loan.allowsExtraPayment || 'yes');

    setExtraPaymentAllowedPercent(
      loan.extraPaymentAllowedPercent !== undefined
        ? String(loan.extraPaymentAllowedPercent)
        : '',
    );

    setExtraPaymentChargeRate(
      loan.extraPaymentChargeRate !== undefined
        ? String(loan.extraPaymentChargeRate)
        : '',
    );

    setNotes(loan.notes || '');
    setDatePickerType(null);
    setShowLoanModal(true);
  };

  const handleSaveLoan = async () => {
    const finalLoanName = loanName.trim();

    const balanceAmount = Number(currentBalance) || 0;
    const monthlyPaymentAmount = Number(monthlyPayment) || 0;
    const interestRateAmount = Number(interestRate) || 0;
    const followOnRateAmount = Number(followOnRate) || 0;

    if (!finalLoanName) {
      Alert.alert('Error', 'Please enter loan name.');
      return;
    }

    if (!currentBalance.trim()) {
      Alert.alert('Error', 'Please enter current balance.');
      return;
    }

    if (balanceAmount <= 0) {
      Alert.alert('Error', 'Current balance must be greater than 0.');
      return;
    }

    if (!monthlyPayment.trim()) {
      Alert.alert('Error', 'Please enter monthly payment.');
      return;
    }

    if (monthlyPaymentAmount <= 0) {
      Alert.alert('Error', 'Monthly payment must be greater than 0.');
      return;
    }

    if (!interestRate.trim()) {
      Alert.alert('Error', 'Please enter interest rate.');
      return;
    }

    if (interestRateAmount <= 0) {
      Alert.alert('Error', 'Interest rate must be greater than 0.');
      return;
    }

    if (!fixedRateEndDate) {
      Alert.alert('Error', 'Please select fixed rate end date.');
      return;
    }

    if (!followOnRate.trim()) {
      Alert.alert('Error', 'Please enter follow-on rate.');
      return;
    }

    if (followOnRateAmount <= 0) {
      Alert.alert('Error', 'Follow-on rate must be greater than 0.');
      return;
    }

    if (!mortgageEndDate) {
      Alert.alert('Error', 'Please select loan end date.');
      return;
    }

    if (new Date(mortgageEndDate) < new Date(fixedRateEndDate)) {
      Alert.alert(
        'Error',
        'Loan end date cannot be earlier than fixed rate end date.',
      );
      return;
    }

    const loanData: Loan = {
      id: editingLoan ? editingLoan.id : Date.now().toString(),

      name: finalLoanName,
      loanType,

      currentBalance: balanceAmount,
      monthlyPayment: monthlyPaymentAmount,

      interestRate: interestRateAmount,
      fixedRateEndDate,
      followOnRate: followOnRateAmount,

      mortgageEndDate,

      allowsExtraPayment,
      extraPaymentAllowedPercent: optionalNumber(
        extraPaymentAllowedPercent,
      ),
      extraPaymentChargeRate: optionalNumber(extraPaymentChargeRate),

      notes: notes.trim() || undefined,

      color: editingLoan ? editingLoan.color : getRandomColor(),
      createdAt: editingLoan
        ? editingLoan.createdAt
        : new Date().toISOString(),
    };

    if (editingLoan) {
      await updateLoan(loanData);
      Alert.alert('Success', 'Loan updated successfully!');
    } else {
      await addLoan(loanData);
      Alert.alert('Success', 'Loan added successfully!');
    }

    closeLoanModal();
    await loadData();
  };

  const handleRemoveLoan = async () => {
    if (!editingLoan) return;

    const relatedLoanPayments = loanPayments.filter(
      (payment) => payment.loanId === editingLoan.id,
    );

    if (relatedLoanPayments.length > 0) {
      Alert.alert(
        'Cannot remove loan',
        `This loan has ${relatedLoanPayments.length} payment record(s). Please delete the payment records first.`,
      );
      return;
    }

    Alert.alert(
      'Remove Loan',
      `Are you sure you want to remove "${editingLoan.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeLoan(editingLoan.id);

            closeLoanModal();
            await loadData();

            Alert.alert('Success', 'Loan removed successfully!');
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
    >
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Manage Loans</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Loans</Text>

      {loans.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No loans yet</Text>
          <Text style={styles.emptyText}>
            Add your first loan or mortgage to start tracking repayments.
          </Text>
        </View>
      ) : (
        loans.map((loan) => {
          const paidAmount = getLoanPaidAmount(loan.id);
          const remainingAmount = Math.max(
            loan.currentBalance - paidAmount,
            0,
          );

          return (
            <TouchableOpacity
              key={loan.id}
              style={styles.loanCard}
              onPress={() => openEditLoanModal(loan)}
              activeOpacity={0.8}
            >
              <View style={styles.loanTopRow}>
                <Text style={styles.loanName} numberOfLines={1}>
                  {loan.name}
                </Text>

                <View style={styles.loanTypePill}>
                  <Text style={styles.loanTypePillText}>
                    {getLoanTypeLabel(loan.loanType)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Remaining</Text>
                  <Text style={styles.infoValue}>
                    £{formatCurrency(remainingAmount)}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Paid</Text>
                  <Text style={styles.infoValue}>
                    £{formatCurrency(paidAmount)}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Monthly</Text>
                  <Text style={styles.infoValue}>
                    £{formatCurrency(loan.monthlyPayment)}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Rate</Text>
                  <Text style={styles.infoValue}>
                    {loan.interestRate}%
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Fixed ends</Text>
                  <Text style={styles.infoValueSmall}>
                    {formatDisplayDate(loan.fixedRateEndDate)}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Loan ends</Text>
                  <Text style={styles.infoValueSmall}>
                    {formatDisplayDate(loan.mortgageEndDate)}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Follow-on</Text>
                  <Text style={styles.infoValue}>
                    {loan.followOnRate}%
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Extra allowed</Text>
                  <Text style={styles.infoValue}>
                    {loan.allowsExtraPayment === 'yes' ? 'Yes' : 'No'}
                  </Text>
                </View>
              </View>

              <Text style={styles.editHint}>Tap to edit</Text>
            </TouchableOpacity>
          );
        })
      )}

      <TouchableOpacity style={styles.addLoanButton} onPress={openAddLoanModal}>
        <Text style={styles.addLoanButtonText}>+ Add New Loan</Text>
      </TouchableOpacity>

      <Modal visible={showLoanModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loanModalBox}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingLoan ? 'Edit Loan' : 'Add Loan'}
                </Text>

                <TouchableOpacity onPress={closeLoanModal}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.groupTitle}>Basic</Text>

              <Text style={styles.label}>Loan name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Halifax 5-year fixed"
                placeholderTextColor={colors.textSecondary}
                value={loanName}
                onChangeText={setLoanName}
              />

              <Text style={styles.label}>Loan type</Text>

              <View style={styles.optionRow}>
                {loanTypeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      loanType === option.value && styles.optionButtonActive,
                    ]}
                    onPress={() => setLoanType(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        loanType === option.value && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Current balance</Text>
              <TextInput
                style={styles.input}
                placeholder="£0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={currentBalance}
                onChangeText={setCurrentBalance}
              />

              <Text style={styles.label}>Monthly payment</Text>
              <TextInput
                style={styles.input}
                placeholder="£0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={monthlyPayment}
                onChangeText={setMonthlyPayment}
              />

              <Text style={styles.groupTitle}>Interest</Text>

              <Text style={styles.label}>Interest rate %</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 4.75"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={interestRate}
                onChangeText={setInterestRate}
              />

              <Text style={styles.label}>Fixed rate end date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setDatePickerType('fixedRateEndDate')}
              >
                <Text
                  style={[
                    styles.inputText,
                    !fixedRateEndDate && styles.placeholderText,
                  ]}
                >
                  {fixedRateEndDate
                    ? formatDisplayDate(fixedRateEndDate)
                    : 'Select Date'}
                </Text>
              </TouchableOpacity>

              {datePickerType === 'fixedRateEndDate' && (
                <View style={styles.inlineDatePickerBox}>
                  <DateTimePicker
                    value={getPickerValue()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    textColor="#ffffff"
                    themeVariant="dark"
                    onChange={(_event, selectedDate) => {
                      if (!selectedDate) return;

                      const dateValue = formatDateValue(selectedDate);
                      setFixedRateEndDate(dateValue);

                      if (Platform.OS !== 'ios') {
                        setDatePickerType(null);
                      }
                    }}
                  />

                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setDatePickerType(null)}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.label}>Follow-on rate %</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 7.99"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={followOnRate}
                onChangeText={setFollowOnRate}
              />

              <Text style={styles.groupTitle}>Loan End</Text>

              <Text style={styles.label}>Loan end date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setDatePickerType('mortgageEndDate')}
              >
                <Text
                  style={[
                    styles.inputText,
                    !mortgageEndDate && styles.placeholderText,
                  ]}
                >
                  {mortgageEndDate
                    ? formatDisplayDate(mortgageEndDate)
                    : 'Select Date'}
                </Text>
              </TouchableOpacity>

              {datePickerType === 'mortgageEndDate' && (
                <View style={styles.inlineDatePickerBox}>
                  <DateTimePicker
                    value={getPickerValue()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    textColor="#ffffff"
                    themeVariant="dark"
                    onChange={(_event, selectedDate) => {
                      if (!selectedDate) return;

                      const dateValue = formatDateValue(selectedDate);
                      setMortgageEndDate(dateValue);

                      if (Platform.OS !== 'ios') {
                        setDatePickerType(null);
                      }
                    }}
                  />

                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setDatePickerType(null)}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.groupTitle}>Extra Payment Rules</Text>

              <Text style={styles.label}>Allows extra payment?</Text>

              <View style={styles.optionRow}>
                {(['yes', 'no'] as const).map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      allowsExtraPayment === option &&
                        styles.optionButtonActive,
                    ]}
                    onPress={() => setAllowsExtraPayment(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        allowsExtraPayment === option &&
                          styles.optionTextActive,
                      ]}
                    >
                      {option === 'yes' ? 'Yes' : 'No'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {allowsExtraPayment === 'yes' && (
                <>
                  <Text style={styles.label}>Extra payment allowance %</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 10"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="decimal-pad"
                    value={extraPaymentAllowedPercent}
                    onChangeText={setExtraPaymentAllowedPercent}
                  />

                  <Text style={styles.label}>Extra payment charge %</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 1"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="decimal-pad"
                    value={extraPaymentChargeRate}
                    onChangeText={setExtraPaymentChargeRate}
                  />
                </>
              )}

              <Text style={styles.groupTitle}>Notes</Text>

              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Any notes about this loan"
                placeholderTextColor={colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
              />

              <TouchableOpacity style={styles.button} onPress={handleSaveLoan}>
                <Text style={styles.buttonText}>
                  {editingLoan ? 'Update Loan' : 'Add Loan'}
                </Text>
              </TouchableOpacity>

              {editingLoan && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={handleRemoveLoan}
                >
                  <Text style={styles.removeButtonText}>Remove Loan</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
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

  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 14,
  },

  backButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
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

  loanCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 12,
  },

  loanTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  loanName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },

  loanTypePill: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },

  loanTypePillText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },

  infoItem: {
    width: '50%',
    paddingRight: 10,
  },

  infoLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 3,
  },

  infoValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  infoValueSmall: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

  editHint: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 14,
  },

  addLoanButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },

  addLoanButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },

  loanModalBox: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 20,
    maxHeight: '88%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },

  modalCloseText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  groupTitle: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 4,
  },

  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 10,
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  optionButton: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 18,
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

  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
  },

  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  inputText: {
    color: colors.text,
    fontSize: 16,
  },

  placeholderText: {
    color: colors.textSecondary,
  },

  dateInput: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
  },

  doneButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },

  doneButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 28,
  },

  buttonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '700',
  },

  removeButton: {
    backgroundColor: '#ff6b6b',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },

  removeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  inlineDatePickerBox: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },
});