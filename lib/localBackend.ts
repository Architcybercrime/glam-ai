/**
 * Local-first backend that mirrors the Supabase client API surface.
 * Stores all data in localStorage — works offline, persists between sessions.
 * Drop-in replacement when no Supabase credentials are configured.
 */

const PREFIX = 'glamai:'
const SESSION_KEY = `${PREFIX}session`
const USERS_KEY   = `${PREFIX}users`
const OTP_KEY     = `${PREFIX}otp`

type User = {
  id: string
  email: string
  created_at: string
  user_metadata: Record<string, any>
}

type Session = {
  access_token: string
  user: User
  expires_at: number
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

function store<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}
function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function tableKey(name: string, userId?: string) {
  return userId ? `${PREFIX}db:${userId}:${name}` : `${PREFIX}db:${name}`
}

// ─── ID & token generators ────────────────────────────────────────────────────

function uid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
function fakeToken() {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('')
}

// ─── Auth state listeners ─────────────────────────────────────────────────────

type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'TOKEN_REFRESHED'
type Listener = (event: AuthEvent, session: Session | null) => void
const listeners: Listener[] = []

function emit(event: AuthEvent, session: Session | null) {
  listeners.forEach((fn) => fn(event, session))
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

function getUsers(): Record<string, User & { password_hash?: string }> {
  return load<Record<string, User>>(USERS_KEY) ?? {}
}
function saveUsers(users: Record<string, any>) {
  store(USERS_KEY, users)
}

function getCurrentSession(): Session | null {
  const s = load<Session>(SESSION_KEY)
  if (!s) return null
  if (s.expires_at < Date.now()) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
  return s
}

function createSession(user: User): Session {
  const session: Session = {
    access_token: fakeToken(),
    user,
    expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }
  store(SESSION_KEY, session)
  return session
}

const auth = {
  async getSession() {
    const session = getCurrentSession()
    return { data: { session }, error: null }
  },

  async getUser() {
    const session = getCurrentSession()
    return { data: { user: session?.user ?? null }, error: null }
  },

  async signInWithOtp({ email }: { email: string }) {
    // Generate a 6-digit OTP and store it (auto-accept for demo: code = "123456" or anything)
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const pending = { email, code, expires: Date.now() + 10 * 60 * 1000 }
    store(OTP_KEY, pending)
    console.info(`[GlamAI] OTP for ${email}: ${code}`)
    return { error: null }
  },

  async verifyOtp({ email, token }: { email: string; token: string; type: string }) {
    const pending = load<{ email: string; code: string; expires: number }>(OTP_KEY)

    // Accept the real OTP or "000000" as universal test code
    const valid = pending &&
      pending.email === email &&
      (pending.code === token || token === '000000') &&
      pending.expires > Date.now()

    if (!valid) {
      return { data: {}, error: { message: 'Invalid or expired code. Try 000000 as a test code.' } }
    }

    localStorage.removeItem(OTP_KEY)

    // Create or fetch user
    const users = getUsers()
    const existing = Object.values(users).find((u) => u.email === email)
    let user: User
    if (existing) {
      user = existing
    } else {
      user = {
        id: uid(),
        email,
        created_at: new Date().toISOString(),
        user_metadata: { onboarding_completed: true },
      }
      users[user.id] = user
      saveUsers(users)

      // Seed demo gallery for new users
      seedDemoData(user.id)
    }

    const session = createSession(user)
    emit('SIGNED_IN', session)
    return { data: { session, user }, error: null }
  },

  async signInWithOAuth({ provider }: { provider: string; options?: any }) {
    // Return a fake URL that will route back to the app
    return {
      data: { url: `${window.location.origin}${window.location.pathname}#oauth-${provider}` },
      error: null,
    }
  },

  async exchangeCodeForSession(_url: string) {
    // On web, we can't do real OAuth — show a friendly message
    return { error: { message: 'OAuth requires a native app. Use email OTP instead — try code 000000.' } }
  },

  async updateUser(updates: { data?: Record<string, any> }) {
    const session = getCurrentSession()
    if (!session) return { error: { message: 'Not authenticated' } }
    const users = getUsers()
    const user = users[session.user.id]
    if (!user) return { error: { message: 'User not found' } }
    user.user_metadata = { ...user.user_metadata, ...updates.data }
    saveUsers(users)
    session.user = user
    store(SESSION_KEY, session)
    emit('USER_UPDATED', session)
    return { data: { user }, error: null }
  },

  async signOut() {
    localStorage.removeItem(SESSION_KEY)
    emit('SIGNED_OUT', null)
    return { error: null }
  },

  onAuthStateChange(callback: Listener) {
    listeners.push(callback)
    // Fire immediately with current state
    const session = getCurrentSession()
    if (session) setTimeout(() => callback('SIGNED_IN', session), 0)
    return {
      data: {
        subscription: {
          unsubscribe() {
            const i = listeners.indexOf(callback)
            if (i !== -1) listeners.splice(i, 1)
          },
        },
      },
    }
  },

  startAutoRefresh() {},
  stopAutoRefresh() {},
}

// ─── Query builder ────────────────────────────────────────────────────────────

type QueryState = {
  table: string
  userId?: string
  filters: Array<{ col: string; val: any }>
  orderCol?: string
  orderAsc?: boolean
  limitN?: number
  selectCols?: string
}

function applyQuery<T extends Record<string, any>>(rows: T[], q: QueryState): T[] {
  let result = [...rows]
  for (const f of q.filters) {
    result = result.filter((r) => r[f.col] === f.val)
  }
  if (q.orderCol) {
    result.sort((a, b) => {
      const aVal = a[q.orderCol!] ?? ''
      const bVal = b[q.orderCol!] ?? ''
      return q.orderAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }
  if (q.limitN) result = result.slice(0, q.limitN)
  return result
}

function makeBuilder(q: QueryState) {
  const builder = {
    select(cols = '*') { return makeBuilder({ ...q, selectCols: cols }) },
    eq(col: string, val: any) { return makeBuilder({ ...q, filters: [...q.filters, { col, val }] }) },
    order(col: string, opts: { ascending?: boolean } = {}) {
      return makeBuilder({ ...q, orderCol: col, orderAsc: opts.ascending ?? true })
    },
    limit(n: number) { return makeBuilder({ ...q, limitN: n }) },
    insert(rows: any | any[]) {
      const key = tableKey(q.table, q.userId)
      const existing = load<any[]>(key) ?? []
      const toInsert = Array.isArray(rows) ? rows : [rows]
      const withIds = toInsert.map((r) => ({
        id: r.id ?? uid(),
        created_at: r.created_at ?? new Date().toISOString(),
        ...r,
      }))
      store(key, [...existing, ...withIds])
      return { data: withIds, error: null }
    },
    update(updates: Record<string, any>) {
      const key = tableKey(q.table, q.userId)
      const existing = load<any[]>(key) ?? []
      let found = false
      const updated = existing.map((r) => {
        const matches = q.filters.every((f) => r[f.col] === f.val)
        if (matches) { found = true; return { ...r, ...updates } }
        return r
      })
      store(key, updated)
      return { data: found ? [updates] : [], error: null }
    },
    delete() {
      const key = tableKey(q.table, q.userId)
      const existing = load<any[]>(key) ?? []
      const kept = existing.filter((r) => !q.filters.every((f) => r[f.col] === f.val))
      store(key, kept)
      return { data: [], error: null }
    },
    then(resolve: (v: { data: any[]; error: null }) => void) {
      const key = tableKey(q.table, q.userId)
      const rows = load<any[]>(key) ?? []
      resolve({ data: applyQuery(rows, q), error: null })
    },
    async *[Symbol.asyncIterator]() {},
  }

  // Make awaitable
  return new Proxy(builder, {
    get(target, prop) {
      if (prop === 'then') {
        return (resolve: any) => {
          const key = tableKey(q.table, q.userId)
          const rows = load<any[]>(key) ?? []
          resolve({ data: applyQuery(rows, q), error: null })
        }
      }
      return target[prop as keyof typeof target]
    },
  })
}

function from(table: string) {
  const session = getCurrentSession()
  return makeBuilder({ table, userId: session?.user.id, filters: [] })
}

// ─── Demo data seeder ─────────────────────────────────────────────────────────

function seedDemoData(userId: string) {
  const galleryKey = tableKey('gallery', userId)
  const editsKey   = tableKey('edits', userId)

  const gallery = [
    { id: uid(), user_id: userId, title: 'Sunset Portrait', format: 'image', width: 1080, height: 1350, toolsUsed: ['AI Beauty', 'Background Swap'], editedAt: '2h ago', created_at: new Date().toISOString() },
    { id: uid(), user_id: userId, title: 'Product Reel', format: 'video', width: 1080, height: 1920, toolsUsed: ['Video Trim', 'Effects'], editedAt: '1d ago', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: uid(), user_id: userId, title: 'Fashion Story', format: 'carousel', width: 1080, height: 1080, toolsUsed: ['AI Filter', 'Text Overlay'], editedAt: '3d ago', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  ]
  const edits = [
    { id: uid(), user_id: userId, title: 'Sunset Portrait', tool: 'AI Beauty', created_at: new Date().toISOString() },
    { id: uid(), user_id: userId, title: 'Product Reel', tool: 'Video Trim', created_at: new Date(Date.now() - 3600000).toISOString() },
  ]

  store(galleryKey, gallery)
  store(editsKey, edits)

  const notifKey = tableKey('notifications', userId)
  store(notifKey, [
    { id: uid(), user_id: userId, title: 'Welcome to GlamAI!', body: 'Start creating with AI-powered editing tools.', timeAgo: 'just now', category: 'system', read: false, created_at: new Date().toISOString() },
  ])
}

// ─── Exported client ──────────────────────────────────────────────────────────

export const localClient = { auth, from }
export const isLocalBackend = true
