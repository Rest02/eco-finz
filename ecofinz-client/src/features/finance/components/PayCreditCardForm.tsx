"use client";

import React, { useState, useMemo } from "react";
import { useAccounts } from "../hooks/useAccounts";
import { usePayCreditCard } from "../hooks/useTransactions";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Wallet,
  ChevronDown,
} from "lucide-react";

type PaymentOption = "billed" | "total" | "custom";

interface Props {
  creditCardAccountId: string;
  creditCardName: string;
  debtAmount: number;
  billedAmount: number;
}

const PayCreditCardForm: React.FC<Props> = ({
  creditCardAccountId,
  creditCardName,
  debtAmount,
  billedAmount,
}) => {
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("billed");
  const [customAmount, setCustomAmount] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);

  const { data: accounts = [] } = useAccounts();
  const payCreditCardMutation = usePayCreditCard();
  const isLoading = payCreditCardMutation.isPending;

  const debitAccounts = useMemo(
    () => accounts.filter((acc) => acc.type !== "TARJETA_CREDITO"),
    [accounts]
  );

  const resolvedAmount = useMemo(() => {
    if (paymentOption === "billed") return billedAmount;
    if (paymentOption === "total") return debtAmount;
    return Number(customAmount) || 0;
  }, [paymentOption, billedAmount, debtAmount, customAmount]);

  const handleOptionChange = (option: PaymentOption) => {
    setPaymentOption(option);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!sourceAccountId) {
      setError("Selecciona una cuenta de origen.");
      return;
    }

    if (resolvedAmount <= 0) {
      setError("Ingresa un monto válido mayor a 0.");
      return;
    }

    if (resolvedAmount > debtAmount) {
      setError("El monto no puede superar la deuda actual.");
      return;
    }

    try {
      await payCreditCardMutation.mutateAsync({
        creditCardAccountId,
        sourceAccountId,
        amount: resolvedAmount,
        date,
      });

      setCustomAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setPaymentOption("billed");
    } catch {
      setError("No se pudo realizar el pago. Intenta nuevamente.");
    }
  };

  const formatCLP = (val: number) =>
    val.toLocaleString("es-CL", { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
          <CreditCard className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-semibold text-black">
          Pagar {creditCardName}
        </h2>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {payCreditCardMutation.isSuccess && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p>Pago registrado correctamente.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">
            Opciones de Pago
          </label>
          <div className="space-y-1 p-1 bg-zinc-100 border border-zinc-200 rounded-2xl">
            <button
              type="button"
              onClick={() => handleOptionChange("billed")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                paymentOption === "billed"
                  ? "bg-white text-emerald-700 shadow-sm border border-emerald-200"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-white/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentOption === "billed" ? "border-emerald-500" : "border-zinc-300"
                }`}>
                  {paymentOption === "billed" && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </span>
                Pagar Facturado
              </span>
              <span className={paymentOption === "billed" ? "text-emerald-600" : "text-zinc-400"}>
                ${formatCLP(billedAmount)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOptionChange("total")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                paymentOption === "total"
                  ? "bg-white text-emerald-700 shadow-sm border border-emerald-200"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-white/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentOption === "total" ? "border-emerald-500" : "border-zinc-300"
                }`}>
                  {paymentOption === "total" && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </span>
                Pagar Deuda Total
              </span>
              <span className={paymentOption === "total" ? "text-emerald-600" : "text-zinc-400"}>
                ${formatCLP(debtAmount)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOptionChange("custom")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                paymentOption === "custom"
                  ? "bg-white text-emerald-700 shadow-sm border border-emerald-200"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-white/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentOption === "custom" ? "border-emerald-500" : "border-zinc-300"
                }`}>
                  {paymentOption === "custom" && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </span>
                Otro monto
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5" /> Desde Cuenta
          </label>
          <div className="relative">
            <select
              value={sourceAccountId}
              onChange={(e) => setSourceAccountId(e.target.value)}
              required
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base md:text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="text-zinc-400">
                Seleccionar cuenta
              </option>
              {debitAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — ${formatCLP(Number(acc.balance))}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              Monto a Pagar
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
              {paymentOption === "custom" ? (
                <input
                  type="number"
                  step="0.01"
                  value={customAmount === 0 ? "" : customAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomAmount(val === "" ? "" : parseFloat(val));
                  }}
                  placeholder="Ingresa un monto"
                  required
                  className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-base md:text-lg font-bold text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              ) : (
                <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-base md:text-lg font-bold text-zinc-800">
                  {formatCLP(resolvedAmount)}
                </div>
              )}
            </div>
            {paymentOption === "billed" && (
              <p className="text-[10px] text-emerald-600 ml-1">
                Corresponde al monto facturado del periodo
              </p>
            )}
            {paymentOption === "total" && (
              <p className="text-[10px] text-zinc-400 ml-1">
                Deuda total: ${formatCLP(debtAmount)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base md:text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-lg hover:shadow-xl ${
            isLoading
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 hover:scale-[1.01]"
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Confirmar Pago (${formatCLP(resolvedAmount)})
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PayCreditCardForm;
