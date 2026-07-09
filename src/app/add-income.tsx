import { addIncome } from '@/storage/income';
import { colors, globalStyles } from '@/styles/global';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
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

const incomeSources = [
  'Salary',
  'Freelance',
  'Rent',
  'Benefit',
  'Interest',
  'Bonus',
  'Other',
];

const bankOptions = [
  'Barclays',
  'HSBC',
  'Lloyds',
  'Revolut',
  'Monzo',
  'Other',
];

export default function AddIncomeScreen() {
  const [source, setSource] = useState('Salary');
  const [customSource, setCustomSource] = useState('');

  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [accountType, setAccountType] = useState<'cash' | 'bank'>('bank');
  const [bankName, setBankName] = useState('Barclays');
  const [customBankName, setCustomBankName] = useState('');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddIncome = async () => {
    const finalSource =
      source === 'Other' ? customSource.trim() : source;

    const finalBankName =
      bankName === 'Other' ? customBankName.trim() : bankName;

    if (!finalSource) {
      Alert.alert('Error', 'Please enter income source');
      return;
    }

    if (!value.trim()) {
      Alert.alert('Error', 'Please enter monthly amount');
      return;
    }

    if (accountType === 'bank' && !finalBankName) {
      Alert.alert('Error', 'Please enter bank name');
      return;
    }

    await addIncome({
      name: finalSource,
      value: Number(value) || 0,
      date: date.toISOString(),
      accountType,
      bankName: accountType === 'bank' ? finalBankName : undefined,
    });

    setSource('Salary');
    setCustomSource('');
    setValue('');
    setDate(new Date());
    setAccountType('bank');
    setBankName('Barclays');
    setCustomBankName('');

    Alert.alert('Success', 'Income added successfully!');

    router.push('/(tabs)/income');
  };

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Add Income</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Income source</Text>

      <View style={styles.optionRow}>
        {incomeSources.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionButton,
              source === item && styles.optionButtonActive,
            ]}
            onPress={() => setSource(item)}
          >
            <Text
              style={[
                styles.optionText,
                source === item && styles.optionTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {source === 'Other' && (
  <TextInput
    style={[styles.input, styles.customInput]}
    placeholder="Enter income source"
    placeholderTextColor={colors.textSecondary}
    value={customSource}
    onChangeText={setCustomSource}
  />
)}

      <Text style={styles.label}>Monthly amount</Text>

      <TextInput
        style={styles.input}
        placeholder="£0"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />

      <Text style={styles.label}>Income date</Text>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Account</Text>

      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            accountType === 'cash' && styles.optionButtonActive,
          ]}
          onPress={() => setAccountType('cash')}
        >
          <Text
            style={[
              styles.optionText,
              accountType === 'cash' && styles.optionTextActive,
            ]}
          >
            Cash
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            accountType === 'bank' && styles.optionButtonActive,
          ]}
          onPress={() => setAccountType('bank')}
        >
          <Text
            style={[
              styles.optionText,
              accountType === 'bank' && styles.optionTextActive,
            ]}
          >
            Bank
          </Text>
        </TouchableOpacity>
      </View>

      {accountType === 'bank' && (
        <>
          <Text style={styles.label}>Bank</Text>

          <View style={styles.optionRow}>
            {bankOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.optionButton,
                  bankName === item && styles.optionButtonActive,
                ]}
                onPress={() => setBankName(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    bankName === item && styles.optionTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {bankName === 'Other' && (
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

      <TouchableOpacity style={styles.button} onPress={handleAddIncome}>
        <Text style={styles.buttonText}>Add Income</Text>
      </TouchableOpacity>

      <Modal visible={showDatePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
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

  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 22,
    marginBottom: 10,
  },

  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
  },

  dateButton: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
  },

  dateText: {
    color: colors.text,
    fontSize: 18,
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
    fontWeight: '500',
  },

  optionTextActive: {
    color: colors.background,
    fontWeight: '700',
  },

  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 32,
  },

  buttonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: 'bold',
  },

  backButton: {
    color: 'red',
    fontSize: 16,
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

  customInput: {
    marginTop: 14,
  },
});