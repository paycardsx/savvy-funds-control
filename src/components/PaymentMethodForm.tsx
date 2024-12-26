import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { PaymentMethod, PaymentMethodType } from "../lib/types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface PaymentMethodFormProps {
  onPaymentMethodChange: (paymentMethod: PaymentMethod) => void;
}

export const PaymentMethodForm = ({ onPaymentMethodChange }: PaymentMethodFormProps) => {
  const [paymentType, setPaymentType] = useState<PaymentMethodType>("pix");
  
  // Informações do pagador
  const [holderName, setHolderName] = useState("");
  const [bank, setBank] = useState("");
  
  // Informações do recebedor (PIX)
  const [pixKey, setPixKey] = useState("");
  const [pixHolderName, setPixHolderName] = useState("");
  const [pixBank, setPixBank] = useState("");
  
  // Informações do recebedor (Cartão)
  const [recipientHolderName, setRecipientHolderName] = useState("");

  // Limpa os campos quando muda o tipo de pagamento
  useEffect(() => {
    if (paymentType === "pix") {
      setRecipientHolderName("");
    } else {
      setPixKey("");
      setPixHolderName("");
      setPixBank("");
    }
  }, [paymentType]);

  // Atualiza o método de pagamento sempre que houver mudanças
  const updatePaymentMethod = () => {
    if (paymentType === "pix") {
      onPaymentMethodChange({
        type: "pix",
        holderName,
        bank,
        pixKey,
        pixHolderName,
        pixBank
      });
    } else {
      onPaymentMethodChange({
        type: "card",
        holderName,
        bank,
        recipientHolderName
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Tipo de Pagamento */}
      <div>
        <div className="flex items-center gap-1 mb-1.5">
          <p className="text-sm font-medium text-[#1B3047]/60">Método de Pagamento</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-[#1B3047]/40" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Escolha como você deseja realizar o pagamento.
                  PIX: Transferência instantânea.
                  Cartão: Pagamento via cartão de crédito/débito.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={paymentType} 
          onValueChange={(value: PaymentMethodType) => {
            setPaymentType(value);
            updatePaymentMethod();
          }}
        >
          <SelectTrigger className="w-full h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20">
            <SelectValue placeholder="Selecione o método" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-[#1B3047]/10 shadow-lg rounded-lg">
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="card">Cartão</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Informações do Pagador */}
      <div className="space-y-4">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium text-[#1B3047]/60">Suas Informações</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-[#1B3047]/40" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Informe seus dados bancários para realizar o pagamento.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          placeholder="Nome do Titular"
          value={holderName}
          onChange={(e) => {
            setHolderName(e.target.value);
            updatePaymentMethod();
          }}
          className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
        />
        <Input
          placeholder="Banco"
          value={bank}
          onChange={(e) => {
            setBank(e.target.value);
            updatePaymentMethod();
          }}
          className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
        />
      </div>

      {/* Informações do Recebedor */}
      <div className="space-y-4">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium text-[#1B3047]/60">Informações do Recebedor</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-[#1B3047]/40" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {paymentType === "pix" 
                    ? "Informe os dados do destinatário do PIX (chave, nome e banco)."
                    : "Informe o nome do titular que receberá o pagamento via cartão."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {paymentType === "pix" ? (
          <>
            <Input
              placeholder="Chave PIX (CPF, CNPJ, e-mail, telefone ou chave aleatória)"
              value={pixKey}
              onChange={(e) => {
                setPixKey(e.target.value);
                updatePaymentMethod();
              }}
              className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
            />
            <Input
              placeholder="Nome do Titular do PIX"
              value={pixHolderName}
              onChange={(e) => {
                setPixHolderName(e.target.value);
                updatePaymentMethod();
              }}
              className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
            />
            <Input
              placeholder="Banco do PIX"
              value={pixBank}
              onChange={(e) => {
                setPixBank(e.target.value);
                updatePaymentMethod();
              }}
              className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
            />
          </>
        ) : (
          <Input
            placeholder="Nome do Titular do Cartão"
            value={recipientHolderName}
            onChange={(e) => {
              setRecipientHolderName(e.target.value);
              updatePaymentMethod();
            }}
            className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
          />
        )}
      </div>
    </div>
  );
};
