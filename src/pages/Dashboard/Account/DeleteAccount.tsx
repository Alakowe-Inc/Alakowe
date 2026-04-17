import { useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'

const CONFIRM_PHRASE = 'DELETE'

function DeleteAccount() {
  const [input, setInput] = useState('')
  const canDelete = input === CONFIRM_PHRASE

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-1">
          Account
        </p>
        <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">Delete Account</h1>
        <p className="text-main/45 text-sm mt-1">
          Permanently remove your account and all associated data.
        </p>
      </div>

      <div className="max-w-lg">
        {/* Warning card */}
        <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-red-100">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <p className="font-heading font-semibold text-red-800 text-base">
              This action cannot be undone
            </p>
          </div>

          <div className="px-5 py-4">
            <p className="text-sm text-red-700/80 leading-relaxed mb-3">
              Deleting your account will permanently:
            </p>
            <ul className="flex flex-col gap-2">
              {[
                'Remove all your listings (live and pending)',
                'Cancel any active orders',
                'Forfeit pending earnings not yet released',
                'Delete your profile and purchase history',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-red-700/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Active orders warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
          <p className="text-xs font-semibold text-amber-800 mb-1">
            Before you delete:
          </p>
          <p className="text-xs text-amber-700/80 leading-relaxed">
            If you have active orders or pending payouts, please wait for them to complete before
            deleting your account. Contact{' '}
            <span className="font-semibold">support@alakowe.com</span> if you need help.
          </p>
        </div>

        {/* Confirmation form */}
        <div className="bg-white rounded-xl border border-third overflow-hidden">
          <div className="px-5 py-4 border-b border-third">
            <p className="font-heading font-semibold text-main text-base">Confirm deletion</p>
          </div>

          <div className="px-5 py-5">
            <label className="block text-sm text-main/60 mb-3 leading-relaxed">
              Type{' '}
              <span className="font-mono font-bold text-main px-1.5 py-0.5 bg-third rounded">
                {CONFIRM_PHRASE}
              </span>{' '}
              to confirm you want to permanently delete your account.
            </label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Type "${CONFIRM_PHRASE}" to confirm`}
              className="w-full bg-third border border-third rounded-lg px-4 py-3 text-sm text-main font-mono placeholder-main/30 outline-none focus:border-red-400 transition-colors mb-5"
            />

            <button
              disabled={!canDelete}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-lg text-sm transition-all ${
                canDelete
                  ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                  : 'bg-red-100 text-red-300 cursor-not-allowed'
              }`}
            >
              <Trash2 size={15} />
              Delete My Account
            </button>

            <p className="text-[11px] text-main/35 text-center mt-3">
              You will be logged out immediately and your data will be queued for deletion.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccount
