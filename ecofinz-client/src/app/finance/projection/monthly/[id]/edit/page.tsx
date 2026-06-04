"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { MonthlyProjectionForm } from "@/features/finance/components/monthly-projection/MonthlyProjectionForm";
import { useMonthlyProjection, useUpdateMonthlyProjection } from "@/features/finance/hooks/useMonthlyProjections";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditMonthlyProjectionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: projection, isLoading } = useMonthlyProjection(id);
  const updateProjection = useUpdateMonthlyProjection();

  const handleSave = (data: any) => {
    updateProjection.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Proyección actualizada exitosamente");
          router.push(`/finance/projection/monthly/${id}`);
        },
        onError: () => {
          toast.error("Error al actualizar la proyección");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!projection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Proyección no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-6 lg:p-10 pb-20 w-full max-w-7xl mx-auto transition-all duration-500">
      <MonthlyProjectionForm
        initialData={projection}
        onSave={handleSave}
        isSaving={updateProjection.isPending}
      />
    </div>
  );
}
