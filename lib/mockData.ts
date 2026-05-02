export type AIToolCategory = 'beauty' | 'background' | 'enhance' | 'creative' | 'video' | 'retouch'

export type AITool = {
  id: string
  name: string
  description: string
  icon: string
  category: AIToolCategory
  isPremium: boolean
  gradient: readonly [string, string]
}

export type RecentEdit = {
  id: string
  title: string
  toolUsed: string
  timestamp: string
  thumbnail: string
  format: 'photo' | 'video' | 'story' | 'carousel'
}

export type FilterPreset = {
  id: string
  name: string
  intensity: number
  category: 'beauty' | 'artistic' | 'vintage' | 'cinematic' | 'viral'
  gradient: readonly [string, string]
}

export type GalleryItem = {
  id: string
  title: string
  editedAt: string
  toolsUsed: string[]
  format: 'photo' | 'video' | 'story' | 'carousel'
  width: number
  height: number
  thumbnail: string
}

export type BackgroundOption = {
  id: string
  name: string
  category: 'solid' | 'gradient' | 'scene' | 'blur' | 'ai-generated'
  thumbnail: string
}

export type VideoEffect = {
  id: string
  name: string
  category: 'transition' | 'overlay' | 'text' | 'sticker' | 'sound'
  icon: string
  isPremium: boolean
}

export const demoUser = {
  fullName: 'Sophia Chen',
  email: 'sophia@glamai.app',
  role: 'Creator',
  teamName: 'GlamAI Pro',
  initials: 'SC',
}

export const aiTools: AITool[] = [
  {
    id: 'tool-beauty',
    name: 'AI Beauty',
    description: 'One-tap skin smoothing, face reshape, and makeup',
    icon: 'sparkles',
    category: 'beauty',
    isPremium: false,
    gradient: ['#e040fb', '#7c4dff'],
  },
  {
    id: 'tool-bg-remove',
    name: 'Background Remove',
    description: 'Instantly remove and replace any background',
    icon: 'cut-outline',
    category: 'background',
    isPremium: false,
    gradient: ['#7c4dff', '#00e5ff'],
  },
  {
    id: 'tool-enhance',
    name: 'AI Enhance',
    description: 'Auto-adjust lighting, color, and sharpness',
    icon: 'sunny-outline',
    category: 'enhance',
    isPremium: false,
    gradient: ['#ff6090', '#ff8a65'],
  },
  {
    id: 'tool-object-remove',
    name: 'Object Eraser',
    description: 'Remove unwanted objects with AI fill',
    icon: 'close-circle-outline',
    category: 'retouch',
    isPremium: true,
    gradient: ['#00e5ff', '#00bfa5'],
  },
  {
    id: 'tool-face-swap',
    name: 'Face Swap',
    description: 'Swap faces between photos with AI',
    icon: 'people-outline',
    category: 'creative',
    isPremium: true,
    gradient: ['#ffd740', '#ff6d00'],
  },
  {
    id: 'tool-style-transfer',
    name: 'Style Transfer',
    description: 'Apply artistic styles to your photos',
    icon: 'color-palette-outline',
    category: 'creative',
    isPremium: true,
    gradient: ['#e040fb', '#ff4081'],
  },
  {
    id: 'tool-video-effects',
    name: 'Video Effects',
    description: 'Add transitions, overlays, and effects',
    icon: 'videocam-outline',
    category: 'video',
    isPremium: false,
    gradient: ['#7c4dff', '#e040fb'],
  },
  {
    id: 'tool-video-trim',
    name: 'Video Trim',
    description: 'Cut, split, and merge video clips',
    icon: 'cut-outline',
    category: 'video',
    isPremium: false,
    gradient: ['#00e5ff', '#7c4dff'],
  },
  {
    id: 'tool-skin-retouch',
    name: 'Skin Retouch',
    description: 'Blemish removal and skin tone evening',
    icon: 'water-outline',
    category: 'beauty',
    isPremium: false,
    gradient: ['#f48fb1', '#e040fb'],
  },
  {
    id: 'tool-body-reshape',
    name: 'Body Reshape',
    description: 'Subtle body adjustments with AI',
    icon: 'body-outline',
    category: 'beauty',
    isPremium: true,
    gradient: ['#ff8a65', '#ff6090'],
  },
  {
    id: 'tool-hdr',
    name: 'HDR Effect',
    description: 'Add stunning HDR dynamic range',
    icon: 'contrast-outline',
    category: 'enhance',
    isPremium: false,
    gradient: ['#ffd740', '#ff9100'],
  },
  {
    id: 'tool-blur-bg',
    name: 'Portrait Blur',
    description: 'Add depth-of-field bokeh to any photo',
    icon: 'aperture-outline',
    category: 'background',
    isPremium: false,
    gradient: ['#82b1ff', '#448aff'],
  },
]

