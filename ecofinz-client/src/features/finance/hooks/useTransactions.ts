import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, payCreditCard, PayCreditCardData } from '../services/financeService';
import { CreateTransactionDto, UpdateTransactionDto, TransactionType } from '../types/finance';

export const useTransactions = (filters?: {
    month?: number;
    year?: number;
    accountId?: string;
    categoryId?: string;
    type?: TransactionType;
    startDate?: string;
    endDate?: string;
    limit?: number;
    page?: number;
}) => {
    return useQuery({
        queryKey: ['transactions', filters],
        queryFn: async () => {
            const response = await getTransactions(filters);
            return response.data;
        },
        // Enabled by default unless specifically disabled. Allows fetching by type alone.
        enabled: true,
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
            queryClient.invalidateQueries({ queryKey: ['projections'] });
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
            queryClient.invalidateQueries({ queryKey: ['projections'] });
        },
    });
};

export const usePayCreditCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: PayCreditCardData) => payCreditCard(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
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
            queryClient.invalidateQueries({ queryKey: ['projections'] });
        },
    });
};
