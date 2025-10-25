export default function DailyLog({ date, data, onRefresh }) {
  const entries = data?.entries || []
  const total = data?.total_protein || 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Daily log for {date}</h3>
        <button onClick={onRefresh} className="text-sm px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50">Refresh</button>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white/60">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Protein</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-sm text-gray-600">No entries yet.</td>
              </tr>
            )}
            {entries.map(e => (
              <tr key={e.id} className="border-t">
                <td className="px-4 py-2 font-medium">{e.item_name}</td>
                <td className="px-4 py-2">{Number(e.quantity).toFixed(1)}</td>
                <td className="px-4 py-2">{e.unit}</td>
                <td className="px-4 py-2">{Number(e.protein_total).toFixed(1)} g</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t bg-gray-50 font-semibold">
              <td className="px-4 py-2" colSpan={3}>Total</td>
              <td className="px-4 py-2">{Number(total).toFixed(1)} g</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
