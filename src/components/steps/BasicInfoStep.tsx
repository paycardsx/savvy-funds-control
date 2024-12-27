import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Transaction, TransactionType, InstallmentPeriod } from "../../lib/types";
import { Category, getCategoriesByType, getDefaultCategoryForType } from "../../lib/categories";
import { CategoryManager } from "../CategoryManager";
import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { getLocalDate, formatDate, calculateDueDate, calculateCurrentInstallment } from "../../lib/utils";

interface BasicInfoStepProps {
  onDataChange: (data: Partial<Transaction>) => void;
  defaultType?: TransactionType;
  availableTypes?: TransactionType[];
  simpleForm?: boolean;
  defaultValues?: Partial<Transaction>;
}

export const BasicInfoStep = ({ 
  onDataChange, 
  defaultType = "expense",
  availableTypes = ["expense", "income", "daily_expense", "bill", "debt"],
  simpleForm = false,
  defaultValues
}: BasicInfoStepProps) => {
  const today = getLocalDate();
  
  const [type, setType] = useState<TransactionType>(defaultType);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(today);
  const [totalInstallments, setTotalInstallments] = useState("1");
  const [installmentPeriod, setInstallmentPeriod] = useState<InstallmentPeriod>("monthly");
  const [category, setCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  // Sincroniza o tipo quando o defaultType muda
  useEffect(() => {
    if (defaultType && defaultType !== type) {
      setType(defaultType);
    }
  }, [defaultType]);

  // Atualiza categorias quando o tipo muda
  useEffect(() => {
    const categories = getCategoriesByType(type);
    setAvailableCategories(categories);
    const defaultCategory = getDefaultCategoryForType(type);
    if (defaultCategory) {
      setCategory(defaultCategory.id);
    }
  }, [type]);

  // Atualiza os dados do formulário sempre que houver mudanças
  useEffect(() => {
    const dueDate = calculateDueDate(
      paymentDate,
      Number(totalInstallments),
      installmentPeriod
    );

    const currentInstallment = calculateCurrentInstallment(
      paymentDate,
      dueDate,
      installmentPeriod
    );

    onDataChange({
      type,
      description,
      amount: amount ? Number(amount) : 0,
      date: paymentDate,
      dueDate,
      installments: {
        total: Number(totalInstallments),
        current: currentInstallment,
        period: installmentPeriod
      },
      category
    });
  }, [type, description, amount, paymentDate, totalInstallments, installmentPeriod, category]);

  const getTypeLabel = (type: TransactionType) => {
    switch (type) {
      case "income":
        return "Entrada";
      case "daily_expense":
        return "Compra Diária";
      case "expense":
        return "Despesa";
      case "bill":
        return "Conta";
      case "debt":
        return "Dívida";
    }
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    // Força atualização imediata do tipo
    const dueDate = calculateDueDate(
      paymentDate,
      Number(totalInstallments),
      installmentPeriod
    );

    const currentInstallment = calculateCurrentInstallment(
      paymentDate,
      dueDate,
      installmentPeriod
    );

    const updatedData: Partial<Transaction> = {
      type: newType,
      description,
      amount: amount ? Number(amount) : 0,
      date: paymentDate,
      dueDate,
      installments: {
        total: Number(totalInstallments),
        current: currentInstallment,
        period: installmentPeriod
      },
      category
    };
    onDataChange(updatedData);
  };

  return (
    <div className="space-y-4">
      {/* Tipo de Transação */}
      {availableTypes.length > 1 && (
        <div>
          <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Tipo de Transação</p>
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#1B3047]/10 shadow-lg rounded-lg">
              {availableTypes.map((type) => (
                <SelectItem key={type} value={type} className="hover:bg-[#1B3047]/5">
                  {getTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Categoria */}
      <div>
        <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Categoria</p>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-[#1B3047]/10 shadow-lg rounded-lg max-h-[300px]">
            {availableCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="hover:bg-[#1B3047]/5">
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Gerenciador de Categorias */}
        <CategoryManager 
          type={type} 
          onCategoryAdded={(newCategory) => {
            setAvailableCategories(getCategoriesByType(type));
            setCategory(newCategory.id);
          }} 
        />
      </div>

      {/* Descrição e Valor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Descrição</p>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite a descrição"
            className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Valor</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1B3047]/40">
              R$
            </span>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="h-11 bg-[#1B3047]/5 border-0 rounded-xl pl-8 focus:ring-1 focus:ring-[#1B3047]/20"
            />
          </div>
        </div>
      </div>

      {/* Data de Pagamento */}
      <div>
        <div className="flex items-center gap-1 mb-1.5">
          <p className="text-sm font-medium text-[#1B3047]/60">Data de Pagamento</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-[#1B3047]/40" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Data do primeiro pagamento. Os demais pagamentos seguirão a periodicidade escolhida.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
        />
      </div>

      {/* Campos adicionais para formulário completo */}
      {!simpleForm && (
        <>
          {/* Parcelas e Periodicidade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <p className="text-sm font-medium text-[#1B3047]/60">Total de Pagamentos</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-[#1B3047]/40" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Número total de pagamentos até o prazo final. 
                        Por exemplo: 12 pagamentos mensais ou 2 pagamentos anuais.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                min="1"
                value={totalInstallments}
                onChange={(e) => setTotalInstallments(e.target.value)}
                placeholder="1"
                className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
              />
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <p className="text-sm font-medium text-[#1B3047]/60">Periodicidade</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-[#1B3047]/40" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Intervalo entre os pagamentos. 
                        Mensal: um pagamento por mês.
                        Anual: um pagamento por ano.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={installmentPeriod} onValueChange={(value: InstallmentPeriod) => setInstallmentPeriod(value)}>
                <SelectTrigger className="w-full h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20">
                  <SelectValue placeholder="Selecione a periodicidade" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#1B3047]/10 shadow-lg rounded-lg">
                  <SelectItem value="monthly" className="hover:bg-[#1B3047]/5">Mensal</SelectItem>
                  <SelectItem value="yearly" className="hover:bg-[#1B3047]/5">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prazo Final (Calculado) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-[#1B3047]/60">Prazo Final</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-[#1B3047]/40" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Data do último pagamento, calculada automaticamente com base na data inicial, 
                        total de pagamentos e periodicidade escolhida.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-xs text-[#1B3047]/40">
                {formatDate(calculateDueDate(paymentDate, Number(totalInstallments), installmentPeriod))}
              </span>
            </div>
            <Input
              type="date"
              value={calculateDueDate(paymentDate, Number(totalInstallments), installmentPeriod)}
              disabled
              className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20 opacity-70 cursor-not-allowed"
            />
          </div>
        </>
      )}
    </div>
  );
};
