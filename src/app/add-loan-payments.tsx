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
  const [paymentName, setPaymentName] = useState('');
  const [value, setValue] = useState('');
  const [regularPaymentAmount, setRegularPaymentAmount] = useState('');
  const [extraPaymentAmount, setExtraPaymentAmount] = useState('');

  const [date, setDate] = useState(new Date().toISOString());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [accountType, setAccountType] =
    useState<'cash' | 'bank'>('bank');

  const [bankNameOption, setBankNameOption] = useState('Barclays');
  const [customBankName, setCustomBankName] = useState('');

  const [isExtraPayment, setIsExtraPayment] =
    useState<'yes' | 'no'>('no');

  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    const loansData = await getLoans();

    setLoans(loansData);

    if (loansData.length > 0) {
      const firstLoan = loansData[0];

      setSelectedLoanId(firstLoan.id);
      setPaymentName(`${firstLoan.name} payment`);

      if (firstLoan.monthlyPayment) {
        setRegularPaymentAmount(String(firstLoan.monthlyPayment));
        setValue(String(firstLoan.monthlyPayment));
      }
    }
  };

  const selectedLoan = loans.find((loan) => loan.id === selectedLoanId);

  const getFinalBankName = () => {
    if (accountType !== 'bank') return undefined;

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

  const calculateTotalPayment = (
    regularAmount: string,
    extraAmount: string,
  ) => {
    const regular = Number(regularAmount) || 0;
    const extra = Number(extraAmount) || 0;

    return regular + extra;
  };

  const handleRegularPaymentChange = (text: string) => {
    setRegularPaymentAmount(text);

    const total = calculateTotalPayment(text, extraPaymentAmount);

    if (total > 0) {
      setValue(String(total));
    }
  };

  const handleExtraPaymentChange = (text: string) => {
    setExtraPaymentAmount(text);

    const total = calculateTotalPayment(regularPaymentAmount, text);

    if (total > 0) {
      setValue(String(total));
    }

    setIsExtraPayment(Number(text) > 0 ? 'yes' : 'no');
  };

  const handleLoanChange = (loanId: string) => {
    const loan = loans.find((item) => item.id === loanId);

    setSelectedLoanId(loanId);

    if (loan) {
      setPaymentName(`${loan.name} payment`);

      if (loan.monthlyPayment) {
        setRegularPaymentAmount(String(loan.monthlyPayment));

        const total = calculateTotalPayment(
          String(loan.monthlyPayment),
          extraPaymentAmount,
        );

        setValue(String(total));
      }
    }
  };

  const handleSavePayment = async () => {
    if (!selectedLoan) {
      Alert.alert('Error', 'Please select a loan.');
      return;
    }

    const finalPaymentName = paymentName.trim();

    if (!finalPaymentName) {
      Alert.alert('Error', 'Please enter payment name.');
      return;
    }

    if (!value.trim()) {
      Alert.alert('Error', 'Please enter payment amount.');
      return;
    }

    const totalPaymentAmount = Number(value) || 0;

    if (totalPaymentAmount <= 0) {
      Alert.alert('Error', 'Payment amount must be greater than 0.');
      return;
    }

    const finalBankName = getFinalBankName();

    if (accountType === 'bank' && !finalBankName) {
      Alert.alert('Error', 'Please select or enter bank name.');
      return;
    }

    await addLoanPayment({
      name: finalPaymentName,
      loanId: selectedLoan.id,
      loanName: selectedLoan.name,

      value: totalPaymentAmount,
      regularPaymentAmount: Number(regularPaymentAmount) || 0,
      extraPaymentAmount: Number(extraPaymentAmount) || 0,

      date,

      accountType,
      bankName: finalBankName,

      isExtraPayment,

      notes: notes.trim() || undefined,
    });

    Alert.alert('Success', 'Loan payment added successfully!');

    router.back();
  };

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
    >
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Add Loan Payment</Text>

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
          <Text style={styles.label}>Loan</Text>

          <View style={styles.optionRow}>
            {loans.map((loan) => (
              <TouchableOpacity
                key={loan.id}
                style={[
                  styles.optionButton,
                  selectedLoanId === loan.id && styles.optionButtonActive,
                ]}
                onPress={() => handleLoanChange(loan.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedLoanId === loan.id && styles.optionTextActive,
                  ]}
                >
                  {loan.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Payment name</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. July loan payment"
            placeholderTextColor={colors.textSecondary}
            value={paymentName}
            onChangeText={setPaymentName}
          />

          <Text style={styles.label}>Date</Text>

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>{formatDisplayDate(date)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <View style={styles.datePickerBox}>
              <Text style={styles.datePickerTitle}>Select payment date</Text>

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

              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.groupTitle}>Payment Amount</Text>

          <Text style={styles.label}>Regular payment amount</Text>

          <TextInput
            style={styles.input}
            placeholder="£0"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={regularPaymentAmount}
            onChangeText={handleRegularPaymentChange}
          />

          <Text style={styles.label}>Extra payment amount</Text>

          <TextInput
            style={styles.input}
            placeholder="£0"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={extraPaymentAmount}
            onChangeText={handleExtraPaymentChange}
          />

          <Text style={styles.label}>Total payment amount</Text>

          <TextInput
            style={styles.input}
            placeholder="£0"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />

          <Text style={styles.groupTitle}>Extra Payment</Text>

          <Text style={styles.label}>Is this an extra payment?</Text>

          <View style={styles.optionRow}>
            {(['yes', 'no'] as const).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  isExtraPayment === option && styles.optionButtonActive,
                ]}
                onPress={() => setIsExtraPayment(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isExtraPayment === option && styles.optionTextActive,
                  ]}
                >
                  {option === 'yes' ? 'Yes' : 'No'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!!selectedLoan && selectedLoan.allowsExtraPayment === 'yes' && (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Extra payment rules</Text>

              {!!selectedLoan.extraPaymentAllowedPercent && (
                <Text style={styles.infoText}>
                  Allowance: {selectedLoan.extraPaymentAllowedPercent}%
                </Text>
              )}

              {!!selectedLoan.extraPaymentChargeRate && (
                <Text style={styles.infoText}>
                  Charge rate: {selectedLoan.extraPaymentChargeRate}%
                </Text>
              )}
            </View>
          )}

          <Text style={styles.groupTitle}>Payment Account</Text>

          <Text style={styles.label}>Account type</Text>

          <View style={styles.optionRow}>
            {(['cash', 'bank'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  accountType === type && styles.optionButtonActive,
                ]}
                onPress={() => setAccountType(type)}
              >
                <Text
                  style={[
                    styles.optionText,
                    accountType === type && styles.optionTextActive,
                  ]}
                >
                  {type === 'cash' ? 'Cash' : 'Bank'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {accountType === 'bank' && (
            <>
              <Text style={styles.label}>Bank name</Text>

              <View style={styles.optionRow}>
                {bankOptions.map((bank) => (
                  <TouchableOpacity
                    key={bank}
                    style={[
                      styles.optionButton,
                      bankNameOption === bank && styles.optionButtonActive,
                    ]}
                    onPress={() => setBankNameOption(bank)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        bankNameOption === bank && styles.optionTextActive,
                      ]}
                    >
                      {bank}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {bankNameOption === 'Other' && (
                <TextInput
                  style={[styles.input, styles.customInput]}
                  placeholder="Enter bank name"
                  placeholderTextColor={colors.textSecondary}
                  value={customBankName}
                  onChangeText={setCustomBankName}
                />
              )}
            </>
          )}

          <Text style={styles.groupTitle}>Notes</Text>

          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Any notes about this payment"
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

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
    paddingBottom: 40,
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
    marginTop: 18,
  },

  manageButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
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
    marginTop: 20,
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

  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
  },

  customInput: {
    marginTop: 14,
  },

  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  inputText: {
    color: colors.text,
    fontSize: 16,
  },

  dateInput: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
  },

  datePickerBox: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
  },

  datePickerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
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

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },

  infoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  infoText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 4,
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
});