export const recentEdits: RecentEdit[] = [
  { id: 'edit-1', title: 'Sunset portrait', toolUsed: 'AI Beauty', timestamp: '5m ago', thumbnail: '', format: 'photo' },
  { id: 'edit-2', title: 'Beach vibes reel', toolUsed: 'Video Effects', timestamp: '32m ago', thumbnail: '', format: 'video' },
  { id: 'edit-3', title: 'Product flat lay', toolUsed: 'Background Remove', timestamp: '1h ago', thumbnail: '', format: 'photo' },
  { id: 'edit-4', title: 'Story carousel', toolUsed: 'AI Enhance', timestamp: '3h ago', thumbnail: '', format: 'carousel' },
]

export const filterPresets: FilterPreset[] = [
  { id: 'f-glow', name: 'Glow Up', intensity: 80, category: 'beauty', gradient: ['#e040fb', '#f48fb1'] },
  { id: 'f-soft', name: 'Soft Focus', intensity: 60, category: 'beauty', gradient: ['#f48fb1', '#ffab91'] },
  { id: 'f-porcelain', name: 'Porcelain', intensity: 70, category: 'beauty', gradient: ['#eeeeee', '#bdbdbd'] },
  { id: 'f-golden', name: 'Golden Hour', intensity: 75, category: 'cinematic', gradient: ['#ffd740', '#ff8a65'] },
  { id: 'f-moody', name: 'Moody', intensity: 65, category: 'cinematic', gradient: ['#37474f', '#263238'] },
  { id: 'f-retro', name: 'Retro Film', intensity: 55, category: 'vintage', gradient: ['#8d6e63', '#a1887f'] },
  { id: 'f-faded', name: 'Faded', intensity: 50, category: 'vintage', gradient: ['#90a4ae', '#b0bec5'] },
  { id: 'f-pop-art', name: 'Pop Art', intensity: 90, category: 'artistic', gradient: ['#ff4081', '#ff6090'] },
  { id: 'f-oil', name: 'Oil Paint', intensity: 85, category: 'artistic', gradient: ['#7c4dff', '#b388ff'] },
  { id: 'f-tiktok', name: 'TikTok Glow', intensity: 80, category: 'viral', gradient: ['#00e5ff', '#e040fb'] },
  { id: 'f-insta', name: 'Insta Ready', intensity: 70, category: 'viral', gradient: ['#e040fb', '#ff6090'] },
  { id: 'f-neon', name: 'Neon Night', intensity: 85, category: 'viral', gradient: ['#7c4dff', '#00e5ff'] },
]

export const galleryItems: GalleryItem[] = [
  { id: 'gal-1', title: 'Portrait session', editedAt: '5m ago', toolsUsed: ['AI Beauty', 'AI Enhance'], format: 'photo', width: 1080, height: 1350, thumbnail: '' },
  { id: 'gal-2', title: 'Beach reel', editedAt: '32m ago', toolsUsed: ['Video Effects', 'Video Trim'], format: 'video', width: 1080, height: 1920, thumbnail: '' },
  { id: 'gal-3', title: 'Product shots', editedAt: '1h ago', toolsUsed: ['Background Remove', 'AI Enhance'], format: 'carousel', width: 1080, height: 1080, thumbnail: '' },
  { id: 'gal-4', title: 'Selfie glow', editedAt: '3h ago', toolsUsed: ['AI Beauty', 'Skin Retouch'], format: 'photo', width: 1080, height: 1350, thumbnail: '' },
  { id: 'gal-5', title: 'Night city edit', editedAt: '5h ago', toolsUsed: ['HDR Effect', 'Style Transfer'], format: 'photo', width: 1920, height: 1080, thumbnail: '' },
  { id: 'gal-6', title: 'Travel story', editedAt: '1d ago', toolsUsed: ['Video Effects', 'AI Enhance'], format: 'story', width: 1080, height: 1920, thumbnail: '' },
]

