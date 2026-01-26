import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/financeService';
import { CreateTransactionDto, UpdateTransactionDto } from '../types/finance';

export const useTransactions = (filters?: {
    month?: number;
    year?: number;
    accountId?: string;
    categoryId?: string;
    type?: 'INGRESO' | 'EGRESO';
    startDate?: string;
    endDate?: string;
}) => {
    return useQuery({
        queryKey: ['transactions', filters],
        queryFn: async () => {
            const response = await getTransactions(filters);
            return response.data;
        },
        // Enabled if no filters are provided (fetch all) or if specific filters are provided
        enabled: !filters || !!filters.accountId || (!!filters.month && !!filters.year) || (!!filters.startDate && !!filters.endDate),
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTransactionDto) => createTransaction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTransactionDto }) => updateTransaction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};
