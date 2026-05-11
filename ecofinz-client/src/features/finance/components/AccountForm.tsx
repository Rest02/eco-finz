"use client";

import React, { useState, useEffect } from "react";
import { useCreateAccount, useUpdateAccount } from "../hooks/useAccounts";
import { Account, AccountType, CreateAccountDto, UpdateAccountDto } from "../types/finance";
import { Plus, Save, X, Info, AlertCircle } from "lucide-react";

const accountTypes: { value: AccountType; label: string }[] = [
  { value: "BANCO", label: "Banco" },
  { value: "BILLETERA_DIGITAL", label: "Billetera Digital" },
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "TARJETA_CREDITO", label: "Tarjeta de Crédito" },
];

interface Props {
  onAccountCreated?: (newAccount: Account) => void;
  onAccountUpdated?: (updatedAccount: Account) => void;
  initialData?: Account;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const AccountForm: React.FC<Props> = ({
  onAccountCreated,
  onAccountUpdated,
  initialData,
  isEditMode = false,
  onCancel
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("BANCO");
  const [balance, setBalance] = useState(0);
  const [creditLimit, setCreditLimit] = useState(0);
  const [closingDay, setClosingDay] = useState(15);
  const [dueDay, setDueDay] = useState(5);
  const [lastDigits, setLastDigits] = useState("");
  const [color, setColor] = useState("from-emerald-500 to-teal-800");
  const [error, setError] = useState<string | null>(null);

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();

  const isLoading = createAccountMutation.isPending || updateAccountMutation.isPending;

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setBalance(initialData.balance);
      setCreditLimit(initialData.creditLimit || 0);
      setClosingDay(initialData.closingDay || 15);
      setDueDay(initialData.dueDay || 5);
      setLastDigits(initialData.lastDigits || "");
      setColor(initialData.color || "from-emerald-500 to-teal-800");
    } else {
      setName("");
      setType("BANCO");
      setBalance(0);
      setCreditLimit(0);
      setClosingDay(15);
      setDueDay(5);
      setLastDigits("");
      setColor("from-emerald-500 to-teal-800");
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      if (isEditMode && initialData) {
        const updateData: UpdateAccountDto = { 
          name, 
          type,
          ...(type === "TARJETA_CREDITO" ? {
            creditLimit,
            closingDay,
            dueDay,
            lastDigits,
            color
          } : {
            creditLimit: null as any,
            closingDay: null as any,
            dueDay: null as any,
            lastDigits: null as any,
            color: null as any
          })
        };
        const response = await updateAccountMutation.mutateAsync({ id: initialData.id, data: updateData });
        if (onAccountUpdated) onAccountUpdated(response.data);
      } else {
        const newAccount: CreateAccountDto = { 
          name, 
          type, 
          balance: type === "TARJETA_CREDITO" ? 0 : balance,
          ...(type === "TARJETA_CREDITO" ? {
            creditLimit,
            closingDay,
            dueDay,
            lastDigits,
            color
          } : {})
        };
        const response = await createAccountMutation.mutateAsync(newAccount);
        if (onAccountCreated) onAccountCreated(response.data);
        setName("");
        setType("BANCO");
        setBalance(0);
        setCreditLimit(0);
        setClosingDay(15);
        setDueDay(5);
        setLastDigits("");
        setColor("from-emerald-500 to-teal-800");
      }
    } catch (err) {
      console.error("Failed to save account:", err);
      setError(`No se pudo ${isEditMode ? "actualizar" : "crear"} la cuenta.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${isEditMode ? "bg-zinc-100 text-black" : "bg-zinc-100 text-black"}`}>
          {isEditMode ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
        <h2 className="text-xl font-bold text-black">
          {isEditMode ? "Editar Cuenta" : "Nueva Cuenta"}
        </h2>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-zinc-700 ml-1">
            Nombre de la Cuenta
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Mi Billetera, Banco Galicia..."
            required
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-semibold text-zinc-700 ml-1">
            Tipo de Cuenta
          </label>
          <div className="grid grid-cols-1 gap-2">
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as AccountType)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all appearance-none cursor-pointer"
            >
              {accountTypes.map(t => (
                <option key={t.value} value={t.value} className="bg-white text-black">
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {type === "TARJETA_CREDITO" && (
          <div className="space-y-4 p-4 bg-zinc-50 border border-zinc-200/60 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
              Detalles de la Tarjeta de Crédito
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="creditLimit" className="text-sm font-semibold text-zinc-700 ml-1">
                  Cupo / Límite de Crédito
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold">$</span>
                  <input
                    id="creditLimit"
                    type="number"
                    value={isNaN(creditLimit) ? "" : creditLimit}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCreditLimit(isNaN(val) ? 0 : val);
                    }}
                    required
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-8 pr-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="lastDigits" className="text-sm font-semibold text-zinc-700 ml-1">
                  Últimos 4 Dígitos
                </label>
                <input
                  id="lastDigits"
                  type="text"
                  maxLength={4}
                  value={lastDigits}
                  onChange={(e) => setLastDigits(e.target.value.replace(/\D/g, ""))}
                  placeholder="Ej. 1234"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="closingDay" className="text-sm font-semibold text-zinc-700 ml-1">
                  Día de Corte / Facturación
                </label>
                <input
                  id="closingDay"
                  type="number"
                  min={1}
                  max={31}
                  value={closingDay}
                  onChange={(e) => setClosingDay(parseInt(e.target.value) || 15)}
                  required
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dueDay" className="text-sm font-semibold text-zinc-700 ml-1">
                  Día de Vencimiento / Pago
                </label>
                <input
                  id="dueDay"
                  type="number"
                  min={1}
                  max={31}
                  value={dueDay}
                  onChange={(e) => setDueDay(parseInt(e.target.value) || 5)}
                  required
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 ml-1">
                Estilo / Color Visual
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Verde Esmeralda", class: "from-emerald-500 to-teal-800" },
                  { name: "Púrpura Elegante", class: "from-purple-500 to-indigo-800" },
                  { name: "Celeste Elegante", class: "from-sky-400 to-purple-600" },
                  { name: "Gris Oscuro", class: "from-zinc-700 to-black" }
                ].map((col) => (
                  <button
                    key={col.class}
                    type="button"
                    onClick={() => setColor(col.class)}
                    className={`h-11 w-full text-xs font-semibold rounded-xl text-white bg-gradient-to-r ${col.class} border ${
                      color === col.class ? "border-black scale-[1.02] shadow-md" : "border-zinc-200 hover:scale-[1.01] hover:border-zinc-300"
                    } transition-all duration-200`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!(type === "TARJETA_CREDITO" && !isEditMode) && (
          <div className="space-y-2">
            <label htmlFor="balance" className="text-sm font-semibold text-zinc-700 ml-1">
              {isEditMode ? "Balance Actual" : "Balance Inicial"}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold">$</span>
              <input
                id="balance"
                type="number"
                step="0.01"
                value={isNaN(balance) ? "" : balance}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBalance(isNaN(val) ? 0 : val);
                }}
                required
                disabled={isEditMode}
                className={`w-full bg-white border border-zinc-200 rounded-xl pl-8 pr-4 py-3 text-black focus:outline-none transition-all ${isEditMode ? "opacity-50 cursor-not-allowed bg-zinc-50" : "focus:ring-2 focus:ring-black/5 focus:border-zinc-400"
                  }`}
              />
            </div>
            {isEditMode && (
              <p className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1 ml-1">
                <Info className="w-3 h-3" />
                El balance se ajusta automáticamente mediante transacciones.
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-bold transition-all duration-300 ${isLoading
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-zinc-800 shadow-md hover:shadow-lg hover:scale-[1.02]"
              }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : isEditMode ? (
              <>
                <Save className="w-5 h-5" />
                Actualizar
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Crear Cuenta
              </>
            )}
          </button>

          {isEditMode && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 rounded-full border border-zinc-200 text-black hover:bg-zinc-50 transition-all font-medium"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
