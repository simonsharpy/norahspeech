import type { BilingualLabel } from './types'

/** A tappable region within a visual scene that speaks a word when tapped */
export interface Hotspot {
  /** Unique identifier for this hotspot */
  id: string
  /** The word spoken when tapped */
  label: BilingualLabel
  /** X position as percentage of scene width (0-100) */
  x: number
  /** Y position as percentage of scene height (0-100) */
  y: number
  /** Width as percentage of scene width */
  width: number
  /** Height as percentage of scene height */
  height: number
  /** Optional color for the hotspot overlay (defaults to scene accent color) */
  color?: string
}

/** A visual scene display — a photo/illustration with tappable hotspot regions */
export interface VisualScene {
  /** Unique scene identifier */
  id: string
  /** Display name for the scene selector */
  label: BilingualLabel
  /** Background color for the scene (used with SVG placeholder illustrations) */
  backgroundColor: string
  /** Accent color used for hotspot highlights */
  accentColor: string
  /** Tappable hotspot regions within the scene */
  hotspots: Hotspot[]
}
