// JustTCG API Service for real-time card data and pricing
// https://justtcg.com/docs
// Using backend proxy to avoid CORS issues

const BACKEND_BASE_URL = 'http://localhost:8082/api';
const API_KEY = process.env.NEXT_PUBLIC_JUST_TCG_API_KEY || '';

// Mapping from your category names to JustTCG game IDs
const GAME_ID_MAPPING: Record<string, string> = {
  'one-piece': 'one-piece-card-game',
  'pokemon': 'pokemon',
  'magic': 'magic-the-gathering',
  'yugioh': 'yugioh',
  'digimon': 'digimon-card-game',
  'union-arena': 'union-arena',
  'disney-lorcana': 'disney-lorcana',
  'flesh-and-blood': 'flesh-and-blood-tcg',
  'age-of-sigmar': 'age-of-sigmar',
  'warhammer-40000': 'warhammer-40000',
  // Add more mappings as needed
};

// Types based on JustTCG API documentation
export interface JustTCGCard {
  id: string;
  name: string;
  game: string;
  set: string;
  number: string;
  tcgplayerId: string;
  rarity: string;
  details?: any;
  variants: JustTCGVariant[];
}

export interface JustTCGVariant {
  id: string;
  condition: string;
  printing: string;
  price: number;
  lastUpdated: number;
  priceChange24hr: number;
  priceChange7d: number;
  avgPrice: number;
  minPrice7d: number;
  maxPrice7d: number;
  priceChange30d: number;
  avgPrice30d: number;
  minPrice30d: number;
  maxPrice30d: number;
  priceHistory: Array<{p: number, t: number}>;
  priceHistory30d: Array<{p: number, t: number}>;
  stddevPopPrice7d: number;
  covPrice7d: number;
  iqrPrice7d: number;
  trendSlope7d: number;
  priceChangesCount7d: number;
  stddevPopPrice30d: number;
  covPrice30d: number;
  iqrPrice30d: number;
  trendSlope30d: number;
  priceChangesCount30d: number;
  priceRelativeTo30dRange: number;
  minPrice90d: number;
  maxPrice90d: number;
  minPrice1y: number;
  maxPrice1y: number;
  minPriceAllTime: number;
  minPriceAllTimeDate: string;
  maxPriceAllTime: number;
  maxPriceAllTimeDate: string;
}

export interface JustTCGGame {
  id: string;
  name: string;
  game_id: string;
  cards_count: number;
  sets_count: number;
}

export interface JustTCGSet {
  id: string;
  name: string;
  game_id: string;
  game: string;
  cards_count: number;
}

