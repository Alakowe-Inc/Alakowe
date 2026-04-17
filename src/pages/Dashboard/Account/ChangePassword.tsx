import { useState } from 'react'
import { Eye, EyeOff, Lock, Check } from 'lucide-react'

interface PasswordForm {
  current: string
  next: string
  confirm: string
}

function ChangePassword() {
  const [form, setForm] = useState<PasswordForm>({ current: '', next: '', confirm: '' })
  const [show, setShow] = useState({ current: false, next: false, confirm: false })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function update(field: keyof PasswordForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      setError('')
    }
  }

  function toggleShow(field: keyof typeof show) {
    setShow(s => ({ ...s, [field]: !s[field] }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.next !== form.confirm) {
      setError('New passwords do not match.')
      return
    }
    if (form.next.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setSaved(true)
    setForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setSaved(false), 4000)
  }

  const fields: { key: keyof PasswordForm; label: string; placeholder: string }[] = [
    { key: 'current', label: 'Current Password', placeholder: 'Your current password' },
    { key: 'next', label: 'New Password', placeholder: 'At least 8 characters' },
    { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat your new password' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-1">
          Account
        </p>
        <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">Change Password</h1>
        <p className="text-main/45 text-sm mt-1">
          Choose a strong password you haven't used before.
        </p>
      </div>

      <div className="max-w-lg">
        {/* Success */}
        {saved && (
          <div className="mb-5 bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-2.5">
            <Check size={15} className="text-green-600 shrink-0" />
            <p className="text-sm font-semibold text-green-700">Password updated successfully.</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-third overflow-hidden"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-third">
            <Lock size={16} className="text-secondary" />
            <p className="font-heading font-semibold text-main text-base">Update Password</p>
          </div>

          <div className="px-5 py-5 flex flex-col gap-5">
            {fields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={show[key] ? 'text' : 'password'}
                    required
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={update(key)}
                    className="w-full bg-third border border-third rounded-lg px-4 py-3 pr-11 text-sm text-main placeholder-main/30 outline-none focus:border-secondary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(key)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-main/35 hover:text-main/60 transition-colors"
                  >
                    {show[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-third rounded-lg px-4 py-3 mt-1">
              <p className="text-xs text-main/50 font-medium mb-1.5">Password requirements:</p>
              <ul className="flex flex-col gap-1">
                {[
                  'At least 8 characters',
                  'Mix of letters and numbers recommended',
                  'Avoid reusing old passwords',
                ].map(req => (
                  <li key={req} className="text-xs text-main/40 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-main/30 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-main text-white font-semibold py-3 rounded-lg hover:bg-main/90 transition-colors text-sm"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
