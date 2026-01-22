import apiClient from '../../lib/apiClient';
import { AxiosResponse } from 'axios';
import {
  Account,
  Category,
  Transaction,
  Budget,
  MonthlySummary,
  PaginatedResponse,
  CreateAccountDto,
  UpdateAccountDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateTransactionDto,
  UpdateTransactionDto,
  CreateBudgetDto,
  UpdateBudgetDto,
} from '../dto/finance';

// ========== Account Endpoints ==========

export const getAccounts = (): Promise<AxiosResponse<Account[]>> => {
  return apiClient.get<Account[]>('/account');
};

export const createAccount = (data: CreateAccountDto): Promise<AxiosResponse<Account>> => {
  return apiClient.post<Account>('/account', data);
};

export const updateAccount = (id: string, data: UpdateAccountDto): Promise<AxiosResponse<Account>> => {
  return apiClient.patch<Account>(`/account/${id}`, data);
};

export const deleteAccount = (id: string): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/account/${id}`);
};

// ========== Category Endpoints ==========

export const getCategories = (): Promise<AxiosResponse<Category[]>> => {
  return apiClient.get<Category[]>('/finance/category');
};

export const createCategory = (data: CreateCategoryDto): Promise<AxiosResponse<Category>> => {
  return apiClient.post<Category>('/finance/category', data);
};

export const updateCategory = (id: string, data: UpdateCategoryDto): Promise<AxiosResponse<Category>> => {
  return apiClient.patch<Category>(`/finance/category/${id}`, data);
};

export const deleteCategory = (id: string): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/finance/category/${id}`);
};

// ========== Transaction Endpoints ==========

export const getTransactions = (filters?: { month?: number, year?: number, accountId?: string }): Promise<AxiosResponse<PaginatedResponse<Transaction>>> => {
  return apiClient.get<PaginatedResponse<Transaction>>('/finance/transaction', { params: filters });
};

export const createTransaction = (data: CreateTransactionDto): Promise<AxiosResponse<Transaction>> => {
  return apiClient.post<Transaction>('/finance/transaction', data);
};

export const updateTransaction = (id: string, data: UpdateTransactionDto): Promise<AxiosResponse<Transaction>> => {
  return apiClient.patch<Transaction>(`/finance/transaction/${id}`, data);
};

export const deleteTransaction = (id: string): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/finance/transaction/${id}`);
};

// ========== Budget Endpoints ==========

export const getBudgets = (filters: { month: number, year: number }): Promise<AxiosResponse<Budget[]>> => {
  return apiClient.get<Budget[]>('/finance/budgets', { params: filters });
};

export const createBudget = (data: CreateBudgetDto): Promise<AxiosResponse<Budget>> => {
  return apiClient.post<Budget>('/finance/budgets', data);
};

export const updateBudget = (id: string, data: UpdateBudgetDto): Promise<AxiosResponse<Budget>> => {
  return apiClient.patch<Budget>(`/finance/budgets/${id}`, data);
};

export const deleteBudget = (id: string): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/finance/budgets/${id}`);
};

// ========== Summary Endpoint ==========

export const getMonthlySummary = (year: number, month: number): Promise<AxiosResponse<MonthlySummary>> => {
  return apiClient.get<MonthlySummary>(`/finance/summary/${year}/${month}`);
};
