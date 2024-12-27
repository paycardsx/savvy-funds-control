import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Transaction } from "../lib/types";
import { calculateTotals, calculateCurrentInstallment } from "../lib/utils";
import { FinancialSummary } from "../components/FinancialSummary";
import { TransactionList } from "../components/TransactionList";
import { AddTransactionForm } from "../components/AddTransactionForm";
import { Plus, Home, ArrowDown, ShoppingBag } from "lucide-react";

type DialogType = "transaction" | "income" | "shopping" | null;

// Chave para armazenar as transações no localStorage
const TRANSACTIONS_STORAGE_KEY = "@promptpay/transactions";

const Index = () => {
  // Inicializa o estado com as transações do localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const storedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (storedTransactions) {
      console.log("Carregando transações do localStorage:", JSON.parse(storedTransactions));
      return JSON.parse(storedTransactions);
    }
    console.log("Nenhuma transação encontrada no localStorage");
    return [];
  });
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);

  // Atualiza o localStorage sempre que as transações mudarem
  useEffect(() => {
    console.log("Salvando transações no localStorage:", transactions);
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    console.log("Recebendo nova transação:", newTransaction);

    // Garante que o número da parcela atual está correto
    const currentInstallment = calculateCurrentInstallment(
      newTransaction.date,
      newTransaction.dueDate,
      newTransaction.installments.period
    );

    const transaction: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9),
      installments: {
        ...newTransaction.installments,
        current: currentInstallment
      }
    };

    console.log("Transação processada:", transaction);

    // Adiciona a nova transação no início da lista
    setTransactions(prevTransactions => {
      const updatedTransactions = [transaction, ...prevTransactions];
      console.log("Lista atualizada de transações:", updatedTransactions);
      return updatedTransactions;
    });
    
    setActiveDialog(null);
  };

  const totals = calculateTotals(transactions);

  // Componente de Dialog reutilizável
  const TransactionDialog = ({ type, children }: { type: DialogType, children: React.ReactNode }) => (
    <Dialog open={activeDialog === type} onOpenChange={(open) => setActiveDialog(open ? type : null)}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={`!p-0 ${window.innerWidth < 768 ? "!rounded-t-[2rem] !rounded-b-none h-[85vh]" : ""} overflow-y-auto`}>
        <AddTransactionForm 
          onAddTransaction={handleAddTransaction} 
          onClose={() => setActiveDialog(null)}
          defaultType={type === "income" ? "income" : type === "shopping" ? "daily_expense" : "expense"}
          availableTypes={type === "income" ? ["income"] : type === "shopping" ? ["daily_expense"] : ["expense", "bill", "debt"]}
          simpleForm={type !== "transaction"}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
<img src="/public/promptpay.png" alt="Logo" className="h-10" />
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

<TransactionList 
  transactions={transactions} 
  onDeleteTransaction={(id) => setTransactions(transactions.filter(transaction => transaction.id !== id))}
/>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-20">
        <div className="flex justify-center items-center h-16">
          <div className="flex items-center gap-4">
            {/* Entrada */}
            <TransactionDialog type="income">
              <Button 
                size="icon" 
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 -mt-8 w-12 h-12 shadow-lg"
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
            </TransactionDialog>

            {/* Nova Transação */}
            <TransactionDialog type="transaction">
              <Button 
                size="icon" 
                className="rounded-full bg-[#1B3047] hover:bg-[#1B3047]/90 -mt-8 w-14 h-14 shadow-lg"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </TransactionDialog>

            {/* Compra Diária */}
            <TransactionDialog type="shopping">
              <Button 
                size="icon" 
                className="rounded-full bg-orange-500 hover:bg-orange-600 -mt-8 w-12 h-12 shadow-lg"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </TransactionDialog>
          </div>
        </div>
      </nav>

      {/* Desktop Add Transaction Buttons */}
      <div className="hidden md:flex fixed bottom-6 right-6 flex-col gap-4 z-20">
        {/* Entrada */}
        <TransactionDialog type="income">
          <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-lg"
          >
            <ArrowDown className="h-5 w-5 mr-2" />
            Adicionar Entrada
          </Button>
        </TransactionDialog>

        {/* Nova Transação */}
        <TransactionDialog type="transaction">
          <Button 
            size="lg" 
            className="bg-[#1B3047] hover:bg-[#1B3047]/90 rounded-full shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Transação
          </Button>
        </TransactionDialog>

        {/* Compra Diária */}
        <TransactionDialog type="shopping">
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Registrar Compra
          </Button>
        </TransactionDialog>
      </div>
    </div>
  );
};

export default Index;
