import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProjections, 
  createProjection, 
  updateProjection, 
  deleteProjection,
  syncProjections
} from '../services/financeService';
import { CreateProjectionDto, UpdateProjectionDto } from '../types/finance';
import { toast } from 'react-hot-toast';

export const useProjections = () => {
  return useQuery({
    queryKey: ['projections'],
    queryFn: async () => {
      const response = await getProjections();
      return response.data;
    },
  });
};

export const useCreateProjection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectionDto) => createProjection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projections'] });
    },
  });
};

export const useUpdateProjection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectionDto }) => 
      updateProjection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projections'] });
    },
  });
};

export const useDeleteProjection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProjection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projections'] });
    },
  });
};

export const useSyncProjections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => syncProjections(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['projections'] });
      toast.success(response.data.message || 'Sincronización completada.');
    },
    onError: (error: any) => {
      toast.error('Error al sincronizar proyecciones.');
      console.error(error);
    }
  });
};
