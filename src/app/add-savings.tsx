import { addSavings } from '@/storage/savings';
import { getGoals, Goal } from '@/storage/savingsgoals';
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

const bankOptions = [
  'Barclays',
  'HSBC',
  'Lloyds',
  'Revolut',
  'Monzo',
  'Other',
];

export default function AddSavingsScreen() {
  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [value, setValue] = useState('');

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [accountType, setAccountType] = useState<'cash' | 'bank'>('bank');
  const [bankName, setBankName] = useState('Barclays');
  const [customBankName, setCustomBankName] = useState('');

  const [goals, setGoals] = useState<Goal[]>([]);
  const [showGoalMenu, setShowGoalMenu] = useState(false);

  useEffect(() => {
    const loadGoals = async () => {
      const data = await getGoals();
      setGoals(data);
    };

    loadGoals();
  }, []);

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

  const handleAddSavings = async () => {
    const finalBankName =
      bankName === 'Other' ? customBankName.trim() : bankName;

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter savings name.');
      return;
    }

    if (!selectedGoal) {
      Alert.alert('Error', 'Please select a goal.');
      return;
    }

    if (!value.trim()) {
      Alert.alert('Error', 'Please enter savings amount.');
      return;
    }

    if (accountType === 'bank' && !finalBankName) {
      Alert.alert('Error', 'Please enter bank name.');
      return;
    }

    await addSavings({
      name: name.trim(),
      goalId: selectedGoal.id,
      goalName: selectedGoal.name,
      value: Number(value) || 0,
      date: date.toISOString(),
      accountType,
      bankName: accountType === 'bank' ? finalBankName : undefined,
    });

    setName('');
    setSelectedGoal(null);
    setValue('');
    setDate(new Date());
    setAccountType('bank');
    setBankName('Barclays');
    setCustomBankName('');

    Alert.alert('Success', 'Savings added successfully!');

    router.push('/(tabs)/savings');
  };

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Add Savings</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      </View>

      {goals.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No goals yet</Text>
          <Text style={styles.emptyText}>
            Add a savings goal first, then you can record your savings.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/add-goals')}
          >
            <Text style={styles.emptyButtonText}>Manage Goals</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.label}>Saving note</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. July saving"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Goal</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowGoalMenu(true)}
          >
            <Text
              style={[
                styles.inputText,
                !selectedGoal && styles.placeholderText,
              ]}
            >
              {selectedGoal ? selectedGoal.name : 'Select a goal'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Amount</Text>

          <TextInput
            style={styles.input}
            placeholder="£0"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />

          <Text style={styles.label}>Saving date</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>{formatDate(date)}</Text>
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

          <TouchableOpacity style={styles.button} onPress={handleAddSavings}>
            <Text style={styles.buttonText}>Add Saving</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal visible={showGoalMenu} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Goal</Text>

            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalOption}
                onPress={() => {
                  setSelectedGoal(goal);
                  setShowGoalMenu(false);
                }}
              >
                <Text style={styles.goalOptionText}>{goal.name}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setShowGoalMenu(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showDatePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select saving date</Text>

            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              textColor="#ffffff"
              themeVariant="dark"
              onChange={handleDateChange}
            />

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
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
    marginTop: 20,
    marginBottom: 10,
  },

  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
  },

  inputText: {
    color: colors.text,
    fontSize: 16,
  },

  placeholderText: {
    color: colors.textSecondary,
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

  customInput: {
    marginTop: 14,
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
    fontWeight: '700',
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

  emptyButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18,
  },

  emptyButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
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

  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },

  goalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },

  goalOptionText: {
    color: colors.text,
    fontSize: 16,
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

  cancelText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 18,
    fontSize: 16,
    fontWeight: '600',
  },
});