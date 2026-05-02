import { useState, useRef, useEffect } from 'react'
import { View, ScrollView, StyleSheet, Pressable, Animated, Dimensions } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { exportFormats } from '@/lib/mockData'
import {
  BG,
  ACCENT,
  ACCENT_DIM,
  BORDER,
  SURFACE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  SECONDARY,
  GRADIENT_PRIMARY,
} from '@/lib/theme'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const QUALITY_OPTIONS = ['Standard', 'High', 'Ultra HD'] as const
type Quality = (typeof QUALITY_OPTIONS)[number]

const SAVE_OPTIONS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'image-outline', label: 'Camera Roll' },
  { icon: 'share-social-outline', label: 'Share' },
  { icon: 'download-outline', label: 'Direct Export' },
]

export default function ExportScreen() {
  const insets = useSafeAreaInsets()
  const [selectedFormat, setSelectedFormat] = useState(exportFormats[0].id)
  const [selectedQuality, setSelectedQuality] = useState<Quality>('High')
  const [selectedSave, setSelectedSave] = useState('Camera Roll')
  const [exporting, setExporting] = useState(false)
  const progressAnim = useRef(new Animated.Value(0)).current

  function handleExport() {
    if (exporting) return
    setExporting(true)
    progressAnim.setValue(0)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        setExporting(false)
        progressAnim.setValue(0)
      }, 600)
    })
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.6)" />
        </Pressable>
        <Text style={s.headerTitle}>Export</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[s.body, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview */}
        <View style={s.previewContainer}>
          <LinearGradient
            colors={[...GRADIENT_PRIMARY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.previewImage}
          >
            <Ionicons name="image" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={s.previewLabel}>Edited Preview</Text>
          </LinearGradient>
        </View>

        {/* Export Format */}
        <Text style={s.sectionTitle}>Export Format</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.formatsRow}
        >
          {exportFormats.map((fmt) => {
            const active = fmt.id === selectedFormat
            return (
              <Pressable
                key={fmt.id}
                style={[s.formatCard, active && s.formatCardActive]}
                onPress={() => setSelectedFormat(fmt.id)}
              >
                <Ionicons
                  name={fmt.icon as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={active ? ACCENT : TEXT_SECONDARY}
                />
                <Text style={[s.formatLabel, active && { color: TEXT_PRIMARY }]}>
                  {fmt.label}
                </Text>
                <Text style={[s.formatRatio, active && { color: ACCENT }]}>
                  {fmt.ratio}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {/* Quality */}
        <Text style={s.sectionTitle}>Quality</Text>
        <View style={s.qualityRow}>
          {QUALITY_OPTIONS.map((q) => {
            const active = q === selectedQuality
            return (
              <Pressable
                key={q}
                style={[s.qualityPill, active && s.qualityPillActive]}
                onPress={() => setSelectedQuality(q)}
              >
                <Text style={[s.qualityText, active && s.qualityTextActive]}>
                  {q}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {/* Save to */}
        <Text style={s.sectionTitle}>Save to</Text>
        <View style={s.saveGroup}>
          {SAVE_OPTIONS.map((opt, i) => {
            const active = opt.label === selectedSave
            return (
              <Pressable
                key={opt.label}
                style={[
                  s.saveRow,
                  active && s.saveRowActive,
                  i < SAVE_OPTIONS.length - 1 && s.saveRowBorder,
                ]}
                onPress={() => setSelectedSave(opt.label)}
              >
                <View style={[s.saveIconWrap, active && s.saveIconWrapActive]}>
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={active ? ACCENT : TEXT_SECONDARY}
                  />
                </View>
                <Text style={[s.saveLabel, active && { color: TEXT_PRIMARY }]}>
                  {opt.label}
                </Text>
                {active && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={ACCENT}
                    style={{ marginLeft: 'auto' }}
                  />
                )}
              </Pressable>
            )
          })}
        </View>

        {/* Progress bar (visible when exporting) */}
        {exporting && (
          <View style={s.progressContainer}>
            <View style={s.progressTrack}>
              <Animated.View style={[s.progressFill, { width: progressWidth }]}>
                <LinearGradient
                  colors={[...GRADIENT_PRIMARY]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </Animated.View>
            </View>
            <Text style={s.progressText}>Exporting...</Text>
          </View>
        )}

        {/* Export button */}
        <Pressable
          style={[s.exportBtn, exporting && { opacity: 0.5 }]}
          onPress={handleExport}
          disabled={exporting}
        >
          <LinearGradient
            colors={[...GRADIENT_PRIMARY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Ionicons name="cloud-upload-outline" size={20} color={BG} style={{ marginRight: 8 }} />
          <Text style={s.exportBtnText}>Export Now</Text>
        </Pressable>
      </ScrollView>
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
  headerTitle: {
    color: TEXT_PRIMARY,
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    padding: 20,
    gap: 14,
  },

  /* Preview */
  previewContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  previewImage: {
    width: SCREEN_WIDTH - 80,
    height: (SCREEN_WIDTH - 80) * 0.65,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },

  /* Section title */
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_TERTIARY,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 6,
  },

  /* Format cards */
  formatsRow: {
    gap: 10,
    paddingVertical: 2,
  },
  formatCard: {
    width: 88,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: SURFACE,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: 'center',
    gap: 6,
  },
  formatCardActive: {
    borderColor: ACCENT,
    backgroundColor: ACCENT_DIM,
  },
  formatLabel: {
    color: TEXT_SECONDARY,
    fontSize: 12.5,
    fontWeight: '600',
  },
  formatRatio: {
    color: TEXT_TERTIARY,
    fontSize: 11,
    fontWeight: '500',
  },

  /* Quality pills */
  qualityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  qualityPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
  },
  qualityPillActive: {
    borderColor: ACCENT,
    backgroundColor: ACCENT_DIM,
  },
  qualityText: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '600',
  },
  qualityTextActive: {
    color: ACCENT,
  },

  /* Save options */
  saveGroup: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  saveRowActive: {
    backgroundColor: ACCENT_DIM,
  },
  saveRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  saveIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIconWrapActive: {
    backgroundColor: 'rgba(224,64,251,0.15)',
  },
  saveLabel: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: '600',
  },

  /* Progress */
  progressContainer: {
    gap: 8,
    marginTop: 4,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressText: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  /* Export button */
  exportBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 6,
  },
  exportBtnText: {
    color: BG,
    fontSize: 16,
    fontWeight: '700',
  },
})
