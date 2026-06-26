import { StyleSheet, Text, View } from 'react-native';



type MacroCardProps = {
  label: string;
  value: string;
  goal: string;
  color: string;
};

export default function SavingsItem({
  label,
  value,
  goal,
  color,
}: MacroCardProps) {
  const savedNumber = Number(value.replace(/,/g, ''));
  const goalNumber = Number(goal.replace(/,/g, ''));

  const percent =
  goalNumber > 0 ? Math.round((savedNumber / goalNumber) * 100) : 0;

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.slash}> / </Text>
        <Text style={styles.goal}>{goal}</Text>
      </View>
      <Text style={styles.complete}>{percent}% Complete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    borderLeftWidth: 3,
  },
  label: {
    fontSize: 14,
    color: '#a0a0b0',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  goal: {
    fontSize: 14,
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

});