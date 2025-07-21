// API Service for ScanCollect Frontend
// Handles all CRUD operations for cards, categories, and achievements

import { supabase } from './supabase';

const API_BASE_URL = 'http://localhost:8082/api';

// Types
export interface Card {
  id: string;
  category_id: string;
  name: string;
  rarity: string;
  set_code: string;
  number: string;
  image_url: string;
  description: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  trigger_type: string;
  requirement: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  card_id: string;
  collected_at: string;
}

// API Response types
interface ApiResponse<T> {
  message: string;
  [key: string]: T | string;
}

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Get the current session (access token) from Supabase
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

// Cards API
export const cardsApi = {
  // Get all cards
  getAll: async (): Promise<Card[]> => {
    const response = await fetch(`${API_BASE_URL}/cards`);
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    const data: ApiResponse<Card[]> = await response.json();
    return data.cards as Card[];
  },

  // Get card by ID
  getById: async (id: string): Promise<Card> => {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`);
    if (!response.ok) {
      throw new Error('Card not found');
    }
    const data: ApiResponse<Card> = await response.json();
    return data.card as Card;
  },

  // Create new card
  create: async (card: Omit<Card, 'id' | 'created_at'>): Promise<Card> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/cards`, {
      method: 'POST',
      body: JSON.stringify(card),
    });
    if (!response.ok) {
      throw new Error('Failed to create card');
    }
    const data: ApiResponse<Card> = await response.json();
    return data.card as Card;
  },

  // Update card
  update: async (id: string, card: Partial<Card>): Promise<Card> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(card),
    });
    if (!response.ok) {
      throw new Error('Failed to update card');
    }
    const data: ApiResponse<Card> = await response.json();
    return data.card as Card;
  },

  // Delete card
  delete: async (id: string): Promise<void> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/cards/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete card');
    }
  },

  // Get cards by category
  getByCategory: async (categoryId: string): Promise<Card[]> => {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/cards`);
    if (!response.ok) {
      throw new Error('Failed to fetch cards for category');
    }
    const data: ApiResponse<Card[]> = await response.json();
    return data.cards as Card[];
  },
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: ApiResponse<Category[]> = await response.json();
    return data.categories as Category[];
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) {
      throw new Error('Category not found');
    }
    const data: ApiResponse<Category> = await response.json();
    return data.category as Category;
  },

  // Create new category
  create: async (category: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/categories`, {
      method: 'POST',
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    const data: ApiResponse<Category> = await response.json();
    return data.category as Category;
  },

  // Update category
  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    const data: ApiResponse<Category> = await response.json();
    return data.category as Category;
  },

  // Delete category
  delete: async (id: string): Promise<void> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
  },
};

// Achievements API
export const achievementsApi = {
  // Get all achievements
  getAll: async (): Promise<Achievement[]> => {
    const response = await fetch(`${API_BASE_URL}/achievements`);
    if (!response.ok) {
      throw new Error('Failed to fetch achievements');
    }
    const data: ApiResponse<Achievement[]> = await response.json();
    return data.achievements as Achievement[];
  },

  // Get achievement by ID
  getById: async (id: string): Promise<Achievement> => {
    const response = await fetch(`${API_BASE_URL}/achievements/${id}`);
    if (!response.ok) {
      throw new Error('Achievement not found');
    }
    const data: ApiResponse<Achievement> = await response.json();
    return data.achievement as Achievement;
  },

  // Create new achievement
  create: async (achievement: Omit<Achievement, 'id' | 'created_at'>): Promise<Achievement> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/achievements`, {
      method: 'POST',
      body: JSON.stringify(achievement),
    });
    if (!response.ok) {
      throw new Error('Failed to create achievement');
    }
    const data: ApiResponse<Achievement> = await response.json();
    return data.achievement as Achievement;
  },

  // Update achievement
  update: async (id: string, achievement: Partial<Achievement>): Promise<Achievement> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(achievement),
    });
    if (!response.ok) {
      throw new Error('Failed to update achievement');
    }
    const data: ApiResponse<Achievement> = await response.json();
    return data.achievement as Achievement;
  },

  // Delete achievement
  delete: async (id: string): Promise<void> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/achievements/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete achievement');
    }
  },

  // Get user achievements
  getUserAchievements: async (): Promise<UserAchievement[]> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/user/achievements`);
    if (!response.ok) {
      throw new Error('Failed to fetch user achievements');
    }
    const data: ApiResponse<UserAchievement[]> = await response.json();
    return data.user_achievements as UserAchievement[];
  },

  // Unlock achievement
  unlock: async (achievementId: string): Promise<UserAchievement> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/achievements/${achievementId}/unlock`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to unlock achievement');
    }
    const data: ApiResponse<UserAchievement> = await response.json();
    return data.user_achievement as UserAchievement;
  },
};

export const collectionsApi = {
  // Add card to user's collection
  create: async (collection: Omit<Collection, 'id' | 'collected_at'>): Promise<Collection> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/collections`, {
      method: 'POST',
      body: JSON.stringify(collection),
    });
    if (!response.ok) {
      throw new Error('Failed to add card to collection');
    }
    const data: ApiResponse<Collection> = await response.json();
    return data.collection as Collection;
  },
  // Remove card from user's collection by collection id
  delete: async (id: string): Promise<void> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/collections/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to remove card from collection');
    }
  },
  // Get collections by user_id
  getByUser: async (user_id: string): Promise<Collection[]> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/collections?user_id=${user_id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch collections for user');
    }
    const data: ApiResponse<Collection[]> = await response.json();
    return (data.collections || []) as Collection[];
  },
};

// Export all APIs as a single object for convenience
export const api = {
  cards: cardsApi,
  categories: categoriesApi,
  achievements: achievementsApi,
  collections: collectionsApi,
}; 