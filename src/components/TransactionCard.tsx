import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { formatDate } from "../lib/utils";
import { Transaction } from "../lib/types";
import { Calendar, CreditCard, Banknote } from "lucide-react";
import { getCategoryById } from "../lib/categories";
import { TransactionActions } from "./transaction/TransactionActions";
import { TransactionIcon } from "./transaction/TransactionIcon";
import { TransactionAmount } from "./transaction/TransactionAmount";
import { TransactionInstallments } from "./transaction/TransactionInstallments";
import { useToast } from "./ui/use-toast";

interface TransactionCardProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onPayInstallment?: (transaction: Transaction) => void;
}

export const TransactionCard = ({ 
  transaction,
  onEdit = () => {},
  onDelete = () => {},
  onPayInstallment = () => {}
}: TransactionCardProps) => {
  const { toast } = useToast();
  console.log("[TransactionCard] Renderizando transação:", transaction);

  const getCategoryLabel = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category?.label || categoryId;
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

  const handlePayInstallment = () => {
    onPayInstallment(transaction);
    toast({
      title: "Parcela paga com sucesso!",
      description: `Parcela ${transaction.installments.current} de ${transaction.installments.total} foi registrada como paga.`,
    });
  };

  const showPayButton = transaction.type !== "income" && 
                       transaction.type !== "daily_expense" && 
                       transaction.installments.total > 1 &&
                       transaction.installments.current <= transaction.installments.total;

  console.log("[TransactionCard] Informações calculadas:", {
    category: getCategoryLabel(transaction.category),
    installments: transaction.installments,
    paymentMethod: transaction.paymentMethod
  });

  return (
    <Card className="p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border group">
      <div className="flex items-center justify-between gap-4">
        {/* Ícone da Transação */}
        <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[#1B3047]/5 group-hover:bg-[#1B3047]/10 transition-colors">
          <TransactionIcon type={transaction.type} />
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

            {/* Parcelas e Status */}
            <TransactionInstallments
              installments={transaction.installments}
              dueDate={transaction.dueDate}
              type={transaction.type}
            />
          </div>
        </div>

        {/* Valor, Botão de Pagamento e Ações */}
        <div className="flex flex-col items-end gap-2">
          <TransactionAmount type={transaction.type} amount={transaction.amount} />
          
          {showPayButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePayInstallment}
              className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
            >
              Pagar Parcela
            </Button>
          )}

          <TransactionActions
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          
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
    </Card>
  );
};