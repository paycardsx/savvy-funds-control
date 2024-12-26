import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Transaction, TransactionStatus, TransactionType } from "../lib/types";
import { X, Info } from "lucide-react";
import { Category, getCategoriesByType, getDefaultCategoryForType } from "../lib/categories";
import { CategoryManager } from "./CategoryManager";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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
  const today = new Date().toISOString().split('T')[0];
  
  const [type, setType] = useState<TransactionType>(defaultType);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [dueDate, setDueDate] = useState(today);
  const [currentInstallment, setCurrentInstallment] = useState("1");
  const [totalInstallments, setTotalInstallments] = useState("1");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<TransactionStatus>("pending");
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  useEffect(() => {
    const categories = getCategoriesByType(type);
    setAvailableCategories(categories);
    const defaultCategory = getDefaultCategoryForType(type);
    if (defaultCategory) {
      setCategory(defaultCategory.id);
    }
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction = {
      description,
      amount: Number(amount),
      date,
      dueDate,
      installments: {
        current: Number(currentInstallment),
        total: Number(totalInstallments)
      },
      category,
      type,
      status,
    };
    onAddTransaction(transaction);
  };

  const handleCategoryAdded = (newCategory: Category) => {
    setAvailableCategories(getCategoriesByType(type));
    setCategory(newCategory.id);
  };

  const getFormTitle = () => {
    switch (type) {
      case "income":
        return "Adicionar Entrada";
      case "daily_expense":
        return "Registrar Compra";
      default:
        return "Nova Transação";
    }
  };

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

  const getHeaderColor = () => {
    switch (type) {
      case "income":
        return "bg-emerald-600";
      case "daily_expense":
        return "bg-orange-500";
      default:
        return "bg-[#1B3047]";
    }
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
          {/* Tipo de Transação */}
          {availableTypes.length > 1 && (
            <div>
              <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Tipo de Transação</p>
              <Select value={type} onValueChange={(value: TransactionType) => setType(value)}>
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

          {/* Data */}
          <div>
            <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Data</p>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
            />
          </div>

          {/* Campos adicionais para formulário completo */}
          {!simpleForm && (
            <>
              {/* Prazo */}
              <div>
                <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Prazo Final</p>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
                />
              </div>

              {/* Parcelas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Parcela Atual</p>
                  <Input
                    type="number"
                    min="1"
                    value={currentInstallment}
                    onChange={(e) => setCurrentInstallment(e.target.value)}
                    placeholder="1"
                    className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Total de Parcelas</p>
                  <Input
                    type="number"
                    min="1"
                    value={totalInstallments}
                    onChange={(e) => setTotalInstallments(e.target.value)}
                    placeholder="1"
                    className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Status</p>
                <Select value={status} onValueChange={(value: TransactionStatus) => setStatus(value)}>
                  <SelectTrigger className="w-full h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#1B3047]/10 shadow-lg rounded-lg">
                    <SelectItem value="pending" className="hover:bg-[#1B3047]/5">Pendente</SelectItem>
                    <SelectItem value="paid" className="hover:bg-[#1B3047]/5">Pago</SelectItem>
                    <SelectItem value="overdue" className="hover:bg-[#1B3047]/5">Em atraso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
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
                    <div className="flex items-center gap-2">
                      <span>{cat.label}</span>
                      {cat.description && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-[#1B3047]/60" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{cat.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Gerenciador de Categorias */}
            <CategoryManager type={type} onCategoryAdded={handleCategoryAdded} />
          </div>

          {/* Botão Submit */}
          <Button 
            type="submit" 
            className={`w-full h-11 ${getHeaderColor()} text-white font-semibold rounded-xl transition-colors mt-6 shadow-md hover:shadow-lg`}
          >
            {type === "income" ? "Adicionar Entrada" : type === "daily_expense" ? "Registrar Compra" : "Adicionar Transação"}
          </Button>
        </form>
      </div>
    </div>
  );
};