// Helper function for backend proxy requests
const makeBackendRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BACKEND_BASE_URL}${endpoint}`;
  
  // Debug logging
  console.log('Backend Proxy Request:', {
    url,
    method: options.method || 'GET'
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log('Backend Proxy Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend Proxy Error Response:', errorText);
      
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        // If not JSON, use the text as is
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Backend Proxy Success:', data);
    return data;
  } catch (error) {
    console.error('Backend Proxy Request Failed:', error);
    throw error;
  }
};

// JustTCG API service
export const justtcgApi = {
  // Check if backend is available (API key is handled server-side)
  isConfigured: (): boolean => {
    return true; // Backend handles API key validation
  },

  // Convert category name to JustTCG game ID
  getGameId: (categoryName: string): string => {
    const normalizedName = categoryName.toLowerCase().replace(/ /g, '-');
    return GAME_ID_MAPPING[normalizedName] || normalizedName;
  },

  // Get all available games
  getGames: async (): Promise<JustTCGGame[]> => {
    const response = await makeBackendRequest('/justtcg/games');
    return response.data || [];
  },

  // Get sets for a specific game
  getSets: async (gameId: string): Promise<JustTCGSet[]> => {
    const response = await makeBackendRequest(`/justtcg/sets?game=${gameId}`);
    return response.data || [];
  },

  // Search cards with optional filters
  searchCards: async (params: {
    game?: string;
    set?: string;
    name?: string;
    limit?: number;
    offset?: number;
    orderBy?: 'price' | '24h' | '7d' | '30d';
    order?: 'asc' | 'desc';
  }): Promise<JustTCGCard[]> => {
    const searchParams = new URLSearchParams();
    
    if (params.game) searchParams.append('game', params.game);
    if (params.set) searchParams.append('set', params.set);
    if (params.name) searchParams.append('name', params.name);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());
    if (params.orderBy) searchParams.append('orderBy', params.orderBy);
    if (params.order) searchParams.append('order', params.order);

    const response = await makeBackendRequest(`/justtcg/cards?${searchParams.toString()}`);
    return response.data || [];
  },

  // Get specific card by TCGPlayer ID
  getCardByTCGPlayerId: async (tcgplayerId: string): Promise<JustTCGCard | null> => {
    try {
      const response = await makeBackendRequest(`/justtcg/cards?tcgplayerId=${tcgplayerId}`);
      return response.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching card by TCGPlayer ID:', error);
      return null;
    }
  },

  // Batch lookup multiple cards
  getBatchCards: async (requests: Array<{
    tcgplayerId: string;
    condition?: string;
    printing?: string;
  }>): Promise<JustTCGCard[]> => {
    const response = await makeBackendRequest('/justtcg/cards/batch', {
      method: 'POST',
      body: JSON.stringify(requests),
    });
    return response.data || [];
  },

  // Get lowest price for a card
  getLowestPrice: (card: JustTCGCard): number => {
    if (!card.variants || card.variants.length === 0) return 0;
    return Math.min(...card.variants.map(v => v.price));
  },

  // Get price range for a card
  getPriceRange: (card: JustTCGCard): { min: number; max: number } => {
    if (!card.variants || card.variants.length === 0) return { min: 0, max: 0 };
    const prices = card.variants.map(v => v.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  },

  // Format price for display
  formatPrice: (price: number): string => {
    if (price === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  },

  // Get price change indicator
  getPriceChangeIndicator: (card: JustTCGCard): { direction: 'up' | 'down' | 'neutral'; percentage: number } => {
    if (!card.variants || card.variants.length === 0) {
      return { direction: 'neutral', percentage: 0 };
    }

    // Use the first variant's 24h change as representative
    const change24h = card.variants[0].priceChange24hr;
    
    if (change24h > 0) return { direction: 'up', percentage: change24h };
    if (change24h < 0) return { direction: 'down', percentage: Math.abs(change24h) };
    return { direction: 'neutral', percentage: 0 };
  },

  // Get market volatility indicator
  getVolatilityIndicator: (card: JustTCGCard): { level: 'low' | 'medium' | 'high'; value: number } => {
    if (!card.variants || card.variants.length === 0) {
      return { level: 'low', value: 0 };
    }

    const variant = card.variants[0];
    const volatility = variant.covPrice7d || 0; // Coefficient of variation
    
    if (volatility < 0.1) return { level: 'low', value: volatility };
    if (volatility < 0.3) return { level: 'medium', value: volatility };
    return { level: 'high', value: volatility };
  },

  // Get trend indicator
  getTrendIndicator: (card: JustTCGCard): { direction: 'up' | 'down' | 'stable'; slope: number } => {
    if (!card.variants || card.variants.length === 0) {
      return { direction: 'stable', slope: 0 };
    }

    const variant = card.variants[0];
    const slope = variant.trendSlope7d || 0;
    
    if (slope > 0.01) return { direction: 'up', slope };
    if (slope < -0.01) return { direction: 'down', slope };
    return { direction: 'stable', slope };
  },

  // Get price position relative to 30-day range
  getPricePosition: (card: JustTCGCard): number => {
    if (!card.variants || card.variants.length === 0) {
      return 0.5;
    }

    return card.variants[0].priceRelativeTo30dRange || 0.5;
  },
};

// Fallback data when JustTCG API is not available
export const fallbackCards = [
  {
    id: 'fallback-1',
    name: 'Sample Card',
    game: 'pokemon',
    set: 'Base Set',
    number: '001',
    tcgplayerId: '12345',
    rarity: 'Common',
    variants: [
      {
        id: 'variant-1',
        condition: 'Near Mint',
        printing: 'Normal',
        price: 1.99,
        lastUpdated: Date.now() / 1000,
        priceChange24hr: 0,
        priceChange7d: 0,
        avgPrice: 1.99,
        minPrice7d: 1.99,
        maxPrice7d: 1.99,
        priceChange30d: 0,
        avgPrice30d: 1.99,
        minPrice30d: 1.99,
        maxPrice30d: 1.99,
        priceHistory: [{p: 1.99, t: Date.now() / 1000}],
        priceHistory30d: [{p: 1.99, t: Date.now() / 1000}],
        stddevPopPrice7d: 0,
        covPrice7d: 0,
        iqrPrice7d: 0,
        trendSlope7d: 0,
        priceChangesCount7d: 0,
        stddevPopPrice30d: 0,
        covPrice30d: 0,
        iqrPrice30d: 0,
        trendSlope30d: 0,
        priceChangesCount30d: 0,
        priceRelativeTo30dRange: 0.5,
        minPrice90d: 1.99,
        maxPrice90d: 1.99,
        minPrice1y: 1.99,
        maxPrice1y: 1.99,
        minPriceAllTime: 1.99,
        minPriceAllTimeDate: new Date().toISOString(),
        maxPriceAllTime: 1.99,
        maxPriceAllTimeDate: new Date().toISOString(),
      }
    ]
  }
]; 