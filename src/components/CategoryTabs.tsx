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
              shrink-0 rounded-full px-5 py-2.5
              text-base font-bold
              transition-all duration-200
              cursor-pointer select-none
              border-2
              ${isActive
                ? 'text-white shadow-md scale-105 border-transparent'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
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
