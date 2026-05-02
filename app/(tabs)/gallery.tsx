import { useState, useMemo } from 'react'
import { View, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { TAB_BAR_CLEARANCE } from '@/components/TabBar'
import {
  BG,
  ACCENT,
  ACCENT_DIM,
  BORDER,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  SURFACE,
} from '@/lib/theme'
import { galleryItems, type GalleryItem } from '@/lib/mockData'

const { width: SW } = Dimensions.get('window')
const GRID_GAP = 10
const GRID_PADDING = 16
const COL_WIDTH = (SW - GRID_PADDING * 2 - GRID_GAP) / 2

type FilterKey = 'all' | 'photo' | 'video' | 'story' | 'carousel'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'photo', label: 'Photos' },
  { key: 'video', label: 'Videos' },
  { key: 'story', label: 'Stories' },
  { key: 'carousel', label: 'Carousels' },
]

const FORMAT_ICON: Record<GalleryItem['format'], keyof typeof Ionicons.glyphMap> = {
  photo: 'image-outline',
  video: 'videocam-outline',
  story: 'phone-portrait-outline',
  carousel: 'albums-outline',
}

const FORMAT_LABEL: Record<GalleryItem['format'], string> = {
  photo: 'Photo',
  video: 'Video',
  story: 'Story',
  carousel: 'Carousel',
}

const THUMB_GRADIENTS: readonly [string, string][] = [
  ['#e040fb', '#7c4dff'],
  ['#7c4dff', '#00e5ff'],
  ['#ff6090', '#ff8a65'],
  ['#00e5ff', '#00bfa5'],
  ['#ffd740', '#ff6d00'],
  ['#e040fb', '#ff4081'],
]

function getThumbHeight(item: GalleryItem): number {
  const ratio = item.height / item.width
  return Math.round(COL_WIDTH * ratio * 0.55)
}

export default function GalleryScreen() {
  const insets = useSafeAreaInsets()
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return galleryItems
    return galleryItems.filter((item) => item.format === activeFilter)
  }, [activeFilter])

  // Split into two columns for masonry layout
  const { left, right } = useMemo(() => {
    const l: GalleryItem[] = []
    const r: GalleryItem[] = []
    let lh = 0
    let rh = 0
    for (const item of filtered) {
      const h = getThumbHeight(item)
      if (lh <= rh) {
        l.push(item)
        lh += h
      } else {
        r.push(item)
        rh += h
      }
    }
    return { left: l, right: r }
  }, [filtered])

  const handleItemPress = (item: GalleryItem) => {
    router.push('/editor')
  }

  const renderItem = (item: GalleryItem, index: number) => {
    const thumbH = getThumbHeight(item)
    const gradient = THUMB_GRADIENTS[index % THUMB_GRADIENTS.length]

    return (
      <Pressable
        key={item.id}
        style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1 }]}
        onPress={() => handleItemPress(item)}
      >
        {/* Thumbnail placeholder */}
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.thumbnail, { height: thumbH }]}
        >
          {/* Format badge */}
          <View style={s.formatBadge}>
            <Ionicons name={FORMAT_ICON[item.format]} size={11} color="#fff" />
            <Text style={s.formatBadgeText}>{FORMAT_LABEL[item.format]}</Text>
          </View>

          {item.format === 'video' && (
            <View style={s.playIcon}>
              <Ionicons name="play" size={20} color="#fff" />
            </View>
          )}
        </LinearGradient>

        {/* Info */}
        <View style={s.cardBody}>
          <Text style={s.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={s.cardTools} numberOfLines={1}>
            {item.toolsUsed.join(' · ')}
          </Text>
          <Text style={s.cardTime}>{item.editedAt}</Text>
        </View>
      </Pressable>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BG }}
      contentContainerStyle={[
        s.container,
        { paddingTop: insets.top + 16, paddingBottom: TAB_BAR_CLEARANCE + 16 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>My Gallery</Text>
        <Text style={s.subtitle}>Your editing history & saved creations</Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterRow}
      >
        {FILTERS.map((f) => {
          const active = f.key === activeFilter
          return (
            <Pressable
              key={f.key}
              style={[s.chip, active && s.chipActive]}
              onPress={() => setActiveFilter(f.key)}
            >
              <Text style={[s.chipText, active && s.chipTextActive]}>{f.label}</Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <View style={s.emptyState}>
          <Ionicons name="images-outline" size={56} color={TEXT_TERTIARY} />
          <Text style={s.emptyTitle}>No items yet</Text>
          <Text style={s.emptySubtitle}>
            Nothing matches this filter. Start editing to fill your gallery!
          </Text>
          <Pressable
            style={s.emptyButton}
            onPress={() => router.push('/editor')}
          >
            <Text style={s.emptyButtonText}>Open Editor</Text>
          </Pressable>
        </View>
      ) : (
        /* Masonry grid */
        <View style={s.grid}>
          <View style={s.column}>
            {left.map((item, i) => renderItem(item, i))}
          </View>
          <View style={s.column}>
            {right.map((item, i) => renderItem(item, left.length + i))}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: GRID_PADDING,
  },

  /* Header */
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: TEXT_SECONDARY,
  },

  /* Filter chips */
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipActive: {
    backgroundColor: ACCENT_DIM,
    borderColor: ACCENT,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_SECONDARY,
  },
  chipTextActive: {
    color: ACCENT,
  },

  /* Grid */
  grid: {
    flexDirection: 'row',
    gap: GRID_GAP,
  },
  column: {
    flex: 1,
    gap: GRID_GAP,
  },

  /* Card */
  card: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  thumbnail: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  formatBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  formatBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  playIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 3,
  },
  cardTools: {
    fontSize: 11,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    marginBottom: 2,
  },
  cardTime: {
    fontSize: 10,
    fontWeight: '400',
    color: TEXT_TERTIARY,
  },

  /* Empty state */
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT,
  },
})
