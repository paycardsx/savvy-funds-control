import { PaymentMethod } from "../../lib/types";
import { PaymentMethodForm } from "../PaymentMethodForm";
import { useEffect, useState } from "react";

interface PaymentDetailsStepProps {
  onDataChange: (data: { paymentMethod: PaymentMethod }) => void;
}

export const PaymentDetailsStep = ({ onDataChange }: PaymentDetailsStepProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  // Valida se todos os campos necessários foram preenchidos
  const validatePaymentMethod = (method: PaymentMethod): boolean => {
    if (method.type === "pix") {
      return !!(
        method.holderName &&
        method.bank &&
        method.pixKey &&
        method.pixHolderName &&
        method.pixBank
      );
    } else {
      return !!(
        method.holderName &&
        method.bank &&
        method.recipientHolderName
      );
    }
  };

  // Atualiza os dados apenas se todos os campos estiverem preenchidos
  useEffect(() => {
    if (paymentMethod && validatePaymentMethod(paymentMethod)) {
      onDataChange({ paymentMethod });
    }
  }, [paymentMethod, onDataChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#1B3047]">Método de Pagamento</h3>
        <p className="text-sm text-[#1B3047]/60">
          Escolha como você deseja pagar esta transação. Preencha os dados do pagamento conforme o método escolhido.
        </p>
      </div>

      <PaymentMethodForm 
        onPaymentMethodChange={setPaymentMethod}
      />

      {paymentMethod && !validatePaymentMethod(paymentMethod) && (
        <p className="text-sm text-amber-600">
          Por favor, preencha todos os campos do método de pagamento selecionado.
        </p>
      )}
    </div>
  );
};
