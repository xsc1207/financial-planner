import { StyleSheet, View } from 'react-native';
import Card from './Card';

export default function CardGrid() {
  return (
    <View style={styles.grid}>
      <Card label='Income' percentage='50' value='£0' goal='2000' color='#ff6b6b' />
      <Card label='Expenses'  percentage='50' value='£0' goal='£2000' color='#4ecdc4' />
      <Card label='Savings' percentage='50' value='£0' goal='£3000' color='blue' />
      <Card label='Loans' percentage='50' value='£0' goal='£2000' color='orange' />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});