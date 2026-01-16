import { useState, useEffect, useCallback } from 'react';
import { Subject } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { subjectsApi } from '@/lib/api';

export function useSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load subjects from MongoDB via API
  const loadSubjects = useCallback(async () => {
    if (!user) {
      setSubjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await subjectsApi.getAll();
    
    if (data && !error) {
      setSubjects(data);
    } else {
      console.error('Failed to load subjects:', error);
      setSubjects([]);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const addSubject = async (name: string): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error } = await subjectsApi.create(name);
      
      if (error || !data) {
        return { error: new Error(error || 'Failed to create subject') };
      }

      // Add to local state
      setSubjects(prev => [...prev, data]);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deleteSubject = async (id: string): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await subjectsApi.delete(id);
      
      if (error) {
        return { error: new Error(error) };
      }

      // Remove from local state
      setSubjects(prev => prev.filter(s => s.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    subjects,
    isLoading,
    addSubject,
    deleteSubject,
    refetch: loadSubjects,
  };
}
