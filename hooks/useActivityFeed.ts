import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { galleryItems, type GalleryItem } from '@/lib/mockData'

export function useGallery() {
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
      return data as GalleryItem[]
    },
    placeholderData: galleryItems,
  })
}
