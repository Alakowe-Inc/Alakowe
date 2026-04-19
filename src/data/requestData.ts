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
