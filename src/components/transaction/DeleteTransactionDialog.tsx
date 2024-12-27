import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";

interface DeleteTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteTransactionDialog = ({
  open,
  onClose,
  onConfirm,
}: DeleteTransactionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-6 rounded-xl bg-white">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-6 w-6 text-[#1B3047] mb-4" />

          <DialogTitle className="text-base font-semibold text-[#1B3047]">
            Excluir transação
          </DialogTitle>

          <DialogDescription className="text-[#1B3047]/70 text-sm mt-2">
            Tem certeza que deseja excluir esta transação? 
            Esta ação não pode ser desfeita.
          </DialogDescription>

          <div className="flex gap-2 w-full mt-6">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 bg-[#1B3047]/5 hover:bg-[#1B3047]/10 
                       text-[#1B3047] rounded-full transition-colors text-sm
                       border-0"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className="flex-1 h-9 bg-[#1B3047] hover:bg-[#1B3047]/90 
                       text-white rounded-full transition-colors text-sm"
            >
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 