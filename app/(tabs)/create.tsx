import { View, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { Card } from '@/components/ui/Card'
import {
  BG,
  ACCENT,
  SECONDARY,
  BORDER,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  GRADIENT_PRIMARY,
  GRADIENT_COOL,
  SURFACE,
} from '@/lib/theme'
import { TAB_BAR_CLEARANCE } from '@/components/TabBar'
import { exportFormats } from '@/lib/mockData'

const { width: SW } = Dimensions.get('window')

const TEMPLATES = exportFormats.filter((f) => f.id !== 'exp-carousel')

export default function CreateScreen() {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BG }}
      contentContainerStyle={[s.container, { paddingTop: insets.top + 16, paddingBottom: TAB_BAR_CLEARANCE + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heading}>Start Creating</Text>
        <Text style={s.subtitle}>Choose a starting point for your next masterpiece</Text>
      </View>

      {/* Action Cards */}
      <View style={s.actionRow}>
        <Pressable
          onPress={() => router.push('/editor' as any)}
          style={({ pressed }) => [s.actionCard, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
        >
          <LinearGradient
            colors={[...GRADIENT_PRIMARY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.actionGradient}
          >
            <View style={s.actionIconWrap}>
              <Ionicons name="image-outline" size={32} color="#fff" />
            </View>
            <Text style={s.actionTitle}>Edit Photo</Text>
            <Text style={s.actionDesc}>AI-powered photo editing</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => router.push('/video-editor' as any)}
          style={({ pressed }) => [s.actionCard, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
        >
          <LinearGradient
            colors={[...GRADIENT_COOL]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.actionGradient}
          >
            <View style={s.actionIconWrap}>
              <Ionicons name="videocam-outline" size={32} color="#fff" />
            </View>
            <Text style={s.actionTitle}>Edit Video</Text>
            <Text style={s.actionDesc}>Trim, effects & transitions</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Quick Start Templates */}
      <Text style={s.sectionTitle}>Quick Start Templates</Text>
      <View style={s.templateGrid}>
        {TEMPLATES.map((tpl) => (
          <Pressable
            key={tpl.id}
            onPress={() => router.push('/editor' as any)}
            style={({ pressed }) => [pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] }]}
          >
            <Card style={s.templateCard}>
              <View style={s.templateIconWrap}>
                <Ionicons name={tpl.icon as any} size={22} color={ACCENT} />
              </View>
              <Text style={s.templateLabel}>{tpl.label}</Text>
              <Text style={s.templateRatio}>{tpl.ratio}</Text>
            </Card>
          </Pressable>
        ))}
      </View>

      {/* From Gallery */}
      <Pressable
        onPress={() => router.push('/editor' as any)}
        style={({ pressed }) => [s.galleryBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
      >
        <Ionicons name="images-outline" size={20} color={TEXT_PRIMARY} />
        <Text style={s.galleryBtnText}>From Gallery</Text>
        <Ionicons name="chevron-forward" size={16} color={TEXT_TERTIARY} style={{ marginLeft: 'auto' }} />
      </Pressable>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 18 },

  hero: { gap: 6, marginBottom: 2 },
  heading: { fontSize: 28, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: -0.6 },
  subtitle: { fontSize: 14, color: TEXT_SECONDARY, lineHeight: 20 },

  actionRow: { flexDirection: 'row', gap: 12 },
  actionCard: { flex: 1 },
  actionGradient: {
    borderRadius: 20,
    padding: 20,
    minHeight: 170,
    justifyContent: 'flex-end',
    gap: 4,
  },
  actionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  actionDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_TERTIARY,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  templateGrid: { flexDirection: 'row', gap: 10 },
  templateCard: {
    width: (SW - 40 - 30) / 4,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  templateIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(224,64,251,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateLabel: { fontSize: 12, fontWeight: '600', color: TEXT_PRIMARY },
  templateRatio: { fontSize: 10, fontWeight: '500', color: TEXT_TERTIARY },

  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SURFACE,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  galleryBtnText: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
})
