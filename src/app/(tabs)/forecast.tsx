import HomeHeader from '@/components/HomeHeader';
import { globalStyles } from '@/styles/global';
import { ScrollView, Text } from 'react-native';

export default function ForecastScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Forecast</Text>
      <HomeHeader />
    </ScrollView>
  );
}