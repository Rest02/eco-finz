// ========== Enums ==========

export type AccountType = "BANCO" | "EFECTIVO" | "TARJETA_CREDITO" | "BILLETERA_DIGITAL";
export type TransactionType = "INGRESO" | "EGRESO" | "AHORRO" | "INVERSION";

// ========== Main Entities ==========

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  userId: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string; // ISO 8601 string
  accountId: string;
  categoryId: string;
  userId: string;
  category?: Category;
  account?: Account;
  budgetId?: string;
  relatedTransactionId?: string;
  isInflow: boolean;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  userId: string;
}

// ========== Data Transfer Objects (DTOs) ==========

// --- Account DTOs ---
export type CreateAccountDto = Omit<Account, "id" | "userId">;
export type UpdateAccountDto = Partial<Omit<Account, "id" | "userId" | "balance">>;

// --- Category DTOs ---
export type CreateCategoryDto = Omit<Category, "id" | "userId">;
export type UpdateCategoryDto = Partial<Omit<Category, "id" | "userId">>;

// --- Transaction DTOs ---
export type CreateTransactionDto = Omit<Transaction, "id" | "userId" | "category" | "account" | "budgetId" | "relatedTransactionId" | "isInflow"> & {
  budgetId?: string;
  destinationAccountId?: string;
};
export type UpdateTransactionDto = Partial<CreateTransactionDto>;

// --- Budget DTOs ---
export type CreateBudgetDto = Omit<Budget, "id" | "userId">;
export type UpdateBudgetDto = Partial<Omit<Budget, "id" | "userId">>;

// ========== API Responses ==========

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export interface SummaryCategory {
  categoryId: string;
  categoryName: string;
  budgeted: number;
  spent: number;
  remaining: number;
  type?: TransactionType; // Added purely for frontend convenience if needed
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  balance: number;
  categorySummaries: SummaryCategory[];
}
