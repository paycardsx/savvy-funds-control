import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
  X,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { calculateDaysRemaining } from "../../lib/utils";
import { PayInstallmentForm } from "./PayInstallmentForm";
import { getInstallmentStatus } from "../../lib/utils";

interface ViewTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
  onPayInstallment?: (transaction: Transaction) => void;
}

export const ViewTransactionDialog = ({
  transaction,
  open,
  onClose,
  onPayInstallment,
}: ViewTransactionDialogProps) => {
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const status = getInstallmentStatus(
    transaction.date,
    transaction.installments.current,
    transaction.installments.total,
    transaction.installments.period
  );

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setShowPaymentSuccess(true);
    setTimeout(() => setShowPaymentSuccess(false), 3000);
  };

  const getTypeLabel = () => {
    switch (transaction.type) {
      case 'income': return 'Entrada';
      case 'expense': return 'Despesa';
      case 'bill': return 'Conta';
      case 'daily_expense': return 'Gasto Diário';
      case 'debt': return 'Dívida';
      default: return transaction.type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden bg-white">
        <DialogHeader className="bg-[#1B3047] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {transaction.type === 'income' ? (
                <ArrowUpCircle className="h-6 w-6 text-emerald-600" />
              ) : (
                <ArrowDownCircle className="h-6 w-6 text-destructive" />
              )}
              <div>
                <DialogTitle className="text-xl font-semibold text-white">
                  {transaction.description}
                </DialogTitle>
                <p className="text-white/70 text-sm mt-1">{getTypeLabel()}</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Valor */}
          <div className="text-2xl font-bold text-[#1B3047]">
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </div>

          {/* Informações Principais */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#1B3047]">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Data: {formatDate(transaction.date)}</span>
            </div>

            <div className="flex items-center gap-2 text-[#1B3047]">
              <Tag className="h-4 w-4" />
              <span className="text-sm">
                Categoria: {getCategoryById(transaction.category)?.label}
              </span>
            </div>

            {transaction.installments.total > 1 && (
              <>
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
              <div className="mt-4 pt-4 border-t border-[#1B3047]/10 space-y-3">
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
              </div>
            )}
          </div>

          {/* Status das Parcelas */}
          {transaction.installments.total > 1 && (
            <div className={`mt-4 p-4 rounded-lg ${
              status.hasOverdue ? 'bg-destructive/10' : 'bg-amber-50'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`h-5 w-5 mt-0.5 ${
                  status.hasOverdue ? 'text-destructive' : 'text-amber-500'
                }`} />
                <div className="flex-1">
                  {/* Status de Atraso */}
                  {status.hasOverdue ? (
                    <>
                      <p className="text-sm font-medium text-destructive">
                        {status.overdueInstallments.length} {
                          status.overdueInstallments.length === 1 
                            ? 'parcela atrasada' 
                            : 'parcelas atrasadas'
                        }
                      </p>
                      <p className="text-sm mt-1 text-destructive/70">
                        Atraso máximo: {status.maxDaysOverdue} dias
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-amber-700">
                      Próximo vencimento em {status.currentInstallment.daysRemaining} dias
                    </p>
                  )}

                  {/* Resumo das Parcelas */}
                  <div className="mt-2 p-3 bg-white/50 rounded-lg">
                    <p className="text-sm text-[#1B3047]/70">
                      Parcela atual: {status.currentInstallment.number} de {transaction.installments.total}
                    </p>
                    <p className="text-sm mt-1 text-[#1B3047]/70">
                      Vencimento: {formatDate(status.currentInstallment.dueDate)}
                    </p>
                  </div>

                  {/* Botão de Pagamento */}
                  {!showPaymentSuccess && !showPaymentForm ? (
                    <Button
                      onClick={() => setShowPaymentForm(true)}
                      className={`mt-3 h-9 text-sm ${
                        status.hasOverdue 
                          ? 'bg-destructive hover:bg-destructive/90' 
                          : 'bg-amber-500 hover:bg-amber-600'
                      } text-white`}
                    >
                      {status.hasOverdue ? 'Regularizar Parcelas' : 'Pagar Parcela'}
                    </Button>
                  ) : showPaymentSuccess ? (
                    <div className="flex items-center gap-2 mt-3 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Parcela {status.currentInstallment.number} paga com sucesso!
                      </span>
                    </div>
                  ) : null}

                  {/* Formulário de Pagamento */}
                  {showPaymentForm && (
                    <PayInstallmentForm
                      transaction={transaction}
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => setShowPaymentForm(false)}
                      onPayInstallment={onPayInstallment}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 