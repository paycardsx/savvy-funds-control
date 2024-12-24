import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Wallet, AlertCircle } from "lucide-react";

interface FinancialSummaryProps {
  income: number;
  expenses: number;
  debts: number;
  total: number;
}

export const FinancialSummary = ({ income, expenses, debts, total }: FinancialSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-4 bg-gradient-to-br from-[#F2FCE2] to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Entradas</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(income)}</p>
          </div>
          <ArrowUpCircle className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-[#FFDEE2] to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Saídas</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(expenses)}</p>
          </div>
          <ArrowDownCircle className="h-8 w-8 text-red-500" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-[#FDE1D3] to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Dívidas</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(debts)}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-orange-500" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-[#E5DEFF] to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Saldo Total</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
          </div>
          <Wallet className="h-8 w-8 text-[#9b87f5]" />
        </div>
      </Card>
    </div>
  );
};