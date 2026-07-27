export type RequestStatus = 'open' | 'matched' | 'closed'

export interface BookRequest {
  id: string
  buyerEmail: string
  title: string
  author: string
  genre: string
  condition: string
  maxPrice: number
  notes: string
  status: RequestStatus
  createdAt: string
  waitlist?: string[] // Array of buyer emails on the waitlist
}

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  open: 'Open',
  matched: 'Matched',
  closed: 'Closed',
}

export const REQUEST_STATUS_CLASS: Record<RequestStatus, string> = {
  open: 'bg-blue-50 text-blue-700 border border-blue-200',
  matched: 'bg-green-50 text-green-700 border border-green-200',
  closed: 'bg-main/8 text-main/50 border border-main/15',
}

const REQUESTS_KEY = 'alakowe_requests'

const INITIAL_REQUESTS: Record<string, BookRequest> = {
  '1': {
    id: '1',
    buyerEmail: 'amaka@example.com',
    title: 'Purple Hibiscus',
    author: 'Chimamanda Ngozi Adichie',
    genre: 'African Fiction',
    condition: 'Like New',
    maxPrice: 3500,
    notes: 'Looking for a clean copy for book club.',
    status: 'open',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    waitlist: Array.from({ length: 14 }, (_, i) => `reader${i + 1}@example.com`),
  },
  '2': {
    id: '2',
    buyerEmail: 'emeka@example.com',
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    genre: 'Finance & Investing',
    condition: 'Good',
    maxPrice: 4500,
    notes: 'Urgent buy for study group.',
    status: 'open',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    waitlist: Array.from({ length: 31 }, (_, i) => `reader${i + 1}@example.com`),
  },
  '3': {
    id: '3',
    buyerEmail: 'chisom@example.com',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction / Philosophical',
    condition: 'Excellent',
    maxPrice: 3000,
    notes: 'Prefer paperback edition.',
    status: 'open',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    waitlist: Array.from({ length: 22 }, (_, i) => `reader${i + 1}@example.com`),
  },
  '4': {
    id: '4',
    buyerEmail: 'bolu@example.com',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help / Productivity',
    condition: 'Like New',
    maxPrice: 5000,
    notes: 'Hardcover preferred if available.',
    status: 'open',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    waitlist: Array.from({ length: 19 }, (_, i) => `reader${i + 1}@example.com`),
  },
  '5': {
    id: '5',
    buyerEmail: 'ngozi@example.com',
    title: 'Half of a Yellow Sun',
    author: 'Chimamanda Ngozi Adichie',
    genre: 'Historical Fiction',
    condition: 'Good',
    maxPrice: 4000,
    notes: 'Need for university course.',
    status: 'open',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    waitlist: Array.from({ length: 8 }, (_, i) => `reader${i + 1}@example.com`),
  },
}

function getAllRequests(): Record<string, BookRequest> {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY)
    if (!raw) {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(INITIAL_REQUESTS))
      return INITIAL_REQUESTS
    }
    const parsed = JSON.parse(raw)
    // Merge initial seed so standard items '1'-'5' are always available
    const merged = { ...INITIAL_REQUESTS, ...parsed }
    return merged
  } catch {
    return INITIAL_REQUESTS
  }
}

export function saveRequest(req: BookRequest): void {
  const all = getAllRequests()
  all[req.id] = req
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(all))
}

export function getBuyerRequests(email: string): BookRequest[] {
  const all = getAllRequests()
  const cleanEmail = (email || '').trim().toLowerCase()

  // Also check queueJoined from localStorage
  let queueJoined: Record<string, boolean> = {}
  try {
    const raw = localStorage.getItem("queueJoined")
    if (raw) queueJoined = JSON.parse(raw)
  } catch { /* ignore */ }

  return Object.values(all)
    .filter(r => {
      const isOwner = cleanEmail && r.buyerEmail?.trim().toLowerCase() === cleanEmail
      const isWaitlist = cleanEmail && r.waitlist?.some(w => w.trim().toLowerCase() === cleanEmail)
      const isQueueJoined = !!queueJoined[r.id]
      return isOwner || isWaitlist || isQueueJoined
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function closeRequest(id: string): void {
  const all = getAllRequests()
  if (all[id]) {
    all[id].status = 'closed'
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(all))
  }
}

export function generateRequestId(): string {
  return (
    'REQ-' +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).substring(2, 5).toUpperCase()
  )
}

export function getExistingRequestByTitle(title: string): BookRequest | null {
  const all = getAllRequests()
  const requests = Object.values(all)
  const existing = requests.find(r => r.title.toLowerCase() === title.toLowerCase() && r.status === 'open')
  return existing || null
}

export function addToWaitlist(
  requestIdOrTitle: string,
  buyerEmail: string,
  extra?: { title?: string; author?: string; genre?: string; condition?: string }
): BookRequest {
  const all = getAllRequests()
  const cleanEmail = (buyerEmail || '').trim().toLowerCase()

  let target: BookRequest | undefined = all[requestIdOrTitle]

  if (!target && extra?.title) {
    target = Object.values(all).find(r => r.title.toLowerCase() === extra.title!.toLowerCase())
  }
  if (!target && requestIdOrTitle) {
    target = Object.values(all).find(r => r.title.toLowerCase() === requestIdOrTitle.toLowerCase())
  }

  if (!target) {
    const newId = requestIdOrTitle.startsWith('REQ-') || requestIdOrTitle.length > 5 ? requestIdOrTitle : generateRequestId()
    target = {
      id: newId,
      buyerEmail: buyerEmail?.trim() || 'guest@example.com',
      title: extra?.title || requestIdOrTitle || 'Requested Book',
      author: extra?.author || '',
      genre: extra?.genre || '',
      condition: extra?.condition || '',
      maxPrice: 0,
      notes: '',
      status: 'open',
      createdAt: new Date().toISOString(),
      waitlist: cleanEmail ? [cleanEmail] : [],
    }
    all[target.id] = target
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(all))
    return target
  }

  if (!target.waitlist) {
    target.waitlist = [target.buyerEmail]
  }
  if (cleanEmail && !target.waitlist.some(e => e.trim().toLowerCase() === cleanEmail)) {
    target.waitlist.push(cleanEmail)
  }
  all[target.id] = target
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(all))
  return target
}

export function removeFromWaitlist(
  requestIdOrTitle: string,
  buyerEmail: string
): boolean {
  const all = getAllRequests()
  const cleanEmail = (buyerEmail || '').trim().toLowerCase()
  let target: BookRequest | undefined = all[requestIdOrTitle]

  if (!target && requestIdOrTitle) {
    target = Object.values(all).find(r => r.title.toLowerCase() === requestIdOrTitle.toLowerCase())
  }
  if (!target || !target.waitlist) return false

  target.waitlist = target.waitlist.filter(e => e.trim().toLowerCase() !== cleanEmail)
  all[target.id] = target
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(all))
  return true
}

export function getWaitlistCount(requestId: string): number {
  const all = getAllRequests()
  const request = all[requestId]
  return request?.waitlist?.length || 0
}

export function isUserOnWaitlist(requestId: string, buyerEmail: string): boolean {
  const all = getAllRequests()
  const cleanEmail = (buyerEmail || '').trim().toLowerCase()
  const request = all[requestId]
  return request?.waitlist?.some(e => e.trim().toLowerCase() === cleanEmail) || false
}
