import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import { Calendar, Clock, Layers } from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
      case 'bill':
      case 'daily_expense':
        return 'text-red-600';
      case 'debt':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'income':
        return 'Entrada';
      case 'expense':
        return 'Despesa';
      case 'daily_expense':
        return 'Compra Diária';
      case 'bill':
        return 'Conta';
      case 'debt':
        return 'Dívida';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{transaction.description}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={getStatusColor(transaction.status)}>
              {transaction.status === 'paid' ? 'Pago' : transaction.status === 'pending' ? 'Pendente' : 'Em atraso'}
            </Badge>
            <Badge variant="outline">{getTypeLabel(transaction.type)}</Badge>
            <span className="text-sm text-gray-500">{transaction.category}</span>
          </div>
          {transaction.dueDate && transaction.type !== 'income' && transaction.type !== 'daily_expense' && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Clock className="h-4 w-4" />
              <span>Vence em: {formatDate(transaction.dueDate)}</span>
            </div>
          )}
          {transaction.installments && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Layers className="h-4 w-4" />
              <span>Parcela {transaction.installments.current} de {transaction.installments.total}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <span className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(transaction.date)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};