import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'
import { localClient } from './localBackend'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  ''

export const isSupabaseEnabled = !!SUPABASE_URL && !!SUPABASE_KEY

// When real Supabase credentials are present, use the real client.
// Otherwise fall back to the local-storage-backed client so the app
// works fully without any cloud account.
let _supabase: any

if (isSupabaseEnabled) {
  const storage =
    Platform.OS === 'web'
      ? undefined
      : require('@react-native-async-storage/async-storage').default

  _supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      storage: Platform.OS === 'web' ? undefined : storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  })

  const { AppState } = require('react-native')
  AppState.addEventListener('change', (state: string) => {
    if (state === 'active') _supabase.auth.startAutoRefresh()
    else _supabase.auth.stopAutoRefresh()
  })
} else {
  _supabase = localClient
}

export const supabase = _supabase
