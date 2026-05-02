import { useState } from 'react'
import { View, ScrollView, StyleSheet, Pressable, FlatList } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { BG, ACCENT, ACCENT_DIM, BORDER, SURFACE, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY } from '@/lib/theme'
import { backgroundOptions } from '@/lib/mockData'

const CATEGORIES = ['All', 'Solid', 'Gradient', 'Scene', 'Blur', 'AI Generated'] as const
type Category = (typeof CATEGORIES)[number]

const CATEGORY_TO_DATA: Record<Category, string | null> = {
  All: null,
  Solid: 'solid',
  Gradient: 'gradient',
  Scene: 'scene',
  Blur: 'blur',
  'AI Generated': 'ai-generated',
}

/** Map each background option to a placeholder color or gradient for preview */
const BG_PREVIEW: Record<string, readonly [string, string]> = {
  'bg-none':       ['#444444', '#333333'],
  'bg-white':      ['#ffffff', '#eeeeee'],
  'bg-black':      ['#111111', '#000000'],
  'bg-sunset':     ['#ff6d00', '#ff4081'],
  'bg-city':       ['#37474f', '#263238'],
  'bg-forest':     ['#2e7d32', '#1b5e20'],
  'bg-studio':     ['#9e9e9e', '#757575'],
  'bg-blur-light': ['#90caf9', '#bbdefb'],
  'bg-blur-heavy': ['#5c6bc0', '#3949ab'],
  'bg-grad-pink':  ['#e040fb', '#f48fb1'],
  'bg-grad-blue':  ['#00b0ff', '#0091ea'],
  'bg-ai-fantasy': ['#7c4dff', '#e040fb'],
  'bg-ai-space':   ['#0d47a1', '#311b92'],
}

export default function BackgroundScreen() {
  const insets = useSafeAreaInsets()
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [selectedBg, setSelectedBg] = useState<string>('bg-none')

  const filteredOptions = CATEGORY_TO_DATA[selectedCategory]
    ? backgroundOptions.filter((o) => o.category === CATEGORY_TO_DATA[selectedCategory])
    : backgroundOptions

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.6)" />
        </Pressable>
        <Text style={s.headerTitle}>Background</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[s.body, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Photo Preview ── */}
        <View style={s.previewContainer}>
          <LinearGradient
            colors={BG_PREVIEW[selectedBg] ?? ['#444444', '#333333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.previewBg}
          >
            {/* Subject silhouette area */}
            <View style={s.subjectOutline}>
              <LinearGradient
                colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']}
                style={s.subjectInner}
              >
                <Ionicons name="person" size={64} color="rgba(255,255,255,0.25)" />
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>

        {/* ── Status ── */}
        <View style={s.statusRow}>
          <View style={s.statusBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#4ade80" />
          </View>
          <Text style={s.statusText}>AI detected subject</Text>
        </View>

        {/* ── Category Chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipRow}
        >
          {CATEGORIES.map((cat) => {
            const active = cat === selectedCategory
            return (
              <Pressable
                key={cat}
                style={[s.chip, active && s.chipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>{cat}</Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {/* ── Background Grid ── */}
        <View style={s.grid}>
          {filteredOptions.map((opt) => {
            const active = opt.id === selectedBg
            const colors = BG_PREVIEW[opt.id] ?? ['#555555', '#444444']
            return (
              <Pressable
                key={opt.id}
                style={[s.gridItem, active && s.gridItemActive]}
                onPress={() => setSelectedBg(opt.id)}
              >
                <View style={[s.previewThumb, active && s.previewThumbActive]}>
                  {opt.id === 'bg-none' ? (
                    <View style={s.transparentPreview}>
                      <Ionicons name="close-circle-outline" size={28} color={TEXT_TERTIARY} />
                    </View>
                  ) : (
                    <LinearGradient
                      colors={colors as [string, string]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={s.thumbGradient}
                    />
                  )}
                </View>
                <Text style={[s.gridLabel, active && s.gridLabelActive]} numberOfLines={1}>
                  {opt.name}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>

      {/* ── Bottom Action ── */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Button label="Apply Background" size="lg" fullWidth onPress={() => router.back()} />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: { color: TEXT_PRIMARY, fontSize: 17, fontWeight: '700' },
  body: { padding: 20, gap: 18 },

  /* Preview */
  previewContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  previewBg: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectOutline: {
    width: 130,
    height: 180,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: ACCENT,
    borderStyle: 'dashed',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectInner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  /* Status */
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '600',
  },

  /* Category Chips */
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
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
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: ACCENT,
  },

  /* Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '30.5%',
    alignItems: 'center',
    gap: 6,
  },
  gridItemActive: {},
  previewThumb: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: BORDER,
  },
  previewThumbActive: {
    borderColor: ACCENT,
    borderWidth: 2,
  },
  thumbGradient: {
    flex: 1,
  },
  transparentPreview: {
    flex: 1,
    backgroundColor: SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLabel: {
    color: TEXT_SECONDARY,
    fontSize: 11.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  gridLabelActive: {
    color: ACCENT,
  },

  /* Bottom Bar */
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
    backgroundColor: BG,
  },
})
