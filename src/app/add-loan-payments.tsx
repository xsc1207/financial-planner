import {
  Loan,
  addLoanPayment,
  getLoans,
} from '@/storage/loans';
import { colors, globalStyles } from '@/styles/global';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const bankOptions = [
  'Revolut',
  'Barclays',
  'HSBC',
  'Lloyds',
  'NatWest',
  'Santander',
  'Other',
];

export default function AddLoanPaymentScreen() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState('');

  const [regularPaymentAmount, setRegularPaymentAmount] = useState('');
  const [extraPaymentAmount, setExtraPaymentAmount] = useState('');

  const [date, setDate] = useState(new Date().toISOString());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [bankNameOption, setBankNameOption] = useState('Barclays');
  const [customBankName, setCustomBankName] = useState('');


  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    const loansData = await getLoans();

    setLoans(loansData);

    if (loansData.length > 0) {
      const firstLoan = loansData[0];

      setSelectedLoanId(firstLoan.id);

      if (firstLoan.monthlyPayment) {
        setRegularPaymentAmount(String(firstLoan.monthlyPayment));
      }
    }
  };

  const selectedLoan = loans.find((loan) => loan.id === selectedLoanId);

  const regularAmount = Number(regularPaymentAmount) || 0;
  const extraAmount = Number(extraPaymentAmount) || 0;
  const totalPaymentAmount = regularAmount + extraAmount;
  const isExtraPayment = extraAmount > 0 ? 'yes' : 'no';

  const getFinalBankName = () => {
    return bankNameOption === 'Other'
      ? customBankName.trim()
      : bankNameOption;
  };

  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount?: number) => {
    return Number(amount || 0).toLocaleString('en-GB');
  };

  const handleLoanChange = (loanId: string) => {
    const loan = loans.find((item) => item.id === loanId);

    setSelectedLoanId(loanId);

    if (loan?.monthlyPayment) {
      setRegularPaymentAmount(String(loan.monthlyPayment));
    } else {
      setRegularPaymentAmount('');
    }

    setExtraPaymentAmount('');
  };

  const handleSavePayment = async () => {
    if (!selectedLoan) {
      Alert.alert('Error', 'Please select a loan.');
      return;
    }

    if (totalPaymentAmount <= 0) {
      Alert.alert('Error', 'Payment amount must be greater than 0.');
      return;
    }

    const finalBankName = getFinalBankName();

    if (!finalBankName) {
      Alert.alert('Error', 'Please select or enter bank name.');
      return;
    }

    await addLoanPayment({
      name: `${selectedLoan.name} payment`,
      loanId: selectedLoan.id,
      loanName: selectedLoan.name,

      value: totalPaymentAmount,
      regularPaymentAmount: regularAmount,
      extraPaymentAmount: extraAmount,

      date,

      accountType: 'bank',
      bankName: finalBankName,

      isExtraPayment
    });

    Alert.alert('Success', 'Loan payment added successfully!');

    router.back();
  };

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Add Payment</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      </View>

      {loans.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No loans yet</Text>

          <Text style={styles.emptyText}>
            Please add a loan first before recording a payment.
          </Text>

          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => router.push('/add-loans')}
          >
            <Text style={styles.manageButtonText}>Add Loan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Loan</Text>

          <View style={styles.chipRow}>
            {loans.map((loan) => (
              <TouchableOpacity
                key={loan.id}
                style={[
                  styles.chip,
                  selectedLoanId === loan.id && styles.chipActive,
                ]}
                onPress={() => handleLoanChange(loan.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedLoanId === loan.id && styles.chipTextActive,
                  ]}
                >
                  {loan.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!!selectedLoan && (
            <View style={styles.loanSummaryCard}>
              <View style={styles.loanSummaryLeft}>
                <Text style={styles.loanSummaryName} numberOfLines={1}>
                  {selectedLoan.name}
                </Text>

                <Text style={styles.loanSummaryMeta}>
                  Monthly £{formatCurrency(selectedLoan.monthlyPayment)}
                </Text>
              </View>

              <View style={styles.loanSummaryRight}>
                <Text style={styles.loanSummaryLabel}>Rate</Text>
                <Text style={styles.loanSummaryValue}>
                  {selectedLoan.interestRate}%
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.sectionTitle}>Payment details</Text>

          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Text style={styles.fieldLabel}>Date</Text>
              <Text style={styles.dateText}>{formatDisplayDate(date)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changeDateButton}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Text style={styles.changeDateText}>
                {showDatePicker ? 'Close' : 'Change'}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <View style={styles.datePickerBox}>
              <DateTimePicker
                value={new Date(date)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                textColor="#ffffff"
                themeVariant="dark"
                onChange={(_event, selectedDate) => {
                  if (!selectedDate) return;

                  setDate(selectedDate.toISOString());

                  if (Platform.OS !== 'ios') {
                    setShowDatePicker(false);
                  }
                }}
              />

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.amountRow}>
            <View style={styles.amountColumn}>
              <Text style={styles.fieldLabel}>Regular</Text>

              <TextInput
                style={styles.input}
                placeholder="£0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={regularPaymentAmount}
                onChangeText={setRegularPaymentAmount}
              />
            </View>

            <View style={styles.amountColumn}>
              <Text style={styles.fieldLabel}>Extra</Text>

              <TextInput
                style={styles.input}
                placeholder="£0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={extraPaymentAmount}
                onChangeText={setExtraPaymentAmount}
              />
            </View>
          </View>

          <View style={styles.totalRow}>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total payment</Text>
              <Text style={styles.totalAmount}>
                £{formatCurrency(totalPaymentAmount)}
              </Text>
            </View>

            <View
              style={[
                styles.badgeBox,
                isExtraPayment === 'yes' && styles.badgeBoxActive,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isExtraPayment === 'yes' && styles.badgeTextActive,
                ]}
              >
                {isExtraPayment === 'yes' ? 'Extra included' : 'Regular only'}
              </Text>
            </View>
          </View>

          {!!selectedLoan && selectedLoan.allowsExtraPayment === 'yes' && (
            <View style={styles.rulesCard}>
              <Text style={styles.rulesText}>
                Extra rule: {selectedLoan.extraPaymentAllowedPercent || 0}%
                allowance
              </Text>

              <Text style={styles.rulesText}>
                {selectedLoan.extraPaymentChargeRate || 0}% charge
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Payment account</Text>

          <View style={styles.chipRow}>
            {bankOptions.map((bank) => (
              <TouchableOpacity
                key={bank}
                style={[
                  styles.chip,
                  bankNameOption === bank && styles.chipActive,
                ]}
                onPress={() => setBankNameOption(bank)}
              >
                <Text
                  style={[
                    styles.chipText,
                    bankNameOption === bank && styles.chipTextActive,
                  ]}
                >
                  {bank}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {bankNameOption === 'Other' && (
            <TextInput
              style={[styles.input, styles.otherInput]}
              placeholder="Enter bank name"
              placeholderTextColor={colors.textSecondary}
              value={customBankName}
              onChangeText={setCustomBankName}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleSavePayment}>
            <Text style={styles.buttonText}>Save Payment</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },

  backButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 18,
    marginBottom: 8,
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginTop: 24,
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

  manageButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },

  manageButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },

  chip: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingVertical: 9,
    paddingHorizontal: 13,
  },

  chipActive: {
    backgroundColor: colors.primary,
  },

  chipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },

  chipTextActive: {
    color: colors.background,
  },

  loanSummaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  loanSummaryLeft: {
    flex: 1,
    marginRight: 12,
  },

  loanSummaryName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },

  loanSummaryMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },

  loanSummaryRight: {
    alignItems: 'flex-end',
  },

  loanSummaryLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  loanSummaryValue: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 2,
  },

  dateRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },

  dateBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },

  dateText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },

  changeDateButton: {
    width: 105,
    backgroundColor: colors.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  changeDateText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },

  datePickerBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },

  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  doneButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  amountRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },

  amountColumn: {
    flex: 1,
  },

  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    fontSize: 16,
  },

  totalRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },

  totalBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  totalLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  totalAmount: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },

  badgeBox: {
    width: 135,
    backgroundColor: colors.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  badgeBoxActive: {
    backgroundColor: colors.primary,
  },

  badgeText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },

  badgeTextActive: {
    color: colors.background,
  },

  rulesCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  rulesText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  otherInput: {
    marginTop: 2,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '800',
  },
});