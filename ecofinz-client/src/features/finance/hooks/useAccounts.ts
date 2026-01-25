import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccounts, getAccount, createAccount, updateAccount, deleteAccount } from '../services/financeService';
import { CreateAccountDto, UpdateAccountDto } from '../types/finance';

export const useAccounts = () => {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const response = await getAccounts();
            return response.data;
        },
    });
};

export const useAccount = (id: string) => {
    return useQuery({
        queryKey: ['accounts', id],
        queryFn: async () => {
            const response = await getAccount(id);
            return response.data;
        },
        enabled: !!id
    });
};

export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAccountDto) => createAccount(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAccountDto }) => updateAccount(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteAccount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};
