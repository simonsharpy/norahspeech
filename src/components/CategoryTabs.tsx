import type { Category, CategoryId, Language } from '../data/types'

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: CategoryId
  language: Language
  onSelect: (categoryId: CategoryId) => void
}

export function CategoryTabs({ categories, activeCategory, language, onSelect }: CategoryTabsProps) {
  return (
    <nav
      className="flex gap-1.5 overflow-x-auto px-3 py-2 scrollbar-none"
      role="tablist"
      aria-label="Categories"
    >
      {categories.map((cat) => {
        const isActive = cat.id === activeCategory
        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            data-testid={`category-${cat.id}`}
            onClick={() => onSelect(cat.id)}
            className={`
              shrink-0 rounded-full px-4 py-2
              text-sm font-semibold
              transition-all duration-150
              cursor-pointer select-none
              ${isActive
                ? 'text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            style={isActive ? { backgroundColor: cat.color } : undefined}
          >
            {cat.label[language]}
          </button>
        )
      })}
    </nav>
  )
}
