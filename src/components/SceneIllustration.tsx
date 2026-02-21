import type { Language } from '../data/types'

interface SceneIllustrationProps {
  sceneId: string
  language: Language
}

/** Simple SVG placeholder illustration for the kitchen scene */
function KitchenScene({ language }: { language: Language }) {
  const labels = {
    fridge: language === 'fr' ? 'frigo' : 'fridge',
    table: language === 'fr' ? 'table' : 'table',
    stove: language === 'fr' ? 'cuisiniere' : 'stove',
    sink: language === 'fr' ? 'evier' : 'sink',
  }

  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
      {/* Floor */}
      <rect x="0" y="220" width="400" height="80" fill="#d4a574" />
      {/* Wall */}
      <rect x="0" y="0" width="400" height="220" fill="#fef3c7" />

      {/* Fridge */}
      <rect x="10" y="40" width="75" height="180" rx="4" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="2" />
      <rect x="10" y="40" width="75" height="90" rx="4" fill="#93c5fd" stroke="#60a5fa" strokeWidth="2" />
      <circle cx="75" cy="80" r="3" fill="#60a5fa" />
      <circle cx="75" cy="150" r="3" fill="#60a5fa" />
      <text x="47" y="200" textAnchor="middle" fontSize="11" fill="#1e40af" fontWeight="bold">{labels.fridge}</text>

      {/* Table */}
      <rect x="100" y="170" width="140" height="8" rx="2" fill="#92400e" />
      <rect x="110" y="178" width="8" height="42" fill="#78350f" />
      <rect x="222" y="178" width="8" height="42" fill="#78350f" />
      <text x="170" y="195" textAnchor="middle" fontSize="11" fill="#78350f" fontWeight="bold">{labels.table}</text>

      {/* Apple on table */}
      <circle cx="140" cy="160" r="12" fill="#ef4444" />
      <line x1="140" y1="148" x2="142" y2="142" stroke="#16a34a" strokeWidth="2" />

      {/* Cup on table */}
      <rect x="185" y="148" width="18" height="22" rx="2" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
      <rect x="203" y="153" width="7" height="12" rx="3" fill="none" stroke="#f59e0b" strokeWidth="1.5" />

      {/* Stove */}
      <rect x="260" y="70" width="72" height="150" rx="4" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="2" />
      <circle cx="280" cy="90" r="12" fill="#6b7280" />
      <circle cx="312" cy="90" r="12" fill="#6b7280" />
      <circle cx="280" cy="120" r="12" fill="#6b7280" />
      <circle cx="312" cy="120" r="12" fill="#6b7280" />
      <rect x="268" y="145" width="56" height="35" rx="2" fill="#9ca3af" />
      <text x="296" y="200" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">{labels.stove}</text>

      {/* Sink */}
      <rect x="340" y="80" width="50" height="80" rx="4" fill="#c7d2fe" stroke="#a5b4fc" strokeWidth="2" />
      <ellipse cx="365" cy="110" rx="18" ry="12" fill="#818cf8" opacity="0.3" />
      <rect x="362" y="80" width="6" height="20" rx="2" fill="#a5b4fc" />
      <text x="365" y="145" textAnchor="middle" fontSize="11" fill="#4338ca" fontWeight="bold">{labels.sink}</text>
    </svg>
  )
}

/** Simple SVG placeholder illustration for the playground scene */
function PlaygroundScene({ language }: { language: Language }) {
  const labels = {
    slide: language === 'fr' ? 'toboggan' : 'slide',
    swing: language === 'fr' ? 'balancoire' : 'swing',
    ball: language === 'fr' ? 'ballon' : 'ball',
    tree: language === 'fr' ? 'arbre' : 'tree',
  }

  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
      {/* Sky */}
      <rect x="0" y="0" width="400" height="200" fill="#bae6fd" />
      {/* Sun */}
      <circle cx="350" cy="40" r="25" fill="#fbbf24" />
      {/* Cloud */}
      <ellipse cx="100" cy="40" rx="35" ry="15" fill="white" />
      <ellipse cx="80" cy="35" rx="20" ry="12" fill="white" />
      <ellipse cx="120" cy="38" rx="22" ry="11" fill="white" />
      {/* Grass */}
      <rect x="0" y="200" width="400" height="100" fill="#86efac" />

      {/* Slide */}
      <rect x="30" y="60" width="8" height="160" fill="#9ca3af" />
      <rect x="90" y="60" width="8" height="160" fill="#9ca3af" />
      <line x1="34" y1="60" x2="34" y2="220" stroke="#6b7280" strokeWidth="1" />
      <rect x="28" y="55" width="72" height="10" rx="3" fill="#ef4444" />
      <line x1="98" y1="65" x2="38" y2="210" stroke="#f87171" strokeWidth="10" strokeLinecap="round" />
      <text x="64" y="180" textAnchor="middle" fontSize="11" fill="#991b1b" fontWeight="bold">{labels.slide}</text>

      {/* Swing */}
      <rect x="155" y="40" width="60" height="6" rx="2" fill="#78350f" />
      <rect x="160" y="46" width="4" height="120" fill="#92400e" />
      <rect x="206" y="46" width="4" height="120" fill="#92400e" />
      <rect x="155" y="40" width="6" height="180" fill="#9ca3af" />
      <rect x="210" y="40" width="6" height="180" fill="#9ca3af" />
      <rect x="150" y="160" width="30" height="6" rx="2" fill="#3b82f6" />
      <rect x="195" y="165" width="30" height="6" rx="2" fill="#3b82f6" />
      <text x="185" y="190" textAnchor="middle" fontSize="11" fill="#1e3a8a" fontWeight="bold">{labels.swing}</text>

      {/* Ball */}
      <circle cx="275" cy="220" r="20" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
      <path d="M260 215 Q275 200 290 215" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
      <path d="M260 225 Q275 240 290 225" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="275" y="255" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold">{labels.ball}</text>

      {/* Tree */}
      <rect x="335" y="120" width="16" height="100" fill="#92400e" />
      <circle cx="343" cy="80" r="40" fill="#22c55e" />
      <circle cx="325" cy="100" r="25" fill="#16a34a" />
      <circle cx="363" cy="95" r="28" fill="#15803d" />
      <text x="343" y="170" textAnchor="middle" fontSize="11" fill="#14532d" fontWeight="bold">{labels.tree}</text>
    </svg>
  )
}

