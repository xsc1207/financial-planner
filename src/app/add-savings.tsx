import { addSavings } from '@/storage/savings';
import { colors, globalStyles } from '@/styles/global';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddSavingsScreen() {
  const [name, setName] = useState('');
  const [types, setTypes] = useState('');
  const [value, setValue] = useState('');

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
      <Text style={globalStyles.title}>Add Savings Goals</Text>

      <TextInput
        style={styles.input}
        placeholder="Savings name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Type"
        placeholderTextColor={colors.textSecondary}
        value={types}
        onChangeText={setTypes}
      />

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

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
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
});