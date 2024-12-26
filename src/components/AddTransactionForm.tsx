import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Transaction, TransactionStatus, TransactionType } from "../lib/types";
import { X } from "lucide-react";

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onClose?: () => void;
}

export const AddTransactionForm = ({ onAddTransaction, onClose }: AddTransactionFormProps) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [dueDate, setDueDate] = useState(today);
  const [currentInstallment, setCurrentInstallment] = useState("1");
  const [totalInstallments, setTotalInstallments] = useState("1");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<TransactionStatus>("pending");

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

  return (
    <div className="w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-[#1B3047] rounded-t-[2rem] p-6 h-[120px] relative">
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-6 right-6 rounded-full w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
        >
          <X className="h-4 w-4 text-white" />
        </button>
        <h2 className="text-xl font-semibold text-white mt-2">Nova Transação</h2>
      </div>

      {/* Formulário */}
      <div className="bg-white px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Transação */}
          <div>
            <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Tipo de Transação</p>
            <Select value={type} onValueChange={(value: TransactionType) => setType(value)}>
              <SelectTrigger className="w-full h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#1B3047]/10 shadow-lg rounded-lg">
                <SelectItem value="expense" className="hover:bg-[#1B3047]/5">Despesa</SelectItem>
                <SelectItem value="income" className="hover:bg-[#1B3047]/5">Entrada</SelectItem>
                <SelectItem value="daily_expense" className="hover:bg-[#1B3047]/5">Compra Diária</SelectItem>
                <SelectItem value="bill" className="hover:bg-[#1B3047]/5">Conta</SelectItem>
                <SelectItem value="debt" className="hover:bg-[#1B3047]/5">Dívida</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Data e Prazo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Data</p>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Prazo Final</p>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
              />
            </div>
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

          {/* Categoria */}
          <div>
            <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Categoria</p>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Digite a categoria"
              className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
            />
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

          {/* Botão Submit */}
          <Button 
            type="submit" 
            className="w-full h-11 bg-[#E19F09] hover:bg-[#E19F09]/90 text-[#1B3047] font-semibold rounded-xl transition-colors mt-6 shadow-md hover:shadow-lg"
          >
            Adicionar Transação
          </Button>
        </form>
      </div>
    </div>
  );
};
