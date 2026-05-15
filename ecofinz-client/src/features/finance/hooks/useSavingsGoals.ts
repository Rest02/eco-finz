'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSavingsGoals,
  getSavingsSummary,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
} from '../services/savingsService';
import {
  CreateSavingsGoalDto,
  UpdateSavingsGoalDto,
} from '../types/savings';
import toast from 'react-hot-toast';

export function useSavingsGoals() {
  return useQuery({
    queryKey: ['savings-goals'],
    queryFn: async () => {
      const res = await getSavingsGoals();
      return res.data;
    },
  });
}

export function useSavingsSummary() {
  return useQuery({
    queryKey: ['savings-summary'],
    queryFn: async () => {
      const res = await getSavingsSummary();
      return res.data;
    },
  });
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSavingsGoalDto) => createSavingsGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['savings-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Meta de ahorro creada exitosamente');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Error al crear la meta';
      toast.error(message);
    },
  });
}

export function useUpdateSavingsGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSavingsGoalDto }) =>
      updateSavingsGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['savings-summary'] });
      toast.success('Meta actualizada');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Error al actualizar la meta';
      toast.error(message);
    },
  });
}

export function useDeleteSavingsGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSavingsGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['savings-summary'] });
      toast.success('Meta eliminada');
    },
    onError: () => {
      toast.error('Error al eliminar la meta');
    },
  });
}
