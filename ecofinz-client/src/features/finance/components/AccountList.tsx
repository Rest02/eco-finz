"use client";

import React from "react";
import Link from "next/link";
import { Account, AccountType } from "../types/finance";
import {
  Landmark,
  Wallet,
  Banknote,
  CreditCard,
  Pencil,
  Trash2,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface Props {
  accounts: Account[];
  onAccountDeleted: (accountId: string) => void;
  onAccountEdit: (account: Account) => void;
}

const getAccountIcon = (type: AccountType) => {
  switch (type) {
    case "BANCO":
      return <Landmark className="w-5 h-5" />;
    case "BILLETERA_DIGITAL":
      return <Wallet className="w-5 h-5" />;
    case "EFECTIVO":
      return <Banknote className="w-5 h-5" />;
    case "TARJETA_CREDITO":
      return <CreditCard className="w-5 h-5" />;
    default:
      return <Wallet className="w-5 h-5" />;
  }
};

const getAccountColor = (type: AccountType) => {
  switch (type) {
    case "BANCO":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "BILLETERA_DIGITAL":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "EFECTIVO":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "TARJETA_CREDITO":
      return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    default:
      return "text-neutral-400 bg-neutral-500/10 border-neutral-500/20";
  }
};

const AccountList: React.FC<Props> = ({ accounts, onAccountDeleted, onAccountEdit }) => {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 text-lg italic">No hay cuentas disponibles todavía.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white/90">Mis Cuentas</h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400">
          {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="group relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${getAccountColor(account.type)}`}>
                  {getAccountIcon(account.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-wider text-sm">
                    {account.name}
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {account.type.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onAccountEdit(account)}
                  className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-amber-400 transition-all backdrop-blur-md border border-transparent hover:border-white/5"
                  title="Editar cuenta"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onAccountDeleted(account.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all backdrop-blur-md border border-transparent hover:border-red-500/10"
                  title="Eliminar cuenta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Balance Actual</p>
                <div className="text-2xl font-bold text-white tracking-tight">
                  <span className="text-emerald-500 mr-1">$</span>
                  {account.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <Link
                href={`/finance/accounts/${account.id}`}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-neutral-400 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/20 text-xs font-medium transition-all group/btn backdrop-blur-md"
              >
                Movimientos
                <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;
