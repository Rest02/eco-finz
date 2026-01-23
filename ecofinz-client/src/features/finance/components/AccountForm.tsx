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
  const [error, setError] = useState<string | null>(null);

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();

  const isLoading = createAccountMutation.isPending || updateAccountMutation.isPending;

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setBalance(initialData.balance);
    } else {
      setName("");
      setType("BANCO");
      setBalance(0);
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      if (isEditMode && initialData) {
        const updateData: UpdateAccountDto = { name, type };
        const response = await updateAccountMutation.mutateAsync({ id: initialData.id, data: updateData });
        if (onAccountUpdated) onAccountUpdated(response.data);
      } else {
        const newAccount: CreateAccountDto = { name, type, balance };
        const response = await createAccountMutation.mutateAsync(newAccount);
        if (onAccountCreated) onAccountCreated(response.data);
        setName("");
        setType("BANCO");
        setBalance(0);
      }
    } catch (err) {
      console.error("Failed to save account:", err);
      setError(`No se pudo ${isEditMode ? "actualizar" : "crear"} la cuenta.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${isEditMode ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>
          {isEditMode ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
        <h2 className="text-xl font-semibold text-white">
          {isEditMode ? "Editar Cuenta" : "Nueva Cuenta"}
        </h2>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-neutral-400 ml-1">
            Nombre de la Cuenta
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Mi Billetera, Banco Galicia..."
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium text-neutral-400 ml-1">
            Tipo de Cuenta
          </label>
          <div className="grid grid-cols-1 gap-2">
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as AccountType)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
            >
              {accountTypes.map(t => (
                <option key={t.value} value={t.value} className="bg-neutral-900 text-white">
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="balance" className="text-sm font-medium text-neutral-400 ml-1">
            {isEditMode ? "Balance Actual" : "Balance Inicial"}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold">$</span>
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
              className={`w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none transition-all ${isEditMode ? "opacity-50 cursor-not-allowed" : "focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                }`}
            />
          </div>
          {isEditMode && (
            <p className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-1 ml-1">
              <Info className="w-3 h-3" />
              El balance se ajusta automáticamente mediante transacciones.
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md ${isLoading
              ? "bg-neutral-800/50 text-neutral-500 cursor-not-allowed"
              : isEditMode
                ? "bg-amber-500/80 hover:bg-amber-500 text-white border border-amber-400/20 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                : "bg-emerald-500/80 hover:bg-emerald-500 text-white border border-emerald-400/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
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
              className="px-5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium backdrop-blur-md"
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
