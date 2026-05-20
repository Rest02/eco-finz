import { useQuery } from '@tanstack/react-query';
import { getIncomeProjection } from '../services/financeService';

export const useIncomeProjection = (period: 'current' | '3m' | '6m') => {
  return useQuery({
    queryKey: ['income-projection', period],
    queryFn: async () => {
      const response = await getIncomeProjection(period);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
