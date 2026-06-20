# Checkout Implementation Update Plan (Phased)

This plan reworks the current frontend checkout flow to follow the required backend/endpoint sequence and UX.

## Phase 0 — Discovery & Contract Alignment (No UI changes)
**Goals**
- Confirm exact response payloads for:
  - `POST /api/v1/cart/validate` (fields: `isValid`, `validItems`, `issues`)
  - `POST /api/v1/checkout/start` (returns `sessionId` and shipping fields)
  - `POST /api/v1/checkout/{sessionId}/pay` (returns `accessCode` for Paystack)
  - `GET /api/v1/checkout/{sessionId}/payment-status` (returns `status`, reference/message, and any order data needed)
- Identify current frontend types and mismatches (notably: existing `pay` typing likely returns `CheckoutSessionResponse`, but swagger indicates a Paystack initiation response with `accessCode`).

**Tasks**
- Review `src/lib/api/types.ts` (and related types) for:
  - `CheckoutSessionResponse`
  - `OrderResponse`
  - `CartValidationResponse`
  - Paystack initiation response shape (access code)
  - payment status response shape
- Review:
  - `src/lib/api/checkout/checkout.api.ts`
  - `src/lib/api/checkout/checkout.hooks.ts`
  - `src/lib/api/cart/cart.api.ts`
  - `src/lib/api/cart/cart.hooks.ts`

**Deliverable**
- A short “contract checklist” in comments/notes (or a follow-up doc) capturing any required type corrections.

---

## Phase 1 — API Layer Updates (Hook + endpoints + typing correctness)
**1. Add payment-status API client**
- File: `src/lib/api/checkout/checkout.api.ts`
- Add:
  - `getPaymentStatusApi(sessionId: string)`:
    - `GET /api/v1/checkout/${sessionId}/payment-status`

**2. Add payment-status hook**
- File: `src/lib/api/checkout/checkout.hooks.ts`
- Add:
  - `usePaymentStatus(sessionId: string)`:
    - `useQuery` with `enabled: !!sessionId`

**3. Fix pay endpoint typing / return type**
- File: `src/lib/api/checkout/checkout.api.ts` and `src/lib/api/checkout/checkout.hooks.ts`
- Update `payCheckoutSessionApi(sessionId)` to return the correct Paystack initiation response type (containing `accessCode`).
- Update `src/lib/api/types.ts` with:
  - `PaymentInitiateResponse` shape (at minimum `accessCode`, plus optional `reference`, `authorizationUrl`, `expiresAt`)
  - `PaymentStatusResponse` shape (at minimum `status`, plus `reference`, `message`, and any `orders` if present)

**4. Ensure cart validate response types match usage**
- Confirm `CartValidationResponse` includes:
  - `isValid: boolean`
  - `validItems?: CartItemResponse[]`
  - `issues?: { listingId: number, issue?: string }[]`

**Deliverable**
- Frontend can:
  - start checkout
  - initiate pay and obtain `accessCode`
  - poll payment-status

---

## Phase 2 — Cart Validation Step + Restart Logic
**Goals**
- When user clicks “checkout” from cart:
  - run `POST /api/v1/cart/validate`
  - if invalid:
    - notify user
    - unselect/remove invalid items in cart state
    - restart the checkout process (i.e., user must reattempt or the UI returns to the shipping entry but blocked until cart becomes valid)

**Implementation approach**
- Keep routing unchanged (`/cart` → `/checkout`), but trigger validation on landing into Checkout.

**Tasks**
1) Checkout page mounts → validate cart
- File: `src/pages/LandingPage/Checkout.tsx`
- Add `useEffect`:
  - if `items.length === 0`: show empty cart UI (already exists)
  - call `useValidateCart().mutateAsync()`
  - if `!isValid`:
    - compute invalid listingIds from `issues` (or derive from `validItems`)
    - update cart context state and/or call `removeFromCartApi` for invalid items
    - show banner/toast
    - restart flow (keep user on Checkout but return to “Validate cart” stage; or send user back to cart view based on UX preference)

2) CartContext integration
- File: `src/context/CartContext.tsx`
- Ensure ability to:
  - remove specific listings from local state after validate
  - optionally update quantities to match validated items (if backend returns corrected items)

**Deliverable**
- Invalid cart never proceeds to shipping/payment.

---

## Phase 3 — Shipping/Contact Capture Step (Prepare Start Checkout Payload)
**Goals**
- After cart is valid:
  - prompt user for shipping address + contact phone
  - then call `POST /api/v1/checkout/start`
  - on failure: notify and return to cart

