import { Card } from "../components/ui/card";
import { formatCurrency } from "../lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";

interface FinancialSummaryProps {
  income: number;
  expenses: number;
  debts: number;
  total: number;
}

export const FinancialSummary = ({ income, expenses, debts, total }: FinancialSummaryProps) => {
  return (
    <div className="space-y-4">
      {/* Card Principal com Saldo */}
      <Card className="p-6 bg-[#1B3047] text-white shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white/90">Saldo disponível</h2>
            <Wallet className="h-6 w-6 text-[#E19F09]" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(total)}</p>
          <div className="flex items-center text-sm text-white/75 hover:text-[#E19F09] transition-colors cursor-pointer">
            <span>Ver extrato</span>
            <ArrowUpCircle className="h-4 w-4 ml-1" />
          </div>
        </div>
      </Card>

      {/* Grid de Cards Secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Entradas */}
        <Card className="p-4 bg-white hover:shadow-md transition-shadow border border-[#1B3047]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#1B3047]/60">Entradas</p>
              <p className="text-xl font-bold text-[#E19F09]">{formatCurrency(income)}</p>
            </div>
            <div className="bg-[#E19F09]/10 p-2 rounded-full">
              <ArrowUpCircle className="h-6 w-6 text-[#E19F09]" />
            </div>
          </div>
        </Card>

        {/* Saídas com Detalhamento */}
        <Card className="p-4 bg-white hover:shadow-md transition-shadow border border-[#1B3047]/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1B3047]/60">Saídas</p>
                <p className="text-xl font-bold text-destructive">{formatCurrency(expenses)}</p>
              </div>
              <div className="bg-destructive/10 p-2 rounded-full">
                <ArrowDownCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            
            {/* Detalhamento das Saídas */}
            <div className="pt-3 border-t border-[#1B3047]/10">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#1B3047]/70">
                  <span>Despesas</span>
                  <span>{formatCurrency(expenses * 0.4)}</span>
                </div>
                <div className="flex justify-between text-[#1B3047]/70">
                  <span>Compras Diárias</span>
                  <span>{formatCurrency(expenses * 0.3)}</span>
                </div>
                <div className="flex justify-between text-[#1B3047]/70">
                  <span>Contas</span>
                  <span>{formatCurrency(expenses * 0.2)}</span>
                </div>
                <div className="flex justify-between text-[#1B3047]/70">
                  <span>Dívidas</span>
                  <span>{formatCurrency(expenses * 0.1)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-[#1B3047]/10">
                  <span>Total</span>
                  <span className="text-destructive">{formatCurrency(expenses)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Menu de Ações Rápidas (Mobile) */}
      <div className="flex justify-around items-center py-4 md:hidden">
        <button className="flex flex-col items-center space-y-1">
          <div className="p-3 rounded-full bg-[#E19F09]/10 hover:bg-[#E19F09]/20 transition-colors">
            <ArrowUpCircle className="h-6 w-6 text-[#E19F09]" />
          </div>
          <span className="text-xs text-[#1B3047]/60">Pix</span>
        </button>
        <button className="flex flex-col items-center space-y-1">
          <div className="p-3 rounded-full bg-[#1B3047]/10 hover:bg-[#1B3047]/20 transition-colors">
            <ArrowDownCircle className="h-6 w-6 text-[#1B3047]" />
          </div>
          <span className="text-xs text-[#1B3047]/60">Transferir</span>
        </button>
        <button className="flex flex-col items-center space-y-1">
          <div className="p-3 rounded-full bg-[#E19F09]/10 hover:bg-[#E19F09]/20 transition-colors">
            <Wallet className="h-6 w-6 text-[#E19F09]" />
          </div>
          <span className="text-xs text-[#1B3047]/60">Cartões</span>
        </button>
      </div>
    </div>
  );
};