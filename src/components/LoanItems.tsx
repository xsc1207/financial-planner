import { colors } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';



type MacroCardProps = {
  label: string;
  value: string;
  loan: string;
  color: string;
  deadline?: string;
};



export default function LoansItem({
  label,
  value,
  loan,
  color,
  deadline,
}: MacroCardProps) {
  const savedNumber = Number(value.replace(/,/g, ''));
  const loanNumber = Number(loan.replace(/,/g, ''));

  const percent =
  loanNumber > 0 ? Math.round((savedNumber / loanNumber) * 100) : 0;

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('en-GB');
  };

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>£{formatMoney(savedNumber)}{' '}</Text>
        <Text style={styles.slash}>/ </Text>
        <Text style={styles.goal}>£{formatMoney(loanNumber)}</Text>
      </View>
      <Text style={styles.complete}>{percent}% Complete</Text>
      {deadline && <Text style={styles.deadline}>{deadline}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
  },
  label: {
    fontSize: 14,
    color: '#a0a0b0',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  goal: {
    fontSize: 12,
    color: '#a0a0b0',
    marginTop: 2,
  },

  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  

  
  slash: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },
  complete: {
    color: '#aaa8bd',
    fontSize: 14,
    marginTop: 4,
  },

  deadline: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 6,
  },

});