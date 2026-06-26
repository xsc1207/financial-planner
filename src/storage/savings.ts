import AsyncStorage from '@react-native-async-storage/async-storage';

export type Savings = {
  id: string;
  name: string;
  types: string;
  value: number;
  createdAt: string;
};

const SAVINGS_KEY = '@finplanner:savings';

export const getSavings = async (): Promise<Savings[]> => {
  try {
    const data = await AsyncStorage.getItem(SAVINGS_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.log('Error loading savings:', error);
    return [];
  }
};

export const addSavings = async (
  saving: Omit<Savings, 'id' | 'createdAt'>,
): Promise<Savings> => {
  try {
    const currentSavings = await getSavings();

    const newSaving: Savings = {
      id: Date.now().toString(),
      name: saving.name,
      types: saving.types,
      value: Number(saving.value) || 0,
      createdAt: new Date().toISOString(),
    };

    const updatedSavings = [newSaving, ...currentSavings];

    await AsyncStorage.setItem(SAVINGS_KEY, JSON.stringify(updatedSavings));

    console.log('Saved savings:', newSaving);
    console.log('All savings:', updatedSavings);

    return newSaving;
  } catch (error) {
    console.log('Error saving savings:', error);
    throw error;
  }
};