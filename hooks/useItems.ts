import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { recentEdits, galleryItems, type RecentEdit, type GalleryItem } from '@/lib/mockData'

export function useRecentEdits() {
  return useQuery<RecentEdit[]>({
    queryKey: ['recent-edits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('edits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      if (error) throw error
      return (data ?? []) as RecentEdit[]
    },
    placeholderData: recentEdits,
  })
}

export function useGalleryItems() {
  return useQuery<GalleryItem[]>({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return (data ?? []) as GalleryItem[]
    },
    placeholderData: galleryItems,
  })
}
