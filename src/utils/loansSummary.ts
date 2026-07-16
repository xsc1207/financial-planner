import { Loan, LoanPayment } from '@/storage/loans';

export const getLoanPaymentsForMonth = (
  payments: LoanPayment[],
  selectedMonth: Date,
) => {
  return payments.filter((payment) => {
    const dateValue = payment.date || payment.createdAt;

    if (!dateValue) return false;

    const paymentDate = new Date(dateValue);

    return (
      paymentDate.getMonth() === selectedMonth.getMonth() &&
      paymentDate.getFullYear() === selectedMonth.getFullYear()
    );
  });
};

export const getMonthlyTotalForLoan = (
  payments: LoanPayment[],
  loanId: string,
) => {
  return payments
    .filter((payment) => payment.loanId === loanId)
    .reduce((sum, payment) => sum + Number(payment.value || 0), 0);
};

export const getTotalPaidForLoan = (
  payments: LoanPayment[],
  loanId: string,
) => {
  return payments
    .filter((payment) => payment.loanId === loanId)
    .reduce((sum, payment) => sum + Number(payment.value || 0), 0);
};

export const getMonthlyLoanPaymentsSummary = (
  payments: LoanPayment[],
  loans: Loan[],
  selectedMonth: Date = new Date(),
) => {
  const selectedMonthPayments = getLoanPaymentsForMonth(
    payments,
    selectedMonth,
  );

  const totalMonthlyLoanPayments = loans.reduce((sum, loan) => {
    return sum + getMonthlyTotalForLoan(selectedMonthPayments, loan.id);
  }, 0);

  return {
    totalMonthlyLoanPayments,
  };
};