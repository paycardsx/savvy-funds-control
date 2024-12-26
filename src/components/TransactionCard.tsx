import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatCurrency, formatDate, calculateDaysRemaining, formatInstallments } from "../lib/utils";
import { Transaction } from "../lib/types";
import { Calendar, ArrowUpCircle, ArrowDownCircle, Clock, AlertCircle, CreditCard, Banknote } from "lucide-react";
import { getCategoryById } from "../lib/categories";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  console.log("[TransactionCard] Renderizando transação:", transaction);

  const getTypeIcon = (type: string) => {
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

  const getTypeColor = (type: string) => {
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

  const getCategoryLabel = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category?.label || categoryId;
  };

  const getDaysRemainingColor = (days: number) => {
    if (days < 0) return "text-destructive";
    if (days <= 7) return "text-amber-500";
    return "text-emerald-600";
  };

  const formatDaysRemaining = (days: number) => {
    if (days < 0) return `${Math.abs(days)} dias em atraso`;
    if (days === 0) return "Vence hoje";
    if (days === 1) return "Vence amanhã";
    return `${days} dias restantes`;
  };

  const getPaymentMethodIcon = () => {
    if (!transaction.paymentMethod) return null;
    return transaction.paymentMethod.type === "pix" ? 
      <Banknote className="h-4 w-4" /> : 
      <CreditCard className="h-4 w-4" />;
  };

  const getPaymentMethodLabel = () => {
    if (!transaction.paymentMethod) return "";
    return transaction.paymentMethod.type === "pix" ? "PIX" : "Cartão";
  };

  const daysRemaining = calculateDaysRemaining(transaction.dueDate);

  console.log("[TransactionCard] Informações calculadas:", {
    category: getCategoryLabel(transaction.category),
    daysRemaining,
    installments: transaction.installments,
    paymentMethod: transaction.paymentMethod
  });

  return (
    <Card className="p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border group">
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

          {/* Informações de Parcelas e Prazo */}
          <div className="flex items-center gap-3 mt-1 text-sm">
            {/* Data */}
            <div className="flex items-center text-[#1B3047]/60">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(transaction.date)}</span>
            </div>

            {/* Método de Pagamento */}
            {transaction.paymentMethod && (
              <div className="flex items-center text-[#1B3047]/60">
                {getPaymentMethodIcon()}
                <span className="ml-1">{getPaymentMethodLabel()}</span>
              </div>
            )}

            {/* Parcelas (se houver) */}
            {transaction.installments.total > 1 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center text-[#1B3047]/60">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {formatInstallments(
                          transaction.installments.current,
                          transaction.installments.total,
                          transaction.installments.period
                        )}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Pagamento {transaction.installments.period === "monthly" ? "mensal" : "anual"}
                      <br />
                      Vencimento: {formatDate(transaction.dueDate)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Dias Restantes */}
            {transaction.type !== "income" && transaction.type !== "daily_expense" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className={`flex items-center ${getDaysRemainingColor(daysRemaining)}`}>
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{formatDaysRemaining(daysRemaining)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Vencimento: {formatDate(transaction.dueDate)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(transaction.date)}</span>
          </div>
          {transaction.installments.total > 1 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {formatInstallments(
                  transaction.installments.current,
                  transaction.installments.total,
                  transaction.installments.period
                )}
              </span>
            </div>
          )}
        </div>
        {transaction.type !== "income" && transaction.type !== "daily_expense" && (
          <div className={`flex items-center gap-1 mt-1 ${getDaysRemainingColor(daysRemaining)}`}>
            <AlertCircle className="h-4 w-4" />
            <span>{formatDaysRemaining(daysRemaining)}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
