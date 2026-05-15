import apiClient from '@/lib/apiClient';
import { AxiosResponse } from 'axios';
import {
  SavingsGoal,
  SavingsGoalsResponse,
  SavingsSummary,
  CreateSavingsGoalDto,
  UpdateSavingsGoalDto,
} from '../types/savings';

export const getSavingsGoals = (): Promise<
  AxiosResponse<SavingsGoalsResponse>
> => {
  return apiClient.get<SavingsGoalsResponse>('/finance/savings-goals');
};

export const getSavingsSummary = (): Promise<
  AxiosResponse<SavingsSummary>
> => {
  return apiClient.get<SavingsSummary>('/finance/savings-goals/summary');
};

export const getSavingsGoal = (
  id: string,
): Promise<AxiosResponse<SavingsGoal>> => {
  return apiClient.get<SavingsGoal>(`/finance/savings-goals/${id}`);
};

export const createSavingsGoal = (
  data: CreateSavingsGoalDto,
): Promise<AxiosResponse<SavingsGoal>> => {
  return apiClient.post<SavingsGoal>('/finance/savings-goals', data);
};

export const updateSavingsGoal = (
  id: string,
  data: UpdateSavingsGoalDto,
): Promise<AxiosResponse<SavingsGoal>> => {
  return apiClient.patch<SavingsGoal>(`/finance/savings-goals/${id}`, data);
};

export const deleteSavingsGoal = (
  id: string,
): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/finance/savings-goals/${id}`);
};
