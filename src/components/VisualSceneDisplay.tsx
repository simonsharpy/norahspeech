import { useState, useCallback } from 'react'
import type { Language, BilingualLabel } from '../data/types'
import type { VisualScene, Hotspot } from '../data/vsdTypes'
import { SceneIllustration } from './SceneIllustration'

interface HotspotButtonProps {
  hotspot: Hotspot
  language: Language
  onTap: (hotspot: Hotspot) => void
}

function HotspotButton({ hotspot, language, onTap }: HotspotButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const label = hotspot.label[language]

  function handleClick() {
    setIsPressed(true)
    onTap(hotspot)
    setTimeout(() => setIsPressed(false), 300)
  }

  return (
    <button
      data-testid={`hotspot-${hotspot.id}`}
      onClick={handleClick}
      className={`
        absolute flex items-center justify-center
        rounded-xl border-3 cursor-pointer
        transition-all duration-200 ease-out
        hover:scale-105 active:scale-95
        ${isPressed ? 'scale-95 ring-4 ring-white/80' : ''}
      `}
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${hotspot.width}%`,
        height: `${hotspot.height}%`,
        backgroundColor: `${hotspot.color ?? '#6366f1'}33`,
        borderColor: `${hotspot.color ?? '#6366f1'}aa`,
      }}
      aria-label={label}
    >
      <span
        className="rounded-lg px-2 py-0.5 text-xs font-bold shadow-sm sm:text-sm"
        style={{
          backgroundColor: hotspot.color ?? '#6366f1',
          color: 'white',
        }}
      >
        {label}
      </span>
    </button>
  )
}

interface SceneSelectorProps {
  scenes: VisualScene[]
  activeSceneId: string
  language: Language
  onSelect: (sceneId: string) => void
}

function SceneSelector({ scenes, activeSceneId, language, onSelect }: SceneSelectorProps) {
  return (
    <nav
      className="flex gap-2 overflow-x-auto px-3 py-2 scrollbar-none"
      role="tablist"
      aria-label={language === 'fr' ? 'Scenes' : 'Scenes'}
    >
      {scenes.map((scene) => {
        const isActive = scene.id === activeSceneId
        return (
          <button
            key={scene.id}
            role="tab"
            aria-selected={isActive}
            data-testid={`scene-${scene.id}`}
            onClick={() => onSelect(scene.id)}
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
            style={isActive ? { backgroundColor: scene.accentColor } : undefined}
          >
            {scene.label[language]}
          </button>
        )
      })}
    </nav>
  )
}

interface VisualSceneDisplayProps {
  scenes: VisualScene[]
  language: Language
  onHotspotTap: (label: BilingualLabel) => void
}

export function VisualSceneDisplay({ scenes, language, onHotspotTap }: VisualSceneDisplayProps) {
  const [activeSceneId, setActiveSceneId] = useState(scenes[0]?.id ?? '')

  const activeScene = scenes.find((s) => s.id === activeSceneId) ?? scenes[0]

  const handleHotspotTap = useCallback((hotspot: Hotspot) => {
    onHotspotTap(hotspot.label)
  }, [onHotspotTap])

  if (!activeScene) return null

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <SceneSelector
        scenes={scenes}
        activeSceneId={activeScene.id}
        language={language}
        onSelect={setActiveSceneId}
      />

      <div className="flex-1 overflow-hidden px-3 pb-3">
        <div
          data-testid="visual-scene"
          className="relative mx-auto h-full w-full overflow-hidden rounded-2xl border-2 shadow-lg"
          style={{
            backgroundColor: activeScene.backgroundColor,
            borderColor: activeScene.accentColor,
          }}
        >
          {/* Scene illustration background */}
          <div className="absolute inset-0">
            <SceneIllustration sceneId={activeScene.id} language={language} />
          </div>

          {/* Hotspot overlay buttons */}
          {activeScene.hotspots.map((hotspot) => (
            <HotspotButton
              key={hotspot.id}
              hotspot={hotspot}
              language={language}
              onTap={handleHotspotTap}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
