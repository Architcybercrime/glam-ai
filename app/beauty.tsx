import { useState } from 'react'
import { View, StyleSheet, Pressable, ScrollView } from 'react-native'
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
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  SECONDARY,
} from '@/lib/theme'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SliderControl = { kind: 'slider'; value: number }
type ToggleControl = { kind: 'toggle'; on: boolean }
type ColorControl = { kind: 'color'; colors: string[]; selected: number }

type BeautyOption =
  | { label: string; control: SliderControl }
  | { label: string; control: ToggleControl }
  | { label: string; control: ColorControl }

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const LIPSTICK_COLORS = ['#e040fb', '#f44336', '#e91e63', '#d50000', '#ff6f00']
const BLUSH_COLORS    = ['#f48fb1', '#ef9a9a', '#ffab91', '#ce93d8', '#f06292']
const EYELINER_COLORS = ['#212121', '#4e342e', '#1a237e', '#880e4f', '#263238']

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BeautyScreen() {
  const insets = useSafeAreaInsets()

  // Before / After toggle
  const [showBefore, setShowBefore] = useState(false)

  // Slider values (0-100)
  const [skinSmoothing, setSkinSmoothing] = useState(65)
  const [faceReshape, setFaceReshape]     = useState(40)

  // Toggles
  const [eyeEnlarge, setEyeEnlarge]         = useState(true)
  const [teethWhitening, setTeethWhitening]  = useState(false)
  const [blemishRemoval, setBlemishRemoval]  = useState(true)

  // Makeup color selections (index into palette)
  const [lipstickIdx, setLipstickIdx] = useState(0)
  const [blushIdx, setBlushIdx]       = useState(1)
  const [eyelinerIdx, setEyelinerIdx] = useState(0)

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* -------- Top bar -------- */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={TEXT_PRIMARY} />
        </Pressable>
        <Text style={styles.title}>AI Beauty</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* -------- Preview area -------- */}
        <View style={styles.previewContainer}>
          <LinearGradient
            colors={
              showBefore
                ? ['#3a3a52', '#24243e', '#1a1a2e']
                : ['#7c4dff', '#e040fb', '#ff6090']
            }
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.previewGradient}
          >
            <Ionicons
              name="person"
              size={80}
              color="rgba(255,255,255,0.18)"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.previewLabel}>
              {showBefore ? 'Original' : 'Enhanced'}
            </Text>
          </LinearGradient>

          {/* Before / After pill */}
          <Pressable
            onPress={() => setShowBefore((p) => !p)}
            style={styles.beforeAfterPill}
          >
            <Text style={styles.beforeAfterText}>
              {showBefore ? 'Before' : 'After'}
            </Text>
          </Pressable>
        </View>

        {/* -------- Controls -------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adjustments</Text>

          {/* Skin Smoothing */}
          <SliderRow
            label="Skin Smoothing"
            value={skinSmoothing}
            onChange={setSkinSmoothing}
          />

          {/* Face Reshape */}
          <SliderRow
            label="Face Reshape"
            value={faceReshape}
            onChange={setFaceReshape}
          />

          {/* Toggles */}
          <ToggleRow label="Eye Enlarge" on={eyeEnlarge} onToggle={() => setEyeEnlarge((p) => !p)} />
          <ToggleRow label="Teeth Whitening" on={teethWhitening} onToggle={() => setTeethWhitening((p) => !p)} />
          <ToggleRow label="Blemish Removal" on={blemishRemoval} onToggle={() => setBlemishRemoval((p) => !p)} />
        </View>

        {/* -------- Makeup -------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Makeup</Text>

          <ColorRow
            label="Lipstick"
            colors={LIPSTICK_COLORS}
            selected={lipstickIdx}
            onSelect={setLipstickIdx}
          />
          <ColorRow
            label="Blush"
            colors={BLUSH_COLORS}
            selected={blushIdx}
            onSelect={setBlushIdx}
          />
          <ColorRow
            label="Eyeliner"
            colors={EYELINER_COLORS}
            selected={eyelinerIdx}
            onSelect={setEyelinerIdx}
          />
        </View>
      </ScrollView>

      {/* -------- Apply button -------- */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button label="Apply" variant="primary" size="lg" fullWidth onPress={() => router.back()} />
      </View>
    </View>
  )
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  const cycle = () => {
    // Simple tap-to-cycle: 0 → 33 → 66 → 100 → 0
    const next = value >= 100 ? 0 : Math.min(value + 25, 100)
    onChange(next)
  }

  return (
    <View style={styles.controlRow}>
      <View style={styles.controlHeader}>
        <Text style={styles.controlLabel}>{label}</Text>
        <Text style={styles.controlValue}>{value}%</Text>
      </View>
      <Pressable onPress={cycle} style={styles.sliderTrack}>
        <LinearGradient
          colors={[ACCENT, SECONDARY]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.sliderFill, { width: `${value}%` as any }]}
        />
      </Pressable>
    </View>
  )
}

function ToggleRow({
  label,
  on,
  onToggle,
}: {
  label: string
  on: boolean
  onToggle: () => void
}) {
  return (
    <View style={styles.controlRow}>
      <Text style={styles.controlLabel}>{label}</Text>
      <Pressable
        onPress={onToggle}
        style={[styles.toggleTrack, on && styles.toggleTrackOn]}
      >
        <View style={[styles.toggleThumb, on && styles.toggleThumbOn]} />
      </Pressable>
    </View>
  )
}

function ColorRow({
  label,
  colors,
  selected,
  onSelect,
}: {
  label: string
  colors: string[]
  selected: number
  onSelect: (i: number) => void
}) {
  return (
    <View style={styles.controlRow}>
      <Text style={styles.controlLabel}>{label}</Text>
      <View style={styles.colorDots}>
        {colors.map((c, i) => (
          <Pressable
            key={c}
            onPress={() => onSelect(i)}
            style={[
              styles.colorDot,
              { backgroundColor: c },
              i === selected && styles.colorDotSelected,
            ]}
          />
        ))}
      </View>
    </View>
  )
}

/* ================================================================== */
/*  Styles                                                             */
/* ================================================================== */

const styles = StyleSheet.create({
  root: {
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: '700',
  },

  /* Scroll */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },

  /* Preview */
  previewContainer: {
    marginTop: 8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    position: 'relative',
  },
  previewGradient: {
    height: 340,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    fontWeight: '600',
  },
  beforeAfterPill: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  beforeAfterText: {
    color: TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '700',
  },

  /* Section */
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  /* Shared control row */
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SURFACE,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  controlHeader: {
    flex: 1,
    marginRight: 12,
  },
  controlLabel: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '600',
  },
  controlValue: {
    color: TEXT_TERTIARY,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },

  /* Mock slider */
  sliderTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginTop: 10,
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },

  /* Toggle */
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackOn: {
    backgroundColor: ACCENT_DIM,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: ACCENT,
  },

  /* Color dots */
  colorDots: {
    flexDirection: 'row',
    gap: 10,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: TEXT_PRIMARY,
    borderWidth: 2.5,
  },

  /* Bottom apply bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
})
