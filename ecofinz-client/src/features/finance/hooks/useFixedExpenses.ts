import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFixedExpenses,
  createFixedExpense,
  updateFixedExpense,
  deleteFixedExpense,
  CreateFixedExpenseDto,
  UpdateFixedExpenseDto,
} from '../services/fixedExpenseService';

export const useFixedExpenses = () => {
  return useQuery({
    queryKey: ['fixed-expenses'],
    queryFn: async () => {
      const response = await getFixedExpenses();
      return response.data;
    },
  });
};

export const useCreateFixedExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFixedExpenseDto) => createFixedExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] });
    },
  });
};

export const useUpdateFixedExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFixedExpenseDto }) =>
      updateFixedExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] });
    },
  });
};

export const useDeleteFixedExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFixedExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] });
    },
  });
};
