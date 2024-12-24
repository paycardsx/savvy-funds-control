export type TransactionStatus = 'paid' | 'pending' | 'overdue';
export type TransactionType = 'income' | 'expense' | 'debt';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  dueDate: string | null;
  category: string;
  type: TransactionType;
  status: TransactionStatus;
  expenses: number;
}