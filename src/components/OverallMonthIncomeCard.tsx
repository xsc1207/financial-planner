import { colors } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';

type OverallMonthIncomeCardProps = {
  total: number;
  count: number;
};

export default function OverallMonthIncomeCard({
  total,
  count,
}: OverallMonthIncomeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.item}>
        <Text style={styles.label}>Monthly Income</Text>
        <Text style={styles.value}>£{total}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.label}>Records</Text>
        <Text style={styles.value}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },

  item: {
    flex: 1,
    alignItems: 'center',
  },

  label: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },

  value: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
  },

  divider: {
    width: 1,
    height: 44,
    backgroundColor: colors.textSecondary,
    opacity: 0.25,
  },
});