// Trading Card Game (TCG) options and rarity mappings for global use

export const TCG_OPTIONS = [
  { value: "one-piece", label: "One Piece" },
  { value: "pokemon", label: "Pokémon" },
  { value: "digimon", label: "Digimon" },
  { value: "magic", label: "Magic: The Gathering" },
  { value: "union-arena", label: "Union Arena" },
  { value: "disney-lorcana", label: "Disney Lorcana" },
  { value: "flesh-and-blood", label: "Flesh and Blood" },
  { value: "yugioh", label: "Yu-Gi-Oh!" },
  { value: "age-of-sigmar", label: "Age of Sigmar" },
  { value: "warhammer-40000", label: "Warhammer 40,000" },
];

export const TCG_RARITIES: Record<string, { value: string; label: string }[]> = {
  "one-piece": [
    { value: "C", label: "Common (C)" },
    { value: "UC", label: "Uncommon (UC)" },
    { value: "R", label: "Rare (R)" },
    { value: "SR", label: "Super Rare (SR)" },
    { value: "SP", label: "Special (SP)" },
    { value: "SEC", label: "Secret Rare (SEC)" },
    { value: "L", label: "Leader (L)" },
    { value: "P", label: "Promo (P)" },
    // Add more as needed
  ],
  "pokemon": [
    { value: "Common", label: "Common" },
    { value: "Uncommon", label: "Uncommon" },
    { value: "Rare", label: "Rare" },
    { value: "Rare Holo", label: "Rare Holo" },
    { value: "Rare Ultra", label: "Rare Ultra" },
    { value: "Rare Secret", label: "Rare Secret" },
    // Add more as needed
  ],
  "dragon-ball-fusion": [
    { value: "Common", label: "Common" },
    { value: "Uncommon", label: "Uncommon" },
    { value: "Rare", label: "Rare" },
    { value: "Super Rare", label: "Super Rare" },
    { value: "Secret Rare", label: "Secret Rare" },
    // Add more as needed
  ],
  "digimon": [
    { value: "C", label: "Common (C)" },
    { value: "U", label: "Uncommon (U)" },
    { value: "R", label: "Rare (R)" },
    { value: "SR", label: "Super Rare (SR)" },
    { value: "SP", label: "Special (SP)" },
    { value: "SEC", label: "Secret Rare (SEC)" },
    { value: "T", label: "Tamer (T)" },
    // Add more as needed
  ],
  "magic": [
    { value: "Common", label: "Common" },
    { value: "Uncommon", label: "Uncommon" },
    { value: "Rare", label: "Rare" },
    { value: "Mythic Rare", label: "Mythic Rare" },
    // Add more as needed
  ],
  "union-arena": [
    { value: "C", label: "Common (C)" },
    { value: "U", label: "Uncommon (U)" },
    { value: "R", label: "Rare (R)" },
    { value: "SR", label: "Super Rare (SR)" },
    // Add more as needed
  ],
  "disney-lorcana": [
    { value: "Common", label: "Common" },
    { value: "Uncommon", label: "Uncommon" },
    { value: "Rare", label: "Rare" },
    { value: "Super Rare", label: "Super Rare" },
    { value: "Enchanted", label: "Enchanted" },
    // Add more as needed
  ],
  "flesh-and-blood": [
    { value: "Common", label: "Common" },
    { value: "Rare", label: "Rare" },
    { value: "Super Rare", label: "Super Rare" },
    { value: "Majestic", label: "Majestic" },
    { value: "Legendary", label: "Legendary" },
    // Add more as needed
  ],
  "yugioh": [
    { value: "Common", label: "Common" },
    { value: "Rare", label: "Rare" },
    { value: "Super Rare", label: "Super Rare" },
    { value: "Ultra Rare", label: "Ultra Rare" },
    { value: "Secret Rare", label: "Secret Rare" },
    // Add more as needed
  ],
  "age-of-sigmar": [
    { value: "Common", label: "Common" },
    { value: "Rare", label: "Rare" },
    { value: "Epic", label: "Epic" },
    { value: "Legendary", label: "Legendary" },
    // Add more as needed
  ],
  "warhammer-40000": [
    { value: "Common", label: "Common" },
    { value: "Rare", label: "Rare" },
    { value: "Epic", label: "Epic" },
    { value: "Legendary", label: "Legendary" },
    // Add more as needed
  ],
}; 