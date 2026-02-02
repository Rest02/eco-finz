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
      return <Landmark className="w-5 h-5 stroke-1" />;
    case "BILLETERA_DIGITAL":
      return <Wallet className="w-5 h-5 stroke-1" />;
    case "EFECTIVO":
      return <Banknote className="w-5 h-5 stroke-1" />;
    case "TARJETA_CREDITO":
      return <CreditCard className="w-5 h-5 stroke-1" />;
    default:
      return <Wallet className="w-5 h-5 stroke-1" />;
  }
};

const getAccountColor = (type: AccountType) => {
  // Monochrome / Zinc palette for Ultra-Clean look
  // Using subtle background differentiation if needed, but keeping it mostly uniform per brand style
  return "text-black bg-zinc-100 border-zinc-200";
};

const AccountList: React.FC<Props> = ({ accounts, onAccountDeleted, onAccountEdit }) => {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 text-lg italic">No hay cuentas disponibles todavía.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">Mis Cuentas</h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500">
          {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="group relative bg-white border border-zinc-200 rounded-[24px] p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-zinc-300"
          >
            {/* Options Icon */}
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => onAccountEdit(account)}
                className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-black transition-all"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onAccountDeleted(account.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Icon Box */}
            <div className={`w-12 h-12 rounded-2xl ${getAccountColor(account.type)} border flex items-center justify-center mb-4 transition-transform`}>
              {getAccountIcon(account.type)}
            </div>

            {/* Info */}
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">
              {account.name}
            </p>

            <div className="flex items-end justify-between relative z-10">
              <div className="text-2xl font-bold text-black tracking-tight">
                <span className="text-zinc-400 mr-1">$</span>
                {account.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </div>

              <Link
                href={`/finance/accounts/${account.id}`}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-zinc-50 hover:bg-black hover:text-white text-zinc-500 border border-zinc-200 hover:border-black text-[10px] font-bold uppercase tracking-tighter transition-all group/btn"
              >
                Movimientos
                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;
