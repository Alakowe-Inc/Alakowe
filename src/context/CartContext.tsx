import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface CartItem {
  bookId: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  count: number
  addToCart: (bookId: string) => void
  removeFromCart: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  function addToCart(bookId: string) {
    setItems(prev => {
      const existing = prev.find(i => i.bookId === bookId)
      if (existing) {
        return prev.map(i => i.bookId === bookId ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { bookId, quantity: 1 }]
    })
  }

  function removeFromCart(bookId: string) {
    setItems(prev => prev.filter(i => i.bookId !== bookId))
  }

  function updateQuantity(bookId: string, quantity: number) {
    if (quantity < 1) return
    setItems(prev => prev.map(i => i.bookId === bookId ? { ...i, quantity } : i))
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, count, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
