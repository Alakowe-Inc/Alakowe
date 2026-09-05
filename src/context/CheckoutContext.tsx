import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import type { CheckoutSessionResponse } from '../lib/api/types'

type AddressMode = 'saved' | 'new'

interface ContactForm {
  fullName: string
  email: string
  phone: string
}

interface CheckoutState {
  contactForm: ContactForm
  addressMode: AddressMode
  selectedShippingAddressId: number | ''
  newStateId: number | ''
  newAreaId: number | ''
  newAddressLine: string
  sessionId: string | null
  sessionData: CheckoutSessionResponse | null
  errorBanner: string | null
}

interface CheckoutContextValue extends CheckoutState {
  setContactForm: (updater: (prev: ContactForm) => ContactForm) => void
  setAddressMode: (mode: AddressMode) => void
  setSelectedShippingAddressId: (id: number | '') => void
  setNewStateId: (id: number | '') => void
  setNewAreaId: (id: number | '') => void
  setNewAddressLine: (line: string) => void
  setSessionData: (sessionId: string, data: CheckoutSessionResponse) => void
  setErrorBanner: (msg: string | null) => void
  resetCheckout: () => void
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null)

const initialState: CheckoutState = {
  contactForm: { fullName: '', email: '', phone: '' },
  addressMode: 'saved',
  selectedShippingAddressId: '',
  newStateId: '',
  newAreaId: '',
  newAddressLine: '',
  sessionId: null,
  sessionData: null,
  errorBanner: null,
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const [state, setState] = useState<CheckoutState>(() => ({
    ...initialState,
    contactForm: {
      fullName: user ? `${user.firstName} ${user.lastName}`.trim() : '',
      email: user?.email ?? '',
      phone: '',
    },
  }))

  const setContactForm = useCallback(
    (updater: (prev: ContactForm) => ContactForm) =>
      setState((prev) => ({ ...prev, contactForm: updater(prev.contactForm) })),
    []
  )

  const setAddressMode = useCallback(
    (mode: AddressMode) => setState((prev) => ({ ...prev, addressMode: mode })),
    []
  )

  const setSelectedShippingAddressId = useCallback(
    (id: number | '') => setState((prev) => ({ ...prev, selectedShippingAddressId: id })),
    []
  )

  const setNewStateId = useCallback(
    (id: number | '') => setState((prev) => ({ ...prev, newStateId: id, newAreaId: '' })),
    []
  )

  const setNewAreaId = useCallback(
    (id: number | '') => setState((prev) => ({ ...prev, newAreaId: id })),
    []
  )

  const setNewAddressLine = useCallback(
    (line: string) => setState((prev) => ({ ...prev, newAddressLine: line })),
    []
  )

  const setSessionData = useCallback(
    (sessionId: string, data: CheckoutSessionResponse) =>
      setState((prev) => ({ ...prev, sessionId, sessionData: data })),
    []
  )

  const setErrorBanner = useCallback(
    (msg: string | null) => setState((prev) => ({ ...prev, errorBanner: msg })),
    []
  )

  const resetCheckout = useCallback(() => {
    setState((prev) => ({
      ...initialState,
      contactForm: {
        fullName: user ? `${user.firstName} ${user.lastName}`.trim() : '',
        email: user?.email ?? '',
        phone: '',
      },
    }))
  }, [user])

  const value = useMemo<CheckoutContextValue>(
    () => ({
      ...state,
      setContactForm,
      setAddressMode,
      setSelectedShippingAddressId,
      setNewStateId,
      setNewAreaId,
      setNewAddressLine,
      setSessionData,
      setErrorBanner,
      resetCheckout,
    }),
    [
      state,
      setContactForm,
      setAddressMode,
      setSelectedShippingAddressId,
      setNewStateId,
      setNewAreaId,
      setNewAddressLine,
      setSessionData,
      setErrorBanner,
      resetCheckout,
    ]
  )

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}
