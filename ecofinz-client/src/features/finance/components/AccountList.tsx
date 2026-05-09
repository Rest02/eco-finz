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
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Mis Cuentas</h2>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 uppercase tracking-wider">
          {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => {
          const isCreditCard = account.type === "TARJETA_CREDITO";
          const cardBgClass = isCreditCard && account.color
            ? `bg-gradient-to-r ${account.color} text-white border-transparent`
            : "bg-white/20 border border-white/30 text-black";
          const textColorClass = isCreditCard ? "text-white" : "text-black";
          const subtextColorClass = isCreditCard ? "text-white/70" : "text-zinc-400";
          const iconColorClass = isCreditCard ? "text-white bg-white/20 border-white/20" : getAccountColor(account.type);

          return (
            <div
              key={account.id}
              className={`group relative rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px] transition-all duration-300 hover:-translate-y-1 ${cardBgClass}`}
              style={{ backdropFilter: 'blur(5px)' }}
            >
              {/* Options Icon */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => onAccountEdit(account)}
                  className={`p-2 rounded-lg hover:bg-white/20 ${isCreditCard ? "text-white/60 hover:text-white" : "text-zinc-400 hover:text-black"} transition-all`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onAccountDeleted(account.id)}
                  className={`p-2 rounded-lg hover:bg-red-500/20 ${isCreditCard ? "text-white/60 hover:text-red-300" : "text-zinc-400 hover:text-red-500"} transition-all`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Icon Box */}
              <div className={`w-12 h-12 rounded-2xl ${iconColorClass} border flex items-center justify-center mb-4 transition-transform`}>
                {getAccountIcon(account.type)}
              </div>

              {/* Info */}
              <div className="flex justify-between items-start mb-1">
                <p className={`text-xs font-medium uppercase tracking-widest ${subtextColorClass}`}>
                  {account.name}
                </p>
                {isCreditCard && account.lastDigits && (
                  <p className="text-xs font-mono tracking-widest text-white/80">
                    •••• {account.lastDigits}
                  </p>
                )}
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div>
                  <div className={`text-2xl font-bold tracking-tight ${textColorClass}`}>
                    <span className={`${isCreditCard ? "text-white/60" : "text-zinc-400"} mr-1`}>$</span>
                    {account.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </div>
                  {isCreditCard && account.creditLimit !== undefined && account.creditLimit !== null && (
                    <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider mt-1">
                      Cupo: ${Number(account.creditLimit).toLocaleString('es-ES', { minimumFractionDigits: 0 })}
                    </p>
                  )}
                </div>

                <Link
                  href={`/finance/accounts/${account.id}`}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-[10px] font-bold uppercase tracking-tighter transition-all group/btn ${
                    isCreditCard
                      ? "bg-white/15 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white"
                      : "bg-zinc-50 hover:bg-black hover:text-white text-zinc-500 border border-zinc-200 hover:border-black"
                  }`}
                >
                  Movimientos
                  <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountList;
