import AsyncStorage from '@react-native-async-storage/async-storage';

export type Savings = {
  id: string;
  name: string;
  goalId: string;
  goalName: string;
  value: number;
  date: string;
  accountType: 'cash' | 'bank';
  bankName?: string;
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
      goalId: saving.goalId,
      goalName: saving.goalName,
      value: Number(saving.value) || 0,
      date: saving.date || new Date().toISOString(),
      accountType: saving.accountType,
      bankName: saving.accountType === 'bank' ? saving.bankName : undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedSavings = [newSaving, ...currentSavings];

    await AsyncStorage.setItem(SAVINGS_KEY, JSON.stringify(updatedSavings));

    return newSaving;
  } catch (error) {
    console.log('Error saving savings:', error);
    throw error;
  }
};

export const deleteSavings = async (id: string): Promise<void> => {
  const savings = await getSavings();
  const filtered = savings.filter((saving) => saving.id !== id);
  await AsyncStorage.setItem(SAVINGS_KEY, JSON.stringify(filtered));
};

export const clearAllSavings = async (): Promise<void> => {
  await AsyncStorage.removeItem(SAVINGS_KEY);
};