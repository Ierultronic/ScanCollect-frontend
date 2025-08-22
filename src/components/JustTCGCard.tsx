import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { JustTCGCard, justtcgApi } from '../lib/justtcg-api';
import { FaArrowUp, FaArrowDown, FaMinus, FaDollarSign } from 'react-icons/fa';
import { getCardPlaceholder } from '../lib/card-image-service';

interface JustTCGCardProps {
  card: JustTCGCard;
  onClick?: () => void;
}

export default function JustTCGCardComponent({ card, onClick }: JustTCGCardProps) {
  const [cardImage, setCardImage] = useState<string>('');
  const lowestPrice = justtcgApi.getLowestPrice(card);
  const priceRange = justtcgApi.getPriceRange(card);
  const priceChange = justtcgApi.getPriceChangeIndicator(card);
  const volatility = justtcgApi.getVolatilityIndicator(card);
  const trend = justtcgApi.getTrendIndicator(card);
  const pricePosition = justtcgApi.getPricePosition(card);

  // Generate card image on component mount
  useEffect(() => {
    const generateImage = () => {
      const image = getCardPlaceholder(card, card.game);
      setCardImage(image);
    };
    
    generateImage();
  }, [card]);

  const getPriceChangeIcon = () => {
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
    switch (priceChange.direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

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
      {cardImage ? (
        <img
          src={cardImage}
          alt={card.name}
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
          height: "120px", // Increased height for pricing info
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
          {card.name}
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
            {card.rarity}
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
            {card.set}{card.number ? ` #${card.number}` : ""}
          </span>
        </div>

        {/* Pricing Information */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8, 
          fontSize: "0.9rem",
          marginTop: 2
        }}>
          <FaDollarSign className="text-yellow-400" />
          <span style={{ fontWeight: 600, color: "#fbbf24" }}>
            {justtcgApi.formatPrice(lowestPrice)}
          </span>
          
          {/* Price Change Indicator */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 4,
            marginLeft: "auto"
          }}>
            {getPriceChangeIcon()}
            <span className={getPriceChangeColor()} style={{ fontSize: "0.8rem", fontWeight: 600 }}>
              {priceChange.percentage > 0 ? `${priceChange.percentage.toFixed(1)}%` : ''}
            </span>
          </div>
        </div>

                  {/* Enhanced Price Information */}
          <div style={{ 
            fontSize: "0.75rem", 
            color: "#d1d5db",
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1
          }}>
            {/* Price Range */}
            {priceRange.min !== priceRange.max && (
              <div>Range: {justtcgApi.formatPrice(priceRange.min)} - {justtcgApi.formatPrice(priceRange.max)}</div>
            )}
            
            {/* 30-day average */}
            {card.variants[0]?.avgPrice30d && (
              <div>30d Avg: {justtcgApi.formatPrice(card.variants[0].avgPrice30d)}</div>
            )}
            
            {/* Market indicators */}
            <div style={{ display: "flex", gap: 8, fontSize: "0.7rem" }}>
              <span style={{ 
                color: volatility.level === 'high' ? '#ef4444' : 
                       volatility.level === 'medium' ? '#f59e0b' : '#10b981'
              }}>
                Vol: {volatility.level}
              </span>
              <span style={{ 
                color: trend.direction === 'up' ? '#10b981' : 
                       trend.direction === 'down' ? '#ef4444' : '#6b7280'
              }}>
                Trend: {trend.direction}
              </span>
            </div>
            
            {/* Price position indicator */}
            <div style={{ 
              width: "100%", 
              height: 2, 
              background: "rgba(255,255,255,0.2)", 
              borderRadius: 1,
              marginTop: 2
            }}>
              <div style={{ 
                width: `${pricePosition * 100}%`, 
                height: "100%", 
                background: pricePosition > 0.7 ? "#ef4444" : 
                           pricePosition < 0.3 ? "#10b981" : "#f59e0b",
                borderRadius: 1
              }} />
            </div>
          </div>
      </div>
    </motion.div>
  );
} 