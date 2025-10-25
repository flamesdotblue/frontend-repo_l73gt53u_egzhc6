import { useState } from 'react'
import { X, PlusCircle } from 'lucide-react'

const UNITS = ['gm', 'cup', 'roti']

export default function AddItemModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState(UNITS[0])
  const [proteinPerUnit, setProteinPerUnit] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const proteinVal = parseFloat(proteinPerUnit)
    if (!name.trim() || !unit || isNaN(proteinVal) || proteinVal <= 0) {
      setError('Please provide a valid name, unit, and protein per unit > 0')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), unit, protein_per_unit: proteinVal }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to create item')
      const data = await res.json()
      onCreated?.(data)
      setName('')
      setUnit(UNITS[0])
      setProteinPerUnit('')
      onClose?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">Add new item</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 rounded-md border"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="px-3 py-2 rounded-md border bg-white"
            >
              {UNITS.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="Protein / unit (g)"
              value={proteinPerUnit}
              onChange={(e) => setProteinPerUnit(e.target.value)}
              className="px-3 py-2 rounded-md border"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
