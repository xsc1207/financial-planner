import { colors, globalStyles } from '@/styles/global';
import { router } from "expo-router";
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


export default function AddSavings() {
  const [name, setName] = useState('');
  const [types, setCalories] = useState('');
  const [value, setProtein] = useState('');

  const handleAddSavings = () => {
    console.log({ name, types, value});
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Add Savings</Text>

      <TextInput
        style={styles.input}
        placeholder='Transaction name'
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder='Types of Deposit'
        placeholderTextColor={colors.textSecondary}
        keyboardType='numeric'
        value={types}
        onChangeText={setCalories}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder='Value'
          placeholderTextColor={colors.textSecondary}
          keyboardType='numeric'
          value={value}
          onChangeText={setProtein}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddSavings}>
        <Text style={styles.buttonText}>Add Savings</Text>
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});