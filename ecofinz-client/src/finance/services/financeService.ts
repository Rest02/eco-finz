import apiClient from '../../lib/apiClient';
import {
  Account,
  Category,
  Transaction,
  Budget,
  MonthlySummary,
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

export const getAccounts = () => {
  return apiClient.get<Account[]>('/account');
};

export const createAccount = (data: CreateAccountDto) => {
  return apiClient.post<Account>('/account', data);
};

export const updateAccount = (id: string, data: UpdateAccountDto) => {
  return apiClient.patch<Account>(`/account/${id}`, data);
};

export const deleteAccount = (id: string) => {
  return apiClient.delete(`/account/${id}`);
};

// ========== Category Endpoints ==========

export const getCategories = () => {
  return apiClient.get<Category[]>('/category');
};

export const createCategory = (data: CreateCategoryDto) => {
  return apiClient.post<Category>('/category', data);
};

export const updateCategory = (id: string, data: UpdateCategoryDto) => {
  return apiClient.patch<Category>(`/category/${id}`, data);
};

export const deleteCategory = (id: string) => {
  return apiClient.delete(`/category/${id}`);
};

// ========== Transaction Endpoints ==========

export const getTransactions = (filters?: { month?: number, year?: number }) => {
  return apiClient.get<Transaction[]>('/transaction', { params: filters });
};

export const createTransaction = (data: CreateTransactionDto) => {
  return apiClient.post<Transaction>('/transaction', data);
};

export const updateTransaction = (id: string, data: UpdateTransactionDto) => {
  return apiClient.patch<Transaction>(`/transaction/${id}`, data);
};

export const deleteTransaction = (id: string) => {
  return apiClient.delete(`/transaction/${id}`);
};

// ========== Budget Endpoints ==========

export const getBudgets = (filters: { month: number, year: number }) => {
  return apiClient.get<Budget[]>('/budget', { params: filters });
};

export const createBudget = (data: CreateBudgetDto) => {
  return apiClient.post<Budget>('/budget', data);
};

export const updateBudget = (id: string, data: UpdateBudgetDto) => {
  return apiClient.patch<Budget>(`/budget/${id}`, data);
};

export const deleteBudget = (id: string) => {
  return apiClient.delete(`/budget/${id}`);
};

// ========== Summary Endpoint ==========

export const getMonthlySummary = (year: number, month: number) => {
  return apiClient.get<MonthlySummary>(`/finance/summary/${year}/${month}`);
};
