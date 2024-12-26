import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { PaymentForm } from "./PaymentForm";
import { Transaction } from "../../lib/types";

interface PaymentButtonProps {
  transaction: Transaction;
  daysRemaining: number;
}

export const PaymentButton = ({ transaction, daysRemaining }: PaymentButtonProps) => {
  if (daysRemaining >= 0 || transaction.type === "income") return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="mt-2 w-full md:w-auto"
        >
          Pagar Parcela
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pagar Parcela</DialogTitle>
        </DialogHeader>
        <PaymentForm transaction={transaction} />
      </DialogContent>
    </Dialog>
  );
};