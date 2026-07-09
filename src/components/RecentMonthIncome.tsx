import { Income } from '@/storage/income';
import { globalStyles } from '@/styles/global';
import { Text, View } from 'react-native';
import RecentIncomeItems from './RecentMonthIncomeItems';

type RecentIncomeProps = {
  income?: Income[];
  onDelete: () => void;
};

export default function RecentIncome({ income = [], onDelete}: RecentIncomeProps) {
  const safeIncome = Array.isArray(income) ? income : [];

  return (
    <View >

      {safeIncome.length === 0 ? (
        <Text style={globalStyles.empty}>No income logged yet.</Text>
      ) : (
        safeIncome.slice(0, 5).map((saving) => (
          <RecentIncomeItems
            key={saving.id}
            id={saving.id}
            name={saving.name}
            value={`${saving.value}`}
            date={saving.date}
            onDelete={onDelete}
          />
        ))
      )}
    </View>
  );
}