**Tasks**
1) Rework `Checkout.tsx` UI into stages
- Replace current single submit logic with a stage-based state machine:
  - Stage 1: Validating cart
  - Stage 2: Enter shipping/contact
  - Stage 3: Starting checkout
  - Stage 4: Initiating Paystack payment
  - Stage 5: Polling payment status
  - Stage 6a: Payment success → complete checkout + success route
  - Stage 6b: Payment failure/timeout → fail route or “verify later” page/message

2) Map UI fields to `CheckoutStartRequest`
Swagger indicates `CheckoutStartRequest` contains:
- `shippingAddressId` (required in schema)
- `shippingStateId` (nullable)
- `shippingAreaId` (nullable)
- `shippingAddress` (nullable)

Current UI collects: fullName, email, phone, street, city, state.

**Decision needed in implementation**
- Either:
  - Create a shipping address first via `/api/v1/shipping-addresses` (then use `shippingAddressId` in startCheckout), OR
  - If backend permits, send `shippingAddress` + state/area directly (but schema indicates `shippingAddressId` required).
  
**Deliverable**
- Checkout start call succeeds with correct payload from user input.

---

## Phase 4 — Paystack Payment Initiation (accessCode + frontend SDK)
**Goals**
- Call `POST /api/v1/checkout/{sessionId}/pay` to obtain `accessCode`
- Use Paystack frontend SDK to start payment

**Tasks**
1) Initiate pay on Stage 4
- In `Checkout.tsx`, on entering Stage 4:
  - call `usePayCheckout().mutateAsync(sessionId)`
  - extract `accessCode`
  - call Paystack SDK / open payment modal
  - store `sessionId` and any `reference` returned (if provided)

2) Paystack callbacks
- On success:
  - transition to Stage 5 (poll payment status)
- On failure/cancel:
  - optionally call `cancelCheckoutSessionApi(sessionId)`
  - transition to failure UI/route

**Deliverable**
- Payment modal is started with correct authorization.

---

## Phase 5 — Polling Payment Status (15s up to 11 minutes)
**Goals**
- Poll `GET /api/v1/checkout/{sessionId}/payment-status` every 15 seconds
- Stop early when status is `success` or `failed`
- If still pending after 11 minutes:
  - show user: “Transaction will be verified later.”

**Tasks**
1) Implement polling loop in `Checkout.tsx`
- Use `setInterval` or a recursive `setTimeout` to:
  - call payment-status
  - check response `status`
  - stop after:
    - terminal state
    - max duration (11 minutes)
2) Completion
- On success:
  - call `completeCheckoutSessionApi(sessionId)` to produce orderId
  - navigate to `/payment/success?orderId=...`
- On failed:
  - navigate to `/payment/failed`

3) Timeout handling (“verified later”)
- Add a pending-verification UI/route.
- If there is no dedicated route, reuse an existing page (e.g., order status or a generic “PaymentSuccess” with messaging), but ideally create a `PaymentPendingVerification` page.

**Deliverable**
- Polling is robust and bounded.

---

## Phase 6 — UI/UX Polish + Error Messaging
**Goals**
- Provide consistent UX feedback at every failure point.

**Tasks**
- Add visible stage header/badge:
  - Validating cart → Entering shipping → Processing payment → Verifying payment
- Display inline errors:
  - validate cart failures
  - start checkout failure
  - pay initiation failure
  - payment status failure/timeout
- Disable “Place order / Submit” button while in loading states.

**Deliverable**
- No silent failures; user always knows what is happening.

---

## Phase 7 — Testing (Critical-path only per instruction)
**Frontend**
- Cart → Checkout routing
- Empty cart behavior
- Validate cart valid path
- Validate cart invalid path:
  - invalid items removed/unselected
  - restart behavior
- Start checkout failure:
  - user redirected back to cart
- Pay initiation:
  - Paystack opens using accessCode
- Polling:
  - success stops polling early and completes order
  - failed stops polling early and routes to failure
  - pending after 11 minutes shows “verified later”

**Backend/API (manual curl guidance if needed)**
- Validate:
  - `POST /api/v1/cart/validate`
- Checkout:
  - `POST /api/v1/checkout/start`
  - `POST /api/v1/checkout/{sessionId}/pay`
  - `GET /api/v1/checkout/{sessionId}/payment-status`

---

## Files Likely to Change
- `src/pages/LandingPage/Cart.tsx`
- `src/pages/LandingPage/Checkout.tsx`
- `src/context/CartContext.tsx` (if invalid item unselect/removal needs support)
- `src/lib/api/cart/cart.api.ts` / `src/lib/api/cart/cart.hooks.ts` (validation usage)
- `src/lib/api/checkout/checkout.api.ts` (add payment-status endpoint + typing fixes)
- `src/lib/api/checkout/checkout.hooks.ts` (add payment-status hook)
- `src/lib/api/types.ts` (PaymentInitiateResponse + PaymentStatusResponse + pay return typing)
