import { createContext, useContext } from "react"
import type { ReactNode } from "react"
import { useCart as useCartQuery, useAddToCart, useRemoveFromCart } from "../lib/api/cart/cart.hooks"
import { cartItemToDisplay, type CartItemDisplay } from "../lib/api/adapters"

interface CartContextValue {
  items: CartItemDisplay[]
  count: number
  addToCart: (bookId: string | number) => void
  removeFromCart: (listingId: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: cart } = useCartQuery()
  const addMutation = useAddToCart()
  const removeMutation = useRemoveFromCart()

  const items: CartItemDisplay[] = cart ? (cart.items ?? []).map(cartItemToDisplay) : []
  const count = items.reduce((s, i) => s + i.quantity, 0)

  function addToCart(bookId: string | number) {
    const listingId = typeof bookId === "number" ? bookId : (parseInt(bookId.replace(/\D/g, ""), 10) || 1)
    addMutation.mutate({ listingId, quantity: 1 })
  }

  function removeFromCart(listingId: number) {
    removeMutation.mutate(listingId)
  }

  function clearCart() {
    for (const item of items) {
      removeMutation.mutate(item.listingId)
    }
  }

  return (
    <CartContext.Provider value={{ items, count, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
