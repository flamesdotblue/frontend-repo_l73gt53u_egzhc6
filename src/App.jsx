import { useEffect, useMemo, useState } from 'react'
import ItemForm from './components/ItemForm'
import ItemList from './components/ItemList'
import ConsumptionForm from './components/ConsumptionForm'
import DailyLog from './components/DailyLog'

export default function App() {
  const [items, setItems] = useState([])
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0,10))
  const [dailyData, setDailyData] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

  async function loadItems() {
    const res = await fetch(`${API_BASE}/api/items`)
    const data = await res.json()
    setItems(data)
  }

  async function loadDaily() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/consumptions?date=${selectedDate}`)
      const data = await res.json()
      setDailyData(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  useEffect(() => {
    loadDaily()
  }, [selectedDate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Daily Protein Tracker</h1>
          <div className="flex items-center gap-3">
            <label htmlFor="date" className="text-sm text-gray-600">Date</label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-md border bg-white"
            />
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Define Items</h2>
          <ItemForm onCreated={() => loadItems()} />
          <ItemList items={items} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Add Daily Consumption</h2>
          <ConsumptionForm items={items} date={selectedDate} onAdded={() => loadDaily()} />
          {loading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : (
            <DailyLog date={selectedDate} data={dailyData} onRefresh={loadDaily} />
          )}
        </section>

        <footer className="pt-6 text-center text-sm text-gray-500">
          Track your protein intake by defining items once and logging what you eat each day.
        </footer>
      </div>
    </div>
  )
}
