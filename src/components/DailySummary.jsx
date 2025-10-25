import { CheckCircle2 } from 'lucide-react'

export default function DailySummary({ date, data, onRefresh }) {
  const entries = data?.entries || []
  const total = data?.total_protein || 0

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Today’s summary</h2>
        <button onClick={onRefresh} className="text-sm px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50">Refresh</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.length === 0 && (
          <div className="col-span-full text-sm text-gray-600 bg-white/60 border rounded-xl p-4">
            No entries for {date}. Add your first one below.
          </div>
        )}
        {entries.map(e => (
          <div key={e.id} className="rounded-xl border bg-white/70 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{e.item_name}</p>
                <p className="text-sm text-gray-600">{Number(e.quantity).toFixed(1)} {e.unit}</p>
              </div>
              <span className="text-emerald-700 font-bold">{Number(e.protein_total).toFixed(1)} g</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-2xl border bg-emerald-50 text-emerald-800 p-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Total protein for {date}</span>
        </div>
        <span className="text-2xl font-extrabold">{Number(total).toFixed(1)} g</span>
      </div>
    </section>
  )
}
