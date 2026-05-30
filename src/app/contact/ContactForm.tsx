'use client'

import { useState } from 'react'
import { submitContact } from '@/app/actions/contact'

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi No HP Min 10 Digit
    if (formData.phone.length < 10) {
      setToast({ message: 'Nomor HP harus memiliki minimal 10 digit', type: 'error' })
      setTimeout(() => setToast(null), 5000)
      return
    }

    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('email', formData.email)
      data.append('phone', formData.phone)
      data.append('message', formData.message)

      const result = await submitContact(data)
      
      if (result.error) {
        setToast({ message: result.error, type: 'error' })
      } else {
        setToast({ message: 'Pesan terkirim, tim kami akan menghubungi Anda.', type: 'success' })
        setFormData({ name: '', email: '', phone: '', message: '' })
      }
    } catch (e: any) {
      setToast({ message: e.message || 'Terjadi kesalahan sistem.', type: 'error' })
    } finally {
      setLoading(false)
      setTimeout(() => setToast(null), 5000)
    }
  }

  return (
    <div className="relative">
      {/* Simple Toast */}
      {toast && (
        <div className={`absolute -top-16 left-0 right-0 p-4 rounded-lg shadow-lg text-center font-bold text-white transition-opacity ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
            <input 
              id="name"
              type="text" 
              required 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition" 
              placeholder="Nama Anda" 
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
            <input 
              id="email"
              type="email" 
              required 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition" 
              placeholder="Email Anda" 
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nomor HP</label>
          <input 
            id="phone"
            type="tel" 
            required 
            pattern="[0-9]*"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition" 
            placeholder="Contoh: 081234567890" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pesan</label>
          <textarea 
            rows={6} 
            required
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition resize-none" 
            placeholder="Tuliskan properti yang Anda minati atau pertanyaan Anda..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`bg-primary-black text-neutral-white font-bold py-4 px-10 rounded-full hover:bg-gray-800 transition shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Mengirim...' : 'Kirim Pesan Sekarang'}
        </button>
      </form>
    </div>
  )
}
