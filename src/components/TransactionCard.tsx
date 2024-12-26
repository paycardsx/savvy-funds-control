import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { formatCurrency } from "../lib/utils";
import { Transaction } from "../lib/types";
import { Calendar, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { getCategoryById } from "../lib/categories";

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpCircle className="h-8 w-8 text-[#E19F09]" />;
      case 'expense':
      case 'bill':
      case 'daily_expense':
      case 'debt':
        return <ArrowDownCircle className="h-8 w-8 text-destructive" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-[#E19F09] font-bold';
      case 'expense':
      case 'bill':
      case 'daily_expense':
      case 'debt':
        return 'text-destructive font-bold';
      default:
        return 'text-[#1B3047]/80';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category?.label || categoryId;
  };

  return (
    <Card className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[#1B3047]/10 group">
      <div className="flex items-center justify-between gap-4">
        {/* Ícone da Transação */}
        <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[#1B3047]/5 group-hover:bg-[#1B3047]/10 transition-colors">
          {getTypeIcon(transaction.type)}
        </div>

        {/* Informações da Transação */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#1B3047] truncate">
              {transaction.description}
            </h3>
            <Badge 
              variant="outline" 
              className="hidden md:inline-flex bg-[#1B3047]/5 text-[#1B3047] border-[#1B3047]/20"
            >
              {getCategoryLabel(transaction.category)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-[#1B3047]/60">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(transaction.date)}</span>
          </div>
        </div>

        {/* Valor */}
        <div className="text-right">
          <span className={`text-lg ${getTypeColor(transaction.type)}`}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </span>
          
          {/* Status em Mobile */}
          <div className="md:hidden mt-1">
            <Badge 
              variant="outline" 
              className="text-xs bg-[#1B3047]/5 text-[#1B3047] border-[#1B3047]/20"
            >
              {getCategoryLabel(transaction.category)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Informações Adicionais em Mobile */}
      <div className="md:hidden mt-2 pt-2 border-t border-[#1B3047]/10">
        <div className="flex items-center justify-between text-sm text-[#1B3047]/60">
          <span>{transaction.type === 'income' ? 'Recebido' : 'Pago'}</span>
          <span>{formatDate(transaction.date)}</span>
        </div>
      </div>
    </Card>
  );
};
