import { Calendar } from 'lucide-react'

export default function Header({ selectedDate, onChangeDate }) {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Protein Tracker</h1>
        <p className="text-gray-600 mt-1">Log what you eat and hit your daily protein goal.</p>
      </div>
      <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-xl border px-3 py-2">
        <Calendar className="w-4 h-4 text-gray-600" />
        <input
          aria-label="Select date"
          type="date"
          value={selectedDate}
          onChange={(e) => onChangeDate(e.target.value)}
          className="px-2 py-1.5 rounded-md outline-none bg-transparent"
        />
      </div>
    </header>
  )
}
