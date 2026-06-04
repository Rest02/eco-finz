"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MonthlyProjectionForm } from "@/features/finance/components/monthly-projection/MonthlyProjectionForm";
import { useCreateMonthlyProjection } from "@/features/finance/hooks/useMonthlyProjections";
import toast from "react-hot-toast";

export default function NewMonthlyProjectionPage() {
  const router = useRouter();
  const createProjection = useCreateMonthlyProjection();

  const handleSave = (data: any) => {
    createProjection.mutate(data, {
      onSuccess: () => {
        toast.success("Proyección creada exitosamente");
        router.push("/finance/projection/monthly");
      },
      onError: () => {
        toast.error("Error al crear la proyección");
      },
    });
  };

  return (
    <div className="relative min-h-screen p-6 lg:p-10 pb-20 w-full max-w-7xl mx-auto transition-all duration-500">
      <MonthlyProjectionForm onSave={handleSave} isSaving={createProjection.isPending} />
    </div>
  );
}
