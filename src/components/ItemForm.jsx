import { useState } from 'react'

const UNITS = ['gm', 'cup', 'roti']

export default function ItemForm({ onCreated }) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState(UNITS[0])
  const [proteinPerUnit, setProteinPerUnit] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white/60 backdrop-blur rounded-xl p-4 border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full px-3 py-2 rounded-md border"
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
          placeholder="Protein per unit (g)"
          value={proteinPerUnit}
          onChange={(e) => setProteinPerUnit(e.target.value)}
          className="input input-bordered w-full px-3 py-2 rounded-md border"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Add Item'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
