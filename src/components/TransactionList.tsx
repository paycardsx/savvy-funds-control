import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction, TransactionType } from "@/lib/types";
import { TransactionCard } from "./TransactionCard";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<TransactionType | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(search.toLowerCase()) ||
      transaction.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    
    const transactionDate = new Date(transaction.date);
    const matchesDateRange = (!startDate || transactionDate >= new Date(startDate)) &&
                            (!endDate || transactionDate <= new Date(endDate));

    return matchesSearch && matchesType && matchesDateRange;
  });

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Buscar transações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as TransactionType | "all")}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="income">Entrada</SelectItem>
              <SelectItem value="expense">Despesa</SelectItem>
              <SelectItem value="daily_expense">Compra Diária</SelectItem>
              <SelectItem value="bill">Conta</SelectItem>
              <SelectItem value="debt">Dívida</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data inicial
            </label>
            <Input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data final
            </label>
            <Input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};