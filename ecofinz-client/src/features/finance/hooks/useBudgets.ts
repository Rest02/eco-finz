import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBudgets, createBudget, updateBudget, deleteBudget, getMonthlySummary } from '../services/financeService';
import { CreateBudgetDto, UpdateBudgetDto } from '../types/finance';

export const useBudgets = (filters: { month: number; year: number }) => {
    return useQuery({
        queryKey: ['budgets', filters],
        queryFn: async () => {
            const response = await getBudgets(filters);
            return response.data;
        },
    });
};

export const useCreateBudget = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBudgetDto) => createBudget(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useUpdateBudget = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBudgetDto }) => updateBudget(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useDeleteBudget = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBudget(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useMonthlySummary = (year: number, month: number) => {
    return useQuery({
        queryKey: ['monthly-summary', year, month],
        queryFn: async () => {
            const response = await getMonthlySummary(year, month);
            return response.data;
        },
    });
};
