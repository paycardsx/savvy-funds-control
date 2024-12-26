export interface Category {
  id: string;
  label: string;
  type: "daily_expense" | "expense" | "bill" | "debt" | "income";
  description?: string;
  isCustom?: boolean;
}

// Categorias padrão do sistema
export const defaultCategories: Category[] = [
  // Entradas (income)
  {
    id: "salary",
    label: "Salário",
    type: "income",
  },
  {
    id: "freelance",
    label: "Freelance",
    type: "income",
    description: "Trabalhos Autônomos, Projetos",
  },
  {
    id: "investments",
    label: "Investimentos",
    type: "income",
    description: "Rendimentos, Dividendos",
  },
  {
    id: "rental_income",
    label: "Aluguel",
    type: "income",
    description: "Rendimentos de Aluguéis",
  },
  {
    id: "bonus",
    label: "Bônus",
    type: "income",
    description: "Participação nos Lucros, Premiações",
  },
  {
    id: "sales",
    label: "Vendas",
    type: "income",
    description: "Vendas de Produtos ou Serviços",
  },
  {
    id: "other_income",
    label: "Outras Entradas",
    type: "income",
    description: "Outras Fontes de Renda",
  },

  // Compras Diárias (daily_expense)
  {
    id: "supermarket",
    label: "Supermercado",
    type: "daily_expense",
  },
  {
    id: "fuel",
    label: "Combustível",
    type: "daily_expense",
  },
  {
    id: "transport",
    label: "Transporte",
    type: "daily_expense",
  },
  {
    id: "food",
    label: "Alimentação",
    type: "daily_expense",
    description: "Restaurantes, Lanches",
  },
  {
    id: "pharmacy",
    label: "Farmácia",
    type: "daily_expense",
  },
  {
    id: "leisure_shopping",
    label: "Compras de Lazer",
    type: "daily_expense",
    description: "Roupas, Eletrônicos",
  },

  // Despesas (expense)
  {
    id: "education",
    label: "Educação",
    type: "expense",
    description: "Cursos, Material Escolar",
  },
  {
    id: "health",
    label: "Saúde",
    type: "expense",
    description: "Consultas, Exames",
  },
  {
    id: "leisure",
    label: "Lazer",
    type: "expense",
    description: "Viagens, Entretenimento",
  },
  {
    id: "subscriptions",
    label: "Assinaturas",
    type: "expense",
    description: "Streaming, Software",
  },
  {
    id: "fees",
    label: "Taxas e Multas",
    type: "expense",
  },
  {
    id: "pension",
    label: "Pensão",
    type: "expense",
  },
  {
    id: "rent",
    label: "Aluguel",
    type: "expense",
  },

  // Contas (bill)
  {
    id: "electricity",
    label: "Energia Elétrica",
    type: "bill",
  },
  {
    id: "water",
    label: "Água",
    type: "bill",
  },
  {
    id: "internet",
    label: "Internet/TV/Telefone",
    type: "bill",
  },
  {
    id: "condo",
    label: "Condomínio",
    type: "bill",
  },
  {
    id: "credit_card",
    label: "Cartão de Crédito",
    type: "bill",
  },
  {
    id: "insurance",
    label: "Seguro",
    type: "bill",
    description: "Saúde, Carro, Residencial",
  },

  // Dívidas (debt)
  {
    id: "bank_loans",
    label: "Empréstimos Bancários",
    type: "debt",
  },
  {
    id: "financing",
    label: "Financiamentos",
    type: "debt",
    description: "Casa, Carro",
  },
  {
    id: "credit_installments",
    label: "Parcelamentos no Cartão de Crédito",
    type: "debt",
  },
  {
    id: "late_agreements",
    label: "Acordos ou Dívidas em Atraso",
    type: "debt",
  },
  {
    id: "debt_fees",
    label: "Juros ou Multas de Dívidas",
    type: "debt",
  },
];

// Funções para gerenciar categorias personalizadas
const CUSTOM_CATEGORIES_KEY = 'custom_categories';

export const getCustomCategories = (): Category[] => {
  const stored = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCustomCategories = (categories: Category[]) => {
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
};

export const addCustomCategory = (category: Omit<Category, 'id' | 'isCustom'>) => {
  const customCategories = getCustomCategories();
  const newCategory: Category = {
    ...category,
    id: `custom_${Date.now()}`,
    isCustom: true,
  };
  
  customCategories.push(newCategory);
  saveCustomCategories(customCategories);
  return newCategory;
};

export const removeCustomCategory = (categoryId: string) => {
  const customCategories = getCustomCategories();
  const filtered = customCategories.filter(cat => cat.id !== categoryId);
  saveCustomCategories(filtered);
};

// Função para obter todas as categorias (padrão + personalizadas)
export const getAllCategories = (): Category[] => {
  return [...defaultCategories, ...getCustomCategories()];
};

// Função para obter categorias por tipo
export const getCategoriesByType = (type: Category["type"]) => {
  const allCategories = getAllCategories();
  return allCategories.filter(category => category.type === type);
};

// Função para obter uma categoria por ID
export const getCategoryById = (id: string) => {
  const allCategories = getAllCategories();
  return allCategories.find(category => category.id === id);
};

// Função para verificar se uma categoria existe
export const categoryExists = (id: string) => {
  const allCategories = getAllCategories();
  return allCategories.some(category => category.id === id);
};

// Função para obter categoria padrão por tipo
export const getDefaultCategoryForType = (type: Category["type"]): Category | undefined => {
  const categoriesOfType = getCategoriesByType(type);
  return categoriesOfType[0];
};

// Função para validar o nome de uma nova categoria
export const validateCategoryName = (label: string, type: Category["type"]): boolean => {
  const allCategories = getAllCategories();
  const exists = allCategories.some(
    cat => cat.type === type && cat.label.toLowerCase() === label.toLowerCase()
  );
  return !exists && label.length >= 3;
};
