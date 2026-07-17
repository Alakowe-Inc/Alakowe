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

function getAllRequests(): Record<string, BookRequest> {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveRequest(req: BookRequest): void {
  const all = getAllRequests()
  all[req.id] = req
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(all))
}

export function getBuyerRequests(email: string): BookRequest[] {
  return Object.values(getAllRequests())
    .filter(r => r.buyerEmail === email)
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

// Check if a book request already exists by title
export function getExistingRequestByTitle(title: string): BookRequest | null {
  const all = getAllRequests()
  const requests = Object.values(all)
  const existing = requests.find(r => r.title.toLowerCase() === title.toLowerCase() && r.status === 'open')
  return existing || null
}

// Add a user to the waitlist of an existing request
export function addToWaitlist(requestId: string, buyerEmail: string): boolean {
  const all = getAllRequests()
  if (!all[requestId]) return false
  
  // Initialize waitlist if it doesn't exist
  if (!all[requestId].waitlist) {
    all[requestId].waitlist = []
  }
  
  // Add user if not already on waitlist
  if (!all[requestId].waitlist!.includes(buyerEmail)) {
    all[requestId].waitlist!.push(buyerEmail)
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(all))
    return true
  }
  
  return false
}

// Get waitlist count for a book request
export function getWaitlistCount(requestId: string): number {
  const all = getAllRequests()
  const request = all[requestId]
  return request?.waitlist?.length || 0
}

// Check if user is on waitlist for a book
export function isUserOnWaitlist(requestId: string, buyerEmail: string): boolean {
  const all = getAllRequests()
  const request = all[requestId]
  return request?.waitlist?.includes(buyerEmail) || false
}
