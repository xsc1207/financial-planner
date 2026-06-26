import HomeHeader from '@/components/HomeHeader';
import RecentTransactions from '@/components/RecentTransactions';
import SavingsGrid from '@/components/SavingsGrid';
import { Savings, getSavings } from '@/storage/savings';
import { globalStyles } from '@/styles/global';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text } from 'react-native';

export default function SavingsScreen() {
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
      <Text style={globalStyles.title}>Savings Goals</Text>

      <HomeHeader />

      <Text style={globalStyles.sectionTitle}>Monthly Savings Goals</Text>

      <SavingsGrid />

      <Link
        href="/add-savings"
        style={{ fontSize: 18, color: '#007bff', paddingTop: 20 }}
      >
        Add Savings
      </Link>

      <Link
        href="/add-savings"
        style={{ fontSize: 18, color: '#007bff', paddingTop: 20 }}
      >
        Add Goals
      </Link>

      <RecentTransactions savings={savings} />
    </ScrollView>
  );
}