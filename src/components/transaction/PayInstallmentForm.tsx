import { useState } from "react";
import { Transaction, PaymentMethodType } from "../../lib/types";
import { Button } from "../ui/button";
import { formatCurrency } from "../../lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { CreditCard, Banknote } from "lucide-react";

interface PayInstallmentFormProps {
  transaction: Transaction;
  onSuccess: () => void;
  onCancel: () => void;
  onPayInstallment?: (transaction: Transaction) => void;
}

export const PayInstallmentForm = ({
  transaction,
  onSuccess,
  onCancel,
  onPayInstallment
}: PayInstallmentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("pix");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (onPayInstallment) {
        await onPayInstallment(transaction);
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <RadioGroup
        defaultValue={paymentMethod}
        onValueChange={(value) => setPaymentMethod(value as PaymentMethodType)}
        className="grid grid-cols-2 gap-2"
      >
        <div>
          <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
          <Label htmlFor="pix" className="flex flex-col items-center p-4 border rounded-lg cursor-pointer peer-checked:border-[#1B3047] peer-checked:bg-[#1B3047]/5">
            <Banknote className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">PIX</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="card" id="card" className="peer sr-only" />
          <Label htmlFor="card" className="flex flex-col items-center p-4 border rounded-lg cursor-pointer peer-checked:border-[#1B3047] peer-checked:bg-[#1B3047]/5">
            <CreditCard className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Cartão</span>
          </Label>
        </div>
      </RadioGroup>

      <div className="flex gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isProcessing}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-[#1B3047]" disabled={isProcessing}>
          {isProcessing ? "Processando..." : "Confirmar"}
        </Button>
      </div>
    </form>
  );
}; 