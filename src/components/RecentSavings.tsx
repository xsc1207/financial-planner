import { Savings } from '@/storage/savings';
import { globalStyles } from '@/styles/global';
import { Text, View } from 'react-native';
import RecentSavingsItems from './RecentSavingsItems';

type RecentSavingsProps = {
  savings?: Savings[];
  onDelete: () => void;
};

export default function RecentSavings({ savings = [], onDelete}: RecentSavingsProps) {
  const safeSavings = Array.isArray(savings) ? savings : [];

  return (
    <View >

      {safeSavings.length === 0 ? (
        <Text style={globalStyles.empty}>No savings logged yet.</Text>
      ) : (
        safeSavings.slice(0, 5).map((saving) => (
          <RecentSavingsItems
            key={saving.id}
            id={saving.id}
            name={saving.name}
            value={`${saving.value}`}
            types={saving.goalName}
            date={saving.date}
            accountType={saving.accountType}
            bankName={saving.bankName}
            onDelete={onDelete}
          />

        ))
      )}
    </View>
  );
}