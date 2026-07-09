import { Savings, getSavings } from '@/storage/savings';
import {
  Goal,
  addGoal,
  getGoals,
  removeGoal,
  updateGoal,
} from '@/storage/savingsgoals';
import { colors, globalStyles } from '@/styles/global';
import {
  getMonthValue,
} from '@/utils/goalSummary';
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

const goalOptions = [
  'House',
  'Car',
  'Holiday',
  'Emergency',
  'Education',
  'Investment',
  'Other',
];


export default function AddGoalsScreen() {
  const [goalNameOption, setGoalNameOption] = useState('House');
  const [customGoalName, setCustomGoalName] = useState('');
  const [target, setTarget] = useState('');

  // Store as YYYY-MM, for example: "2026-07"
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');

  const [datePickerType, setDatePickerType] = useState<
    'start' | 'deadline' | null
  >(null);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [savings, setSavings] = useState<Savings[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const goalsData = await getGoals();
    const savingsData = await getSavings();

    setGoals(goalsData);
    setSavings(savingsData);
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

  const formatMonthValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  };

  const formatMonthYear = (monthString: string) => {
    if (!monthString) return '';

    return new Date(`${monthString}-01`).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-GB');
  };

  const getPickerValue = () => {
    if (datePickerType === 'start' && startDate) {
      return new Date(`${startDate}-01`);
    }

    if (datePickerType === 'deadline' && deadline) {
      return new Date(`${deadline}-01`);
    }

    return new Date();
  };

  const getGoalSavedAmount = (goalId: string) => {
    return savings
      .filter((saving) => saving.goalId === goalId)
      .reduce((sum, saving) => sum + saving.value, 0);
  };

  const clearForm = () => {
    setGoalNameOption('House');
    setCustomGoalName('');
    setTarget('');
    setStartDate('');
    setDeadline('');
    setEditingGoal(null);
    setDatePickerType(null);
  };

  const closeGoalModal = () => {
    clearForm();
    setShowGoalModal(false);
  };

  const openAddGoalModal = () => {
    clearForm();
    setShowGoalModal(true);
  };

  const openEditGoalModal = (goal: Goal) => {
    setEditingGoal(goal);

    if (goalOptions.includes(goal.name)) {
      setGoalNameOption(goal.name);
      setCustomGoalName('');
    } else {
      setGoalNameOption('Other');
      setCustomGoalName(goal.name);
    }

    setTarget(String(goal.target));
    setStartDate(goal.startDate || '');
    setDeadline(goal.deadline || '');
    setDatePickerType(null);
    setShowGoalModal(true);
  };

  const getFinalGoalName = () => {
    return goalNameOption === 'Other'
      ? customGoalName.trim()
      : goalNameOption;
  };

  const handleSaveGoal = async () => {
    const finalGoalName = getFinalGoalName();
    const targetAmount = Number(target) || 0;
  
    if (!finalGoalName) {
      Alert.alert('Error', 'Please enter goal name.');
      return;
    }
  
    if (!target.trim()) {
      Alert.alert('Error', 'Please enter target amount.');
      return;
    }
  
    if (!startDate) {
      Alert.alert('Error', 'Please select start date.');
      return;
    }
  
    if (!deadline) {
      Alert.alert('Error', 'Please select deadline.');
      return;
    }
  
    if (new Date(`${deadline}-01`) < new Date(`${startDate}-01`)) {
      Alert.alert('Error', 'Deadline cannot be earlier than start date.');
      return;
    }
  
    if (editingGoal) {
      const currentMonth = getMonthValue(new Date());
  
      const newPlan = {
        effectiveMonth: currentMonth,
        target: targetAmount,
        deadline,
      };
  
      const updatedGoal: Goal = {
        ...editingGoal,
        name: finalGoalName,
        target: targetAmount,
        deadline,
        plans: [
          ...(editingGoal.plans || []),
          newPlan,
        ],
      };
  
      await updateGoal(updatedGoal);
  
      Alert.alert('Success', 'Goal updated successfully!');
    } else {
      const newGoalId = Date.now().toString();
  
      const newGoal: Goal = {
        id: newGoalId,
        name: finalGoalName,
        target: targetAmount,
        startDate,
        deadline,
        color: getRandomColor(),
        createdAt: new Date().toISOString(),
        plans: [
          {
            effectiveMonth: startDate,
            target: targetAmount,
            deadline,
          },
        ],
      };
  
      await addGoal(newGoal);
  
      Alert.alert('Success', 'Goal added successfully!');
    }
  
    closeGoalModal();
    await loadData();
  };

  const handleRemoveGoal = async () => {
    if (!editingGoal) return;

    const relatedSavings = savings.filter(
      (saving) => saving.goalId === editingGoal.id,
    );

    if (relatedSavings.length > 0) {
      Alert.alert(
        'Cannot remove goal',
        `This goal has ${relatedSavings.length} saving record(s). Please move them to another goal before removing it.`,
      );
      return;
    }

    Alert.alert(
      'Remove Goal',
      `Are you sure you want to remove your goal "${editingGoal.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeGoal(editingGoal.id);

            closeGoalModal();
            await loadData();

            Alert.alert('Success', 'Goal removed successfully!');
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
        <Text style={globalStyles.title}>Manage Goals</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Goals</Text>

      {goals.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No goals yet</Text>
          <Text style={styles.emptyText}>
            Add your first goal to start tracking your savings.
          </Text>
        </View>
      ) : (
        goals.map((goal) => {
          const savedAmount = getGoalSavedAmount(goal.id);
          const percentage =
            goal.target > 0
              ? Math.min((savedAmount / goal.target) * 100, 100)
              : 0;

          return (
            <TouchableOpacity
              key={goal.id}
              style={styles.goalCard}
              onPress={() => openEditGoalModal(goal)}
              activeOpacity={0.8}
            >
              <View style={styles.goalTopRow}>
                <Text style={styles.goalName} numberOfLines={1}>
                  {goal.name}
                </Text>

                <Text style={styles.goalPercentage}>
                  {Math.round(percentage)}%
                </Text>
              </View>

              <Text style={styles.goalSaved}>
                Saved: £{formatCurrency(savedAmount)} / £
                {formatCurrency(goal.target)}
              </Text>

              <Text style={styles.goalDate}>
                {goal.startDate ? formatMonthYear(goal.startDate) : 'No start'}{' '}
                - {goal.deadline ? formatMonthYear(goal.deadline) : 'No deadline'}
              </Text>

              <Text style={styles.editHint}>Tap to edit</Text>
            </TouchableOpacity>
          );
        })
      )}

      <TouchableOpacity style={styles.addGoalButton} onPress={openAddGoalModal}>
        <Text style={styles.addGoalButtonText}>+ Add New Goal</Text>
      </TouchableOpacity>

      <Modal visible={showGoalModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.goalModalBox}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingGoal ? 'Edit Goal' : 'Add Goal'}
                </Text>

                <TouchableOpacity onPress={closeGoalModal}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Goal name</Text>

              <View style={styles.optionRow}>
                {goalOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      goalNameOption === option && styles.optionButtonActive,
                    ]}
                    onPress={() => setGoalNameOption(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        goalNameOption === option && styles.optionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {goalNameOption === 'Other' && (
                <TextInput
                  style={[styles.input, styles.customInput]}
                  placeholder="Enter goal name"
                  placeholderTextColor={colors.textSecondary}
                  value={customGoalName}
                  onChangeText={setCustomGoalName}
                />
              )}

              <Text style={styles.label}>Target amount</Text>

              <TextInput
                style={styles.input}
                placeholder="£0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={target}
                onChangeText={setTarget}
              />

              <View style={styles.dateRow}>
                <View style={styles.dateColumn}>
                  <Text style={styles.label}>Start date</Text>

                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setDatePickerType('start')}
                  >
                    <Text
                      style={[
                        styles.inputText,
                        !startDate && styles.placeholderText,
                      ]}
                    >
                      {startDate ? formatMonthYear(startDate) : 'Start'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.dateColumn}>
                  <Text style={styles.label}>Deadline</Text>

                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setDatePickerType('deadline')}
                  >
                    <Text
                      style={[
                        styles.inputText,
                        !deadline && styles.placeholderText,
                      ]}
                    >
                      {deadline ? formatMonthYear(deadline) : 'Deadline'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {datePickerType && (
                <View style={styles.datePickerBox}>
                  <Text style={styles.datePickerTitle}>
                    {datePickerType === 'start'
                      ? 'Select start date'
                      : 'Select deadline'}
                  </Text>

                  <DateTimePicker
                    value={getPickerValue()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    textColor="#ffffff"
                    themeVariant="dark"
                    onChange={(_event, selectedDate) => {
                      if (!selectedDate) return;

                      const monthValue = formatMonthValue(selectedDate);

                      if (datePickerType === 'start') {
                        setStartDate(monthValue);
                      }

                      if (datePickerType === 'deadline') {
                        setDeadline(monthValue);
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

              <TouchableOpacity style={styles.button} onPress={handleSaveGoal}>
                <Text style={styles.buttonText}>
                  {editingGoal ? 'Update Goal' : 'Add Goal'}
                </Text>
              </TouchableOpacity>

              {editingGoal && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={handleRemoveGoal}
                >
                  <Text style={styles.removeButtonText}>Remove Goal</Text>
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

  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginTop: 12,
  },

  goalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  goalName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },

  goalPercentage: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '800',
  },

  goalSaved: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },

  goalDate: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 8,
  },

  editHint: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },

  addGoalButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },

  addGoalButtonText: {
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

  goalModalBox: {
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

  inputText: {
    color: colors.text,
    fontSize: 16,
  },

  placeholderText: {
    color: colors.textSecondary,
  },

  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },

  dateColumn: {
    flex: 1,
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
});