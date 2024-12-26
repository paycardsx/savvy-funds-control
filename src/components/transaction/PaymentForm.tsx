import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Transaction } from "../../lib/types";
import { formatCurrency } from "../../lib/utils";
import { useToast } from "../ui/use-toast";

interface PaymentFormProps {
  transaction: Transaction;
}

export const PaymentForm = ({ transaction }: PaymentFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui você implementaria a lógica real de pagamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Pagamento realizado com sucesso!",
        description: `Parcela ${transaction.installments.current}/${transaction.installments.total} paga.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao realizar pagamento",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Input value={transaction.description} disabled />
      </div>
      
      <div className="space-y-2">
        <Label>Valor da Parcela</Label>
        <Input value={formatCurrency(transaction.amount)} disabled />
      </div>
      
      <div className="space-y-2">
        <Label>Parcela</Label>
        <Input 
          value={`${transaction.installments.current}/${transaction.installments.total}`} 
          disabled 
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processando..." : "Confirmar Pagamento"}
      </Button>
    </form>
  );
};