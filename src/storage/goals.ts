// src/storage/goals.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export type Goal = {
  id: string;
  name: string;
  target: number;
  deadline: string;
  color: string;
};

const GOALS_KEY = 'goals';

export const getGoals = async (): Promise<Goal[]> => {
    const data = await AsyncStorage.getItem(GOALS_KEY);
  
    if (!data) {
      console.log('Loaded Goals: []');
      return [];
    }
  
    const parsedGoals = JSON.parse(data);
  
    console.log('Loaded Goals:', parsedGoals);
  
    return parsedGoals;
};

export const addGoal = async (goal: Goal) => {
    const goals = await getGoals();
    const updatedGoals = [...goals, goal];
  
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));

    console.log('Saved goal:', goals);
    console.log('All goals:', updatedGoals);
  };


  
  export const clearGoals = async () => {
    await AsyncStorage.removeItem(GOALS_KEY);
  };

  export const updateGoal = async (updatedGoal: Goal) => {
    const goals = await getGoals();
  
    const updatedGoals = goals.map((goal) =>
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
  
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));

    console.log('Saved goals:', updateGoal);
    console.log('All goals:', updatedGoals);
  };

  export const removeGoal = async (goalId: string) => {
    const goals = await getGoals();
  
    const updatedGoals = goals.filter((goal) => goal.id !== goalId);
  
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));

    console.log('Removed goal id:', goalId);
    console.log('All goals:', updatedGoals);
  };