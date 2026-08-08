import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, CreditCard, AlertTriangle, Check, KeyRound, Eye, EyeOff, MapPin, Truck, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { savePublicSellerProfile } from '../../data/sellerData'
import { useSellerStoreProfile, useUpdateSellerStoreProfile } from '../../lib/api/store/store.hooks'
import type { StoreFulfillmentOption } from '../../lib/api/types'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

const NIGERIAN_BANKS = [
  'Access Bank', 'Citibank Nigeria', 'Ecobank Nigeria', 'Fidelity Bank',
  'First Bank of Nigeria', 'First City Monument Bank (FCMB)', 'Globus Bank',
  'Guaranty Trust Bank (GTBank)', 'Heritage Bank', 'Keystone Bank', 'Kuda Bank',
  'Moniepoint', 'OPay', 'Palmpay', 'Polaris Bank', 'Providus Bank',
  'Stanbic IBTC Bank', 'Standard Chartered Bank', 'Sterling Bank',
  'Titan Trust Bank', 'Union Bank', 'United Bank for Africa (UBA)',
  'Unity Bank', 'Wema Bank', 'Zenith Bank',
]


interface ProfileData {
  fullName: string
  username?: string
  phone: string
  city: string
  state: string
  bio: string
  bankName: string
  accountNumber: string
  accountName: string
  currentlyReading: string
  favouriteBook: string
  favouriteAuthor: string
  readMostly: string
  hobbies: string
}

const defaultProfile: ProfileData = {
  fullName: '', phone: '', city: '', state: '',
  bio: '', bankName: '', accountNumber: '', accountName: '',
  currentlyReading: '', favouriteBook: '', favouriteAuthor: '',
  readMostly: '', hobbies: '',
}

function loadProfile(userId: string | number): ProfileData {
  try {
    const key = `alakowe_profile_${userId}`
    const raw = localStorage.getItem(key)
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile
  } catch {
    return defaultProfile
  }
}



const inputClass = cn(
  'rounded-xl h-auto py-3 text-sm text-main placeholder:text-main/30 bg-white border-main/15',
  'focus-visible:ring-0 focus-visible:border-secondary transition-colors',
)

const selectClass = cn(
  'rounded-xl h-auto py-3 text-sm bg-white border-main/15',
  'focus:ring-0 focus:ring-offset-0 focus-visible:ring-0',
)

function Field({
  label,
  children,
  error,
  required,
}: {
  label: string
  children: React.ReactNode
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-1.5 block">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-red-500 mt-1.5">{error}</p> : null}
    </div>
  )
}

