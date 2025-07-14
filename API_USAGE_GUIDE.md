# ScanCollect Frontend API Usage Guide

This guide explains how to use the CRUD APIs for cards, categories, and achievements in the ScanCollect frontend application.

## Overview

The frontend includes a comprehensive API service layer that provides easy-to-use interfaces for all CRUD operations. The APIs are built on top of the backend REST endpoints and include:

- **TypeScript interfaces** for all data types
- **React hooks** for easy integration with components
- **Error handling** and loading states
- **Authentication** support with JWT tokens

## API Structure

### Base Configuration
- **Base URL**: `http://localhost:8082/api`
- **Authentication**: JWT tokens stored in `localStorage` as `authToken`
- **Content-Type**: `application/json`

### Available APIs

1. **Cards API** (`api.cards`)
2. **Categories API** (`api.categories`)
3. **Achievements API** (`api.achievements`)

## Data Types

### Card
```typescript
interface Card {
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
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
}
```

### Achievement
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  trigger_type: string;
  requirement: string;
  created_at: string;
}
```

### UserAchievement
```typescript
interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}
```

## Direct API Usage

### Cards API

```typescript
import { api } from '../lib/api';

// Get all cards
const cards = await api.cards.getAll();

// Get card by ID
const card = await api.cards.getById('card-id');

// Create new card
const newCard = await api.cards.create({
  category_id: 'category-id',
  name: 'Card Name',
  rarity: 'Common',
  set_code: 'SET001',
  number: '001',
  image_url: 'https://example.com/image.jpg',
  description: 'Card description'
});

// Update card
const updatedCard = await api.cards.update('card-id', {
  name: 'Updated Card Name',
  rarity: 'Rare'
});

// Delete card
await api.cards.delete('card-id');

// Get cards by category
const categoryCards = await api.cards.getByCategory('category-id');
```

### Categories API

```typescript
import { api } from '../lib/api';

// Get all categories
const categories = await api.categories.getAll();

// Get category by ID
const category = await api.categories.getById('category-id');

// Create new category
const newCategory = await api.categories.create({
  name: 'Category Name',
  description: 'Category description',
  image_url: 'https://example.com/image.jpg'
});

// Update category
const updatedCategory = await api.categories.update('category-id', {
  name: 'Updated Category Name'
});

// Delete category
await api.categories.delete('category-id');
```

### Achievements API

```typescript
import { api } from '../lib/api';

// Get all achievements
const achievements = await api.achievements.getAll();

// Get achievement by ID
const achievement = await api.achievements.getById('achievement-id');

// Create new achievement
const newAchievement = await api.achievements.create({
  name: 'Achievement Name',
  description: 'Achievement description',
  icon_url: 'https://example.com/icon.jpg',
  trigger_type: 'card_count',
  requirement: '10'
});

// Update achievement
const updatedAchievement = await api.achievements.update('achievement-id', {
  name: 'Updated Achievement Name'
});

// Delete achievement
await api.achievements.delete('achievement-id');

// Get user achievements
const userAchievements = await api.achievements.getUserAchievements();

// Unlock achievement
const unlockedAchievement = await api.achievements.unlock('achievement-id');
```

## React Hooks Usage

The frontend provides React hooks for easy integration with components:

### Cards Hooks

```typescript
import { useCards, useCreateCard, useUpdateCard, useDeleteCard } from '../lib/hooks';

