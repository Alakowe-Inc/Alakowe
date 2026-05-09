import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { CartItemResponse } from '@/lib/api-types'
import * as cartService from '@/services/cart.service'
import { useAuth } from './AuthContext'

interface CartContextValue {
  items: CartItemResponse[]
  count: number
  totalAmount: number
  loading: boolean
  addToCart: (listingId: number, quantity?: number) => Promise<void>
  removeFromCart: (listingId: number) => Promise<void>
  updateQuantity: (listingId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<CartItemResponse[]>([])
  const [loading, setLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const cart = await cartService.getCart()
      setItems(cart.items || [])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const addToCart = useCallback(async (listingId: number, quantity: number = 1) => {
    setLoading(true)
    try {
      await cartService.addToCart({ listingId, quantity })
      await refreshCart()
    } finally {
      setLoading(false)
    }
  }, [refreshCart])

  const removeFromCart = useCallback(async (listingId: number) => {
    setLoading(true)
    try {
      await cartService.removeCartItem(listingId)
      await refreshCart()
    } finally {
      setLoading(false)
    }
  }, [refreshCart])

  const updateQuantity = useCallback(async (listingId: number, quantity: number) => {
    if (quantity < 1) return
    setLoading(true)
    try {
      await cartService.addToCart({ listingId, quantity })
      await refreshCart()
    } finally {
      setLoading(false)
    }
  }, [refreshCart])

  const clearCart = useCallback(async () => {
    setLoading(true)
    try {
      for (const item of items) {
        await cartService.removeCartItem(item.listingId)
      }
      await refreshCart()
    } finally {
      setLoading(false)
    }
  }, [items, refreshCart])

  return (
    <CartContext.Provider value={{ items, count, totalAmount, loading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
