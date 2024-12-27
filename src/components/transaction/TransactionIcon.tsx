import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { TransactionType } from "../../lib/types";

interface TransactionIconProps {
  type: TransactionType;
}

export const TransactionIcon = ({ type }: TransactionIconProps) => {
  switch (type) {
    case 'income':
      return <ArrowUpCircle className="h-8 w-8 text-emerald-600" />;
    case 'expense':
    case 'bill':
    case 'daily_expense':
    case 'debt':
      return <ArrowDownCircle className="h-8 w-8 text-destructive" />;
    default:
      return null;
  }
};