export const backgroundOptions: BackgroundOption[] = [
  { id: 'bg-none', name: 'Transparent', category: 'solid', thumbnail: '' },
  { id: 'bg-white', name: 'White', category: 'solid', thumbnail: '' },
  { id: 'bg-black', name: 'Black', category: 'solid', thumbnail: '' },
  { id: 'bg-sunset', name: 'Sunset Beach', category: 'scene', thumbnail: '' },
  { id: 'bg-city', name: 'City Skyline', category: 'scene', thumbnail: '' },
  { id: 'bg-forest', name: 'Enchanted Forest', category: 'scene', thumbnail: '' },
  { id: 'bg-studio', name: 'Studio Light', category: 'scene', thumbnail: '' },
  { id: 'bg-blur-light', name: 'Light Blur', category: 'blur', thumbnail: '' },
  { id: 'bg-blur-heavy', name: 'Heavy Blur', category: 'blur', thumbnail: '' },
  { id: 'bg-grad-pink', name: 'Pink Gradient', category: 'gradient', thumbnail: '' },
  { id: 'bg-grad-blue', name: 'Ocean Gradient', category: 'gradient', thumbnail: '' },
  { id: 'bg-ai-fantasy', name: 'AI Fantasy', category: 'ai-generated', thumbnail: '' },
  { id: 'bg-ai-space', name: 'AI Space', category: 'ai-generated', thumbnail: '' },
]

export const videoEffects: VideoEffect[] = [
  { id: 've-fade', name: 'Fade', category: 'transition', icon: 'swap-horizontal-outline', isPremium: false },
  { id: 've-slide', name: 'Slide', category: 'transition', icon: 'arrow-forward-outline', isPremium: false },
  { id: 've-zoom', name: 'Zoom', category: 'transition', icon: 'expand-outline', isPremium: false },
  { id: 've-glitch', name: 'Glitch', category: 'overlay', icon: 'flash-outline', isPremium: true },
  { id: 've-sparkle', name: 'Sparkle', category: 'overlay', icon: 'sparkles', isPremium: false },
  { id: 've-light-leak', name: 'Light Leak', category: 'overlay', icon: 'sunny-outline', isPremium: false },
  { id: 've-title', name: 'Title Card', category: 'text', icon: 'text-outline', isPremium: false },
  { id: 've-caption', name: 'Caption', category: 'text', icon: 'chatbubble-outline', isPremium: false },
  { id: 've-emoji', name: 'Emoji Pack', category: 'sticker', icon: 'happy-outline', isPremium: false },
  { id: 've-beat', name: 'Beat Sync', category: 'sound', icon: 'musical-notes-outline', isPremium: true },
]

export const exportFormats = [
  { id: 'exp-story', label: 'Story', ratio: '9:16', width: 1080, height: 1920, icon: 'phone-portrait-outline' },
  { id: 'exp-post', label: 'Post', ratio: '4:5', width: 1080, height: 1350, icon: 'image-outline' },
  { id: 'exp-square', label: 'Square', ratio: '1:1', width: 1080, height: 1080, icon: 'square-outline' },
  { id: 'exp-landscape', label: 'Landscape', ratio: '16:9', width: 1920, height: 1080, icon: 'tablet-landscape-outline' },
  { id: 'exp-carousel', label: 'Carousel', ratio: '1:1', width: 1080, height: 1080, icon: 'albums-outline' },
]

export const insightCards = [
  { id: 'metric-1', label: 'Edits Today', value: '12', delta: '+4 from yesterday' },
  { id: 'metric-2', label: 'AI Tools Used', value: '6', delta: 'Most: Beauty' },
  { id: 'metric-3', label: 'Exports', value: '8', delta: '3 stories, 5 posts' },
]

export const categoryLabels: Record<AIToolCategory, string> = {
  beauty: 'Beauty',
  background: 'Background',
  enhance: 'Enhance',
  creative: 'Creative',
  video: 'Video',
  retouch: 'Retouch',
}

export function getToolsByCategory(category?: AIToolCategory) {
  if (!category) return aiTools
  return aiTools.filter((t) => t.category === category)
}

export function getToolById(id: string) {
  return aiTools.find((t) => t.id === id) ?? null
}
