"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { useMonthlyProjections, useDeleteMonthlyProjection, useDuplicateMonthlyProjection } from "../../hooks/useMonthlyProjections";
import { CalendarRange, Plus, Eye, Edit, Copy, Trash2, Search, Loader2 } from "lucide-react";
import { ProjectionStatus, MonthlyProjectionFilters } from "../../types/finance";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/context/AuthContext";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const STATUS_LABELS: Record<ProjectionStatus, { label: string; color: string }> = {
  ACTIVE: { label: "Activa", color: "text-emerald-600 bg-emerald-50" },
  ARCHIVED: { label: "Archivada", color: "text-zinc-600 bg-zinc-100" },
  DELETED: { label: "Eliminada", color: "text-red-600 bg-red-50" },
};

export function MonthlyProjectionList() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectionStatus | "">("");
  const [yearFilter, setYearFilter] = useState<number | "">("");
  const [monthFilter, setMonthFilter] = useState<number | "">("");

  const filters = useMemo(() => {
    const result: Record<string, unknown> = {};
    if (search) result.search = search;
    if (statusFilter) result.status = statusFilter;
    if (yearFilter) result.year = yearFilter;
    if (monthFilter) result.month = monthFilter;
    return Object.keys(result).length > 0 ? result as MonthlyProjectionFilters : undefined;
  }, [search, statusFilter, yearFilter, monthFilter]);

  const { data: projections = [], isLoading } = useMonthlyProjections(filters, { enabled: isAuthenticated });

  const deleteProjection = useDeleteMonthlyProjection();
  const duplicateProjection = useDuplicateMonthlyProjection();

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta proyección?")) {
      deleteProjection.mutate(id, {
        onSuccess: () => toast.success("Proyección eliminada"),
        onError: () => toast.error("Error al eliminar"),
      });
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateProjection.mutate(id, {
      onSuccess: () => {
        toast.success("Proyección duplicada");
      },
      onError: () => toast.error("Error al duplicar"),
    });
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  const formatPeriod = (period: string) => {
    const [y, m] = period.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${y}`;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
            <CalendarRange className="w-6 h-6" />
            Proyecciones Mensuales
          </h1>
          <p className="text-sm text-zinc-500 font-medium mt-0.5">
            Historial de todas tus proyecciones financieras mensuales.
          </p>
        </div>
        <button
          onClick={() => router.push("/finance/projection/monthly/new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/20"
        >
          <Plus className="w-4 h-4" />
          Nueva Proyección
        </button>
      </motion.div>

      {/* Filtros */}
      <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ProjectionStatus | "")}
            className="px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVE">Activas</option>
            <option value="ARCHIVED">Archivadas</option>
            <option value="DELETED">Eliminadas</option>
          </select>
          <select
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value ? parseInt(e.target.value) : "")}
            className="px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="">Todos los meses</option>
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value ? parseInt(e.target.value) : "")}
            className="px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="">Todos los años</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Listado */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : projections.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-12 text-center">
          <CalendarRange className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500 font-medium">No hay proyecciones mensuales aún.</p>
          <p className="text-zinc-400 text-sm mt-1">Crea tu primera proyección para empezar.</p>
          <button
            onClick={() => router.push("/finance/projection/monthly/new")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear Proyección
          </button>
        </motion.div>
      ) : (
        <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Período</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Nombre</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Disponible Real</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Ahorro</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {projections.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-zinc-700">{formatPeriod(p.period)}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{p.name}</td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-zinc-900">{formatCurrency(p.realAvailableMoney)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-emerald-600">{formatCurrency(p.projectedSavings)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_LABELS[p.status].color}`}>
                        {STATUS_LABELS[p.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/finance/projection/monthly/${p.id}`)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/finance/projection/monthly/${p.id}/edit`)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p.id)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
