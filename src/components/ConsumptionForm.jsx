import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'

export default function ConsumptionForm({ items, date, onAdded, onOpenAddItem, preferredItemId }) {
  const [itemId, setItemId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

  useEffect(() => {
    if (preferredItemId) {
      setItemId(preferredItemId)
      return
    }
    if (items && items.length) setItemId(items[0].id)
  }, [items, preferredItemId])

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

  const selected = items?.find(i => i.id === itemId)
  const estimated = selected && quantity ? parseFloat(quantity || '0') * Number(selected.protein_per_unit) : null

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Quick add</h2>
        <button
          type="button"
          onClick={onOpenAddItem}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50"
        >
          <Plus className="w-4 h-4" /> New item
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white/70 backdrop-blur rounded-2xl p-4 border">
        {(!items || items.length === 0) ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">You don’t have any items yet.</p>
            <button type="button" onClick={onOpenAddItem} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Add your first item</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="px-3 py-2 rounded-md border bg-white md:col-span-2"
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
              {estimated != null && !isNaN(estimated) && (
                <span>Estimated protein: <span className="font-semibold">{estimated.toFixed(1)} g</span></span>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !items?.length}
              className="bg-emerald-600 text-white rounded-md px-4 py-2 hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </section>
  )
}
