import { useState, useMemo } from 'react'
import { View, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { Card } from '@/components/ui/Card'
import TextInputField from '@/components/ui/TextInputField'
import {
  ACCENT,
  ACCENT_DIM,
  BG,
  BORDER,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
} from '@/lib/theme'
import { TAB_BAR_CLEARANCE } from '@/components/TabBar'
import { aiTools, categoryLabels, type AIToolCategory } from '@/lib/mockData'

const { width: SW } = Dimensions.get('window')
const CARD_GAP = 12
const CARD_WIDTH = (SW - 40 - CARD_GAP) / 2

type CategoryFilter = 'all' | AIToolCategory

const CATEGORIES: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  ...Object.entries(categoryLabels).map(([key, label]) => ({
    key: key as AIToolCategory,
    label,
  })),
]

export default function ToolsScreen() {
  const insets = useSafeAreaInsets()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')

  const filteredTools = useMemo(() => {
    let tools = aiTools
    if (activeCategory !== 'all') {
      tools = tools.filter((t) => t.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      )
    }
    return tools
  }, [activeCategory, search])

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BG }}
      contentContainerStyle={[
        s.container,
        { paddingTop: insets.top + 16, paddingBottom: TAB_BAR_CLEARANCE + 16 },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>AI Tools</Text>
        <Text style={s.subtitle}>{aiTools.length} tools available</Text>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons
          name="search-outline"
          size={18}
          color={TEXT_TERTIARY}
          style={s.searchIcon}
        />
        <TextInputField
          placeholder="Search tools..."
          value={search}
          onChangeText={setSearch}
          style={s.searchInput}
        />
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipRow}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat.key === activeCategory
          return (
            <Pressable
              key={cat.key}
              onPress={() => setActiveCategory(cat.key)}
              style={[s.chip, isActive && s.chipActive]}
            >
              <Text style={[s.chipText, isActive && s.chipTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <View style={s.emptyState}>
          <Ionicons name="search" size={40} color={TEXT_TERTIARY} />
          <Text style={s.emptyText}>No tools found</Text>
          <Text style={s.emptySubtext}>Try a different search or category</Text>
        </View>
      ) : (
        <View style={s.grid}>
          {filteredTools.map((tool) => (
            <Pressable
              key={tool.id}
              onPress={() => router.push('/editor' as any)}
              style={({ pressed }) => [
                s.toolCard,
                pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
              ]}
            >
              <LinearGradient
                colors={[...tool.gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.toolGradient}
              >
                <Ionicons name={tool.icon as any} size={24} color="#fff" />
              </LinearGradient>
              <Text style={s.toolName}>{tool.name}</Text>
              <Text style={s.toolDesc} numberOfLines={2}>
                {tool.description}
              </Text>
              {tool.isPremium && (
                <View style={s.proBadge}>
                  <Ionicons name="sparkles" size={9} color="#fff" />
                  <Text style={s.proText}>PRO</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 14 },
  header: { gap: 4, marginBottom: 2 },
  title: { fontSize: 26, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: -0.6 },
  subtitle: { fontSize: 14, color: TEXT_SECONDARY },

  searchWrap: { position: 'relative', justifyContent: 'center' },
  searchIcon: { position: 'absolute', left: 14, zIndex: 1 },
  searchInput: { paddingLeft: 38 },

  chipRow: { gap: 8, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipActive: {
    backgroundColor: ACCENT_DIM,
    borderColor: ACCENT,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: TEXT_SECONDARY },
  chipTextActive: { color: ACCENT },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  toolCard: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  toolGradient: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolName: { fontSize: 14, fontWeight: '700', color: TEXT_PRIMARY },
  toolDesc: { fontSize: 11, color: TEXT_SECONDARY, lineHeight: 16 },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(224,64,251,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  proText: { fontSize: 9, fontWeight: '800', color: ACCENT },

  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '700', color: TEXT_SECONDARY },
  emptySubtext: { fontSize: 13, color: TEXT_TERTIARY },
})
