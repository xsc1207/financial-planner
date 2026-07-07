import AsyncStorage from '@react-native-async-storage/async-storage';

export type Loans = {
  id: string;
  name: string;
  types: string;
  value: number;
  interestrate: number;
  yearleft: number;
  createdAt: string;
};

const LOANS_KEY = '@finplanner:loans';

export const getLoans = async (): Promise<Loans[]> => {
  try {
    const data = await AsyncStorage.getItem(LOANS_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.log('Error loading loans:', error);
    return [];
  }
};

export const addLoans = async (
  loan: Omit<Loans, 'id' | 'createdAt'>,
): Promise<Loans> => {
  try {
    const currentLoans = await getLoans();

    const newLoan: Loans = {
      id: Date.now().toString(),
      name: loan.name,
      types: loan.types,
      value: Number(loan.value) || 0,
      interestrate: Number(loan.value) || 0,
      yearleft:  Number(loan.value) || 0,
      createdAt: new Date().toISOString(),
    };

    const updatedLoans = [newLoan, ...currentLoans];

    await AsyncStorage.setItem(LOANS_KEY, JSON.stringify(updatedLoans));

    console.log('Saved loans:', newLoan);
    console.log('All loans:', updatedLoans);

    return newLoan;
  } catch (error) {
    console.log('Error saving loans:', error);
    throw error;
  }
};

export const deleteLoans = async (id: string): Promise<void> => {
  const loans = await getLoans();
  const filtered = loans.filter((loans) => loans.id !== id);
  await AsyncStorage.setItem(LOANS_KEY, JSON.stringify(filtered));
};

export const clearAllLoans = async (): Promise<void> => {
  await AsyncStorage.removeItem(LOANS_KEY);
};