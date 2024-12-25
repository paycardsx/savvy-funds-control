export type TransactionStatus = 'paid' | 'pending' | 'overdue';
export type TransactionType = 'income' | 'expense' | 'debt' | 'bill' | 'daily_expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  dueDate?: string;
  installments?: {
    current: number;
    total: number;
  };
  category: string;
  type: TransactionType;
  status: TransactionStatus;
}