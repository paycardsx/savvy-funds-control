export type TransactionType = "income" | "expense" | "daily_expense" | "bill" | "debt";
export type TransactionStatus = "pending" | "paid" | "overdue";

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  dueDate: string;
  installments: {
    current: number;
    total: number;
  };
  category: string;
  status: TransactionStatus;
}
