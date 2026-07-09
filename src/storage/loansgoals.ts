import AsyncStorage from '@react-native-async-storage/async-storage';

export type LoansGoals = {
  id: string;
  name: string;
  types: string;
  value: number;
  interestrate: number;
  yearleft: number;
  directdebt: boolean;
  createdAt: string;
};

const LOANSGOALS_KEY = 'goals';

export const getLoansGoals = async (): Promise<LoansGoals[]> => {
    const data = await AsyncStorage.getItem(LOANSGOALS_KEY);
  
    if (!data) {
      console.log('Loaded Loans Goals: []');
      return [];
    }
  
    const parsedGoals = JSON.parse(data);
  
    console.log('Loaded Loans Goals:', parsedGoals);
  
    return parsedGoals;
};

export const addGoal = async (loansgoal: LoansGoals) => {
    const loansgoals = await getLoansGoals();
    const updatedLoansGoals = [...loansgoals, loansgoal];
  
    await AsyncStorage.setItem(LOANSGOALS_KEY, JSON.stringify(updatedLoansGoals));

    console.log('Saved Loans goal:', loansgoals);
    console.log('All Loans goals:', updatedLoansGoals);
  };


  
  export const clearLoansGoals = async () => {
    await AsyncStorage.removeItem(LOANSGOALS_KEY);
  };

  export const updateLoansGoal = async (updatedLoansGoal: LoansGoals) => {
    const loansgoals = await getLoansGoals();
  
    const updatedLoansGoals = loansgoals.map((loansgoal) =>
      loansgoal.id === updatedLoansGoal.id ? updatedLoansGoal : loansgoal
    );
  
    await AsyncStorage.setItem(LOANSGOALS_KEY, JSON.stringify(updatedLoansGoals));

    console.log('Saved Loans goals:', updateLoansGoal);
    console.log('All Loans goals:', updatedLoansGoals);
  };

  export const removeLoansGoal = async (goalId: string) => {
    const loansgoals = await getLoansGoals();
  
    const updatedLoansGoals = loansgoals.filter((loansgoal) => loansgoal.id !== goalId);
  
    await AsyncStorage.setItem(LOANSGOALS_KEY, JSON.stringify(updatedLoansGoals));

    console.log('Removed loans goal id:', goalId);
    console.log('All loans goals:', updatedLoansGoals);
  };