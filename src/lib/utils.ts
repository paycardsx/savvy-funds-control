import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Transaction } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Função para ajustar o fuso horário para Brasil/São Paulo
export function getLocalDate(date?: string): string {
  if (date) {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day).toISOString().split('T')[0];
  }
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];
}

// Função para formatar data em pt-BR
export function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

// Função para calcular prazo final
export function calculateDueDate(date: string, total: number, period: "monthly" | "yearly"): string {
  const [year, month, day] = date.split('-').map(Number);
  const startDate = new Date(year, month - 1, day);
  
  if (period === "monthly") {
    // Subtrai 1 do total pois o primeiro pagamento é na data inicial
    startDate.setMonth(startDate.getMonth() + (total - 1));
  } else {
    startDate.setFullYear(startDate.getFullYear() + (total - 1));
  }

  // Ajusta para o mesmo dia do mês, caso necessário
  if (startDate.getDate() !== day) {
    startDate.setDate(day);
  }

  return startDate.toISOString().split('T')[0];
}

// Função para calcular dias restantes
export function calculateDaysRemaining(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [year, month, day] = dueDate.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Função para formatar período
export function formatPeriod(period: "monthly" | "yearly"): string {
  return period === "monthly" ? "mensal" : "anual";
}

// Função para formatar parcelas
export function formatInstallments(current: number, total: number, period: "monthly" | "yearly"): string {
  if (total === 1) return "Pagamento único";
  return `${current}/${total} ${period === "monthly" ? "meses" : "anos"}`;
}

// Função para calcular parcela atual
export function calculateCurrentInstallment(startDate: string, dueDate: string, period: "monthly" | "yearly"): number {
  const [startYear, startMonth] = startDate.split('-').map(Number);
  const [dueYear, dueMonth] = dueDate.split('-').map(Number);
  
  if (period === "monthly") {
    return (dueYear - startYear) * 12 + (dueMonth - startMonth) + 1;
  } else {
    return dueYear - startYear + 1;
  }
}

// Função para calcular totais
export function calculateTotals(transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    const amount = transaction.amount;

    switch (transaction.type) {
      case "income":
        acc.income += amount;
        acc.total += amount;
        break;
      case "expense":
      case "daily_expense":
        acc.expenses += amount;
        acc.total -= amount;
        break;
      case "bill":
        acc.expenses += amount;
        acc.total -= amount;
        break;
      case "debt":
        acc.debts += amount;
        acc.total -= amount;
        break;
    }

    return acc;
  }, {
    income: 0,
    expenses: 0,
    debts: 0,
    total: 0
  });
}
