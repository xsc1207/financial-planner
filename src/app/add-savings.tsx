import { getGoals, Goal } from '@/storage/goals';
import { addSavings } from '@/storage/savings';
import { colors, globalStyles } from '@/styles/global';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function AddSavingsScreen() {
  const [name, setName] = useState('');
  const [types, setTypes] = useState('');
  const [value, setValue] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showGoalMenu, setShowGoalMenu] = useState(false);

  useEffect(() => {
    const loadGoals = async () => {
      const data = await getGoals();
      setGoals(data);
    };
  
    loadGoals();
  }, []);

  const handleAddSavings = async () => {
    if (!name || !types) {
      Alert.alert('Error', 'Please enter a savings name and type.');
      return;
    }

    await addSavings({
      name,
      types,
      value: Number(value) || 0,
    });

    setName('');
    setTypes('');
    setValue('');

    Alert.alert('Success', 'Savings added successfully!');

    router.push('/(tabs)/savings');
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
                  <Text style={globalStyles.title}>
                  Add Savings
                  </Text>
                  <TouchableOpacity onPress={() => router.back()}>
                      <Text style={styles.backButton}>Back</Text>
                  </TouchableOpacity>
            </View>
  
      <TextInput
        style={styles.input}
        placeholder="Savings name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
  
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowGoalMenu(true)}
      >
        <Text style={{ color: types ? colors.text : colors.textSecondary }}>
          {types || 'Select a goal'}
        </Text>
      </TouchableOpacity>
  
      <Modal
        visible={showGoalMenu}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Goal Type</Text>
  
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalOption}
                onPress={() => {
                  setTypes(goal.name);
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
  
      <TextInput
        style={styles.input}
        placeholder="Value"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />
  
      <TouchableOpacity style={styles.button} onPress={handleAddSavings}>
        <Text style={styles.buttonText}>Add Saving</Text>
      </TouchableOpacity>
  
    </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  
  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
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
  
  cancelText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 18,
    fontSize: 16,
  },

  backButton: {
    color: 'red',
    fontSize: 16,
  },
});