import { useEffect, useState } from 'react'
import Header from './components/Header'
import ConsumptionForm from './components/ConsumptionForm'
import DailySummary from './components/DailySummary'
import AddItemModal from './components/AddItemModal'

export default function App() {
  const [items, setItems] = useState([])
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0,10))
  const [dailyData, setDailyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [preferredItemId, setPreferredItemId] = useState('')

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

  useEffect(() => { loadItems() }, [])
  useEffect(() => { loadDaily() }, [selectedDate])

  function handleItemCreated(newItem) {
    // Refresh items, and prefer the newly created one in the selector
    loadItems()
    setPreferredItemId(newItem.id)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100 via-white to-sky-100 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <Header selectedDate={selectedDate} onChangeDate={setSelectedDate} />

        <ConsumptionForm
          items={items}
          date={selectedDate}
          onAdded={loadDaily}
          onOpenAddItem={() => setModalOpen(true)}
          preferredItemId={preferredItemId}
        />

        {loading ? (
          <div className="text-sm text-gray-600">Loading summary...</div>
        ) : (
          <DailySummary date={selectedDate} data={dailyData} onRefresh={loadDaily} />
        )}

        <footer className="pt-6 text-center text-sm text-gray-500">
          Keep it simple: pick an item, log it, and watch your protein add up.
        </footer>
      </div>

      <AddItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleItemCreated}
      />
    </div>
  )
}
