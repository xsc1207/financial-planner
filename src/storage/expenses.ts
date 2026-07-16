import AsyncStorage from '@react-native-async-storage/async-storage';

const FIXED_EXPENSES_KEY = 'fixed_expenses';
const FLEXIBLE_EXPENSES_KEY = 'flexible_expenses';

export type FixedExpenseCategory =
  | 'rent'
  | 'councilTax'
  | 'electricity'
  | 'gas'
  | 'water'
  | 'internet'
  | 'phone'
  | 'insurance'
  | 'subscription'
  | 'nursery'
  | 'transport'
  | 'other';

export type FlexibleExpenseCategory =
  | 'groceries'
  | 'eatingOut'
  | 'transport'
  | 'shopping'
  | 'baby'
  | 'entertainment'
  | 'health'
  | 'beauty'
  | 'home'
  | 'other';

export type FixedExpense = {
  id: string;

  name: string;
  category: FixedExpenseCategory;

  monthlyAmount: number;
  paymentDayOfMonth?: number;

  accountType: 'bank' | 'card';
  bankName?: string;

  isActive: 'yes' | 'no';

  createdAt: string;
};

export type FlexibleExpense = {
  id: string;

  name: string;
  category: FlexibleExpenseCategory;

  value: number;
  date: string;

  accountType: 'bank' | 'card' | 'cash';
  bankName?: string;

  createdAt: string;
};

export const getFixedExpenses = async (): Promise<FixedExpense[]> => {
  const jsonValue = await AsyncStorage.getItem(FIXED_EXPENSES_KEY);

  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

export const addFixedExpense = async (
  fixedExpense: Omit<FixedExpense, 'id' | 'createdAt'>,
): Promise<FixedExpense> => {
  const currentFixedExpenses = await getFixedExpenses();

  const newFixedExpense: FixedExpense = {
    id: Date.now().toString(),

    name: fixedExpense.name,
    category: fixedExpense.category,

    monthlyAmount: Number(fixedExpense.monthlyAmount) || 0,
    paymentDayOfMonth: fixedExpense.paymentDayOfMonth
      ? Number(fixedExpense.paymentDayOfMonth)
      : undefined,

    accountType: fixedExpense.accountType,
    bankName:
      fixedExpense.accountType === 'bank' ||
      fixedExpense.accountType === 'card'
        ? fixedExpense.bankName
        : undefined,

    isActive: fixedExpense.isActive || 'yes',

    createdAt: new Date().toISOString(),
  };

  const updatedFixedExpenses = [
    newFixedExpense,
    ...currentFixedExpenses,
  ];

  await AsyncStorage.setItem(
    FIXED_EXPENSES_KEY,
    JSON.stringify(updatedFixedExpenses),
  );

  return newFixedExpense;
};

export const updateFixedExpense = async (
  updatedFixedExpense: FixedExpense,
): Promise<void> => {
  const currentFixedExpenses = await getFixedExpenses();

  const updatedFixedExpenses = currentFixedExpenses.map((expense) =>
    expense.id === updatedFixedExpense.id
      ? updatedFixedExpense
      : expense,
  );

  await AsyncStorage.setItem(
    FIXED_EXPENSES_KEY,
    JSON.stringify(updatedFixedExpenses),
  );
};

export const deleteFixedExpense = async (id: string): Promise<void> => {
  const currentFixedExpenses = await getFixedExpenses();

  const updatedFixedExpenses = currentFixedExpenses.filter(
    (expense) => expense.id !== id,
  );

  await AsyncStorage.setItem(
    FIXED_EXPENSES_KEY,
    JSON.stringify(updatedFixedExpenses),
  );
};

export const getFlexibleExpenses = async (): Promise<FlexibleExpense[]> => {
  const jsonValue = await AsyncStorage.getItem(FLEXIBLE_EXPENSES_KEY);

  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

export const addFlexibleExpense = async (
  flexibleExpense: Omit<FlexibleExpense, 'id' | 'createdAt'>,
): Promise<FlexibleExpense> => {
  const currentFlexibleExpenses = await getFlexibleExpenses();

  const newFlexibleExpense: FlexibleExpense = {
    id: Date.now().toString(),

    name: flexibleExpense.name,
    category: flexibleExpense.category,

    value: Number(flexibleExpense.value) || 0,
    date: flexibleExpense.date || new Date().toISOString(),

    accountType: flexibleExpense.accountType,
    bankName:
      flexibleExpense.accountType === 'bank' ||
      flexibleExpense.accountType === 'card'
        ? flexibleExpense.bankName
        : undefined,

    createdAt: new Date().toISOString(),
  };

  const updatedFlexibleExpenses = [
    newFlexibleExpense,
    ...currentFlexibleExpenses,
  ];

  await AsyncStorage.setItem(
    FLEXIBLE_EXPENSES_KEY,
    JSON.stringify(updatedFlexibleExpenses),
  );

  return newFlexibleExpense;
};

export const deleteFlexibleExpense = async (id: string): Promise<void> => {
  const currentFlexibleExpenses = await getFlexibleExpenses();

  const updatedFlexibleExpenses = currentFlexibleExpenses.filter(
    (expense) => expense.id !== id,
  );

  await AsyncStorage.setItem(
    FLEXIBLE_EXPENSES_KEY,
    JSON.stringify(updatedFlexibleExpenses),
  );
};

export const clearAllFixedExpenses = async (): Promise<void> => {
  await AsyncStorage.removeItem(FIXED_EXPENSES_KEY);
};

export const clearAllFlexibleExpenses = async (): Promise<void> => {
  await AsyncStorage.removeItem(FLEXIBLE_EXPENSES_KEY);
};

export const clearAllExpenses = async (): Promise<void> => {
  await AsyncStorage.removeItem(FIXED_EXPENSES_KEY);
  await AsyncStorage.removeItem(FLEXIBLE_EXPENSES_KEY);
};