import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Transaction, TransactionType } from "../lib/types";
import { TransactionCard } from "./TransactionCard";
import { Search, Calendar } from "lucide-react";
import { Card } from "../components/ui/card";
import { TransactionFilters } from "./TransactionFilters";
import { getCategoryById } from "../lib/categories";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [filters, setFilters] = useState<{
    type?: TransactionType;
    category?: string;
  }>({});

  // Log quando as transações mudam
  useEffect(() => {
    console.log("TransactionList recebeu transações:", transactions);
  }, [transactions]);

  const filteredTransactions = transactions
    .sort((a, b) => {
      // Primeiro por data (mais recente primeiro)
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // Se mesma data, por ID (mais recente primeiro)
      return b.id.localeCompare(a.id);
    })
    .filter((transaction) => {
      console.log("Filtrando transação:", transaction);

      // Filtro de busca
      const category = getCategoryById(transaction.category);
      const matchesSearch = 
        transaction.description.toLowerCase().includes(search.toLowerCase()) ||
        (category?.label || "").toLowerCase().includes(search.toLowerCase());
      
      // Filtro de tipo
      const matchesType = !filters.type || transaction.type === filters.type;
      
      // Filtro de categoria
      const matchesCategory = !filters.category || transaction.category === filters.category;
      
      // Filtro de data - Convertendo as strings de data para objetos Date
      const transactionDate = new Date(transaction.date);
      const startDateObj = startDate ? new Date(startDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;

      // Ajustando para considerar o dia inteiro
      if (startDateObj) startDateObj.setHours(0, 0, 0, 0);
      if (endDateObj) endDateObj.setHours(23, 59, 59, 999);
      transactionDate.setHours(12, 0, 0, 0); // Meio-dia para evitar problemas de fuso horário

      const matchesDateRange = (!startDateObj || transactionDate >= startDateObj) &&
                              (!endDateObj || transactionDate <= endDateObj);

      const matches = matchesSearch && matchesType && matchesCategory && matchesDateRange;
      console.log("Resultado dos filtros:", {
        matchesSearch,
        matchesType,
        matchesCategory,
        matchesDateRange,
        final: matches,
        dates: {
          transaction: transactionDate.toISOString(),
          start: startDateObj?.toISOString(),
          end: endDateObj?.toISOString()
        }
      });

      return matches;
    });

  // Log das transações filtradas
  useEffect(() => {
    console.log("Transações filtradas:", filteredTransactions);
  }, [filteredTransactions]);

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      {/* Cabeçalho com Título e Contagem */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1B3047]">Transações</h2>
        <span className="text-sm text-[#1B3047]/60">{filteredTransactions.length} itens</span>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        {/* Barra de Pesquisa */}
        <Card className="p-4 bg-white shadow-md border border-[#1B3047]/10">
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
        </Card>

        {/* Filtros de Tipo e Categoria */}
        <TransactionFilters onFilterChange={setFilters} />

        {/* Filtros de Data */}
        <Card className="p-4 bg-white shadow-md border border-[#1B3047]/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

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