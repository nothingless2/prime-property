'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function HeroSearch({ defaultValue = '' }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}#properti`)
    } else {
      router.push(`/#properti`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl bg-white rounded-full p-2 flex items-center shadow-lg">
      <div className="pl-6 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <input 
        type="text" 
        aria-label="Cari properti"
        placeholder="Cari properti, area, dll..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-primary-black"
      />
      <button 
        type="submit"
        className="bg-accent-gold text-primary-black font-bold px-5 sm:px-8 py-3 rounded-full hover:bg-yellow-600 transition whitespace-nowrap"
      >
        Cari <span className="hidden sm:inline">Properti</span>
      </button>
    </form>
  )
}
