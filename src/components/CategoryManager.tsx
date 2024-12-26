import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus, Trash2, Info, ChevronDown } from "lucide-react";
import { Category, addCustomCategory, getCategoriesByType, removeCustomCategory, validateCategoryName } from "../lib/categories";
import { TransactionType } from "../lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "../lib/utils";

interface CategoryManagerProps {
  type: TransactionType;
  onCategoryAdded?: (category: Category) => void;
}

export const CategoryManager = ({ type, onCategoryAdded }: CategoryManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>(() => getCategoriesByType(type));

  const handleAddCategory = () => {
    if (!validateCategoryName(newCategoryName, type)) {
      setError("Nome inválido ou categoria já existe");
      return;
    }

    const newCategory = addCustomCategory({
      label: newCategoryName,
      type,
      description: newCategoryDescription || undefined,
    });

    setCategories(getCategoriesByType(type));
    setNewCategoryName("");
    setNewCategoryDescription("");
    setError("");
    onCategoryAdded?.(newCategory);
  };

  const handleRemoveCategory = (categoryId: string) => {
    removeCustomCategory(categoryId);
    setCategories(getCategoriesByType(type));
  };

  const getTypeLabel = (type: TransactionType) => {
    switch (type) {
      case "daily_expense":
        return "Compra Diária";
      case "expense":
        return "Despesa";
      case "bill":
        return "Conta";
      case "debt":
        return "Dívida";
      case "income":
        return "Entrada";
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "income":
        return "bg-emerald-600 hover:bg-emerald-700";
      case "daily_expense":
        return "bg-orange-500 hover:bg-orange-600";
      default:
        return "bg-[#1B3047] hover:bg-[#1B3047]/90";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full mt-2 gap-2 text-[#1B3047]/60 hover:text-[#1B3047] hover:bg-[#1B3047]/5 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Adicionar Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        {/* Header */}
        <div className={`${getTypeColor()} px-6 py-4 transition-colors`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Gerenciar Categorias de {getTypeLabel(type)}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Adicionar Nova Categoria */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Nome da Categoria</p>
              <Input
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  setError("");
                }}
                placeholder="Digite o nome da categoria"
                className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-[#1B3047]/60 mb-1.5">Descrição (Opcional)</p>
              <Input
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Adicione uma descrição"
                className="h-11 bg-[#1B3047]/5 border-0 rounded-xl focus:ring-1 focus:ring-[#1B3047]/20"
              />
            </div>

            <Button 
              onClick={handleAddCategory} 
              className={`w-full h-11 ${getTypeColor()} text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg`}
            >
              Adicionar Categoria
            </Button>

            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>

          {/* Toggle Categorias */}
          <Button
            variant="ghost"
            onClick={() => setShowCategories(!showCategories)}
            className="w-full justify-between text-[#1B3047]/60 hover:text-[#1B3047] hover:bg-[#1B3047]/5"
          >
            <span className="font-medium">Categorias Existentes</span>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                showCategories && "transform rotate-180"
              )} 
            />
          </Button>

          {/* Lista de Categorias */}
          <div
            className={cn(
              "space-y-2 overflow-hidden transition-all duration-200",
              showCategories ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="space-y-2 pr-2 overflow-y-auto">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#1B3047]/5 hover:bg-[#1B3047]/10 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#1B3047]">{category.label}</span>
                    {category.description && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-[#1B3047]/40 group-hover:text-[#1B3047]/60 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{category.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  {category.isCustom && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCategory(category.id)}
                      className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
