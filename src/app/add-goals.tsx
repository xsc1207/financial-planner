import { addGoal, getGoals, Goal, removeGoal, updateGoal } from '@/storage/goals';
import { getSavings } from '@/storage/savings';
import { colors, globalStyles } from '@/styles/global';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function AddGoalsScreen() {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [deadline, setDeadline] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        const data = await getGoals();
        setGoals(data);
    };

    const getRandomColor = () => {
        const colors = [
            '#4ecdc4',
            '#ff6b6b',
            '#ffd93d',
            '#6bdb7d',
            '#a78bfa',
            '#f97316',
            '#38bdf8',
            '#f472b6',
        ];
  
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatDateUK = (dateString: string) => {
    if (!dateString) return '';
  
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });
  };

  const handleSaveGoal = async () => {
    if (!name || !target) {
      Alert.alert('Error', 'Please enter goal name and target amount.');
      return;
    }

    if (editingGoal) {
      await updateGoal({
        ...editingGoal,
        name,
        target: Number(target) || 0,
      });

      Alert.alert('Success', 'Goal updated successfully!');
    } else {
      await addGoal({
        id: Date.now().toString(),
        name,
        target: Number(target) || 0,
        deadline: deadline,
        color: getRandomColor(),
      });

      Alert.alert('Success', 'Goal added successfully!');
    }

    setName('');
    setTarget('');
    setDeadline('')
    setEditingGoal(null);

    await loadGoals();
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setName(goal.name);
    setDeadline(goal.deadline)
    setTarget(String(goal.target));
  };

  const handleCancelEdit = () => {
    setName('');
    setTarget('');
    setDeadline('');
    setEditingGoal(null);
  };

  const handleRemoveGoal = async () => {
    if (!editingGoal) return;
  
    const allSavings = await getSavings();
  
    const relatedSavings = allSavings.filter(
      (saving) => saving.types === editingGoal.name
    );
  
    if (relatedSavings.length > 0) {
      Alert.alert(
        'Cannot remove goal',
        `This goal has ${relatedSavings.length} saving record(s). Please move them to another goal before removing it.`
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
  
            setName('');
            setTarget('');
            setDeadline('')
            setEditingGoal(null);
  
            await loadGoals();
  
            Alert.alert('Success', 'Goal removed successfully!');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
            <Text style={globalStyles.title}>
            {editingGoal ? 'Edit Saving Goals' : 'Add Saving Goals'}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.backButton}>Back</Text>
            </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Goal name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Target amount"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={target}
        onChangeText={setTarget}
      />

<TouchableOpacity
  style={styles.input}
  onPress={() => setShowDatePicker(true)}
>
<Text style={{ color: deadline ? colors.text : colors.textSecondary }}>
  {deadline ? formatDateUK(deadline) : 'Select deadline date (only select Month and Year)'}
</Text>
</TouchableOpacity>

{showDatePicker && (
 <DateTimePicker
 value={deadline ? new Date(`${deadline}-01`) : new Date()}
 mode="date"
 display="spinner"
 textColor="#ffffff"
 themeVariant="dark"
 minimumDate={new Date()}
 onChange={(event, selectedDate) => {
   if (selectedDate) {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    
    setDeadline(`${year}-${month}`);
   }
 }}
/>
)}


      <TouchableOpacity style={styles.button} onPress={handleSaveGoal}>
        <Text style={styles.buttonText}>
          {editingGoal ? 'Update Goal' : 'Add Goal'}
        </Text>
      </TouchableOpacity>

      {editingGoal && (
  <>
    <TouchableOpacity style={styles.secondaryButton} onPress={handleCancelEdit}>
      <Text style={styles.secondaryButtonText}>Cancel Edit</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.removeButton} onPress={handleRemoveGoal}>
      <Text style={styles.removeButtonText}>Remove Goal</Text>
    </TouchableOpacity>
  </>
)}

      <Text style={styles.sectionTitle}>Existing Goals</Text>

      {goals.length === 0 ? (
  <Text style={styles.emptyText}>No goal log</Text>
) : (
  goals.map((goal) => (
    <TouchableOpacity
      key={goal.id}
      style={styles.goalCard}
      onPress={() => handleEditGoal(goal)}
    >
      <Text style={styles.goalName}>{goal.name}</Text>
      <Text style={styles.goalTarget}>Target: £{goal.target}</Text>
      <Text style={styles.goalTarget}>
        Deadline: {goal.deadline ? formatDateUK(goal.deadline) : 'No deadline'}
      </Text>
      <Text style={styles.editHint}>Tap to edit</Text>
    </TouchableOpacity>
  ))
)}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 16,
  },

  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },

  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },

  secondaryButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 8,
  },

  goalCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
  },

  goalName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },

  goalTarget: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },

  editHint: {
    color: colors.primary,
    fontSize: 13,
    marginTop: 8,
  },

  backButton: {
    color: 'red',
    fontSize: 16,
  },

  removeButton: {
    backgroundColor: '#ff6b6b',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 16,
  },
});