/** Simple SVG placeholder illustration for the bedroom scene */
function BedroomScene({ language }: { language: Language }) {
  const labels = {
    bed: language === 'fr' ? 'lit' : 'bed',
    window: language === 'fr' ? 'fenetre' : 'window',
    lamp: language === 'fr' ? 'lampe' : 'lamp',
    teddy: language === 'fr' ? 'nounours' : 'teddy',
    book: language === 'fr' ? 'livre' : 'book',
  }

  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
      {/* Wall */}
      <rect x="0" y="0" width="400" height="220" fill="#ede9fe" />
      {/* Floor */}
      <rect x="0" y="220" width="400" height="80" fill="#c4b5a0" />

      {/* Window */}
      <rect x="130" y="15" width="90" height="75" rx="3" fill="#7dd3fc" stroke="#94a3b8" strokeWidth="3" />
      <line x1="175" y1="15" x2="175" y2="90" stroke="#94a3b8" strokeWidth="2" />
      <line x1="130" y1="52" x2="220" y2="52" stroke="#94a3b8" strokeWidth="2" />
      {/* Stars in window */}
      <circle cx="150" cy="35" r="2" fill="#fef08a" />
      <circle cx="195" cy="28" r="2.5" fill="#fef08a" />
      <circle cx="165" cy="70" r="1.5" fill="#fef08a" />
      <text x="175" y="80" textAnchor="middle" fontSize="10" fill="#0c4a6e" fontWeight="bold">{labels.window}</text>

      {/* Bed */}
      <rect x="20" y="130" width="170" height="90" rx="5" fill="#a78bfa" stroke="#7c3aed" strokeWidth="2" />
      <rect x="20" y="100" width="30" height="120" rx="5" fill="#7c3aed" />
      {/* Pillow */}
      <rect x="30" y="135" width="50" height="30" rx="8" fill="#f0abfc" stroke="#d946ef" strokeWidth="1" />
      {/* Blanket pattern */}
      <rect x="80" y="155" width="105" height="60" rx="3" fill="#c4b5fd" />
      <text x="105" y="200" textAnchor="middle" fontSize="11" fill="#4c1d95" fontWeight="bold">{labels.bed}</text>

      {/* Teddy bear on bed */}
      <circle cx="145" cy="155" r="15" fill="#fdba74" stroke="#f97316" strokeWidth="1.5" />
      <circle cx="139" cy="150" r="5" fill="#fed7aa" />
      <circle cx="151" cy="150" r="5" fill="#fed7aa" />
      <circle cx="142" cy="153" r="1.5" fill="#78350f" />
      <circle cx="148" cy="153" r="1.5" fill="#78350f" />
      <ellipse cx="145" cy="158" rx="3" ry="2" fill="#78350f" />
      <text x="145" y="180" textAnchor="middle" fontSize="9" fill="#9a3412" fontWeight="bold">{labels.teddy}</text>

      {/* Lamp */}
      <rect x="210" y="140" width="8" height="50" fill="#92400e" />
      <polygon points="195,140 229,140 220,110 204,110" fill="#fcd34d" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="214" y="165" textAnchor="middle" fontSize="10" fill="#92400e" fontWeight="bold">{labels.lamp}</text>

      {/* Bookshelf */}
      <rect x="260" y="170" width="60" height="50" rx="3" fill="#92400e" stroke="#78350f" strokeWidth="2" />
      <rect x="265" y="175" width="12" height="18" rx="1" fill="#ef4444" />
      <rect x="279" y="175" width="10" height="18" rx="1" fill="#3b82f6" />
      <rect x="291" y="175" width="12" height="18" rx="1" fill="#22c55e" />
      <rect x="305" y="175" width="10" height="18" rx="1" fill="#eab308" />
      <text x="290" y="210" textAnchor="middle" fontSize="10" fill="#fef3c7" fontWeight="bold">{labels.book}</text>
    </svg>
  )
}

/**
 * Renders a simple SVG illustration as the background for a visual scene display.
 * These are placeholder illustrations — in production these would be replaced with
 * actual photos or professional illustrations.
 */
export function SceneIllustration({ sceneId, language }: SceneIllustrationProps) {
  switch (sceneId) {
    case 'kitchen':
      return <KitchenScene language={language} />
    case 'playground':
      return <PlaygroundScene language={language} />
    case 'bedroom':
      return <BedroomScene language={language} />
    default:
      return null
  }
}
