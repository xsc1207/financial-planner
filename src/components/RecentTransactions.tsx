import { Savings } from '@/storage/savings';
import { globalStyles } from '@/styles/global';
import { Text, View } from 'react-native';
import TransactionItems from './TransactionItems';

type RecentSavingsProps = {
  savings?: Savings[];
  onDelete: () => void;
};

export default function RecentTransactions({ savings = [], onDelete}: RecentSavingsProps) {
  const safeSavings = Array.isArray(savings) ? savings : [];

  return (
    <View >

      {safeSavings.length === 0 ? (
        <Text style={globalStyles.empty}>No savings logged yet.</Text>
      ) : (
        safeSavings.slice(0, 5).map((saving) => (
          <TransactionItems
            key={saving.id}
            id={saving.id}
            name={saving.name}
            value={`${saving.value}`}
            types={saving.types}
            onDelete={onDelete}
          />
        ))
      )}
    </View>
  );
}