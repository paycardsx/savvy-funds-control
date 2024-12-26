import { useState } from "react";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Transaction, TransactionType } from "../lib/types";
import { TransactionCard } from "./TransactionCard";
import { Search, Filter, Calendar } from "lucide-react";
import { Card } from "../components/ui/card";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<TransactionType | "all">("all");
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="space-y-4">
      {/* Cabeçalho com Título e Contagem */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1B3047]">Transações</h2>
        <span className="text-sm text-[#1B3047]/60">{filteredTransactions.length} itens</span>
      </div>

      {/* Barra de Pesquisa Mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1B3047]/40" />
          <Input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-xl bg-[#1B3047]/5 hover:bg-[#1B3047]/10 transition-colors"
        >
          <Filter className="h-5 w-5 text-[#1B3047]/60" />
        </button>
      </div>

      {/* Filtros Desktop */}
      <Card className="p-4 hidden md:block bg-white shadow-md border border-[#1B3047]/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1B3047]/40" />
            <Input
              type="text"
              placeholder="Buscar transações..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
            />
          </div>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as TransactionType | "all")}
          >
            <SelectTrigger className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20">
              <SelectValue placeholder="Tipo" />
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
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1B3047]/40" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-9 h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1B3047]/40" />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-9 h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
            />
          </div>
        </div>
      </Card>

      {/* Filtros Mobile (Expansível) */}
      {showFilters && (
        <Card className="p-4 md:hidden space-y-4 bg-white shadow-md border border-[#1B3047]/10">
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as TransactionType | "all")}
          >
            <SelectTrigger className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20">
              <SelectValue placeholder="Tipo" />
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
          <div className="space-y-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1B3047]/40" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9 h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1B3047]/40" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9 h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Lista de Transações */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div className="text-center py-8 text-[#1B3047]/40">
            Nenhuma transação encontrada
          </div>
        )}
      </div>
    </div>
  );
};
