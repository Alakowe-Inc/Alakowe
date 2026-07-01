# User Landing Page — Dynamic Sections Implementation Plan

## Objective

Replace the hardcoded mock-data carousels on the Home page (`/`) with API-driven dynamic sections configured via the admin panel. The `GET /api/v1/LandingPage/landing-page` endpoint returns an ordered list of sections, each containing a title, type (category/collection/tag), and up to 6 listings.

---

## Current State

The Home page (`src/pages/LandingPage/Home.tsx`) has three hardcoded carousels:

```tsx
const likeNewBooks = books.filter(b => b.condition === 'LikeNew' || b.condition === 'Good').slice(0, 5)
const trendingBooks = [...books].sort((a, b) => b.sellerRating - a.sellerRating).slice(0, 5)
const bestValueBooks = books.filter(b => b.isDiscountApplied || b.badge === 'Best Value').slice(0, 5)
```

These filter from `data/mockData.ts` (8 hardcoded books). The API returns real data from `GET /api/v1/LandingPage/landing-page`.

---

## API Response Shape

From `CATALOGUE_DISCOVERY_SOLUTION.md` and `admin/swagger.json`:

```typescript
// GET /api/v1/LandingPage/landing-page (anonymous, no auth required)
interface LandingPageResponse {
  sections: LandingPageSectionResponse[]
}

interface LandingPageSectionResponse {
  id: number
  title: string                    // e.g. "Fiction Books", "Trending Now"
  sectionType: string              // "category" | "collection" | "tag"
  filterParam: any                 // e.g. { category: "fiction" } or { collection: "trending" }
  listings: ListingResponse[]      // up to 6 listings
}
```

Each section's `listings` array contains full `ListingResponse` objects (same shape as used by `useListings()` and `listingToBookDisplay()`).

---

## File Change Summary

### Modified Files

| File | Change |
|------|--------|
| `src/lib/api/types.ts` | Add `LandingPageSectionResponse` and `LandingPageResponse` interfaces |
| `src/lib/api/listings/listings.api.ts` | Add `getLandingPageApi()` function |
| `src/lib/api/listings/listings.hooks.ts` | Add `useLandingPage()` React Query hook |
| `src/pages/LandingPage/Home.tsx` | Replace hardcoded carousels with API-driven dynamic sections |

### No New Files

All changes fit within existing files.

---

## Phase 1: Type Definitions

### Step 1.1 — `src/lib/api/types.ts`

Add at the end of the file:

```typescript
/* ───────── Landing Page ───────── */

export interface LandingPageSectionResponse {
  id?: number
  title?: string | null
  sectionType?: string | null       // "category" | "collection" | "tag"
  filterParam?: any
  listings?: ListingResponse[] | null
}

export interface LandingPageResponse {
  sections?: LandingPageSectionResponse[] | null
}
```

---

## Phase 2: API Layer

### Step 2.1 — `src/lib/api/listings/listings.api.ts`

Add import for the new types, then add:

```typescript
import type {
  SubmitListingRequestDto,
  UpdateListingRequestDto,
  ListingResponse,
  ListingResponsePagedResult,
  ListingStatus,
  SetListingDiscountRequest,
  MyListingSummaryResponse,
  LandingPageResponse,        // ← ADD
} from "../types"

// ... existing functions ...

export async function getLandingPageApi(): Promise<LandingPageResponse> {
  const { data } = await client.get("/api/v1/LandingPage/landing-page")
  return data as LandingPageResponse
}
```

### Step 2.2 — `src/lib/api/listings/listings.hooks.ts`

Add import for `getLandingPageApi` and `LandingPageResponse`, then add:

```typescript
import {
  submitListingApi,
  editListingApi,
  getListingsByFilterApi,
  getListingByIdApi,
  getMyListingsApi,
  getMyListingByIdApi,
  setDiscountApi,
  getMyListingSummaryApi,
  getLandingPageApi,           // ← ADD
  type ListingFilterParams,
  type MyListingsFilterParams,
} from "./listings.api"

import type {
  SubmitListingRequestDto,
  UpdateListingRequestDto,
  ListingResponse,
  ListingResponsePagedResult,
  SetListingDiscountRequest,
  MyListingSummaryResponse,
  LandingPageResponse,          // ← ADD
} from "../types"

// ... existing code ...

export function useLandingPage() {
  return useQuery({
    queryKey: ["landing-page"],
    queryFn: () => withMock({ sections: [] }, () => getLandingPageApi()),
  })
}
```

---

## Phase 3: Home Page Refactor

### Step 3.1 — `src/pages/LandingPage/Home.tsx`

**What changes:**

