import { Clock, AlertCircle } from "lucide-react";
import { formatInstallments, calculateDaysRemaining, formatDate } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { InstallmentPeriod } from "../../lib/types";

interface TransactionInstallmentsProps {
  installments: {
    current: number;
    total: number;
    period: InstallmentPeriod;
  };
  dueDate: string;
  type: string;
}

export const TransactionInstallments = ({ installments, dueDate, type }: TransactionInstallmentsProps) => {
  const daysRemaining = calculateDaysRemaining(dueDate);

  const getDaysRemainingColor = (days: number) => {
    if (days < 0) return "text-destructive";
    if (days <= 7) return "text-amber-500";
    return "text-emerald-600";
  };

  const formatDaysRemaining = (days: number) => {
    if (days < 0) return `${Math.abs(days)} dias em atraso`;
    if (days === 0) return "Vence hoje";
    if (days === 1) return "Vence amanhã";
    return `${days} dias restantes`;
  };

  return (
    <>
      {installments.total > 1 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center text-[#1B3047]/60">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {formatInstallments(
                    installments.current,
                    installments.total,
                    installments.period
                  )}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Pagamento {installments.period === "monthly" ? "mensal" : "anual"}
                <br />
                Vencimento: {formatDate(dueDate)}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {type !== "income" && type !== "daily_expense" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className={`flex items-center ${getDaysRemainingColor(daysRemaining)}`}>
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{formatDaysRemaining(daysRemaining)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Vencimento: {formatDate(dueDate)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};