"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ page, lastPage, onPageChange }) => {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-6">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-black hover:border-zinc-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-600 disabled:hover:border-zinc-200 shadow-sm"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Anterior
      </button>

      <span className="text-xs font-bold text-zinc-500 tracking-wide px-3">
        Página {page} de {lastPage}
      </span>

      <button
        type="button"
        disabled={page >= lastPage}
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-black hover:border-zinc-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-600 disabled:hover:border-zinc-200 shadow-sm"
      >
        Siguiente
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Pagination;
