import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Transaction } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export const calculateTotals = (transactions: Transaction[]) => {
  return transactions.reduce(
    (acc, transaction) => {
      const amount = transaction.amount;
      switch (transaction.type) {
        case 'income':
          acc.income += amount;
          break;
        case 'expense':
        case 'bill':
          acc.expenses += amount;
          break;
        case 'debt':
          acc.debts += amount;
          break;
      }
      acc.total = acc.income - acc.expenses - acc.debts;
      return acc;
    },
    { income: 0, expenses: 0, debts: 0, total: 0 }
  );
};