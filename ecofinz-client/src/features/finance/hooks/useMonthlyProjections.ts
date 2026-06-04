import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMonthlyProjections,
  getMonthlyProjection,
  createMonthlyProjection,
  updateMonthlyProjection,
  duplicateMonthlyProjection,
  deleteMonthlyProjection,
} from '../services/financeService';
import {
  CreateMonthlyProjectionDto,
  UpdateMonthlyProjectionDto,
  MonthlyProjectionFilters,
} from '../types/finance';

export const useMonthlyProjections = (filters?: MonthlyProjectionFilters) => {
  return useQuery({
    queryKey: ['monthly-projections', filters],
    queryFn: async () => {
      const response = await getMonthlyProjections(filters);
      return response.data;
    },
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
