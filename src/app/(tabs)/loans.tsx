import HomeHeader from '@/components/HomeHeader';
import { globalStyles } from '@/styles/global';
import { ScrollView, Text } from 'react-native';

export default function LoansScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Loans</Text>
      <HomeHeader />
    </ScrollView>
  );
}