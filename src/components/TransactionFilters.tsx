import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TransactionType } from "../lib/types";
import { Category, getCategoriesByType } from "../lib/categories";
import { useState, useEffect } from "react";

interface TransactionFiltersProps {
  onFilterChange: (filters: {
    type?: TransactionType;
    category?: string;
  }) => void;
}

export const TransactionFilters = ({ onFilterChange }: TransactionFiltersProps) => {
  const [selectedType, setSelectedType] = useState<TransactionType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (selectedType !== "all") {
      const categories = getCategoriesByType(selectedType as TransactionType);
      setAvailableCategories(categories);
      // Reset category selection when type changes
      setSelectedCategory("all");
    } else {
      setAvailableCategories([]);
      setSelectedCategory("all");
    }
  }, [selectedType]);

  useEffect(() => {
    onFilterChange({
      type: selectedType === "all" ? undefined : selectedType,
      category: selectedCategory === "all" ? undefined : selectedCategory,
    });
  }, [selectedType, selectedCategory, onFilterChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl shadow-sm border border-[#1B3047]/10">
      {/* Filtro por Tipo */}
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Tipo de Transação</p>
        <Select value={selectedType} onValueChange={(value: TransactionType | "all") => setSelectedType(value)}>
          <SelectTrigger className="w-full h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-[#1B3047]/10 shadow-lg rounded-lg">
            <SelectItem value="all" className="hover:bg-[#1B3047]/5">Todos os tipos</SelectItem>
            <SelectItem value="income" className="hover:bg-[#1B3047]/5">Entrada</SelectItem>
            <SelectItem value="expense" className="hover:bg-[#1B3047]/5">Despesa</SelectItem>
            <SelectItem value="daily_expense" className="hover:bg-[#1B3047]/5">Compra Diária</SelectItem>
            <SelectItem value="bill" className="hover:bg-[#1B3047]/5">Conta</SelectItem>
            <SelectItem value="debt" className="hover:bg-[#1B3047]/5">Dívida</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Categoria */}
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Categoria</p>
        <Select 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
          disabled={selectedType === "all"}
        >
          <SelectTrigger className="w-full h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20">
            <SelectValue placeholder={selectedType === "all" ? "Selecione um tipo primeiro" : "Todas as categorias"} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-[#1B3047]/10 shadow-lg rounded-lg">
            <SelectItem value="all" className="hover:bg-[#1B3047]/5">
              Todas as categorias
            </SelectItem>
            {availableCategories.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id}
                className="hover:bg-[#1B3047]/5"
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
