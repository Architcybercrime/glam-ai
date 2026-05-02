import { useState } from 'react'
import { View, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { Card } from '@/components/ui/Card'
import {
  ACCENT,
  ACCENT_DIM,
  BG,
  SECONDARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  BORDER,
  GRADIENT_PRIMARY,
  GRADIENT_COOL,
  GRADIENT_WARM,
} from '@/lib/theme'
import { TAB_BAR_CLEARANCE } from '@/components/TabBar'
import { aiTools, recentEdits, insightCards } from '@/lib/mockData'

const { width: SW } = Dimensions.get('window')

const QUICK_ACTIONS = [
  { id: 'qa-beauty', label: 'Beauty', icon: 'sparkles' as const, gradient: GRADIENT_PRIMARY, route: '/beauty' },
  { id: 'qa-bg', label: 'BG Remove', icon: 'cut-outline' as const, gradient: GRADIENT_COOL, route: '/background' },
  { id: 'qa-enhance', label: 'Enhance', icon: 'sunny-outline' as const, gradient: GRADIENT_WARM, route: '/editor' },
  { id: 'qa-video', label: 'Video', icon: 'videocam-outline' as const, gradient: ['#7c4dff', '#e040fb'] as const, route: '/video-editor' },
]

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const [refreshing, setRefreshing] = useState(false)

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const topTools = aiTools.slice(0, 4)

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BG }}
      contentContainerStyle={[s.container, { paddingTop: insets.top + 16, paddingBottom: TAB_BAR_CLEARANCE + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={s.greeting}>{greeting}</Text>
        <Text style={s.subGreeting}>What will you create today?</Text>
      </View>

      {/* Quick Actions */}
      <View style={s.quickRow}>
        {QUICK_ACTIONS.map((action) => (
          <Pressable
            key={action.id}
            onPress={() => router.push(action.route as any)}
            style={({ pressed }) => [s.quickItem, pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }]}
          >
            <LinearGradient
              colors={[...action.gradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.quickIcon}
            >
              <Ionicons name={action.icon} size={22} color="#fff" />
            </LinearGradient>
            <Text style={s.quickLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Stats */}
      <Text style={s.sectionTitle}>Today's Stats</Text>
      <View style={s.cardGrid}>
        {insightCards.map((insight) => (
          <Card key={insight.id} style={s.metricCard}>
            <Text style={s.metricLabel}>{insight.label}</Text>
            <Text style={s.metricValue}>{insight.value}</Text>
            <Text style={s.metricDelta}>{insight.delta}</Text>
          </Card>
        ))}
      </View>

      {/* AI Tools Spotlight */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>AI Tools</Text>
        <Pressable onPress={() => router.push('/(tabs)/tools')}>
          <Text style={s.seeAll}>See all</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.toolsScroll}>
        {topTools.map((tool) => (
          <Pressable
            key={tool.id}
            onPress={() => router.push('/editor' as any)}
            style={({ pressed }) => [s.toolCard, pressed && { opacity: 0.85 }]}
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
            <Text style={s.toolDesc} numberOfLines={2}>{tool.description}</Text>
            {tool.isPremium && (
              <View style={s.premiumBadge}>
                <Ionicons name="sparkles" size={9} color="#fff" />
                <Text style={s.premiumText}>PRO</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {/* Recent Edits */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Recent Edits</Text>
        <Pressable onPress={() => router.push('/(tabs)/gallery')}>
          <Text style={s.seeAll}>View all</Text>
        </Pressable>
      </View>
      {recentEdits.map((edit) => (
        <Pressable
          key={edit.id}
          onPress={() => router.push('/editor' as any)}
          style={({ pressed }) => [pressed && { opacity: 0.75 }]}
        >
          <Card style={s.editCard}>
            <View style={s.editThumb}>
              <LinearGradient
                colors={['rgba(224,64,251,0.3)', 'rgba(124,77,255,0.3)']}
                style={StyleSheet.absoluteFillObject}
              />
              <Ionicons
                name={edit.format === 'video' ? 'videocam' : edit.format === 'carousel' ? 'albums' : 'image'}
                size={20}
                color="rgba(255,255,255,0.6)"
              />
            </View>
            <View style={s.editInfo}>
              <Text style={s.editTitle}>{edit.title}</Text>
              <Text style={s.editMeta}>{edit.toolUsed} · {edit.timestamp}</Text>
            </View>
            <View style={s.formatBadge}>
              <Text style={s.formatText}>{edit.format}</Text>
            </View>
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 14 },
  header: { gap: 4, marginBottom: 4 },
  greeting: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.6 },
  subGreeting: { fontSize: 14, color: TEXT_SECONDARY },

  quickRow: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  quickItem: { alignItems: 'center', gap: 8, flex: 1 },
  quickIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 11, fontWeight: '600', color: TEXT_SECONDARY },

  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: TEXT_TERTIARY,
    letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 4,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  seeAll: { fontSize: 12, fontWeight: '600', color: ACCENT },

  cardGrid: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, gap: 3, paddingVertical: 12, paddingHorizontal: 12 },
  metricLabel: { fontSize: 11, color: TEXT_TERTIARY, fontWeight: '600' },
  metricValue: { fontSize: 17, color: '#fff', fontWeight: '700', letterSpacing: -0.2 },
  metricDelta: { fontSize: 11, color: ACCENT },

  toolsScroll: { gap: 12, paddingRight: 20 },
  toolCard: {
    width: SW * 0.38, backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: BORDER, borderRadius: 16,
    padding: 14, gap: 8,
  },
  toolGradient: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  toolName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  toolDesc: { fontSize: 11, color: TEXT_SECONDARY, lineHeight: 16 },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-start',
    backgroundColor: 'rgba(224,64,251,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  premiumText: { fontSize: 9, fontWeight: '800', color: ACCENT },

  editCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12 },
  editThumb: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  editInfo: { flex: 1, gap: 3 },
  editTitle: { fontSize: 14, fontWeight: '600', color: '#fff' },
  editMeta: { fontSize: 11.5, color: TEXT_TERTIARY },
  formatBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  formatText: { fontSize: 10, fontWeight: '600', color: TEXT_SECONDARY, textTransform: 'capitalize' },
})
