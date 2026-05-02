import React, { useState } from 'react'
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import {
  BG,
  ACCENT,
  ACCENT_DIM,
  BORDER,
  SURFACE,
  SURFACE2,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  SECONDARY,
} from '@/lib/theme'
import { filterPresets, aiTools } from '@/lib/mockData'

const { width: SCREEN_W } = Dimensions.get('window')

type EditorTool = 'Filters' | 'Adjust' | 'Beauty' | 'Background' | 'Effects' | 'Crop' | 'Text'

const TOOLS: { key: EditorTool; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'Filters', icon: 'color-filter-outline' },
  { key: 'Adjust', icon: 'options-outline' },
  { key: 'Beauty', icon: 'sparkles-outline' },
  { key: 'Background', icon: 'image-outline' },
  { key: 'Effects', icon: 'flash-outline' },
  { key: 'Crop', icon: 'crop-outline' },
  { key: 'Text', icon: 'text-outline' },
]

const ADJUST_SLIDERS = [
  { label: 'Brightness', value: 0.5 },
  { label: 'Contrast', value: 0.45 },
  { label: 'Saturation', value: 0.6 },
  { label: 'Warmth', value: 0.4 },
]

export default function EditorScreen() {
  const insets = useSafeAreaInsets()
  const [activeTool, setActiveTool] = useState<EditorTool>('Filters')
  const [sliders, setSliders] = useState(
    ADJUST_SLIDERS.map((s) => ({ ...s }))
  )
  const [activeFilter, setActiveFilter] = useState<string>(filterPresets[0].id)

  const beautyTools = aiTools.filter((t) => t.category === 'beauty' || t.category === 'retouch')

  const updateSlider = (index: number, delta: number) => {
    setSliders((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        value: Math.min(1, Math.max(0, next[index].value + delta)),
      }
      return next
    })
  }

  /* ---- Panel renderers ---- */

  const renderFiltersPanel = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersScroll}
    >
      {filterPresets.map((preset) => {
        const isActive = activeFilter === preset.id
        return (
          <Pressable
            key={preset.id}
            style={[styles.filterCard, isActive && styles.filterCardActive]}
            onPress={() => setActiveFilter(preset.id)}
          >
            <LinearGradient
              colors={preset.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.filterPreview}
            />
            <Text
              style={[
                styles.filterName,
                isActive && { color: ACCENT },
              ]}
              numberOfLines={1}
            >
              {preset.name}
            </Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )

  const renderAdjustPanel = () => (
    <View style={styles.adjustContainer}>
      {sliders.map((slider, idx) => (
        <View key={slider.label} style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>{slider.label}</Text>
          <View style={styles.sliderTrack}>
            <View
              style={[styles.sliderFill, { width: `${slider.value * 100}%` }]}
            />
            <View
              style={[
                styles.sliderThumb,
                { left: `${slider.value * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.sliderValue}>
            {Math.round(slider.value * 100)}
          </Text>
          <View style={styles.sliderButtons}>
            <Pressable
              onPress={() => updateSlider(idx, -0.05)}
              style={styles.sliderBtn}
            >
              <Ionicons name="remove" size={14} color={TEXT_SECONDARY} />
            </Pressable>
            <Pressable
              onPress={() => updateSlider(idx, 0.05)}
              style={styles.sliderBtn}
            >
              <Ionicons name="add" size={14} color={TEXT_SECONDARY} />
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  )

  const renderBeautyPanel = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersScroll}
    >
      {beautyTools.map((tool) => (
        <Pressable key={tool.id} style={styles.beautyCard}>
          <LinearGradient
            colors={tool.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.beautyIcon}
          >
            <Ionicons
              name={tool.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color="#fff"
            />
          </LinearGradient>
          <Text style={styles.beautyLabel} numberOfLines={1}>
            {tool.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  )

  const renderDefaultPanel = () => (
    <View style={styles.defaultPanel}>
      <Ionicons name="construct-outline" size={28} color={TEXT_TERTIARY} />
      <Text style={styles.defaultPanelText}>
        {activeTool} tools coming soon
      </Text>
    </View>
  )

  const renderPanel = () => {
    switch (activeTool) {
      case 'Filters':
        return renderFiltersPanel()
      case 'Adjust':
        return renderAdjustPanel()
      case 'Beauty':
        return renderBeautyPanel()
      default:
        return renderDefaultPanel()
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ---- Top bar ---- */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.topBtn}>
          <Ionicons name="chevron-back" size={24} color={TEXT_PRIMARY} />
        </Pressable>

        <Text style={styles.topTitle}>Photo Editor</Text>

        <Pressable
          onPress={() => router.push('/export' as any)}
          style={styles.saveBtn}
        >
          <Ionicons name="download-outline" size={18} color={ACCENT} />
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </View>

      {/* ---- Image preview ---- */}
      <View style={styles.previewWrapper}>
        <LinearGradient
          colors={['#1e1e2e', '#282840', '#1e1e2e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.previewGradient}
        >
          <View style={styles.previewPlaceholder}>
            <Ionicons name="image-outline" size={56} color={TEXT_TERTIARY} />
            <Text style={styles.previewHint}>Photo Preview</Text>
          </View>
        </LinearGradient>
      </View>

      {/* ---- Tool bar ---- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.toolbarScroll}
        style={styles.toolbar}
      >
        {TOOLS.map((tool) => {
          const isActive = activeTool === tool.key
          return (
            <Pressable
              key={tool.key}
              onPress={() => setActiveTool(tool.key)}
              style={[styles.toolPill, isActive && styles.toolPillActive]}
            >
              <Ionicons
                name={tool.icon}
                size={18}
                color={isActive ? ACCENT : TEXT_SECONDARY}
              />
              <Text
                style={[
                  styles.toolLabel,
                  isActive && styles.toolLabelActive,
                ]}
              >
                {tool.key}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* ---- Panel ---- */}
      <View style={styles.panelArea}>{renderPanel()}</View>

      {/* ---- Export button ---- */}
      <View style={[styles.exportBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          label="Export"
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => router.push('/export' as any)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    color: TEXT_PRIMARY,
    fontSize: 17,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: ACCENT_DIM,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
  },

  /* Preview */
  previewWrapper: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  previewGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  previewHint: {
    color: TEXT_TERTIARY,
    fontSize: 14,
    fontWeight: '500',
  },

  /* Toolbar */
  toolbar: {
    flexGrow: 0,
    marginTop: 12,
  },
  toolbarScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  toolPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  toolPillActive: {
    backgroundColor: ACCENT_DIM,
    borderColor: ACCENT,
  },
  toolLabel: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '500',
  },
  toolLabelActive: {
    color: ACCENT,
    fontWeight: '600',
  },

  /* Panel area */
  panelArea: {
    minHeight: 140,
    marginTop: 12,
  },

  /* Filters panel */
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterCard: {
    width: 80,
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  filterCardActive: {
    borderColor: ACCENT,
    backgroundColor: ACCENT_DIM,
  },
  filterPreview: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  filterName: {
    color: TEXT_SECONDARY,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },

  /* Adjust panel */
  adjustContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sliderLabel: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    fontWeight: '500',
    width: 72,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: SURFACE2,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: TEXT_PRIMARY,
    marginLeft: -7,
    top: -5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  sliderValue: {
    color: TEXT_TERTIARY,
    fontSize: 12,
    fontWeight: '500',
    width: 28,
    textAlign: 'right',
  },
  sliderButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  sliderBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: SURFACE2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Beauty panel */
  beautyCard: {
    alignItems: 'center',
    gap: 8,
    width: 80,
  },
  beautyIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beautyLabel: {
    color: TEXT_SECONDARY,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },

  /* Default panel */
  defaultPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  defaultPanelText: {
    color: TEXT_TERTIARY,
    fontSize: 14,
    fontWeight: '500',
  },

  /* Export bar */
  exportBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
})
