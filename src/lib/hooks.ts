// React hooks for API operations
import { useState, useEffect, useCallback } from 'react';
import { api, Card, Category, Achievement, UserAchievement, Collection } from './api';
import { supabase } from './supabase';

// Generic hook for CRUD operations
function useApiOperation<T>(
  operation: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [operation]);

  useEffect(() => {
    execute();
  }, dependencies);

  return { data, loading, error, refetch: execute };
}

// Cards hooks
export const useCards = () => {
  return useApiOperation(() => api.cards.getAll());
};

export const useCard = (id: string) => {
  return useApiOperation(() => api.cards.getById(id), [id]);
};

export const useCardsByCategory = (categoryId: string) => {
  return useApiOperation(() => api.cards.getByCategory(categoryId), [categoryId]);
};

export const useCreateCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCard = useCallback(async (card: Omit<Card, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.cards.create(card);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCard, loading, error };
};

export const useUpdateCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCard = useCallback(async (id: string, card: Partial<Card>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.cards.update(id, card);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateCard, loading, error };
};

export const useDeleteCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCard = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.cards.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete card');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteCard, loading, error };
};

// Categories hooks
export const useCategories = () => {
  return useApiOperation(() => api.categories.getAll());
};

export const useCategory = (id: string) => {
  return useApiOperation(() => api.categories.getById(id), [id]);
};

export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = useCallback(async (category: Omit<Category, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.categories.create(category);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCategory, loading, error };
};

export const useUpdateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCategory = useCallback(async (id: string, category: Partial<Category>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.categories.update(id, category);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateCategory, loading, error };
};

export const useDeleteCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCategory = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.categories.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteCategory, loading, error };
};

// Achievements hooks
export const useAchievements = () => {
  return useApiOperation(() => api.achievements.getAll());
};

export const useAchievement = (id: string) => {
  return useApiOperation(() => api.achievements.getById(id), [id]);
};

export const useUserAchievements = () => {
  return useApiOperation(() => api.achievements.getUserAchievements());
};

export const useCreateAchievement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAchievement = useCallback(async (achievement: Omit<Achievement, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.achievements.create(achievement);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create achievement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createAchievement, loading, error };
};

export const useUpdateAchievement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAchievement = useCallback(async (id: string, achievement: Partial<Achievement>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.achievements.update(id, achievement);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update achievement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateAchievement, loading, error };
};

export const useDeleteAchievement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAchievement = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.achievements.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete achievement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteAchievement, loading, error };
};

export const useUnlockAchievement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlockAchievement = useCallback(async (achievementId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.achievements.unlock(achievementId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock achievement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { unlockAchievement, loading, error };
};

// Collections hooks
export const useCreateCollection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCollection = useCallback(async (collection: { user_id: string; card_id: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.collections.create(collection);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add card to collection');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCollection, loading, error };
};

export const useUserCollections = () => {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) {
          setCollections([]);
          setLoading(false);
          return;
        }
        const result = await api.collections.getByUser(userId);
        setCollections(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collections');
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  return { collections, loading, error };
}; 