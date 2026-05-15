export interface SavingsGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  allocatedPercentage: number;
  currentAmount: number;
  progress: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  deadline?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoalsResponse {
  totalSaved: number;
  goals: SavingsGoal[];
}

export interface SavingsSummary {
  totalSaved: number;
  totalAllocatedPercentage: number;
  availablePercentage: number;
  goalCount: number;
}

export type CreateSavingsGoalDto = {
  name: string;
  description?: string;
  targetAmount: number;
  allocatedPercentage: number;
  deadline?: string;
};

export type UpdateSavingsGoalDto = Partial<CreateSavingsGoalDto>;
