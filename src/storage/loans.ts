import AsyncStorage from '@react-native-async-storage/async-storage';

const LOANS_KEY = 'loans';
const LOAN_PAYMENTS_KEY = 'loan_payments';

export type LoanType =
  | 'house'
  | 'car'
  | 'investment'
  | 'student'
  | 'personal'
  | 'creditCard'
  | 'other';

export type Loan = {
  id: string;

  // Basic information
  name: string;
  loanType: LoanType;

  // Current mortgage / loan information
  currentBalance: number;
  monthlyPayment: number;

  // Interest information
  interestRate: number;
  fixedRateEndDate: string; // YYYY-MM-DD
  followOnRate?: number;

  // Whole mortgage / loan end date
  mortgageEndDate: string; // YYYY-MM-DD

  // Extra payment / overpayment rules
  allowsExtraPayment?: 'yes' | 'no';
  extraPaymentAllowedPercent?: number;
  extraPaymentChargeRate?: number;

  // Optional notes
  notes?: string;

  // UI / metadata
  color: string;
  createdAt: string;
};

export type LoanPayment = {
  id: string;

  name: string;
  loanId: string;
  loanName: string;

  value: number;
  regularPaymentAmount?: number;
  extraPaymentAmount?: number;

  date: string;

  accountType: 'cash' | 'bank';
  bankName?: string;

  isExtraPayment: 'yes' | 'no';

  notes?: string;

  createdAt: string;
};

export const getLoans = async (): Promise<Loan[]> => {
  const jsonValue = await AsyncStorage.getItem(LOANS_KEY);

  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

export const addLoan = async (loan: Loan): Promise<void> => {
  const currentLoans = await getLoans();
  const updatedLoans = [loan, ...currentLoans];

  await AsyncStorage.setItem(LOANS_KEY, JSON.stringify(updatedLoans));
};

export const updateLoan = async (updatedLoan: Loan): Promise<void> => {
  const currentLoans = await getLoans();

  const updatedLoans = currentLoans.map((loan) =>
    loan.id === updatedLoan.id ? updatedLoan : loan,
  );

  await AsyncStorage.setItem(LOANS_KEY, JSON.stringify(updatedLoans));
};

export const removeLoan = async (id: string): Promise<void> => {
  const currentLoans = await getLoans();
  const updatedLoans = currentLoans.filter((loan) => loan.id !== id);

  await AsyncStorage.setItem(LOANS_KEY, JSON.stringify(updatedLoans));
};

export const getLoanPayments = async (): Promise<LoanPayment[]> => {
  const jsonValue = await AsyncStorage.getItem(LOAN_PAYMENTS_KEY);

  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

export const addLoanPayment = async (
  payment: Omit<LoanPayment, 'id' | 'createdAt'>,
): Promise<LoanPayment> => {
  const currentPayments = await getLoanPayments();

  const newPayment: LoanPayment = {
    id: Date.now().toString(),

    name: payment.name,
    loanId: payment.loanId,
    loanName: payment.loanName,

    value: Number(payment.value) || 0,
    regularPaymentAmount: Number(payment.regularPaymentAmount || 0),
    extraPaymentAmount: Number(payment.extraPaymentAmount || 0),

    date: payment.date || new Date().toISOString(),

    accountType: payment.accountType,
    bankName:
      payment.accountType === 'bank' ? payment.bankName : undefined,

    isExtraPayment: payment.isExtraPayment || 'no',

    notes: payment.notes,

    createdAt: new Date().toISOString(),
  };

  const updatedPayments = [newPayment, ...currentPayments];

  await AsyncStorage.setItem(
    LOAN_PAYMENTS_KEY,
    JSON.stringify(updatedPayments),
  );

  return newPayment;
};

export const deleteLoanPayment = async (id: string): Promise<void> => {
  const payments = await getLoanPayments();
  const filtered = payments.filter((payment) => payment.id !== id);

  await AsyncStorage.setItem(
    LOAN_PAYMENTS_KEY,
    JSON.stringify(filtered),
  );
};

export const clearAllLoans = async (): Promise<void> => {
  await AsyncStorage.removeItem(LOANS_KEY);
};

export const clearAllLoanPayments = async (): Promise<void> => {
  await AsyncStorage.removeItem(LOAN_PAYMENTS_KEY);
};