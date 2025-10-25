export default function ItemList({ items }) {
  if (!items?.length) {
    return (
      <div className="text-sm text-gray-600 bg-white/50 p-4 rounded-xl border">
        No items yet. Add your first item above.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white/60">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">Item</th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Protein / unit (g)</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} className="border-t">
              <td className="px-4 py-2 font-medium">{it.name}</td>
              <td className="px-4 py-2">{it.unit}</td>
              <td className="px-4 py-2">{Number(it.protein_per_unit).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
