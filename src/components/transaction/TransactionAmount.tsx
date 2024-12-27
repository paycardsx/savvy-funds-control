import { formatCurrency } from "../../lib/utils";
import { TransactionType } from "../../lib/types";

interface TransactionAmountProps {
  type: TransactionType;
  amount: number;
}

export const TransactionAmount = ({ type, amount }: TransactionAmountProps) => {
  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return 'text-emerald-600 font-bold';
      case 'expense':
      case 'bill':
      case 'daily_expense':
      case 'debt':
        return 'text-destructive font-bold';
      default:
        return 'text-[#1B3047]/80';
    }
  };

  return (
    <span className={`text-lg ${getTypeColor(type)}`}>
      {type === 'income' ? '+' : '-'} {formatCurrency(amount)}
    </span>
  );
};