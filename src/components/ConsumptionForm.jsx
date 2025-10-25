import { useEffect, useState } from 'react'

export default function ConsumptionForm({ items, date, onAdded }) {
  const [itemId, setItemId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

  useEffect(() => {
    if (items && items.length) setItemId(items[0].id)
  }, [items])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const qty = parseFloat(quantity)
    if (!itemId || !date || isNaN(qty) || qty <= 0) {
      setError('Pick an item, date and quantity > 0')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/consumptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, item_id: itemId, quantity: qty }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to add entry')
      const data = await res.json()
      onAdded?.(data)
      setQuantity('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white/60 backdrop-blur rounded-xl p-4 border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          className="px-3 py-2 rounded-md border bg-white"
        >
          {items?.map(it => (
            <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
          ))}
        </select>
        <input
          type="number"
          step="0.1"
          min="0"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="px-3 py-2 rounded-md border"
        />
        <div className="flex items-center text-sm text-gray-600">
          {(() => {
            const it = items?.find(i => i.id === itemId)
            if (!it || !quantity) return null
            const protein = parseFloat(quantity || '0') * Number(it.protein_per_unit)
            if (isNaN(protein)) return null
            return <span>Estimated protein: <span className="font-semibold">{protein.toFixed(1)} g</span></span>
          })()}
        </div>
        <button
          type="submit"
          disabled={loading || !items?.length}
          className="bg-emerald-600 text-white rounded-md px-4 py-2 hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Consumption'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
