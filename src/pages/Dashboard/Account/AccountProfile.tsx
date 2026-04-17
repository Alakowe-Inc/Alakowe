import { useState } from 'react'
import { User, Camera, Check } from 'lucide-react'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
}

const initial: ProfileForm = {
  firstName: 'Chidi',
  lastName: 'Okonkwo',
  email: 'chidi@email.com',
  phone: '08012345678',
  location: 'Lagos Island, Lagos',
}

function AccountProfile() {
  const [form, setForm] = useState<ProfileForm>(initial)
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function update(field: keyof ProfileForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-1">
          Account
        </p>
        <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">Profile</h1>
        <p className="text-main/45 text-sm mt-1">
          Your name and contact details are visible to Alakowe only.
        </p>
      </div>

      <div className="max-w-lg">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-secondary/20 border-2 border-secondary/30 flex items-center justify-center">
              <span className="font-heading font-bold text-secondary text-xl">
                {form.firstName.charAt(0)}
              </span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-main border-2 border-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
              <Camera size={11} className="text-white" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-main text-base">
              {form.firstName} {form.lastName}
            </p>
            <p className="text-main/40 text-sm">{form.email}</p>
          </div>
        </div>

        {/* Success message */}
        {saved && (
          <div className="mb-5 bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-2.5">
            <Check size={15} className="text-green-600 shrink-0" />
            <p className="text-sm font-semibold text-green-700">Profile updated successfully.</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-third overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-third">
            <User size={16} className="text-secondary" />
            <p className="font-heading font-semibold text-main text-base">Personal Details</p>
          </div>

          <div className="px-5 py-5 flex flex-col gap-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={update('firstName')}
                  className="w-full bg-third border border-third rounded-lg px-4 py-3 text-sm text-main outline-none focus:border-secondary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={update('lastName')}
                  className="w-full bg-third border border-third rounded-lg px-4 py-3 text-sm text-main outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={form.email}
                className="w-full bg-third/60 border border-third rounded-lg px-4 py-3 text-sm text-main/50 cursor-not-allowed outline-none"
              />
              <p className="text-[11px] text-main/35 mt-1.5">Email cannot be changed here.</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                placeholder="080XXXXXXXX"
                className="w-full bg-third border border-third rounded-lg px-4 py-3 text-sm text-main placeholder-main/30 outline-none focus:border-secondary transition-colors"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={update('location')}
                placeholder="e.g. Ikeja, Lagos"
                className="w-full bg-third border border-third rounded-lg px-4 py-3 text-sm text-main placeholder-main/30 outline-none focus:border-secondary transition-colors"
              />
              <p className="text-[11px] text-main/35 mt-1.5">
                Used to show your general area on listings.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-main text-white font-semibold py-3 rounded-lg hover:bg-main/90 transition-colors text-sm mt-1"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AccountProfile
