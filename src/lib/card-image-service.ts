// Comprehensive Card Image Service
// Integrates with multiple image sources since JustTCG doesn't provide images

export interface ImageSource {
  name: string;
  url: string;
  priority: number;
  gameId: string;
}

// Image sources for different games
const IMAGE_SOURCES: ImageSource[] = [
  // Pokemon
  {
    name: 'Pokemon TCG API',
    url: 'https://images.pokemontcg.io/{set}/{number}.png',
    priority: 1,
    gameId: 'pokemon'
  },
  {
    name: 'Pokemon.com',
    url: 'https://assets.pokemon.com/assets/cms2/img/cards/web/{set}/{number}.png',
    priority: 2,
    gameId: 'pokemon'
  },
  
  // Magic: The Gathering
  {
    name: 'Scryfall',
    url: 'https://api.scryfall.com/cards/named?fuzzy={name}&format=image',
    priority: 1,
    gameId: 'magic-the-gathering'
  },
  
  // One Piece
  {
    name: 'One Piece TCG Database',
    url: 'https://onepiecetcg.com/cards/{set}/{number}.jpg',
    priority: 1,
    gameId: 'one-piece-card-game'
  },
  
  // Yu-Gi-Oh!
  {
    name: 'Yu-Gi-Oh! Database',
    url: 'https://db.ygorganization.com/card/{name}',
    priority: 1,
    gameId: 'yugioh'
  }
];

// Generate a beautiful card placeholder
export const generateCardPlaceholder = (card: any, gameId: string): string => {
  // Create canvas for generated image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = 260;
  canvas.height = 360;
  
  // Background based on rarity
  const rarity = card.rarity?.toLowerCase() || 'common';
  let bgGradient;
  
  switch (rarity) {
    case 'rare':
    case 'super rare':
    case 'secret rare':
      bgGradient = ctx.createLinearGradient(0, 0, 0, 360);
      bgGradient.addColorStop(0, '#ffd700');
      bgGradient.addColorStop(1, '#ffed4e');
      break;
    case 'epic':
    case 'legendary':
      bgGradient = ctx.createLinearGradient(0, 0, 0, 360);
      bgGradient.addColorStop(0, '#ff6b6b');
      bgGradient.addColorStop(1, '#ee5a52');
      break;
    case 'mythic':
      bgGradient = ctx.createLinearGradient(0, 0, 0, 360);
      bgGradient.addColorStop(0, '#a855f7');
      bgGradient.addColorStop(1, '#7c3aed');
      break;
    default:
      bgGradient = ctx.createLinearGradient(0, 0, 0, 360);
      bgGradient.addColorStop(0, '#667eea');
      bgGradient.addColorStop(1, '#764ba2');
  }
  
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 260, 360);
  
  // Add card border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 15, 230, 330);
  
  // Add inner border
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(25, 25, 210, 310);
  
  // Add card name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(card.name || 'Card', 130, 60);
  
  // Add set info
  ctx.font = '12px Arial';
  ctx.fillText(`${card.set} #${card.number}`, 130, 90);
  
  // Add rarity badge
  const rarityText = card.rarity || 'Common';
  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = '#000000';
  ctx.fillRect(80, 100, 100, 25);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(rarityText, 130, 118);
  
  // Add game icon
  ctx.font = '48px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(getGameIcon(gameId), 130, 200);
  
  // Add price info
  if (card.variants && card.variants.length > 0) {
    const price = card.variants[0].price;
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`$${price.toFixed(2)}`, 130, 250);
  }
  
  // Add decorative elements
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(30 + i * 50, 280);
    ctx.lineTo(30 + i * 50, 340);
    ctx.stroke();
  }
  
  return canvas.toDataURL();
};

const getGameIcon = (gameId: string): string => {
  switch (gameId) {
    case 'pokemon': return '⚡';
    case 'magic-the-gathering': return '🔥';
    case 'one-piece-card-game': return '🏴‍☠️';
    case 'yugioh': return '🐉';
    case 'digimon-card-game': return '🦖';
    case 'union-arena': return '⚔️';
    case 'disney-lorcana': return '✨';
    case 'flesh-and-blood-tcg': return '⚔️';
    case 'age-of-sigmar': return '🛡️';
    case 'warhammer-40000': return '⚔️';
    default: return '🃏';
  }
};

// Try to fetch image from available sources
export const fetchCardImage = async (card: any, gameId: string): Promise<string> => {
  const sources = IMAGE_SOURCES.filter(source => source.gameId === gameId);
  
  for (const source of sources) {
    try {
      const url = source.url
        .replace('{name}', encodeURIComponent(card.name))
        .replace('{set}', card.set?.toLowerCase().replace(/ /g, '-') || '')
        .replace('{number}', card.number || '');
      
      const response = await fetch(url);
      if (response.ok) {
        return url;
      }
    } catch (error) {
      console.warn(`Failed to fetch image from ${source.name}:`, error);
    }
  }
  
  // Return generated placeholder
  return generateCardPlaceholder(card, gameId);
};

// Get immediate placeholder (synchronous)
export const getCardPlaceholder = (card: any, gameId: string): string => {
  return generateCardPlaceholder(card, gameId);
}; 