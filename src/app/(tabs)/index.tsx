import CardGrid from '@/components/CardGrid';
import HighlightCard from '@/components/HighlightCard';
import HomeHeader from '@/components/HomeHeader';
import { getSavings, Savings } from '@/storage/savings';
import { globalStyles } from '@/styles/global';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function HomeScreen() {
  const [savings, setSavings] = useState<Savings[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadSavings = async () => {
        const data = await getSavings();
        console.log('Loaded savings in savings page:', data);
        setSavings(data);
      };

      loadSavings();
    }, [])
  );

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Welcome to FinPlanner</Text>
      <HomeHeader />
      <HighlightCard />
      <Text style={globalStyles.sectionTitle}>Monthly Overview</Text>
      <CardGrid />
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