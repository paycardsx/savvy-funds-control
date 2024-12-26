import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Transaction, TransactionType, PaymentMethod } from "../lib/types";
import { X } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { PaymentDetailsStep } from "./steps/PaymentDetailsStep";
import { getLocalDate } from "../lib/utils";

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onClose?: () => void;
  defaultType?: TransactionType;
  availableTypes?: TransactionType[];
  simpleForm?: boolean;
}

export const AddTransactionForm = ({ 
  onAddTransaction, 
  onClose,
  defaultType = "expense",
  availableTypes = ["expense", "income", "daily_expense", "bill", "debt"],
  simpleForm = false
}: AddTransactionFormProps) => {
  const today = getLocalDate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: defaultType,
    date: today,
    dueDate: today,
    installments: {
      total: 1,
      period: "monthly"
    }
  });

  // Reset o passo quando o tipo muda
  useEffect(() => {
    setCurrentStep(1);
  }, [formData.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData && isFormValid()) {
      onAddTransaction(formData as Omit<Transaction, 'id'>);
    }
  };

  const getFormTitle = () => {
    const type = formData.type || defaultType;
    switch (type) {
      case "income":
        return "Adicionar Entrada";
      case "daily_expense":
        return "Registrar Compra";
      default:
        return "Nova Transação";
    }
  };

  const getHeaderColor = () => {
    const type = formData.type || defaultType;
    switch (type) {
      case "income":
        return "bg-emerald-600";
      case "daily_expense":
        return "bg-orange-500";
      default:
        return "bg-[#1B3047]";
    }
  };

  const updateFormData = (data: Partial<Transaction>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
      // Garante que as parcelas sempre tenham um período definido
      installments: {
        ...prev.installments,
        ...data.installments,
      }
    }));
  };

  // Verifica se deve usar o formulário simples baseado no tipo atual
  const shouldUseSimpleForm = () => {
    return simpleForm || formData.type === "income" || formData.type === "daily_expense";
  };

  const renderStepContent = () => {
    // Se for formulário simples, mostra apenas o BasicInfoStep
    if (shouldUseSimpleForm()) {
      return (
        <BasicInfoStep
          onDataChange={updateFormData}
          defaultType={formData.type}
          availableTypes={availableTypes}
          simpleForm={true}
        />
      );
    }

    // Se não for simples, mostra os passos
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            onDataChange={updateFormData}
            defaultType={formData.type}
            availableTypes={availableTypes}
            simpleForm={false}
          />
        );
      case 2:
        return (
          <PaymentDetailsStep
            onDataChange={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  // Valida se os campos básicos estão preenchidos
  const isBasicInfoValid = () => {
    return !!(
      formData.description &&
      formData.amount &&
      formData.date &&
      formData.category
    );
  };

  // Valida se o método de pagamento está preenchido
  const isPaymentMethodValid = () => {
    if (shouldUseSimpleForm()) return true;
    
    const paymentMethod = formData.paymentMethod;
    if (!paymentMethod) return false;

    if (paymentMethod.type === "pix") {
      return !!(
        paymentMethod.holderName &&
        paymentMethod.bank &&
        paymentMethod.pixKey &&
        paymentMethod.pixHolderName &&
        paymentMethod.pixBank
      );
    } else {
      return !!(
        paymentMethod.holderName &&
        paymentMethod.bank &&
        paymentMethod.recipientHolderName
      );
    }
  };

  // Valida se o formulário está pronto para ser enviado
  const isFormValid = () => {
    return isBasicInfoValid() && (shouldUseSimpleForm() || isPaymentMethodValid());
  };

  // Valida se pode avançar para o próximo passo
  const canProceed = () => {
    if (currentStep === 1) {
      return isBasicInfoValid();
    }
    return true;
  };

  return (
    <div className="w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className={`${getHeaderColor()} rounded-t-[2rem] relative flex items-center justify-between h-[90px] px-6`}>
        <h2 className="text-xl font-semibold text-white">{getFormTitle()}</h2>
        <button 
          type="button" 
          onClick={onClose} 
          className="rounded-full w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Formulário */}
      <div className="bg-white px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Indicador de Progresso (apenas para formulário completo) */}
          {!shouldUseSimpleForm() && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 1 ? getHeaderColor() : 'bg-[#1B3047]/10'
                } text-white font-medium`}>
                  1
                </div>
                <div className="h-1 w-16 bg-[#1B3047]/10" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 2 ? getHeaderColor() : 'bg-[#1B3047]/10'
                } text-white font-medium`}>
                  2
                </div>
              </div>
              <span className="text-sm text-[#1B3047]/60">
                Passo {currentStep} de 2
              </span>
            </div>
          )}

          {/* Conteúdo do Step */}
          {renderStepContent()}

          {/* Botões de Navegação */}
          <div className="flex gap-4 mt-6">
            {!shouldUseSimpleForm() && currentStep > 1 && (
              <Button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex-1 h-11 bg-[#1B3047]/5 text-[#1B3047] font-semibold rounded-xl hover:bg-[#1B3047]/10 transition-colors"
              >
                Voltar
              </Button>
            )}
            
            {!shouldUseSimpleForm() && currentStep < 2 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className={`flex-1 h-11 ${getHeaderColor()} text-white font-semibold rounded-xl transition-colors ${
                  !canProceed() ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'
                }`}
              >
                Próximo
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={!isFormValid()}
                className={`flex-1 h-11 ${getHeaderColor()} text-white font-semibold rounded-xl transition-colors ${
                  !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'
                }`}
              >
                {formData.type === "income" ? "Adicionar Entrada" : 
                 formData.type === "daily_expense" ? "Registrar Compra" : 
                 "Adicionar Transação"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
