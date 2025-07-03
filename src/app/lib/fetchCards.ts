import { supabase } from "./supabase"

// Fallback placeholder cards when no data is available
const placeholderCards = [
  { id: "1", name: "Joker Card", image_url: "🃏" },
  { id: "2", name: "Playing Card", image_url: "🎴" },
  { id: "3", name: "ID Card", image_url: "🪪" },
  { id: "4", name: "Diamond", image_url: "💎" },
  { id: "5", name: "Fire", image_url: "🔥" },
  { id: "6", name: "Wave", image_url: "🌊" },
  { id: "7", name: "Lightning", image_url: "⚡" },
  { id: "8", name: "Alien", image_url: "👾" },
  { id: "9", name: "DNA", image_url: "🧬" },
]

export async function fetchCards() {
  try {
    const { data, error } = await supabase.from("cards").select("id, name, image_url")

    if (error) {
      console.warn("Error fetching cards:", error.message)
      return placeholderCards
    }

    // If no cards found, return placeholder cards
    if (!data || data.length === 0) {
      console.log("No cards found, using placeholder cards")
      return placeholderCards
    }

    return data
  } catch (error) {
    console.warn("Failed to fetch cards, using placeholder cards:", error)
    return placeholderCards
  }
}
