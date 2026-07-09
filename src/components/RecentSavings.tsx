import RecentSavingsItems from '@/components/RecentSavingsItems';
import { Savings, deleteSavings } from '@/storage/savings';

type RecentSavingsProps = {
  savings: Savings[];
  onDelete: () => void;
};

export default function RecentSavings({
  savings,
  onDelete,
}: RecentSavingsProps) {
  const handleDeleteSavings = async (id: string) => {
    await deleteSavings(id);
    onDelete();
  };

  return (
    <>
      {savings.map((saving) => (
        <RecentSavingsItems
          key={saving.id}
          id={saving.id}
          name={saving.name}
          goalName={saving.goalName}
          value={`${saving.value}`}
          date={saving.date || saving.createdAt}
          accountType={saving.accountType}
          bankName={saving.bankName}
          onDelete={handleDeleteSavings}
        />
      ))}
    </>
  );
}