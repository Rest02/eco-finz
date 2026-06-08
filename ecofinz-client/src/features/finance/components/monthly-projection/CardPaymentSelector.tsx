"use client";

import React, { useMemo } from "react";
import { useAccounts } from "../../hooks/useAccounts";
import { useTransactions } from "../../hooks/useTransactions";
import { useProjections } from "../../hooks/useProjections";
import { getBillingPeriodForMonth, getBilledAmountForPeriod } from "../../utils/creditCardUtils";
import { Loader2, CreditCard } from "lucide-react";

interface CardPaymentSelectorProps {
  selectedPayments: { name: string; amount: number }[];
  onChange: (payments: { name: string; amount: number }[]) => void;
  projectionMonth: number;
  projectionYear: number;
}

export function CardPaymentSelector({
  selectedPayments,
  onChange,
  projectionMonth,
  projectionYear,
}: CardPaymentSelectorProps) {
  const { data: accounts = [] } = useAccounts();
  const { data: transactionsData } = useTransactions({ type: "EGRESO", limit: 1000, page: 1 });
  const { data: projections = [] } = useProjections();

  const creditCards = useMemo(
    () => accounts.filter(a => a.type === "TARJETA_CREDITO"),
    [accounts]
  );

  const allTransactions = transactionsData?.data || [];

  const selectedMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of selectedPayments) {
      map.set(p.name, p.amount);
    }
    return map;
  }, [selectedPayments]);

  const cardAmounts = useMemo(() => {
    return creditCards.map(card => {
      const closingDay = card.closingDay || 15;
      const period = getBillingPeriodForMonth(closingDay, projectionMonth, projectionYear);
      const cardTxns = allTransactions.filter(tx => tx.accountId === card.id);
      const billedAmount = getBilledAmountForPeriod(cardTxns, projections, card.id, period);
      const totalDebt = Math.abs(Number(card.balance));

      return {
        id: card.id,
        name: card.name,
        lastDigits: card.lastDigits,
        color: card.color,
        totalDebt,
        billedAmount,
        closingDay,
      };
    });
  }, [creditCards, allTransactions, projections, projectionMonth, projectionYear]);

  const handleToggle = (cardName: string, billedAmount: number) => {
    const current = selectedMap.get(cardName) ?? 0;
    if (current > 0) {
      onChange(selectedPayments.filter(p => p.name !== cardName));
    } else {
      onChange([...selectedPayments, { name: cardName, amount: billedAmount }]);
    }
  };

  const handleAmountChange = (cardName: string, amount: number) => {
    if (amount <= 0) {
      onChange(selectedPayments.filter(p => p.name !== cardName));
    } else {
      const rest = selectedPayments.filter(p => p.name !== cardName);
      onChange([...rest, { name: cardName, amount }]);
    }
  };

  const totalSelected = selectedPayments.reduce((s, p) => s + p.amount, 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  if (creditCards.length === 0) {
    return (
      <div className="text-sm text-zinc-400 py-4 text-center">
        No tienes tarjetas de crédito registradas. Crea una en Cuentas primero.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cardAmounts.map(card => {
        const isSelected = selectedMap.has(card.name);
        const currentAmount = selectedMap.get(card.name) ?? card.billedAmount;

        return (
          <div
            key={card.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
              isSelected
                ? "bg-blue-50 border-blue-200"
                : "bg-white border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggle(card.name, card.billedAmount)}
              className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />

            <CreditCard className={`w-5 h-5 stroke-[1.5] ${card.color ? "" : "text-zinc-400"}`} />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-800 truncate">
                {card.name}
                {card.lastDigits && <span className="text-zinc-400 font-normal"> · {card.lastDigits}</span>}
              </p>
              <p className="text-xs text-zinc-400">
                Deuda total: {formatCurrency(card.totalDebt)} · Facturado: {formatCurrency(card.billedAmount)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Pagar:</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
                <input
                  type="number"
                  value={isSelected ? currentAmount : card.billedAmount}
                  onChange={e => handleAmountChange(card.name, parseFloat(e.target.value) || 0)}
                  min={0}
                  max={card.totalDebt}
                  className="w-28 pl-6 pr-2 py-1.5 rounded-lg border border-zinc-200 text-sm text-right font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-blue-50 border border-blue-200">
        <span className="text-sm font-bold text-blue-700">Total pagos tarjetas</span>
        <span className="text-sm font-bold text-blue-700">{formatCurrency(totalSelected)}</span>
      </div>
    </div>
  );
}
