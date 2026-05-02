import { View, ScrollView, StyleSheet, Pressable } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { Card } from '@/components/ui/Card'
import {
  BG, BORDER, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, ACCENT, SECONDARY, SURFACE,
} from '@/lib/theme'
import { galleryItems, aiTools } from '@/lib/mockData'
import { Button } from '@/components/ui/Button'

export default function DetailScreen() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{ id: string }>()

  const item = galleryItems.find((g) => g.id === id) ?? galleryItems[0]

  const THUMB_GRADIENTS: readonly [string, string][] = [
    ['#e040fb', '#7c4dff'],
    ['#7c4dff', '#00e5ff'],
    ['#ff6090', '#ff8a65'],
    ['#ffd740', '#ff6d00'],
    ['#00e5ff', '#00bfa5'],
    ['#f48fb1', '#e040fb'],
  ]
  const gradient = THUMB_GRADIENTS[galleryItems.findIndex((g) => g.id === id) % THUMB_GRADIENTS.length]

  const relatedTools = aiTools.filter((t) => item.toolsUsed.some((u) => u === t.name))

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.6)" />
        </Pressable>
        <Text style={s.headerTitle} numberOfLines={1}>{item.title}</Text>
        <Pressable onPress={() => router.push('/editor' as any)} hitSlop={12}>
          <Ionicons name="create-outline" size={22} color={ACCENT} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[s.body, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Thumbnail preview */}
        <View style={s.thumbWrap}>
          <LinearGradient
            colors={[...gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Ionicons
            name={item.format === 'video' ? 'play-circle' : item.format === 'carousel' ? 'albums' : 'image'}
            size={52}
            color="rgba(255,255,255,0.4)"
          />
        </View>

        {/* Meta */}
        <Card style={s.metaCard}>
          <View style={s.metaRow}>
            <View style={s.metaBadge}>
              <Text style={s.metaBadgeText}>{item.format}</Text>
            </View>
            <Text style={s.metaSize}>{item.width} × {item.height}</Text>
            <Text style={s.metaTime}>{item.editedAt}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.statsGrid}>
            <StatItem label="Format" value={item.format} />
            <StatItem label="Width" value={`${item.width}px`} />
            <StatItem label="Height" value={`${item.height}px`} />
            <StatItem label="Tools used" value={`${item.toolsUsed.length}`} />
          </View>
        </Card>

        {/* Tools used */}
        <Text style={s.sectionTitle}>AI Tools Used</Text>
        {item.toolsUsed.map((toolName) => {
          const tool = relatedTools.find((t) => t.name === toolName)
          return (
            <Card key={toolName} style={s.toolRow}>
              {tool && (
                <LinearGradient
                  colors={[...tool.gradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.toolIcon}
                >
                  <Ionicons name={tool.icon as any} size={16} color="#fff" />
                </LinearGradient>
              )}
              {!tool && (
                <View style={[s.toolIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                  <Ionicons name="sparkles" size={16} color={ACCENT} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={s.toolName}>{toolName}</Text>
                <Text style={s.toolDesc}>{tool?.description ?? 'AI-powered editing tool'}</Text>
              </View>
            </Card>
          )
        })}

        <Button
          label="Re-edit in Editor"
          variant="primary"
          fullWidth
          onPress={() => router.push('/editor' as any)}
          style={{ marginTop: 8 }}
        />
        <Button
          label="Export"
          variant="secondary"
          fullWidth
          onPress={() => router.push('/export' as any)}
        />
      </ScrollView>
    </View>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.statItem}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: { flex: 1, color: TEXT_PRIMARY, fontSize: 16.5, fontWeight: '700', textAlign: 'center' },
  body: { padding: 20, gap: 12 },

  thumbWrap: {
    height: 220, borderRadius: 20, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },

  metaCard: { gap: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metaBadge: {
    backgroundColor: 'rgba(224,64,251,0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
  },
  metaBadgeText: { color: ACCENT, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  metaSize: { fontSize: 12, color: TEXT_TERTIARY, flex: 1 },
  metaTime: { fontSize: 12, color: TEXT_TERTIARY },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: BORDER },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statItem: {
    minWidth: 120, borderWidth: 1, borderColor: BORDER,
    borderRadius: 10, paddingVertical: 8, paddingHorizontal: 9,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  statLabel: { fontSize: 11, color: TEXT_TERTIARY },
  statValue: { fontSize: 14, color: TEXT_PRIMARY, fontWeight: '700', marginTop: 2 },

  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: TEXT_TERTIARY,
    letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 4,
  },
  toolRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  toolIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  toolName: { fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY },
  toolDesc: { fontSize: 12, color: TEXT_SECONDARY, marginTop: 1 },
})