function CardsComponent() {
  // Get all cards with loading and error states
  const { data: cards, loading, error, refetch } = useCards();
  
  // Create card hook
  const { createCard, loading: createLoading, error: createError } = useCreateCard();
  
  // Update card hook
  const { updateCard, loading: updateLoading } = useUpdateCard();
  
  // Delete card hook
  const { deleteCard, loading: deleteLoading } = useDeleteCard();

  const handleCreateCard = async (cardData) => {
    try {
      await createCard(cardData);
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await deleteCard(id);
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {cards?.map(card => (
        <div key={card.id}>
          <h3>{card.name}</h3>
          <button onClick={() => handleDeleteCard(card.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Categories Hooks

```typescript
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../lib/hooks';

function CategoriesComponent() {
  const { data: categories, loading, error } = useCategories();
  const { createCategory, loading: createLoading } = useCreateCategory();
  const { updateCategory, loading: updateLoading } = useUpdateCategory();
  const { deleteCategory, loading: deleteLoading } = useDeleteCategory();

  // Use similar pattern as cards
}
```

### Achievements Hooks

```typescript
import { useAchievements, useUserAchievements, useUnlockAchievement } from '../lib/hooks';

function AchievementsComponent() {
  const { data: achievements, loading, error } = useAchievements();
  const { data: userAchievements } = useUserAchievements();
  const { unlockAchievement, loading: unlockLoading } = useUnlockAchievement();

  const handleUnlockAchievement = async (achievementId) => {
    try {
      await unlockAchievement(achievementId);
      // Handle success
    } catch (error) {
      console.error('Failed to unlock achievement:', error);
    }
  };
}
```

## Available Hooks

### Cards
- `useCards()` - Get all cards
- `useCard(id)` - Get specific card
- `useCardsByCategory(categoryId)` - Get cards by category
- `useCreateCard()` - Create new card
- `useUpdateCard()` - Update existing card
- `useDeleteCard()` - Delete card

### Categories
- `useCategories()` - Get all categories
- `useCategory(id)` - Get specific category
- `useCreateCategory()` - Create new category
- `useUpdateCategory()` - Update existing category
- `useDeleteCategory()` - Delete category

### Achievements
- `useAchievements()` - Get all achievements
- `useAchievement(id)` - Get specific achievement
- `useUserAchievements()` - Get user's achievements
- `useCreateAchievement()` - Create new achievement
- `useUpdateAchievement()` - Update existing achievement
- `useDeleteAchievement()` - Delete achievement
- `useUnlockAchievement()` - Unlock achievement for user

## Error Handling

All API calls include proper error handling:

```typescript
try {
  const result = await api.cards.create(cardData);
  // Handle success
} catch (error) {
  // Handle error
  console.error('API Error:', error.message);
}
```

## Authentication

The API automatically handles authentication by:

1. Reading the JWT token from `localStorage.authToken`
2. Adding the `Authorization: Bearer <token>` header to authenticated requests
3. Handling 401 responses appropriately

## Example Components

The frontend includes example components that demonstrate API usage:

1. **CardsList.tsx** - Shows how to display and delete cards
2. **CreateCardForm.tsx** - Shows how to create new cards with form validation

## Backend API Endpoints

The frontend APIs correspond to these backend endpoints:

### Cards
- `GET /api/cards` - Get all cards
- `GET /api/cards/:id` - Get card by ID
- `POST /api/cards` - Create card (authenticated)
- `PUT /api/cards/:id` - Update card (authenticated)
- `DELETE /api/cards/:id` - Delete card (authenticated)
- `GET /api/categories/:id/cards` - Get cards by category

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (authenticated)
- `PUT /api/categories/:id` - Update category (authenticated)
- `DELETE /api/categories/:id` - Delete category (authenticated)

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/:id` - Get achievement by ID
- `POST /api/achievements` - Create achievement (authenticated)
- `PUT /api/achievements/:id` - Update achievement (authenticated)
- `DELETE /api/achievements/:id` - Delete achievement (authenticated)
- `GET /api/user/achievements` - Get user achievements (authenticated)
- `POST /api/achievements/:id/unlock` - Unlock achievement (authenticated)

## Getting Started

1. Ensure the backend server is running on `http://localhost:8082`
2. Import the API functions or hooks in your components
3. Use the provided examples as templates for your own implementations

## Best Practices

1. **Use hooks for data fetching** - They provide loading states and error handling
2. **Handle errors gracefully** - Always wrap API calls in try-catch blocks
3. **Refresh data after mutations** - Use the `refetch` function from hooks
4. **Validate data before sending** - Ensure required fields are present
5. **Show loading states** - Use the loading states from hooks to improve UX 