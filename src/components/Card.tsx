import { StyleSheet, Text, View } from 'react-native';

type MacroCardProps = {
  label: string;
  percentage: string;
  value: string;
  goal: string;
  color: string;
};

export default function Card({
  label,
  percentage,
  value,
  goal,
  color,
}: MacroCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.label}>{label}({percentage}%)</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.goal}>/ {goal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    borderLeftWidth: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#a0a0b0',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  goal: {
    fontSize: 14,
    color: '#a0a0b0',
    marginTop: 2,
  },
});