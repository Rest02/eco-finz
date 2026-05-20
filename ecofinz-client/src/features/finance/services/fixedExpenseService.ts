import apiClient from '@/lib/apiClient';
import { AxiosResponse } from 'axios';

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFixedExpenseDto {
  name: string;
  amount: number;
  isActive?: boolean;
}

export interface UpdateFixedExpenseDto {
  name?: string;
  amount?: number;
  isActive?: boolean;
}

export const getFixedExpenses = (): Promise<AxiosResponse<FixedExpense[]>> => {
  return apiClient.get<FixedExpense[]>('/finance/fixed-expenses');
};

export const createFixedExpense = (data: CreateFixedExpenseDto): Promise<AxiosResponse<FixedExpense>> => {
  return apiClient.post<FixedExpense>('/finance/fixed-expenses', data);
};

export const updateFixedExpense = (id: string, data: UpdateFixedExpenseDto): Promise<AxiosResponse<FixedExpense>> => {
  return apiClient.patch<FixedExpense>(`/finance/fixed-expenses/${id}`, data);
};

export const deleteFixedExpense = (id: string): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/finance/fixed-expenses/${id}`);
};
