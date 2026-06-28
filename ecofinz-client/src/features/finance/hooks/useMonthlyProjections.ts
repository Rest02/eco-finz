import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMonthlyProjections,
  getMonthlyProjection,
  createMonthlyProjection,
  updateMonthlyProjection,
  duplicateMonthlyProjection,
  deleteMonthlyProjection,
  updateSpendingPlan,
  updateExcludedTransactions,
  updateWeeklyAdjustments,
} from '../services/financeService';
import {
  CreateMonthlyProjectionDto,
  UpdateMonthlyProjectionDto,
  MonthlyProjectionFilters,
} from '../types/finance';

export const useMonthlyProjections = (
  filters?: MonthlyProjectionFilters,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['monthly-projections', filters],
    queryFn: async () => {
      const response = await getMonthlyProjections(filters);
      return response.data;
    },
    enabled: options?.enabled,
    refetchOnMount: 'always',
  });
};

export const useMonthlyProjection = (id: string) => {
  return useQuery({
    queryKey: ['monthly-projections', id],
    queryFn: async () => {
      const response = await getMonthlyProjection(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateMonthlyProjection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMonthlyProjectionDto) => createMonthlyProjection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-projections'] });
    },
  });
};

export const useUpdateMonthlyProjection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMonthlyProjectionDto }) =>
      updateMonthlyProjection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-projections'] });
    },
  });
};

export const useDuplicateMonthlyProjection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => duplicateMonthlyProjection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-projections'] });
    },
  });
};

export const useDeleteMonthlyProjection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMonthlyProjection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-projections'] });
    },
  });
};

export const useUpdateExcludedTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, excludedTransactionIds }: { id: string; excludedTransactionIds: string[] }) =>
      updateExcludedTransactions(id, excludedTransactionIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['monthly-projections', variables.id] });
    },
  });
};

export const useSaveWeeklyAdjustments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adjustments }: { id: string; adjustments: { sourceWeekIndex: number; targetWeekIndex: number; amount: number }[] }) =>
      updateWeeklyAdjustments(id, adjustments),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['monthly-projections', variables.id] });
    },
  });
};

export const useUpdateSpendingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { variableExpensesAccountId?: string; spendingPlanPattern?: string; spendingDays?: string; variableExpenseDistribution?: string; variableExpenseWeeks?: number } }) =>
      updateSpendingPlan(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['monthly-projections', variables.id] });
    },
  });
};
