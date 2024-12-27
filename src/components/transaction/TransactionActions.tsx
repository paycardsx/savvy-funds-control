import { useState } from "react";
import { MoreVertical, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import { ViewTransactionDialog } from "./ViewTransactionDialog";
import { Transaction } from "../../lib/types";

interface TransactionActionsProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionActions = ({
  transaction,
  onDelete,
}: TransactionActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 rounded-lg text-[#1B3047] 
                     hover:bg-[#1B3047]/5 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="min-w-[140px] p-1 rounded-lg bg-white shadow-md border-[#1B3047]/10"
        >
          <DropdownMenuItem
            onClick={() => setShowViewDialog(true)}
            className="flex items-center h-9 px-2.5 text-sm rounded-md
                     text-[#1B3047] font-medium hover:bg-[#1B3047]/5 
                     transition-colors cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver mais
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center h-9 px-2.5 text-sm rounded-md
                     text-[#1B3047] font-medium hover:bg-destructive/5
                     hover:text-destructive transition-colors cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewTransactionDialog
        transaction={transaction}
        open={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        onPayInstallment={(t) => {
          // Lógica para processar o pagamento
          console.log("Processando pagamento da parcela:", t);
        }}
      />

      <DeleteTransactionDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          onDelete(transaction);
          setShowDeleteDialog(false);
        }}
      />
    </>
  );
};