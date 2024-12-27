import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Transaction } from "../../lib/types";
import { formatCurrency, formatDate, formatInstallments } from "../../lib/utils";
import { getCategoryById } from "../../lib/categories";
import { 
  Calendar, 
  CreditCard, 
  Banknote, 
  Tag, 
  Clock,
  Building,
  User,
  Key,
  ArrowUpCircle,
  ArrowDownCircle,
  Pencil,
  X
} from "lucide-react";

interface TransactionDetailsProps {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
}

export const TransactionDetails = ({
  transaction,
  open,
  onClose,
  onEdit,
}: TransactionDetailsProps) => {
  const getTypeIcon = () => {
    switch (transaction.type) {
      case 'income':
        return <ArrowUpCircle className="h-6 w-6 text-emerald-600" />;
      default:
        return <ArrowDownCircle className="h-6 w-6 text-destructive" />;
    }
  };

  const getTypeLabel = () => {
    switch (transaction.type) {
      case 'income':
        return 'Entrada';
      case 'expense':
        return 'Despesa';
      case 'bill':
        return 'Conta';
      case 'daily_expense':
        return 'Gasto Diário';
      case 'debt':
        return 'Dívida';
      default:
        return transaction.type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden bg-white">
        {/* Header com botões */}
        <DialogHeader className="bg-[#1B3047] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTypeIcon()}
              <div>
                <DialogTitle className="text-xl font-semibold text-white">
                  {transaction.description}
                </DialogTitle>
                <p className="text-white/70 text-sm mt-1">
                  {getTypeLabel()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  onClose();
                  onEdit(transaction);
                }}
                variant="ghost"
                className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-lg"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Valor */}
          <div className="text-2xl font-bold text-[#1B3047]">
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </div>

          {/* Informações Principais */}
          <div className="space-y-3">
            {/* Data */}
            <div className="flex items-center gap-2 text-[#1B3047]">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Data: {formatDate(transaction.date)}
              </span>
            </div>

            {/* Categoria */}
            <div className="flex items-center gap-2 text-[#1B3047]">
              <Tag className="h-4 w-4" />
              <span className="text-sm">
                Categoria: {getCategoryById(transaction.category)?.label}
              </span>
            </div>

            {/* Informações de Parcelas */}
            {transaction.installments.total > 1 && (
              <>
                {/* Total de Parcelas */}
                <div className="flex items-center gap-2 text-[#1B3047]">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Parcelas: {formatInstallments(
                      transaction.installments.current,
                      transaction.installments.total,
                      transaction.installments.period
                    )}
                  </span>
                </div>

                {/* Periodicidade */}
                <div className="flex items-center gap-2 text-[#1B3047]">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Periodicidade: {transaction.installments.period === 'monthly' ? 'Mensal' : 'Anual'}
                  </span>
                </div>

                {/* Prazo Final */}
                <div className="flex items-center gap-2 text-[#1B3047]">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Prazo Final: {formatDate(transaction.dueDate)}
                  </span>
                </div>
              </>
            )}

            {/* Método de Pagamento */}
            {transaction.paymentMethod && (
              <>
                {/* Tipo de Pagamento */}
                <div className="flex items-center gap-2 text-[#1B3047]">
                  {transaction.paymentMethod.type === 'pix' ? (
                    <Banknote className="h-4 w-4" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    Método: {transaction.paymentMethod.type === 'pix' ? 'PIX' : 'Cartão'}
                  </span>
                </div>

                {/* Suas Informações */}
                <div className="flex items-center gap-2 text-[#1B3047]">
                  <User className="h-4 w-4" />
                  <span className="text-sm">
                    Titular: {transaction.paymentMethod.holderName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#1B3047]">
                  <Building className="h-4 w-4" />
                  <span className="text-sm">
                    Banco: {transaction.paymentMethod.bank}
                  </span>
                </div>

                {/* Informações do Recebedor (apenas para PIX) */}
                {transaction.paymentMethod.type === 'pix' && (
                  <>
                    <div className="flex items-center gap-2 text-[#1B3047]">
                      <Key className="h-4 w-4" />
                      <span className="text-sm">
                        Chave PIX: {transaction.paymentMethod.pixKey}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#1B3047]">
                      <User className="h-4 w-4" />
                      <span className="text-sm">
                        Titular do PIX: {transaction.paymentMethod.pixHolderName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#1B3047]">
                      <Building className="h-4 w-4" />
                      <span className="text-sm">
                        Banco do PIX: {transaction.paymentMethod.pixBank}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Observações (se houver) */}
          {transaction.notes && (
            <div className="mt-4 p-3 bg-[#1B3047]/5 rounded-lg">
              <p className="text-sm text-[#1B3047]">
                {transaction.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 