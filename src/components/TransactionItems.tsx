import { deleteSavings } from '@/storage/savings';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

type ItemProps = {
  id: string;
  name: string;
  types: string;
  value: string;
  onDelete: () => void;
};

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export default function TransactionItems({
  id,
  name,
  types,
  value,
  onDelete,
}: ItemProps) {
  const handleLongPress = () => {
    Alert.alert('Delete Meal', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSavings(id);
          onDelete();
        },
      },
    ]);
  };



  return (
    <TouchableOpacity style={styles.container} onLongPress={handleLongPress}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.macros}>
        {types}  • £{value} • {currentDate}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  macros: {
    fontSize: 13,
    color: '#a0a0b0',
    marginTop: 4,
  },
});