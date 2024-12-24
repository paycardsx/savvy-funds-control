import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import { Calendar, Clock } from "lucide-react";

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
        return 'text-red-600';
      case 'debt':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
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
            <span className="text-sm text-gray-500">{transaction.category}</span>
          </div>
          {transaction.dueDate && (transaction.type === 'expense' || transaction.type === 'debt') && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Clock className="h-4 w-4" />
              <span>Vence em: {new Date(transaction.dueDate).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <span className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};