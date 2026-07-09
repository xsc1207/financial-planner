import AsyncStorage from '@react-native-async-storage/async-storage';

export type Goal = {
  id: string;
  name: string;
  target: number;
  startDate: string;
  deadline: string;
  color: string;
  createdAt: string;
};

const GOALS_KEY = '@finplanner:goals';

export const getGoals = async (): Promise<Goal[]> => {
  try {
    const data = await AsyncStorage.getItem(GOALS_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.log('Error loading goals:', error);
    return [];
  }
};

export const addGoal = async (goal: Goal): Promise<Goal> => {
  try {
    const currentGoals = await getGoals();
    const updatedGoals = [goal, ...currentGoals];

    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));

    return goal;
  } catch (error) {
    console.log('Error adding goal:', error);
    throw error;
  }
};

export const updateGoal = async (updatedGoal: Goal): Promise<void> => {
  const goals = await getGoals();

  const updatedGoals = goals.map((goal) =>
    goal.id === updatedGoal.id ? updatedGoal : goal,
  );

  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
};

export const removeGoal = async (id: string): Promise<void> => {
  const goals = await getGoals();
  const filtered = goals.filter((goal) => goal.id !== id);

  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(filtered));
};

export const clearAllGoals = async (): Promise<void> => {
  await AsyncStorage.removeItem(GOALS_KEY);
};