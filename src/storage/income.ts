import AsyncStorage from '@react-native-async-storage/async-storage';

export type Income = {
  id: string;
  name: string;
  value: number;
  createdAt: string;
};

const INCOME_KEY = '@finplanner:income';

export const getIncome = async (): Promise<Income[]> => {
  try {
    const data = await AsyncStorage.getItem(INCOME_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.log('Error loading income:', error);
    return [];
  }
};

export const addIncome = async (
  income: Omit<Income, 'id' | 'createdAt'>,
): Promise<Income> => {
  try {
    const currentIncome = await getIncome();

    const newIncome: Income = {
      id: Date.now().toString(),
      name: income.name,
      value: Number(income.value) || 0,
      createdAt: new Date().toISOString(),
    };

    const updatedIncome = [newIncome, ...currentIncome];

    await AsyncStorage.setItem(INCOME_KEY, JSON.stringify(updatedIncome));

    console.log('Saved income:', newIncome);
    console.log('All income:', updatedIncome);

    return newIncome;
  } catch (error) {
    console.log('Error saving income:', error);
    throw error;
  }
};

export const deleteIncome = async (id: string): Promise<void> => {
  const income = await getIncome();
  const filtered = income.filter((income) => income.id !== id);
  await AsyncStorage.setItem(INCOME_KEY, JSON.stringify(filtered));
};

export const clearAllIncome = async (): Promise<void> => {
  await AsyncStorage.removeItem(INCOME_KEY);
};