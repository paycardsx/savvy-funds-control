import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Transaction } from "@/lib/types";
import { calculateTotals } from "@/lib/utils";
import { FinancialSummary } from "@/components/FinancialSummary";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { Plus } from "lucide-react";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([transaction, ...transactions]);
    setIsDialogOpen(false);
  };

  const totals = calculateTotals(transactions);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Controle Financeiro</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#9b87f5] hover:bg-[#8b77e5]">
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <AddTransactionForm onAddTransaction={handleAddTransaction} />
          </DialogContent>
        </Dialog>
      </div>

      <FinancialSummary
        income={totals.income}
        expenses={totals.expenses}
        debts={totals.debts}
        total={totals.total}
      />

      <TransactionList transactions={transactions} />
    </div>
  );
};

export default Index;