import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction, TransactionStatus, TransactionType } from "@/lib/types";

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionForm = ({ onAddTransaction }: AddTransactionFormProps) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [dueDate, setDueDate] = useState(today);
  const [category, setCategory] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [status, setStatus] = useState<TransactionStatus>("pending");
  const [currentInstallment, setCurrentInstallment] = useState("1");
  const [totalInstallments, setTotalInstallments] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction = {
      description,
      amount: Number(amount),
      date,
      ...(type !== 'income' && type !== 'daily_expense' && dueDate ? { dueDate } : {}),
      ...(type !== 'income' && type !== 'daily_expense' && Number(totalInstallments) > 1 ? {
        installments: {
          current: Number(currentInstallment),
          total: Number(totalInstallments)
        }
      } : {}),
      category,
      type,
      status,
    };
    onAddTransaction(transaction);
    setDescription("");
    setAmount("");
    setDate(today);
    setDueDate(today);
    setCategory("");
    setType("expense");
    setStatus("pending");
    setCurrentInstallment("1");
    setTotalInstallments("1");
  };

  const showInstallments = type !== 'income' && type !== 'daily_expense';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de transação como primeiro campo */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="type">Tipo de Transação</Label>
          <Select value={type} onValueChange={(value: TransactionType) => setType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Entrada</SelectItem>
              <SelectItem value="daily_expense">Compra Diária</SelectItem>
              <SelectItem value="expense">Despesa</SelectItem>
              <SelectItem value="bill">Conta</SelectItem>
              <SelectItem value="debt">Dívida</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Valor</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        {type !== 'income' && type !== 'daily_expense' && (
          <div className="space-y-2">
            <Label htmlFor="dueDate">Prazo Final</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        )}
        {showInstallments && (
          <>
            <div className="space-y-2">
              <Label htmlFor="currentInstallment">Parcela Atual</Label>
              <Input
                id="currentInstallment"
                type="number"
                min="1"
                value={currentInstallment}
                onChange={(e) => setCurrentInstallment(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalInstallments">Total de Parcelas</Label>
              <Input
                id="totalInstallments"
                type="number"
                min="1"
                value={totalInstallments}
                onChange={(e) => setTotalInstallments(e.target.value)}
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value: TransactionStatus) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="overdue">Em atraso</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full">Adicionar Transação</Button>
    </form>
  );
};