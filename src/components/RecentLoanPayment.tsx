import RecentLoanPaymentItems from '@/components/RecentLoanPaymentItems';
import { LoanPayment, deleteLoanPayment } from '@/storage/loans';
import { globalStyles } from '@/styles/global';
import { Text, View } from 'react-native';

type RecentLoanPaymentsProps = {
  loanPayments?: LoanPayment[];
  onDelete: () => void;
};

export default function RecentLoanPayments({
  loanPayments = [],
  onDelete,
}: RecentLoanPaymentsProps) {
  const safeLoanPayments = Array.isArray(loanPayments) ? loanPayments : [];

  const handleDeleteLoanPayment = async (id: string) => {
    await deleteLoanPayment(id);
    onDelete();
  };

  return (
    <View>
      {safeLoanPayments.length === 0 ? (
        <Text style={globalStyles.empty}>No loan payments logged yet.</Text>
      ) : (
        safeLoanPayments.map((payment) => (
          <RecentLoanPaymentItems
            key={payment.id}
            id={payment.id}
            name={payment.name}
            loanName={payment.loanName}
            value={`${payment.value}`}
            date={payment.date || payment.createdAt}
            accountType={payment.accountType}
            bankName={payment.bankName}
            onDelete={handleDeleteLoanPayment}
          />
        ))
      )}
    </View>
  );
}