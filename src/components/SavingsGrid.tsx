import { StyleSheet, View } from 'react-native';
import SavingsItem from './SavingsItems';

export default function SavingsGrid() {
  return (
    <View style={styles.grid}>
      <SavingsItem label='Retirement Strategy' value='20000' goal='40,000' color='#ff6b6b' />
      <SavingsItem label='Purchase a House' value='0' goal='40,000' color='#4ecdc4' />
      <SavingsItem label='Stock Investment' value='0' goal='1,000' color='#ffd93d' />
      <SavingsItem label='Emergency Savings' value='0' goal='1,000' color='#6bcb77' />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});