import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type NotificationItem = {
  id: string
  title: string
  body: string
  timeAgo: string
  category: 'billing' | 'system' | 'product' | 'team'
  read: boolean
}

const placeholderNotifications: NotificationItem[] = [
  { id: 'n-1', title: 'Export complete', body: 'Your story export is ready to share.', timeAgo: '2m ago', category: 'product', read: false },
  { id: 'n-2', title: 'New AI filter available', body: 'Try the new Neon Night filter in your editor.', timeAgo: '1h ago', category: 'product', read: false },
  { id: 'n-3', title: 'Welcome to GlamAI', body: 'Start creating with AI-powered editing tools.', timeAgo: '1d ago', category: 'system', read: true },
]

export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data as NotificationItem[]
    },
    placeholderData: placeholderNotifications,
  })
}
