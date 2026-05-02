import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
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
import { videoEffects } from '@/lib/mockData'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const TOOLS = [
  { key: 'trim', label: 'Trim', icon: 'cut-outline' as const },
  { key: 'effects', label: 'Effects', icon: 'sparkles' as const },
  { key: 'text', label: 'Text', icon: 'text-outline' as const },
  { key: 'stickers', label: 'Stickers', icon: 'happy-outline' as const },
  { key: 'music', label: 'Music', icon: 'musical-notes-outline' as const },
  { key: 'speed', label: 'Speed', icon: 'speedometer-outline' as const },
  { key: 'filters', label: 'Filters', icon: 'color-filter-outline' as const },
]

export default function VideoEditorScreen() {
  const insets = useSafeAreaInsets()
  const [activeTool, setActiveTool] = useState('effects')

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={TEXT_PRIMARY} />
        </Pressable>

        <Text style={styles.topBarTitle}>Video Editor</Text>

        <Pressable
          onPress={() => {}}
          style={styles.exportTopButton}
        >
          <Text style={styles.exportTopLabel}>Export</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Video Preview ── */}
        <View style={styles.previewWrapper}>
          <LinearGradient
            colors={[SECONDARY, ACCENT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.previewGradient}
          >
            <Pressable style={styles.playButton}>
              <Ionicons name="play" size={36} color={TEXT_PRIMARY} />
            </Pressable>
          </LinearGradient>
        </View>

        {/* ── Timeline ── */}
        <View style={styles.timelineSection}>
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>0:00</Text>
            <Text style={styles.timeText}>0:32</Text>
          </View>

          <View style={styles.timelineTrack}>
            {/* Left trim handle */}
            <View style={[styles.trimHandle, styles.trimHandleLeft]} />

            {/* Timeline bar */}
            <View style={styles.timelineBar}>
              {/* Playhead */}
              <View style={styles.playhead} />
            </View>

            {/* Right trim handle */}
            <View style={[styles.trimHandle, styles.trimHandleRight]} />
          </View>
        </View>

        {/* ── Tools Toolbar ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolbarContent}
          style={styles.toolbar}
        >
          {TOOLS.map((tool) => {
            const isActive = activeTool === tool.key
            return (
              <Pressable
                key={tool.key}
                onPress={() => setActiveTool(tool.key)}
                style={[
                  styles.toolItem,
                  isActive && styles.toolItemActive,
                ]}
              >
                <Ionicons
                  name={tool.icon}
                  size={20}
                  color={isActive ? ACCENT : TEXT_SECONDARY}
                />
                <Text
                  style={[
                    styles.toolLabel,
                    isActive && styles.toolLabelActive,
                  ]}
                >
                  {tool.label}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {/* ── Effects Panel ── */}
        <View style={styles.effectsPanel}>
          <Text style={styles.effectsPanelTitle}>Video Effects</Text>
          <View style={styles.effectsGrid}>
            {videoEffects.map((effect) => (
              <Pressable key={effect.id} style={styles.effectCard}>
                <View style={styles.effectIconWrapper}>
                  <Ionicons
                    name={effect.icon as any}
                    size={22}
                    color={TEXT_PRIMARY}
                  />
                  {effect.isPremium && (
                    <View style={styles.premiumBadge}>
                      <Ionicons name="star" size={8} color={BG} />
                    </View>
                  )}
                </View>
                <Text style={styles.effectName} numberOfLines={1}>
                  {effect.name}
                </Text>
                <Text style={styles.effectCategory} numberOfLines={1}>
                  {effect.category}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          label="Export Video"
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => {}}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },

  /* ── Top Bar ── */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: SURFACE,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  exportTopButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: ACCENT_DIM,
  },
  exportTopLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: ACCENT,
  },

  /* ── Video Preview ── */
  previewWrapper: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  previewGradient: {
    width: '100%',
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },

  /* ── Timeline ── */
  timelineSection: {
    marginTop: 20,
    paddingHorizontal: 4,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: TEXT_TERTIARY,
  },
  timelineTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  trimHandle: {
    width: 10,
    height: 40,
    borderRadius: 4,
  },
  trimHandleLeft: {
    backgroundColor: ACCENT,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  trimHandleRight: {
    backgroundColor: ACCENT,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  timelineBar: {
    flex: 1,
    height: 32,
    backgroundColor: SURFACE2,
    borderRadius: 2,
    justifyContent: 'center',
  },
  playhead: {
    position: 'absolute',
    left: '35%',
    width: 2,
    height: 40,
    backgroundColor: TEXT_PRIMARY,
    borderRadius: 1,
  },

  /* ── Tools Toolbar ── */
  toolbar: {
    marginTop: 20,
  },
  toolbarContent: {
    gap: 8,
    paddingVertical: 4,
  },
  toolItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    minWidth: 72,
  },
  toolItemActive: {
    backgroundColor: ACCENT_DIM,
    borderColor: ACCENT,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginTop: 4,
  },
  toolLabelActive: {
    color: ACCENT,
  },

  /* ── Effects Panel ── */
  effectsPanel: {
    marginTop: 24,
  },
  effectsPanelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  effectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  effectCard: {
    width: (SCREEN_WIDTH - 32 - 40) / 4,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  effectIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: SURFACE2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  premiumBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  effectName: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    textAlign: 'center',
  },
  effectCategory: {
    fontSize: 9,
    fontWeight: '500',
    color: TEXT_TERTIARY,
    textAlign: 'center',
    marginTop: 2,
  },

  /* ── Bottom Bar ── */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
})
