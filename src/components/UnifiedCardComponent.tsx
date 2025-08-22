import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaMinus, FaDollarSign } from 'react-icons/fa';
import { getCardPlaceholder } from '../lib/card-image-service';

// Unified card interface that can handle both JustTCG and API TCG cards
interface UnifiedCard {
  id: string;
  name: string;
  set?: string;
  set_code?: string;
  number: string;
  rarity: string;
  image_url?: string;
  description?: string;
  game?: string;
  tcgplayerId?: string;
  variants?: any[];
  // API TCG specific fields
  price?: number;
  condition?: string;
  printing?: string;
  // Image fields
  images?: {
    small?: string;
    large?: string;
  };
}

interface UnifiedCardProps {
  card: UnifiedCard;
  onClick?: () => void;
  isJustTCG?: boolean;
}

export default function UnifiedCardComponent({ card, onClick, isJustTCG = false }: UnifiedCardProps) {
  const [cardImage, setCardImage] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Helper function to safely extract string value from potentially complex objects
  const safeStringValue = (value: any, fallback: string = 'Unknown'): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (value && typeof value === 'object') {
      // If it's an object, try to extract a meaningful value
      if (value.name && typeof value.name === 'string') return value.name;
      if (value.value && typeof value.value === 'string') return value.value;
      if (value.label && typeof value.label === 'string') return value.label;
      // If it's an array, take the first item
      if (Array.isArray(value) && value.length > 0) return safeStringValue(value[0], fallback);
    }
    return value ? String(value) : fallback;
  };

  // Generate card image on component mount
  useEffect(() => {
    const generateImage = async () => {
      setImageLoading(true);
      setImageError(false);
      
      // For API TCG, try to use real images first
      if (!isJustTCG) {
        // Check for API TCG image sources
        if (card.images && (card.images.small || card.images.large)) {
          const imageUrl = card.images.large || card.images.small;
          if (imageUrl) {
            try {
              // Test if image loads successfully
              const img = new Image();
              img.onload = () => {
                setCardImage(imageUrl);
                setImageLoading(false);
              };
              img.onerror = () => {
                setImageError(true);
                setImageLoading(false);
                // Fallback to generated placeholder
                const gameId = card.game || 'pokemon';
                const image = getCardPlaceholder(card, gameId);
                setCardImage(image);
              };
              img.src = imageUrl;
              return;
            } catch (error) {
              console.warn('Failed to load image:', imageUrl, error);
            }
          }
        }
        if (card.image_url) {
          try {
            // Test if image loads successfully
            const img = new Image();
            img.onload = () => {
              setCardImage(card.image_url!);
              setImageLoading(false);
            };
            img.onerror = () => {
              setImageError(true);
              setImageLoading(false);
              // Fallback to generated placeholder
              const gameId = card.game || 'pokemon';
              const image = getCardPlaceholder(card, gameId);
              setCardImage(image);
            };
            img.src = card.image_url;
            return;
          } catch (error) {
            console.warn('Failed to load image:', card.image_url, error);
          }
        }
      }
      
      // Fallback to generated placeholder
      const gameId = card.game || 'pokemon';
      const image = getCardPlaceholder(card, gameId);
      setCardImage(image);
      setImageLoading(false);
    };
    
    generateImage();
  }, [card, isJustTCG]);

  // Helper functions for JustTCG cards
  const getLowestPrice = (): number => {
    if (!isJustTCG || !card.variants || card.variants.length === 0) {
      return card.price || 0;
    }
    return Math.min(...card.variants.map((v: any) => v.price));
  };

  const getPriceRange = (): { min: number; max: number } => {
    if (!isJustTCG || !card.variants || card.variants.length === 0) {
      const price = card.price || 0;
      return { min: price, max: price };
    }
    const prices = card.variants.map((v: any) => v.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getPriceChangeIndicator = (): { direction: 'up' | 'down' | 'neutral'; percentage: number } => {
    if (!isJustTCG || !card.variants || card.variants.length === 0) {
      return { direction: 'neutral', percentage: 0 };
    }

    const change24h = card.variants[0]?.priceChange24hr || 0;
    
    if (change24h > 0) return { direction: 'up', percentage: change24h };
    if (change24h < 0) return { direction: 'down', percentage: Math.abs(change24h) };
    return { direction: 'neutral', percentage: 0 };
  };

  const getVolatilityIndicator = (): { level: 'low' | 'medium' | 'high'; value: number } => {
    if (!isJustTCG || !card.variants || card.variants.length === 0) {
      return { level: 'low', value: 0 };
    }

    const variant = card.variants[0];
    const volatility = variant?.covPrice7d || 0;
    
    if (volatility < 0.1) return { level: 'low', value: volatility };
    if (volatility < 0.3) return { level: 'medium', value: volatility };
    return { level: 'high', value: volatility };
  };

  const getTrendIndicator = (): { direction: 'up' | 'down' | 'stable'; slope: number } => {
    if (!isJustTCG || !card.variants || card.variants.length === 0) {
      return { direction: 'stable', slope: 0 };
    }

    const variant = card.variants[0];
    const slope = variant?.trendSlope7d || 0;
    
    if (slope > 0.01) return { direction: 'up', slope };
    if (slope < -0.01) return { direction: 'down', slope };
    return { direction: 'stable', slope };
  };

  const getPricePosition = (): number => {
    if (!isJustTCG || !card.variants || card.variants.length === 0) {
      return 0.5;
    }

    return card.variants[0]?.priceRelativeTo30dRange || 0.5;
  };

  const getPriceChangeIcon = () => {
    const priceChange = getPriceChangeIndicator();
    switch (priceChange.direction) {
      case 'up':
        return <FaArrowUp className="text-green-500" />;
      case 'down':
        return <FaArrowDown className="text-red-500" />;
      default:
        return <FaMinus className="text-gray-500" />;
    }
  };

  const getPriceChangeColor = () => {
    const priceChange = getPriceChangeIndicator();
    switch (priceChange.direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const lowestPrice = getLowestPrice();
  const priceRange = getPriceRange();
  const priceChange = getPriceChangeIndicator();
  const volatility = getVolatilityIndicator();
  const trend = getTrendIndicator();
  const pricePosition = getPricePosition();

  return (
    <motion.div
      className="relative overflow-hidden shadow-lg rounded-[28px] flex items-end"
      style={{ 
        width: 260, 
        height: 360, 
        margin: "auto", 
        cursor: "pointer", 
        border: "2px solid #c4b5fd", 
        background: "#eee" 
      }}
      whileHover={{
        scale: 1.12,
        rotate: -2,
        boxShadow: "0 15px 35px rgba(147, 51, 234, 0.15), 0 5px 15px rgba(168, 85, 247, 0.10)",
        zIndex: 10,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 15 }}
      onClick={onClick}
    >
      {/* Card Image as background */}
      {imageLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 z-1 rounded-[28px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : cardImage ? (
        <img
          src={cardImage}
          alt={safeStringValue(card.name, 'Card image')}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 28,
            zIndex: 1,
          }}
          onError={() => {
            setImageError(true);
            // Fallback to generated placeholder
            const gameId = card.game || 'pokemon';
            const image = getCardPlaceholder(card, gameId);
            setCardImage(image);
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 z-1 rounded-[28px]">
          <div className="text-gray-400 text-4xl">🃏</div>
        </div>
      )}

      {/* Gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "120px",
          background: "linear-gradient(0deg, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.0) 100%)",
          zIndex: 2,
        }}
      />

      {/* Card Info overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          padding: "14px 14px 10px 14px",
          color: "#fff",
          fontWeight: 500,
          fontSize: "1.05rem",
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Card Name */}
        <div style={{ 
          fontWeight: 700, 
          fontSize: "1.12rem", 
          lineHeight: 1.2, 
          marginBottom: 4, 
          overflow: "hidden", 
          textOverflow: "ellipsis", 
          whiteSpace: "nowrap", 
          width: "100%", 
          maxWidth: "100%" 
        }}>
          {safeStringValue(card.name, 'Unknown Card')}
        </div>

        {/* Card Details */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 10, 
          fontSize: "0.98rem", 
          flexWrap: "nowrap", 
          minWidth: 0,
          marginBottom: 4
        }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Rarity:</span>
          <span style={{ 
            background: "rgba(0,0,0,0.7)", 
            color: "#fff", 
            borderRadius: 12, 
            padding: "2px 10px", 
            fontWeight: 700, 
            fontSize: "0.98rem", 
            letterSpacing: 0.5, 
            maxWidth: 110, 
            overflow: "hidden", 
            textOverflow: "ellipsis", 
            whiteSpace: "nowrap", 
            display: "inline-block" 
          }}>
            {safeStringValue(card.rarity, 'Unknown')}
          </span>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Set:</span>
          <span style={{ 
            background: "rgba(0,0,0,0.7)", 
            color: "#fff", 
            borderRadius: 12, 
            padding: "2px 10px", 
            fontWeight: 700, 
            fontSize: "0.98rem", 
            letterSpacing: 0.5, 
            maxWidth: 110, 
            overflow: "hidden", 
            textOverflow: "ellipsis", 
            whiteSpace: "nowrap", 
            display: "inline-block" 
          }}>
{safeStringValue(card.set || card.set_code, 'Unknown Set')}{card.number ? ` #${safeStringValue(card.number, '')}` : ""}
          </span>
        </div>

        {/* Pricing Information */}
        {isJustTCG && (
          <>
            {/* Price Range */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              fontSize: "0.95rem",
              marginBottom: 2
            }}>
              <FaDollarSign className="text-yellow-400" />
              <span style={{ fontWeight: 600 }}>
                {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
              </span>
            </div>

            {/* Price Change */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 6, 
              fontSize: "0.9rem",
              marginBottom: 2
            }}>
              {getPriceChangeIcon()}
              <span className={getPriceChangeColor()} style={{ fontWeight: 600 }}>
                {priceChange.percentage > 0 ? `${priceChange.percentage.toFixed(1)}%` : 'No change'}
              </span>
            </div>

            {/* Market Indicators */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              fontSize: "0.85rem",
              marginTop: 4
            }}>
              {/* Volatility */}
              <span style={{ 
                background: volatility.level === 'high' ? 'rgba(239,68,68,0.8)' : 
                           volatility.level === 'medium' ? 'rgba(245,158,11,0.8)' : 
                           'rgba(34,197,94,0.8)', 
                color: "#fff", 
                borderRadius: 8, 
                padding: "2px 6px", 
                fontWeight: 600, 
                fontSize: "0.8rem" 
              }}>
                Vol: {volatility.level}
              </span>

              {/* Trend */}
              <span style={{ 
                background: trend.direction === 'up' ? 'rgba(34,197,94,0.8)' : 
                           trend.direction === 'down' ? 'rgba(239,68,68,0.8)' : 
                           'rgba(107,114,128,0.8)', 
                color: "#fff", 
                borderRadius: 8, 
                padding: "2px 6px", 
                fontWeight: 600, 
                fontSize: "0.8rem" 
              }}>
                {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
              </span>

              {/* Price Position Bar */}
              <div style={{ 
                flex: 1, 
                height: 4, 
                background: "rgba(255,255,255,0.3)", 
                borderRadius: 2,
                position: "relative"
              }}>
                <div style={{ 
                  position: "absolute",
                  left: `${pricePosition * 100}%`,
                  top: 0,
                  width: 2,
                  height: "100%",
                  background: "#fff",
                  borderRadius: 1
                }} />
              </div>
            </div>
          </>
        )}

        {/* Simple Price for API TCG */}
        {!isJustTCG && card.price && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            fontSize: "0.95rem",
            marginTop: 4
          }}>
            <FaDollarSign className="text-yellow-400" />
            <span style={{ fontWeight: 600 }}>
              {formatPrice(card.price)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
} 