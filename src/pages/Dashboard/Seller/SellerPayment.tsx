import { useState } from 'react'
import { CreditCard, ShieldCheck } from 'lucide-react'

const NIGERIAN_BANKS = [
  'Access Bank',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Guaranty Trust Bank (GTB)',
  'Kuda Bank',
  'OPay',
  'Palmpay',
  'Polaris Bank',
  'Sterling Bank',
  'United Bank for Africa (UBA)',
  'Wema Bank',
  'Zenith Bank',
]

interface PaymentForm {
  bankName: string
  accountNumber: string
  accountName: string
}

// Mock saved bank info — null means not set yet
const savedBank: PaymentForm | null = {
  bankName: 'Guaranty Trust Bank (GTB)',
  accountNumber: '0123456789',
  accountName: 'CHIDI OKONKWO',
}

function SellerPayment() {
  const [editing, setEditing] = useState(!savedBank)
  const [form, setForm] = useState<PaymentForm>(
    savedBank ?? { bankName: '', accountNumber: '', accountName: '' }
  )
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-1">
          Seller Dashboard
        </p>
        <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">Payment Information</h1>
        <p className="text-main/45 text-sm mt-1">
          Your earnings will be paid to this account after each confirmed delivery.
        </p>
      </div>

      <div className="max-w-lg">
        {/* Saved state — read-only display */}
        {savedBank && !editing && (
          <div className="bg-white rounded-xl border border-third overflow-hidden mb-4">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-third">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <ShieldCheck size={17} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-main">Bank account linked</p>
                <p className="text-xs text-main/40">Payouts will be sent here</p>
              </div>
            </div>

            <div className="px-5 py-4 flex flex-col gap-3">
              {[
                { label: 'Bank Name', value: form.bankName },
                {
                  label: 'Account Number',
                  value: `••••••${form.accountNumber.slice(-4)}`,
                },
                { label: 'Account Name', value: form.accountName },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-main/35 mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-main">{value}</p>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-third">
              <button
                onClick={() => setEditing(true)}
                className="text-sm font-semibold text-secondary hover:text-main transition-colors"
              >
                Update bank details
              </button>
            </div>
          </div>
        )}

        {/* Success message */}
        {saved && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-5 py-3">
            <p className="text-sm font-semibold text-green-700">
              Payment details saved successfully.
            </p>
          </div>
        )}

        {/* Form */}
        {editing && (
          <div className="bg-white rounded-xl border border-third overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-third">
              <CreditCard size={18} className="text-secondary" />
              <p className="font-heading font-semibold text-main text-base">
                {savedBank ? 'Update' : 'Add'} Bank Account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-5">
              {/* Bank name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                  Bank Name
                </label>
                <select
                  required
                  value={form.bankName}
                  onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))}
                  className="w-full bg-third border border-third rounded-lg px-4 py-3 text-sm text-main outline-none focus:border-secondary transition-colors appearance-none"
                >
                  <option value="">Select your bank</option>
                  {NIGERIAN_BANKS.map(bank => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="10-digit NUBAN"
                  value={form.accountNumber}
                  onChange={e =>
                    setForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))
                  }
                  className="w-full bg-third border border-third rounded-lg px-4 py-3 text-sm text-main placeholder-main/30 font-mono outline-none focus:border-secondary transition-colors"
                />
              </div>

              {/* Account name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="As shown on your bank account"
                  value={form.accountName}
                  onChange={e => setForm(f => ({ ...f, accountName: e.target.value }))}
                  className="w-full bg-third border border-third rounded-lg px-4 py-3 text-sm text-main placeholder-main/30 outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-main text-white font-semibold py-3 rounded-lg hover:bg-main/90 transition-colors text-sm"
                >
                  Save Bank Details
                </button>
                {savedBank && (
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-5 border border-main/20 text-main font-semibold py-3 rounded-lg hover:border-main/40 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Security note */}
        <div className="mt-4 flex items-start gap-2.5 px-1">
          <ShieldCheck size={15} className="text-main/30 shrink-0 mt-0.5" />
          <p className="text-xs text-main/40 leading-relaxed">
            Your bank details are encrypted and only used for payout transfers. Alakowe will never
            debit this account.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SellerPayment
