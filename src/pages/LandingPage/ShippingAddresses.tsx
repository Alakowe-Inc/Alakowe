import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, MapPin, Pencil, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAreasByState, useStates } from '../../lib/api/location/location.hooks'
import { useShippingAddresses, useCreateShippingAddress, useUpdateShippingAddress, useDeleteShippingAddress, useSetDefaultShippingAddress } from '../../lib/api/shipping-addresses/shipping-addresses.hooks'
import type { CreateShippingAddressRequest, ShippingAddressResponse, UpdateShippingAddressRequest } from '../../lib/api/types'
import { FormControl, SelectBoxControl, CheckBoxControl, type SelectOption } from '@/components/ui/form-controls'


type FormState = {
  label: string
  stateId: number | ''
  areaId: number | ''
  addressLine: string
  isDefault: boolean
}

function classNames(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(' ')
}

function inputClass(hasError?: boolean) {
  return `w-full border rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors bg-white ${
    hasError ? 'border-red-400' : 'border-main/15'
  }`
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function toNumberOrEmpty(v: string): number | '' {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : ''
}

export default function ShippingAddresses() {
  const { user } = useAuth()

  const { data: addressesData, isLoading } = useShippingAddresses()
  const addresses: ShippingAddressResponse[] = addressesData ?? []

  const createMutation = useCreateShippingAddress()
  const updateMutation = useUpdateShippingAddress()
  const deleteMutation = useDeleteShippingAddress()
  const setDefaultMutation = useSetDefaultShippingAddress()

  const { data: states } = useStates()

  const [form, setForm] = useState<FormState>({
    label: '',
    stateId: '',
    areaId: '',
    addressLine: '',
    isDefault: false,
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const selectedStateId = typeof form.stateId === 'number' ? form.stateId : undefined
  const { data: areas } = useAreasByState(selectedStateId)

  const defaultAddress = useMemo(() => addresses.find(a => a.isDefault), [addresses])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(p => ({ ...p, [key]: value }))
  }

  function resetForm() {
    setForm({ label: '', stateId: '', areaId: '', addressLine: '', isDefault: false })
    setEditingId(null)
    setErrors({})
  }

  function validate(): Partial<FormState> {
    const e: Partial<FormState> = {}
    if (!form.label.trim()) e.label = 'Label is required'
    if (!form.stateId) e.stateId = ''
    if (!form.areaId) e.areaId = ''
    if (!form.addressLine.trim()) e.addressLine = 'Address is required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const body: CreateShippingAddressRequest & UpdateShippingAddressRequest = {
      label: form.label.trim(),
      stateId: form.stateId as number,
      areaId: form.areaId as number,
      addressLine: form.addressLine.trim(),
      isDefault: form.isDefault,
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          body: body as UpdateShippingAddressRequest,
        })
      } else {
        await createMutation.mutateAsync(body as CreateShippingAddressRequest)
      }
      resetForm()
    } catch {
      // errors are handled by axios/toast
    }
  }

  function startEdit(addr: ShippingAddressResponse) {
    setEditingId(addr.id ?? null)
    setForm({
      label: addr.label ?? '',
      stateId: addr.stateId ?? '',
      areaId: addr.areaId ?? '',
      addressLine: addr.addressLine ?? '',
      isDefault: !!addr.isDefault,
    })
    setErrors({})
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this shipping address?')) return
    try {
      await deleteMutation.mutateAsync(id)
      if (editingId === id) resetForm()
    } catch {
      // handled
    }
  }

  async function handleSetDefault(id: number) {
    try {
      await setDefaultMutation.mutateAsync(id)
    } catch {
      // handled
    }
  }

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          ← Back to Profile
        </Link>

        <div className="mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">Shipping Addresses</h1>
          <p className="text-main/50 text-sm mt-1">Add, edit, and set your default shipping address for checkout.</p>
        </div>

        {/* Default address highlight */}
        {defaultAddress && (
          <div className="flex items-center gap-3 bg-main/5 border border-main/10 rounded-2xl px-5 py-3.5 mb-6">
            <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-main truncate">Default: {defaultAddress.label}</p>
              <p className="text-xs text-main/45 mt-0.5 truncate">
                {defaultAddress.addressLine}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-main/45">
              <Check size={16} className="text-green-600" />
              <span>Selected</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* List */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-heading font-bold text-main text-base">Your Addresses</h2>
                <p className="text-xs text-main/45 mt-1">{isLoading ? 'Loading…' : `${addresses.length} saved`}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setForm(p => ({ ...p, isDefault: addresses.length === 0 }))
                }}
                className="inline-flex items-center gap-2 bg-secondary text-white font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-colors"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {addresses.length === 0 ? (
                <div className="text-sm text-main/50 bg-main/3 border border-main/10 rounded-xl px-4 py-3">
                  No shipping addresses yet.
                </div>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} className="border border-third rounded-2xl px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className={classNames('w-9 h-9 rounded-full flex items-center justify-center shrink-0', addr.isDefault ? 'bg-green-50' : 'bg-secondary/10')}>
                        {addr.isDefault ? <Check size={18} className="text-green-600" /> : <MapPin size={18} className="text-secondary" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-main truncate">{addr.label}</p>
                          {addr.isDefault && (
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-main/50 mt-1">
                          {[addr.addressLine, addr.areaName, addr.stateName].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {addr.isDefault ? (
                        <button
                          type="button"
                          disabled
                          className="px-3 py-2 rounded-full text-xs font-semibold bg-main/5 border border-main/10 text-main/50 cursor-not-allowed"
                        >
                          Default
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addr.id && handleSetDefault(addr.id)}
                          className="px-3 py-2 rounded-full text-xs font-semibold bg-secondary/10 border border-secondary/20 text-secondary hover:bg-secondary/15 transition-colors"
                        >
                          Set default
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (addr.id) startEdit(addr)
                        }}
                        className="ml-auto p-2 rounded-xl border border-main/10 text-main/70 hover:text-main hover:bg-main/5 transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => addr.id && handleDelete(addr.id)}
                        className="p-2 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Create / Edit form */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-heading font-bold text-main text-base">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                <p className="text-xs text-main/45 mt-1">{editingId ? 'Update your shipping details.' : 'Save a new address for checkout.'}</p>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-semibold text-main/70 hover:text-main transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Label" error={errors.label}>
                  <FormControl
                    type="text"
                    placeholder="e.g. Home, Work"
                    value={form.label}
                    onChange={e => setField('label', e.target.value)}
                    style={inputClass(!!errors.label)}
                  />
                </Field>

                <Field label="State" error={errors.stateId ? 'State is required' : undefined}>
                  <SelectBoxControl
                    placeholder="Select state"
                    options={(states ?? []).map(s => ({ label: s.name, value: s.id }))}
                    value={form.stateId === '' ? null : (states ?? []).map(s => ({ label: s.name, value: s.id })).find(o => o.value === form.stateId) ?? null}
                    onChange={(option: SelectOption) => {
                      setField('stateId', toNumberOrEmpty(String(option.value)))
                      setField('areaId', '')
                    }}
                    style={inputClass(!!errors.stateId)}
                  />
                </Field>

                <Field label="Area" error={errors.areaId ? String(errors.areaId) : undefined}>
                  <SelectBoxControl
                    placeholder="Select area"
                    options={(areas ?? []).map(a => ({ label: a.name, value: a.id }))}
                    value={form.areaId === '' ? null : (areas ?? []).map(a => ({ label: a.name, value: a.id })).find(o => o.value === form.areaId) ?? null}
                    onChange={(option: SelectOption) => setField('areaId', toNumberOrEmpty(String(option.value)))}
                    disabled={!selectedStateId}
                    style={inputClass(!!errors.areaId)}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Address Line" error={errors.addressLine}>
                    <FormControl
                      type="text"
                      placeholder="e.g. 12 Broad Street, Flat 3"
                      value={form.addressLine}
                      onChange={e => setField('addressLine', e.target.value)}
                      style={inputClass(!!errors.addressLine)}
                    />
                  </Field>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <CheckBoxControl
                  checked={form.isDefault}
                  onChange={e => setField('isDefault', e.target.checked)}
                  className="accent-secondary"
                  label={{ exist: true, text: 'Set as default shipping address', style: 'font-semibold text-main' }}
                />

                <button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    updateMutation.isPending ||
                    deleteMutation.isPending ||
                    setDefaultMutation.isPending
                  }
                  className="bg-secondary text-white font-semibold py-3.5 px-6 rounded-full hover:bg-secondary/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {editingId ? (updateMutation.isPending ? 'Saving…' : 'Save Changes') : createMutation.isPending ? 'Saving…' : 'Save Address'}
                </button>
              </div>

              {!user && (
                <div className="text-sm text-main/50 bg-main/3 border border-main/10 rounded-xl px-4 py-3">
                  Please sign in to manage shipping addresses.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