1. Remove the hardcoded mock data imports and filter variables:

```tsx
// REMOVE these lines:
import { blogPosts, bookQuotes, bookRequests, books } from '../../data/mockData'
const likeNewBooks = books.filter(...)
const trendingBooks = [...books].sort(...)
const bestValueBooks = books.filter(...)
```

2. Add API hook import and call:

```tsx
import { useLandingPage } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'

// Inside the Home component:
const { data: landingPage, isLoading: sectionsLoading } = useLandingPage()
const sections = landingPage?.sections ?? []
```

3. Replace the hardcoded "Like New", "Trending Now", "Best Value" carousels (lines ~329-369) with a dynamic section renderer:

```tsx
{/* ── The Store ────────────────────────────────────────────── */}
<section className="bg-white py-20">
  <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

    {/* Header */}
    <div className="mb-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
        The Store
      </p>
      <h2 className="font-heading font-bold text-main text-3xl md:text-5xl tracking-tight max-w-3xl">
        Discover books, curated by condition and demand.
      </h2>
      <p className="text-main/55 text-sm md:text-base mt-3 max-w-2xl">
        Hand-picked listings from readers across Nigeria — refreshed daily.
      </p>
    </div>

    {/* Dynamic sections from API */}
    {sectionsLoading && (
      <div className="py-12 text-center text-main/40 text-sm">Loading collections...</div>
    )}

    {sections.map((section) => {
      const listings = (section.listings ?? []).map(listingToBookDisplay)
      if (listings.length === 0) return null

      // Pick an icon based on section type
      const iconMap: Record<string, React.ReactNode> = {
        category: <span className="text-amber-400">✦</span>,
        collection: <span className="text-red-400">🔥</span>,
        tag: <span className="text-amber-500">☆</span>,
      }

      return (
        <div key={section.id} className="mb-14">
          <BookCarousel
            label={section.title ?? "Featured"}
            icon={iconMap[section.sectionType ?? "category"]}
            seeAllLink={`/browse?${section.sectionType}=${section.filterParam?.[section.sectionType ?? "category"] ?? ""}`}
          >
            {listings.map((book) => (
              <div key={book.id} className="shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-[20%] px-1.5 sm:px-2 snap-start">
                <BookCard book={book} />
              </div>
            ))}
          </BookCarousel>
        </div>
      )
    })}

    {/* Empty state */}
    {!sectionsLoading && sections.length === 0 && (
      <div className="py-12 text-center text-main/40 text-sm">
        No collections available yet. Check back soon!
      </div>
    )}

    {/* Mobile CTA */}
    <div className="mt-8 text-center md:hidden">
      <Link
        to="/browse"
        className="inline-flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
      >
        View all books
      </Link>
    </div>
  </div>
</section>
```

4. The rest of the Home page (hero, quotes, how-it-works, book requests, blog, CTA, footer) remains **unchanged** — those sections are not part of the dynamic landing page config.

---

## Section Type → Visual Mapping

| `sectionType` | Icon | Color | Example `filterParam` | `seeAllLink` |
|---------------|------|-------|----------------------|-------------|
| `category` | ✦ | amber-400 | `{ category: "fiction" }` | `/browse?category=fiction` |
| `collection` | 🔥 | red-400 | `{ collection: "trending" }` | `/browse?collection=trending` |
| `tag` | ☆ | amber-500 | `{ tag: "best-sellers" }` | `/browse?tag=best-sellers` |

---

## Behavior

- **Loading state**: Show a centered "Loading collections..." text while the API responds
- **Empty state**: If no sections are configured (or all sections have 0 listings), show "No collections available yet"
- **Empty sections**: Sections with 0 listings are hidden (not rendered)
- **"See all" link**: Each carousel's "See all" links to `/browse` with the appropriate filter query param
- **Fallback**: When `VITE_USE_MOCK=true`, returns empty sections (existing mock Home page still works via the `books` array if we keep the old imports, or we can remove them)

---

## Implementation Order

| Step | File | What |
|------|------|------|
| 1 | `types.ts` | Add `LandingPageSectionResponse`, `LandingPageResponse` |
| 2 | `listings.api.ts` | Add `getLandingPageApi()` |
| 3 | `listings.hooks.ts` | Add `useLandingPage()` |
| 4 | `Home.tsx` | Replace hardcoded carousels with dynamic section renderer |

---

## Verification

1. `npx tsc --noEmit` — TypeScript compiles
2. `npm run build` — Production build succeeds
3. Manual test: Configure sections in admin, visit `/`, verify carousels load from API
4. Fallback: With no sections configured, Home page shows empty state gracefully
