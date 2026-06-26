import HomeHeader from '@/components/HomeHeader';
import { globalStyles } from '@/styles/global';
import { ScrollView, Text } from 'react-native';

export default function BudgetScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Budget</Text>
      <HomeHeader />
    </ScrollView>
  );
}