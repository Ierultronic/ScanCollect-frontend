import React from 'react';
import { FaSearch, FaSort } from 'react-icons/fa';
import { TCG_OPTIONS, TCG_RARITIES } from '../lib/tcg-constants';

export interface TcgCardFilterProps {
    rarity: string;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onChange: (filters: {
        rarity?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        category?: string;
    }) => void;
    showSearchButton?: boolean;
    showRarity?: boolean;
    showSort?: boolean;
    className?: string;
    categories?: { id: string; name: string }[];
    selectedCategory?: string;
}

const TcgCardFilter: React.FC<TcgCardFilterProps> = ({
    rarity,
    search,
    sortBy,
    sortOrder,
    onChange,
    showSearchButton = true,
    showRarity = true,
    showSort = true,
    className = '',
    categories,
    selectedCategory,
}) => {
    // Debug: log categories
    console.log('categories in filter:', categories);

    // Find the selected category object
    const selectedCategoryObj = Array.isArray(categories)
        ? categories.find(cat => cat.id === selectedCategory)
        : undefined;

    // Convert category name to slug (e.g., 'One Piece' -> 'one-piece')
    const categorySlug = selectedCategoryObj?.name
        ? selectedCategoryObj.name.toLowerCase().replace(/ /g, '-')
        : '';

    // Get rarity options for the selected category
    const rarityOptions = TCG_RARITIES[categorySlug] || [];

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 ${className}`}>
            {/* Category Filter (now the only main selector) */}
            <select
                value={selectedCategory || ''}
                onChange={e => onChange({ category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                style={{ backgroundColor: 'white' }}
            >
                <option value="">All TCGs</option>
                {Array.isArray(categories) && categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            {/* Search */}
            <form
                className="relative col-span-2 flex"
                onSubmit={e => {
                    e.preventDefault();
                    if (showSearchButton) onChange({ search });
                }}
                role="search"
            >
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search cards..."
                    value={search}
                    onChange={e => onChange({ search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {showSearchButton && (
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white font-bold rounded-r-lg hover:bg-purple-700 transition"
                        aria-label="Search"
                    >
                        Search
                    </button>
                )}
            </form>
            {/* Rarity Filter */}
            {showRarity && (
                <select
                    value={rarity}
                    onChange={e => onChange({ rarity: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    style={{ backgroundColor: 'white' }}
                >
                    <option value="">All Rarities</option>
                    {rarityOptions.length > 0
                        ? rarityOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))
                        : null}
                </select>
            )}
            {/* Sort */}
            {showSort && (
                <div className="flex gap-2 col-span-2 lg:col-span-1">
                    <select
                        value={sortBy}
                        onChange={e => onChange({ sortBy: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        style={{ backgroundColor: 'white' }}
                    >
                        <option value="name">Name</option>
                        <option value="rarity">Rarity</option>
                        <option value="set_code">Set</option>
                        <option value="created_at">Date Added</option>
                    </select>
                    <button
                        type="button"
                        onClick={() => onChange({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500"
                    >
                        <FaSort className={sortOrder === 'asc' ? 'rotate-180' : ''} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TcgCardFilter; 