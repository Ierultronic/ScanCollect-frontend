"use client"

import { useEffect, useState } from "react"
import { fetchCards } from "@/app/lib/fetchCards"
import * as motion from "motion/react-client"


interface CardType {
  id: string
  name: string
  image_url: string
}

export function ScrollCards() {
  const [cards, setCards] = useState<CardType[]>([])

  useEffect(() => {
    fetchCards().then(setCards).catch(console.error)
  }, [])

  return (
    <div style={horizontalContainer}>
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  )
}

function Card({ card }: { card: CardType }) {
  // Check if image_url is an emoji (doesn't start with http/https)
  const isEmoji = !card.image_url.startsWith('http')
  
  return (
    <motion.div
      style={{
        background: 'none',
        padding: 4,
        borderRadius: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 158,
        height: 218,
        position: 'relative',
      }}
      whileHover={{
        scale: 1.12,
        rotate: -2,
        boxShadow: "0 15px 35px rgba(147, 51, 234, 0.15), 0 5px 15px rgba(168, 85, 247, 0.10)",
        zIndex: 10,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 15,
      }}
    >
      <div
        style={{
          width: 150,
          height: 210,
          borderRadius: 32,
          backgroundColor: '#fff',
          border: '2px solid #c4b5fd',
          backgroundImage: isEmoji ? 'none' : `url(${card.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 8px 25px rgba(147, 51, 234, 0.08), 0 4px 10px rgba(168, 85, 247, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isEmoji ? '4rem' : 'inherit',
          color: isEmoji ? '#333' : 'inherit',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isEmoji && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem', zIndex: 1 }}>
              {card.image_url}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              textAlign: 'center', 
              color: '#666',
              fontWeight: '500',
              padding: '0 0.5rem',
              zIndex: 1
            }}>
              {card.name}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

const horizontalContainer: React.CSSProperties = {
  margin: "0 auto",
  padding: "4rem 2rem",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "1.5rem",
  maxWidth: "1200px",
  background: "linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(34, 197, 94, 0.05) 50%, rgba(234, 179, 8, 0.05) 100%)",
}

const cardStyle: React.CSSProperties = {
    width: 150,
    height: 210,
    borderRadius: 32,
    backgroundColor: "#ffffff",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 8px 25px rgba(147, 51, 234, 0.15), 0 4px 10px rgba(34, 197, 94, 0.1)",
    border: "3px solid",
    borderImage: "linear-gradient(45deg, #9333ea, #22c55e, #eab308) 1",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    position: "relative",
    overflow: "hidden",
  }
