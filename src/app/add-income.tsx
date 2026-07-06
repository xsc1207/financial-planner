import { addIncome } from '@/storage/income';
import { colors, globalStyles } from '@/styles/global';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function AddIncomeScreen() {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const handleAddIncome = async () => {


    await addIncome({
      name,
      value: Number(value) || 0,
    });

    setName('');
    setValue('');

    Alert.alert('Success', 'Income added successfully!');

    router.push('/(tabs)/income');
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
                  <Text style={globalStyles.title}>
                  Add Income
                  </Text>
                  <TouchableOpacity onPress={() => router.back()}>
                      <Text style={styles.backButton}>Back</Text>
                  </TouchableOpacity>
            </View>
  
      <TextInput
        style={styles.input}
        placeholder="Income name, eg: Salary, Rent ..."
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
  
      <TextInput
        style={styles.input}
        placeholder="Value(Month)"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />
  
      <TouchableOpacity style={styles.button} onPress={handleAddIncome}>
        <Text style={styles.buttonText}>Add Income</Text>
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