import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { DashboardData, Analysis, Resume, SavedProject, Roadmap } from '../types';

// Dashboard
export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard');
      return res.data;
    },
  });
}

// Resumes
export function useResumes() {
  return useQuery<{ resumes: Resume[] }>({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await api.get('/resumes');
      return res.data;
    },
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Analysis
export function useAnalyses() {
  return useQuery<{ analyses: Analysis[] }>({
    queryKey: ['analyses'],
    queryFn: async () => {
      const res = await api.get('/analysis');
      return res.data;
    },
  });
}

export function useAnalysis(id: string) {
  return useQuery<{ analysis: Analysis }>({
    queryKey: ['analysis', id],
    queryFn: async () => {
      const res = await api.get(`/analysis/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useAnalyzeResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ resumeId, targetRole }: { resumeId: string; targetRole: string }) => {
      const res = await api.post('/analysis/analyze', { resumeId, targetRole });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Projects
export function useSavedProjects() {
  return useQuery<{ projects: SavedProject[] }>({
    queryKey: ['savedProjects'],
    queryFn: async () => {
      const res = await api.get('/projects/saved');
      return res.data;
    },
  });
}

export function useSaveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await api.post('/projects/save', { projectId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const res = await api.patch(`/projects/${id}/status`, { status, notes });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
    },
  });
}

// Roadmaps
export function useRoadmaps() {
  return useQuery<{ roadmaps: Roadmap[] }>({
    queryKey: ['roadmaps'],
    queryFn: async () => {
      const res = await api.get('/users/roadmaps');
      return res.data;
    },
  });
}