type PickupFieldErrors = {
  addressLine?: string
  city?: string
  state?: string
  consent?: string
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const profileKey = user ? `alakowe_profile_${user.userId ?? user.email}` : null

  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [saved, setSaved] = useState(false)

  const { data: store } = useSellerStoreProfile(!!user)
  const updateStore = useUpdateSellerStoreProfile()

  const [fulfillmentOption, setFulfillmentOption] = useState<StoreFulfillmentOption>('Courier')
  const [pickupAddressLine, setPickupAddressLine] = useState('')
  const [pickupCity, setPickupCity] = useState('')
  const [pickupState, setPickupState] = useState('')
  const [pickupConsent, setPickupConsent] = useState(false)
  const [pickupErrors, setPickupErrors] = useState<PickupFieldErrors>({})

  // When the user changes (login/logout/switch), reset form and load from their own localStorage slot
  useEffect(() => {
    if (!profileKey) {
      setProfile(defaultProfile)
      return
    }
    setProfile(loadProfile(user!.userId ?? user!.email))
  }, [profileKey])

  // Hydrate from API — API is always the source of truth for store/reading fields.
  // Only fall back to localStorage values for fields not covered by the store API
  // (e.g. bankName, accountNumber, phone).
  useEffect(() => {
    if (!store) return
    setProfile(p => ({
      ...p,
      phone: store.phoneNumber || store.phone || p.phone || '',
      fullName: store.fullName || p.fullName || '',
      username: store.userName || store.username || p.username || '',
      bio: store.description || p.bio || '',
      city: store.city || p.city || '',
      state: store.state || p.state || '',
      currentlyReading: store.currentlyReading || '',
      favouriteBook: store.favouriteBook || '',
      favouriteAuthor: store.favouriteAuthor || '',
      readMostly: store.readMostly || store.mostlyRead || '',
      hobbies: store.hobbies || '',
    }))
    setFulfillmentOption(store.fulfillmentOption ?? 'Courier')
    setPickupAddressLine(store.pickupAddressLine ?? '')
    setPickupCity(store.pickupCity ?? store.city ?? '')
    setPickupState(store.pickupState ?? store.state ?? '')
    setPickupConsent(store.pickupConsentGiven ?? false)
  }, [store])

  useEffect(() => {
    if (window.location.hash === '#delivery') {
      document.getElementById('delivery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [store])

  const [pwOpen, setPwOpen] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)

  function set(field: keyof ProfileData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSaved(false)
      setProfile(p => ({ ...p, [field]: e.target.value }))
    }
  }

  function setSelect(field: keyof ProfileData) {
    return (value: string) => {
      setSaved(false)
      setProfile(p => ({ ...p, [field]: value }))
    }
  }

  function scrollToDelivery() {
    document.getElementById('delivery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function validatePickupFields(): boolean {
    if (fulfillmentOption !== 'Pickup' && fulfillmentOption !== 'Both') {
      setPickupErrors({})
      return true
    }

    const next: PickupFieldErrors = {}
    if (!pickupAddressLine.trim()) {
      next.addressLine = 'Enter your pickup street address.'
    }
    if (!pickupCity.trim()) {
      next.city = 'Enter your pickup city.'
    }
    if (!pickupState.trim()) {
      next.state = 'Select your pickup state.'
    }
    if (!pickupConsent) {
      next.consent = 'Confirm you understand your address and phone will be shared.'
    }

    setPickupErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()

    if (!validatePickupFields()) {
      setSaved(false)
      scrollToDelivery()
      return
    }

    if (profileKey) {
      localStorage.setItem(profileKey, JSON.stringify(profile))
    }
    savePublicSellerProfile({
      email: user!.email,
      fullName: profile.fullName,
      username: profile.username,
      city: profile.city,
      state: profile.state,
      bio: profile.bio,
    })
    // The bio doubles as the public storefront description; city/state
    // become the seller's public storefront location.
    updateStore.mutate({
      storeName:
        store?.storeName ||
        `${profile.fullName || user!.email.split('@')[0]}'s Store`,
      description: profile.bio || null,
      city: profile.city || null,
      state: profile.state || null,
      isOnVacation: store?.isOnVacation ?? false,
      vacationMessage: store?.vacationMessage ?? null,
      fulfillmentOption,
      pickupAddressLine: pickupAddressLine || null,
      pickupCity: pickupCity || null,
      pickupState: pickupState || null,
      pickupConsentGiven: pickupConsent,
      currentlyReading: profile.currentlyReading || null,
      favouriteBook: profile.favouriteBook || null,
      favouriteAuthor: profile.favouriteAuthor || null,
      readMostly: profile.readMostly || null,
      hobbies: profile.hobbies || null,
    })
    setSaved(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDeleteAccount() {
    logout()
    if (profileKey) {
      localStorage.removeItem(profileKey)
    }
    navigate('/')
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    if (newPw !== confirmPw) {
      setPwError('Passwords do not match.')
      return
    }
    // TODO: wire up change-password API call
    setPwSaved(true)
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
  }

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">

        <div className="mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">My Profile</h1>
          <p className="text-main/50 text-sm mt-1">Manage your personal details and seller payout information.</p>
        </div>

        {saved && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3.5 mb-6">
            <Check size={16} className="text-green-600 shrink-0" />
            <p className="text-sm font-semibold text-green-800">Profile saved successfully.</p>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6">

          {/* ── Personal Info ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <User size={15} className="text-secondary" />
              </div>
              <h2 className="font-heading font-bold text-main text-base">Personal Info</h2>
            </div>

            {/* Email — read only */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-1.5 block">
                Email Address
              </label>
              <div className="w-full border border-main/10 rounded-xl px-4 py-3 text-sm text-main/50 bg-main/3 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="truncate">{user?.email}</span>
                <span className="text-xs text-main/30 font-medium shrink-0">Cannot be changed</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Full Name">
                  <Input
                    type="text"
                    placeholder="e.g. Amaka Okonkwo"
                    value={profile.fullName}
                    onChange={set('fullName')}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Username (optional)">
                  <Input
                    type="text"
                    placeholder="e.g. amaka_reads"
                    value={profile.username ?? ''}
                    onChange={set('username')}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Phone Number">
                <Input
                  type="tel"
                  placeholder="080XXXXXXXX"
                  value={profile.phone}
                  onChange={set('phone')}
                  className={inputClass}
                />
              </Field>
              <Field label="City">
                <Input
                  type="text"
                  placeholder="e.g. Ikeja Lagos"
                  value={profile.city}
                  onChange={set('city')}
                  className={inputClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="State">
                  <Select value={profile.state} onValueChange={setSelect('state')}>
                    <SelectTrigger className={cn(selectClass, !profile.state && 'text-main/30')}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
          </div>

          {/* ── Reading Info ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <BookOpen size={15} className="text-secondary" />
              </div>
              <h2 className="font-heading font-bold text-main text-base">Reading info</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Currently Reading">
                <Input
                  type="text"
                  placeholder="e.g. Things Fall Apart"
                  value={profile.currentlyReading}
                  onChange={set('currentlyReading')}
                  className={inputClass}
                />
              </Field>
              <Field label="Favourite Book">
                <Input
                  type="text"
                  placeholder="e.g. Half of a Yellow Sun"
                  value={profile.favouriteBook}
                  onChange={set('favouriteBook')}
                  className={inputClass}
                />
              </Field>
              <Field label="Favourite Author">
                <Input
                  type="text"
                  placeholder="e.g. Chinua Achebe"
                  value={profile.favouriteAuthor}
                  onChange={set('favouriteAuthor')}
                  className={inputClass}
                />
              </Field>
              <Field label="Read mostly">
                <Input
                  type="text"
                  placeholder="e.g. Fiction, Sci-Fi"
                  value={profile.readMostly}
                  onChange={set('readMostly')}
                  className={inputClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Hobbies Beyond Reading">
                  <Input
                    type="text"
                    placeholder="e.g. Hiking, Cooking"
                    value={profile.hobbies}
                    onChange={set('hobbies')}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Short Bio (optional)">
                  <Textarea
                    placeholder="Tell buyers a little about yourself…"
                    value={profile.bio}
                    onChange={set('bio')}
                    rows={3}
                    className="rounded-xl text-sm text-main placeholder:text-main/30 border-main/15 bg-white focus-visible:ring-0 focus-visible:border-secondary transition-colors resize-none"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* ── How buyers get your books ── */}
          <div id="delivery" className="bg-white rounded-2xl border border-third p-6 scroll-mt-24">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <Truck size={15} className="text-secondary" />
              </div>
              <h2 className="font-heading font-bold text-main text-base">How buyers get your books</h2>
            </div>
            <p className="text-xs text-main/45 mb-5 leading-relaxed">
              This applies to every book you list. Change it anytime. Existing orders keep the option chosen at checkout.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {([
                {
                  value: 'Courier' as const,
                  title: 'Alákòwé delivery',
                  desc: 'Drop off at a Speedaf station. We handle the rest.',
                },
                {
                  value: 'Pickup' as const,
                  title: 'Buyer pickup',
                  desc: 'Buyers come to your pickup address.',
                },
                {
                  value: 'Both' as const,
                  title: 'Either works',
                  desc: 'Buyers choose delivery or pickup at checkout.',
                },
              ]).map((opt) => {
                const active = fulfillmentOption === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSaved(false)
                      setFulfillmentOption(opt.value)
                      if (opt.value === 'Courier') setPickupErrors({})
                    }}
                    className={cn(
                      'text-left rounded-xl border p-4 transition-colors',
                      active
                        ? 'border-secondary bg-secondary/5 ring-1 ring-secondary/30'
                        : 'border-main/10 hover:border-main/25',
                    )}
                  >
                    <p className="text-sm font-semibold text-main mb-1">{opt.title}</p>
                    <p className="text-[11px] text-main/50 leading-relaxed">{opt.desc}</p>
                  </button>
                )
              })}
            </div>

            {(fulfillmentOption === 'Pickup' || fulfillmentOption === 'Both') && (
              <div className="space-y-4 rounded-xl border border-main/10 bg-main/[0.02] p-4">
                <p className="text-xs font-semibold text-main/60 uppercase tracking-wider">Pickup address</p>
                <Field label="Street address" required error={pickupErrors.addressLine}>
                  <Input
                    type="text"
                    placeholder="e.g. 12 Admiralty Way, Lekki Phase 1"
                    value={pickupAddressLine}
                    onChange={(e) => {
                      setSaved(false)
                      setPickupAddressLine(e.target.value)
                      if (pickupErrors.addressLine) {
                        setPickupErrors((prev) => ({ ...prev, addressLine: undefined }))
                      }
                    }}
                    className={cn(inputClass, pickupErrors.addressLine && 'border-red-400')}
                    aria-invalid={!!pickupErrors.addressLine}
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="City" required error={pickupErrors.city}>
                    <Input
                      type="text"
                      placeholder="e.g. Lagos"
                      value={pickupCity}
                      onChange={(e) => {
                        setSaved(false)
                        setPickupCity(e.target.value)
                        if (pickupErrors.city) {
                          setPickupErrors((prev) => ({ ...prev, city: undefined }))
                        }
                      }}
                      className={cn(inputClass, pickupErrors.city && 'border-red-400')}
                      aria-invalid={!!pickupErrors.city}
                    />
                  </Field>
                  <Field label="State" required error={pickupErrors.state}>
                    <Select
                      value={pickupState}
                      onValueChange={(v) => {
                        setSaved(false)
                        setPickupState(v)
                        if (pickupErrors.state) {
                          setPickupErrors((prev) => ({ ...prev, state: undefined }))
                        }
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          selectClass,
                          !pickupState && 'text-main/30',
                          pickupErrors.state && 'border-red-400',
                        )}
                        aria-invalid={!!pickupErrors.state}
                      >
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {NIGERIAN_STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pickupConsent}
                      onChange={(e) => {
                        setSaved(false)
                        setPickupConsent(e.target.checked)
                        if (pickupErrors.consent) {
                          setPickupErrors((prev) => ({ ...prev, consent: undefined }))
                        }
                      }}
                      className={cn(
                        'mt-0.5 rounded border-main/30',
                        pickupErrors.consent && 'outline outline-1 outline-red-400',
                      )}
                      aria-invalid={!!pickupErrors.consent}
                    />
                    <span className="text-xs text-main/65 leading-relaxed">
                      I understand my pickup address will show on my listings, and my phone number will be shared with buyers after they pay.
                    </span>
                  </label>
                  {pickupErrors.consent ? (
                    <p className="text-xs text-red-500 mt-1.5 ml-6">{pickupErrors.consent}</p>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* ── Payout Info ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <CreditCard size={15} className="text-secondary" />
              </div>
              <h2 className="font-heading font-bold text-main text-base">Payout Details</h2>
            </div>
            <p className="text-xs text-main/45 mb-5 leading-relaxed">
              Your earnings are released here after a buyer confirms delivery. Make sure these details are correct.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Bank Name">
                  <Select value={profile.bankName} onValueChange={setSelect('bankName')}>
                    <SelectTrigger className={cn(selectClass, !profile.bankName && 'text-main/30')}>
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_BANKS.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Account Number">
                <Input
                  type="text"
                  placeholder="10-digit NUBAN"
                  maxLength={10}
                  value={profile.accountNumber}
                  onChange={e =>
                    setProfile(p => ({
                      ...p,
                      accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                    }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Account Name">
                <Input
                  type="text"
                  placeholder="Name on account"
                  value={profile.accountName}
                  onChange={set('accountName')}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-secondary text-white font-semibold h-auto py-4 rounded-xl hover:bg-secondary/90 transition-colors text-sm"
          >
            Save Changes
          </Button>

          {/* Shipping addresses link */}
          <div className="mt-6">
            <Link
              to="/account/shipping-addresses"
              className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-main/70 hover:text-main transition-colors border border-main/15 bg-white rounded-full py-3"
            >
              <MapPin size={16} className="text-main/50" /> Manage shipping addresses
            </Link>
          </div>

        </form>

        {/* ── Change Password ── */}
        <div className="bg-white rounded-2xl border border-third p-6 mt-6">
          <button
            type="button"
            onClick={() => { setPwOpen(o => !o); setPwSaved(false); setPwError('') }}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <KeyRound size={15} className="text-secondary" />
              </div>
              <h2 className="font-heading font-bold text-main text-base">Change Password</h2>
            </div>
            <span className="text-xs font-semibold text-secondary">
              {pwOpen ? 'Cancel' : 'Update'}
            </span>
          </button>

          {pwOpen && (
            <form onSubmit={handleChangePassword} className="mt-5 flex flex-col gap-4">
              {pwSaved && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <Check size={14} className="text-green-600 shrink-0" />
                  <p className="text-sm font-semibold text-green-800">Password updated successfully.</p>
                </div>
              )}
              {pwError && (
                <p className="text-sm text-red-600 font-medium">{pwError}</p>
              )}

              {[
                { label: 'Current Password', value: currentPw, onChange: (v: string) => { setCurrentPw(v); setPwSaved(false) }, show: showCurrent, toggle: () => setShowCurrent(v => !v), placeholder: 'Enter current password' },
                { label: 'New Password', value: newPw, onChange: (v: string) => { setNewPw(v); setPwSaved(false) }, show: showNew, toggle: () => setShowNew(v => !v), placeholder: 'Min. 8 characters' },
                { label: 'Confirm New Password', value: confirmPw, onChange: (v: string) => { setConfirmPw(v); setPwSaved(false) }, show: showConfirm, toggle: () => setShowConfirm(v => !v), placeholder: 'Repeat new password' },
              ].map(({ label, value, onChange, show, toggle, placeholder }) => (
                <div key={label}>
                  <label className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-1.5 block">
                    {label}
                  </label>
                  <div className="relative">
                    <Input
                      type={show ? 'text' : 'password'}
                      required
                      placeholder={placeholder}
                      value={value}
                      onChange={e => onChange(e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-main/30 hover:text-main/60 transition-colors"
                    >
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}

              <Button
                type="submit"
                className="w-full bg-secondary text-white font-semibold h-auto py-3.5 rounded-xl hover:bg-secondary/90 transition-colors text-sm"
              >
                Update Password
              </Button>
            </form>
          )}
        </div>

        {/* ── Danger Zone ── */}
        <div className="bg-white rounded-2xl border border-red-100 p-6 mt-6">


          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={15} className="text-red-500" />
            </div>
            <h2 className="font-heading font-bold text-main text-base">Danger Zone</h2>
          </div>
          <p className="text-xs text-main/45 mb-5 leading-relaxed">
            Deleting your account is permanent and cannot be undone. All your listings and order history will be removed.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="border border-red-200 text-red-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This is permanent and cannot be undone. All your listings and order history will be removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

      </div>
    </div>
  )
}
