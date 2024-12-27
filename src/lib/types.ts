export type TransactionType = "income" | "expense" | "daily_expense" | "bill" | "debt";
export type PaymentMethodType = "pix" | "card";
export type InstallmentPeriod = "monthly" | "yearly";

export interface PixPaymentMethod {
  type: "pix";
  // Informações do pagador
  holderName: string;
  bank: string;
  // Informações do recebedor
  pixKey: string;
  pixHolderName: string;
  pixBank: string;
}

export interface CardPaymentMethod {
  type: "card";
  // Informações do pagador
  holderName: string;
  bank: string;
  // Informações do recebedor
  recipientHolderName: string;
}

export type PaymentMethod = PixPaymentMethod | CardPaymentMethod;

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  dueDate: string;
  installments: {
    total: number;
    current: number;
    period: InstallmentPeriod;
  };
  category: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}
