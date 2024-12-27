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

export function calculateInstallmentDueDate(
  startDate: string,
  installmentNumber: number,
  period: "monthly" | "yearly"
): string {
  const [year, month, day] = startDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (period === "monthly") {
    date.setMonth(date.getMonth() + (installmentNumber - 1));
  } else {
    date.setFullYear(date.getFullYear() + (installmentNumber - 1));
  }

  return date.toISOString().split('T')[0];
}

export function getInstallmentStatus(
  startDate: string,
  currentInstallment: number,
  totalInstallments: number,
  period: "monthly" | "yearly"
) {
  // Usar data atual real para cálculos
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const installments = Array.from({ length: totalInstallments }, (_, i) => {
    const installmentNumber = i + 1;
    const dueDate = calculateInstallmentDueDate(startDate, installmentNumber, period);
    const dueDateTime = new Date(dueDate);
    
    // Uma parcela está atrasada se:
    // 1. A data de vencimento já passou E
    // 2. A parcela ainda não foi paga (número da parcela >= parcela atual)
    const isOverdue = dueDateTime < today && installmentNumber >= currentInstallment;
    
    return {
      number: installmentNumber,
      dueDate,
      isPaid: installmentNumber < currentInstallment,
      isCurrentInstallment: installmentNumber === currentInstallment,
      isOverdue,
      daysOverdue: isOverdue ? 
        Math.ceil((today.getTime() - dueDateTime.getTime()) / (1000 * 60 * 60 * 24)) : 0,
      daysRemaining: Math.ceil(
        (dueDateTime.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
    };
  });

  // Encontrar parcelas atrasadas (não pagas e com data vencida)
  const overdueInstallments = installments.filter(i => i.isOverdue);
  
  // Encontrar a próxima parcela a ser paga
  const nextInstallmentData = installments[currentInstallment - 1];

  return {
    installments,
    currentInstallment: nextInstallmentData,
    overdueInstallments,
    hasOverdue: overdueInstallments.length > 0,
    totalPaid: currentInstallment - 1,
    totalRemaining: totalInstallments - (currentInstallment - 1),
    oldestOverdueDate: overdueInstallments.length > 0 ? 
      overdueInstallments[0].dueDate : null,
    maxDaysOverdue: overdueInstallments.length > 0 ?
      Math.max(...overdueInstallments.map(i => i.daysOverdue)) : 0
  };
}

// Função de teste para validar
function testWithCurrentDate() {
  const startDate = "2024-10-10";  // Data inicial
  const currentDate = new Date("2024-12-27"); // Simulando hoje como 27/12/2024
  const currentInstallment = 1;    // Ainda na primeira parcela
  const totalInstallments = 12;    // 12 parcelas no total
  const period = "monthly" as const;

  // Sobrescrever temporariamente Date.now() para teste
  const originalNow = Date.now;
  Date.now = () => currentDate.getTime();

  const status = getInstallmentStatus(startDate, currentInstallment, totalInstallments, period);

  // Restaurar Date.now
  Date.now = originalNow;

  console.log("Status em 27/12/2024:", {
    parcelasAtrasadas: status.overdueInstallments.length,
    diasDeAtraso: status.maxDaysOverdue,
    parcelaAtual: status.currentInstallment,
    detalheParcelas: status.installments.map(i => ({
      numero: i.number,
      vencimento: i.dueDate,
      atrasada: i.isOverdue,
      diasAtraso: i.daysOverdue
    }))
  });

  return status;
}
