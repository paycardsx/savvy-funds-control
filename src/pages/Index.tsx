import { useState } from "react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Transaction } from "../lib/types";
import { calculateTotals } from "../lib/utils";
import { FinancialSummary } from "../components/FinancialSummary";
import { TransactionList } from "../components/TransactionList";
import { AddTransactionForm } from "../components/AddTransactionForm";
import { Plus, Home } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1B3047]">PromptPay</h1>
          <Button variant="ghost" className="gap-2 text-[#1B3047] hover:bg-[#1B3047]/5">
            <Home className="h-5 w-5" />
            Início
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 min-h-screen pb-20 md:pb-6">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <FinancialSummary
            income={totals.income}
            expenses={totals.expenses}
            debts={totals.debts}
            total={totals.total}
          />

          <TransactionList transactions={transactions} />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-center items-center h-16">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="icon" 
                className="rounded-full bg-[#1B3047] hover:bg-[#1B3047]/90 -mt-8 w-14 h-14 shadow-lg"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <div className="md:hidden">
              <DialogContent className="!p-0 !rounded-t-[2rem] !rounded-b-none h-[85vh] overflow-y-auto touch-pan-y">
                <AddTransactionForm 
                  onAddTransaction={handleAddTransaction} 
                  onClose={() => setIsDialogOpen(false)} 
                />
              </DialogContent>
            </div>
          </Dialog>
        </div>
      </nav>

      {/* Desktop Add Transaction Button */}
      <div className="hidden md:block fixed bottom-6 right-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="bg-[#1B3047] hover:bg-[#1B3047]/90 rounded-full shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <div className="hidden md:block">
            <DialogContent className="!p-0">
              <AddTransactionForm 
                onAddTransaction={handleAddTransaction} 
                onClose={() => setIsDialogOpen(false)} 
              />
            </DialogContent>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
