'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  SavingsGoal,
  CreateSavingsGoalDto,
  UpdateSavingsGoalDto,
} from '../../types/savings';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSavingsGoalDto | UpdateSavingsGoalDto) => void;
  editingGoal?: SavingsGoal | null;
  availablePercentage: number;
}

export function GoalForm({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
  availablePercentage,
}: GoalFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [allocatedPercentage, setAllocatedPercentage] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name);
      setDescription(editingGoal.description || '');
      setTargetAmount(String(editingGoal.targetAmount));
      setAllocatedPercentage(String(editingGoal.allocatedPercentage));
      setDeadline(editingGoal.deadline?.split('T')[0] || '');
    } else {
      setName('');
      setDescription('');
      setTargetAmount('');
      setAllocatedPercentage('');
      setDeadline('');
    }
    setErrors({});
  }, [editingGoal, isOpen]);

  const maxPercentage = editingGoal
    ? availablePercentage + editingGoal.allocatedPercentage
    : availablePercentage;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!targetAmount || Number(targetAmount) <= 0)
      newErrors.targetAmount = 'El monto debe ser mayor a 0';
    if (!allocatedPercentage || Number(allocatedPercentage) <= 0)
      newErrors.allocatedPercentage = 'El porcentaje debe ser mayor a 0';
    if (Number(allocatedPercentage) > maxPercentage)
      newErrors.allocatedPercentage = `Solo tienes ${maxPercentage}% disponible`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: any = {
      name: name.trim(),
      description: description.trim() || undefined,
      targetAmount: Number(targetAmount),
      allocatedPercentage: Number(allocatedPercentage),
      deadline: deadline || undefined,
    };

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-zinc-900">
            {editingGoal ? 'Editar Meta' : 'Nueva Meta de Ahorro'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              Nombre de la meta
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Viaje a Japón"
              className={cn(
                'w-full px-4 py-3 rounded-2xl border bg-zinc-50 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all',
                errors.name ? 'border-red-300' : 'border-zinc-200',
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              Descripción (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción..."
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Meta ($)
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="5.000.000"
                min={1}
                className={cn(
                  'w-full px-4 py-3 rounded-2xl border bg-zinc-50 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all',
                  errors.targetAmount ? 'border-red-300' : 'border-zinc-200',
                )}
              />
              {errors.targetAmount && (
                <p className="text-xs text-red-500 mt-1">{errors.targetAmount}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                % del ahorro
              </label>
              <input
                type="number"
                value={allocatedPercentage}
                onChange={(e) => setAllocatedPercentage(e.target.value)}
                placeholder="30"
                min={1}
                max={maxPercentage}
                className={cn(
                  'w-full px-4 py-3 rounded-2xl border bg-zinc-50 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all',
                  errors.allocatedPercentage ? 'border-red-300' : 'border-zinc-200',
                )}
              />
              {errors.allocatedPercentage ? (
                <p className="text-xs text-red-500 mt-1">{errors.allocatedPercentage}</p>
              ) : (
                <p className="text-xs text-zinc-400 mt-1">Disponible: {maxPercentage}%</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              Fecha límite (opcional)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
            >
              {editingGoal ? 'Guardar Cambios' : 'Crear Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
