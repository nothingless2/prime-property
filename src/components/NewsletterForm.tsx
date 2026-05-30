'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { subscribeNewsletter } from '@/app/actions/contact'

const MySwal = withReactContent(Swal)

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return

    setLoading(true)
    const result = await subscribeNewsletter(email)
    setLoading(false)

    if (result.error) {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal Berlangganan',
        text: result.error,
        confirmButtonColor: '#B33A3A',
        background: '#1A1A1A',
        color: '#FFFFFF'
      })
    } else {
      setEmail('')
      MySwal.fire({
        icon: 'success',
        title: 'Berhasil Berlangganan!',
        text: 'Anda akan menerima update properti eksklusif dari kami.',
        confirmButtonColor: '#D4AF37',
        background: '#1A1A1A',
        color: '#FFFFFF'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex bg-gray-900 border border-gray-800 rounded-md overflow-hidden">
      <input
        type="email"
        required
        aria-label="Email untuk berlangganan"
        placeholder="Email Anda"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        className="bg-transparent border-none outline-none px-4 py-2 text-sm w-full text-white placeholder-gray-600 focus:ring-0 disabled:opacity-50"
      />
      <button 
        type="submit" 
        disabled={loading}
        className="bg-accent-gold text-primary-black font-bold px-4 py-2 text-sm hover:bg-yellow-600 transition disabled:opacity-70 whitespace-nowrap"
      >
        {loading ? 'Memproses...' : 'Daftar'}
      </button>
    </form>
  )
}
