import { colors } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';

type OverallMonthIncomeCardProps = {
  total: number;
};

export default function OverallMonthIncomeCard({
  total,
}: OverallMonthIncomeCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>Overall Income</Text>
        <Text style={styles.subtitle}>Monthly</Text>
      </View>

      <Text style={styles.value}>£{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },

  value: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
});