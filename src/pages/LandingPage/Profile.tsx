import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, CreditCard, AlertTriangle, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { savePublicSellerProfile } from '../../data/sellerData'

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

const PROFILE_KEY = 'alakowe_profile'

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
}

const defaultProfile: ProfileData = {
  fullName: '', phone: '', city: '', state: '',
  bio: '', bankName: '', accountNumber: '', accountName: '',
}

function loadProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile
  } catch {
    return defaultProfile
  }
}

function inputClass(hasError?: boolean) {
  return `w-full border rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors bg-white ${hasError ? 'border-red-400' : 'border-main/15'
    }`
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState<ProfileData>(loadProfile)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function set(field: keyof ProfileData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setSaved(false)
      setProfile(p => ({ ...p, [field]: e.target.value }))
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    savePublicSellerProfile({
      email: user!.email,
      fullName: profile.fullName,
      username: profile.username,
      city: profile.city,
      state: profile.state,
      bio: profile.bio,
    })
    setSaved(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDeleteAccount() {
    logout()
    localStorage.removeItem(PROFILE_KEY)
    navigate('/')
  }

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">My Profile</h1>
          <p className="text-main/50 text-sm mt-1">Manage your personal details and seller payout information.</p>
        </div>

        {/* Saved banner */}
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
              <div className="w-full border border-main/10 rounded-xl px-4 py-3 text-sm text-main/50 bg-main/3 flex items-center justify-between">
                <span>{user?.email}</span>
                <span className="text-xs text-main/30 font-medium">Cannot be changed</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Full Name">
                  <input
                    type="text"
                    placeholder="e.g. Amaka Okonkwo"
                    value={profile.fullName}
                    onChange={set('fullName')}
                    className={inputClass()}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Username (optional)">
                  <input
                    type="text"
                    placeholder="e.g. amaka_reads"
                    value={profile.username ?? ''}
                    onChange={set('username')}
                    className={inputClass()}
                  />
                </Field>
              </div>
              <Field label="Phone Number">
                <input
                  type="tel"
                  placeholder="080XXXXXXXX"
                  value={profile.phone}
                  onChange={set('phone')}
                  className={inputClass()}
                />
              </Field>
              <Field label="City">
                <input
                  type="text"
                  placeholder="e.g. Ikeja Lagos"
                  value={profile.city}
                  onChange={set('city')}
                  className={inputClass()}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="State">
                  <select
                    value={profile.state}
                    onChange={set('state')}
                    className={`${inputClass()} ${!profile.state ? 'text-main/30' : 'text-main'}`}
                  >
                    <option value="" disabled>Select state</option>
                    {NIGERIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Short Bio (optional)">
                  <textarea
                    placeholder="Tell buyers a little about yourself…"
                    value={profile.bio}
                    onChange={set('bio')}
                    rows={3}
                    className="w-full border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors resize-none bg-white"
                  />
                </Field>
              </div>
            </div>
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
                  <select
                    value={profile.bankName}
                    onChange={set('bankName')}
                    className={`${inputClass()} ${!profile.bankName ? 'text-main/30' : 'text-main'}`}
                  >
                    <option value="" disabled>Select your bank</option>
                    {NIGERIAN_BANKS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Account Number">
                <input
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
                  className={inputClass()}
                />
              </Field>
              <Field label="Account Name">
                <input
                  type="text"
                  placeholder="Name on account"
                  value={profile.accountName}
                  onChange={set('accountName')}
                  className={inputClass()}
                />
              </Field>
            </div>
          </div>

          {/* Save button */}
          <button
            type="submit"
            className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm"
          >
            Save Changes
          </button>

        </form>

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

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="border border-red-200 text-red-600 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-red-50 transition-colors"
            >
              Delete Account
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-800 mb-3">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-red-700 transition-colors"
                >
                  Yes, delete my account
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="border border-main/20 text-main font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-main/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
