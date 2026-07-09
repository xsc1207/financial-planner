import CardGrid from '@/components/CardGrid';
import HighlightCard from '@/components/HighlightCard';
import HomeHeader from '@/components/HomeHeader';
import { globalStyles } from '@/styles/global';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { getIncome, Income } from '@/storage/income';
import { getSavings, Savings } from '@/storage/savings';
import { getGoals, Goal } from '@/storage/savingsgoals';



export default function HomeScreen() {
  const [savings, setSavings] = useState<Savings[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [income, setIncome] = useState<Income[]>([]);

  const loadData = async () => {
    const savingsData = await getSavings();
    const goalsData = await getGoals();
    const incomeData = await getIncome();


    setSavings(savingsData);
    setGoals(goalsData);
    setIncome(incomeData);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );



  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Welcome to FinPlanner</Text>
      <HomeHeader />
      <HighlightCard />
      <Text style={globalStyles.sectionTitle}>Monthly Overview</Text>
      <CardGrid income={income} savings={savings} goals={goals} />
      <Text style={globalStyles.sectionTitle}>Budget Health</Text>
      <Text style={styles.text}>You are on track this month.</Text>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: '#ffffff'
  },
});