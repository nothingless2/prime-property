'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/agent/properties')
    }
  }

  return (
    <div className="min-h-screen flex bg-neutral-white">
      {/* Left Side: Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <Image 
          src="/hero_bg.png" 
          alt="Luxury Property" 
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent z-10 opacity-80"></div>
        <div className="absolute bottom-16 left-16 z-20 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Standar Baru dalam <br/>
            <span className="text-accent-gold">Properti Eksklusif</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Bergabunglah dengan jaringan agen profesional kami dan berikan layanan premium untuk klien Anda.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 relative bg-white">
        {/* Back to Home Link */}
        <Link href="/" className="absolute top-8 right-8 text-sm text-gray-500 hover:text-primary-black font-semibold flex items-center transition">
          &larr; Kembali ke Beranda
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-12">
            <Image src="/logoprime.jpg" alt="Prime Property Logo" width={180} height={48} className="h-14 w-auto object-contain mb-8" />
            <h1 className="text-3xl font-bold text-primary-black mb-2 tracking-tight">Agent Portal</h1>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-8 shadow-sm text-sm">
              <p className="font-bold">Login Gagal</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-primary-black text-xs font-bold mb-2 uppercase tracking-wider">Username</label>
              <div className="relative">
                <input 
                  id="username"
                  name="username" 
                  type="text" 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-primary-black placeholder-gray-400 focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition shadow-sm"
                  placeholder="Masukkan username Anda"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-primary-black text-xs font-bold uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <input 
                  id="password"
                  name="password" 
                  type="password" 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-primary-black placeholder-gray-400 focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition shadow-sm"
                  placeholder="Masukkan password Anda"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-black text-neutral-white font-bold py-3.5 px-4 rounded-lg hover:bg-gray-800 transition shadow-lg disabled:opacity-50 mt-8 flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Login Agent'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
