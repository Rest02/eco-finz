import apiClient from '@/lib/apiClient';
import { AxiosResponse } from 'axios';
import {
  Account,
  Category,
  Transaction,
  TransactionType,
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
  Projection,
  CreateProjectionDto,
  UpdateProjectionDto,
  IncomeProjection,
  MonthlyProjection,
  CreateMonthlyProjectionDto,
  UpdateMonthlyProjectionDto,
  MonthlyProjectionFilters,
} from '../types/finance';

// ========== Account Endpoints ==========

export const getAccounts = (): Promise<AxiosResponse<Account[]>> => {
  return apiClient.get<Account[]>('/finance/account');
};

export const getAccount = (id: string): Promise<AxiosResponse<Account>> => {
  return apiClient.get<Account>(`/finance/account/${id}`);
};

export const createAccount = (data: CreateAccountDto): Promise<AxiosResponse<Account>> => {
  return apiClient.post<Account>('/finance/account', data);
};

export const updateAccount = (id: string, data: UpdateAccountDto): Promise<AxiosResponse<Account>> => {
  return apiClient.patch<Account>(`/finance/account/${id}`, data);
};

export const deleteAccount = (id: string): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/finance/account/${id}`);
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

export const getTransactions = (filters?: {
  month?: number,
  year?: number,
  accountId?: string,
  categoryId?: string,
  type?: TransactionType,
  startDate?: string,
  endDate?: string,
  limit?: number,
  page?: number
}): Promise<AxiosResponse<PaginatedResponse<Transaction>>> => {
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

export interface PayCreditCardData {
  creditCardAccountId: string;
  sourceAccountId: string;
  amount: number;
  date?: string;
}

export const payCreditCard = (data: PayCreditCardData): Promise<AxiosResponse<Transaction>> => {
  return apiClient.post<Transaction>('/finance/transaction/pay-credit-card', data);
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

// ========== Projection Endpoints ==========

export const getProjections = (): Promise<AxiosResponse<Projection[]>> => {
  return apiClient.get<Projection[]>('/finance/projection');
};

export const createProjection = (data: CreateProjectionDto): Promise<AxiosResponse<Projection>> => {
  return apiClient.post<Projection>('/finance/projection', data);
};

export const updateProjection = (id: string, data: UpdateProjectionDto): Promise<AxiosResponse<Projection>> => {
  return apiClient.patch<Projection>(`/finance/projection/${id}`, data);
};

export const deleteProjection = (id: string): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/finance/projection/${id}`);
};

export const syncProjections = (): Promise<AxiosResponse<{ success: boolean; message: string; cleanedCount: number }>> => {
  return apiClient.post('/finance/projection/sync');
};

// ========== Income Projection Endpoint ==========

export const getIncomeProjection = (period: 'current' | '3m' | '6m'): Promise<AxiosResponse<IncomeProjection>> => {
  return apiClient.get<IncomeProjection>('/finance/income-projection', { params: { period } });
};

// ========== Monthly Projection Endpoints ==========

export const getMonthlyProjections = (filters?: MonthlyProjectionFilters): Promise<AxiosResponse<MonthlyProjection[]>> => {
  return apiClient.get<MonthlyProjection[]>('/finance/monthly-projection', { params: filters });
};

export const getMonthlyProjection = (id: string): Promise<AxiosResponse<MonthlyProjection>> => {
  return apiClient.get<MonthlyProjection>(`/finance/monthly-projection/${id}`);
};

export const createMonthlyProjection = (data: CreateMonthlyProjectionDto): Promise<AxiosResponse<MonthlyProjection>> => {
  return apiClient.post<MonthlyProjection>('/finance/monthly-projection', data);
};

export const updateMonthlyProjection = (id: string, data: UpdateMonthlyProjectionDto): Promise<AxiosResponse<MonthlyProjection>> => {
  return apiClient.patch<MonthlyProjection>(`/finance/monthly-projection/${id}`, data);
};

export const duplicateMonthlyProjection = (id: string): Promise<AxiosResponse<MonthlyProjection>> => {
  return apiClient.post<MonthlyProjection>(`/finance/monthly-projection/${id}/duplicate`);
};

export const deleteMonthlyProjection = (id: string): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/finance/monthly-projection/${id}`);
};

export const updateSpendingPlan = (id: string, data: {
  variableExpensesAccountId?: string;
  spendingPlanPattern?: string;
  spendingDays?: string;
  variableExpenseDistribution?: string;
  variableExpenseWeeks?: number;
}): Promise<AxiosResponse<MonthlyProjection>> => {
  return apiClient.patch<MonthlyProjection>(`/finance/monthly-projection/${id}/spending-plan`, data);
};


