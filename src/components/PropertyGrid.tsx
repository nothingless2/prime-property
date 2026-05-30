'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, TrendingUp, Maximize, Compass } from 'lucide-react'

// Define the type for the serialized property
type SerializedProperty = {
  id: string
  nama_property: string
  group: string | null
  lebar: number
  panjang: number
  tingkat: number
  hadap: string
  tipe: string
  price: string // Serialized from BigInt
  status: string
  kawasan: string
}

export default function PropertyGrid({ 
  properties, 
  q 
}: { 
  properties: SerializedProperty[],
  q?: string
}) {
  const [showAll, setShowAll] = useState(!!q)

  const formatRupiah = (val: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(val))
  }

  const generateSlug = (name: string, id: string) => {
    const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    return `/properties/${slugName}-${id}`
  }

  const showButton = !showAll && properties.length > 3
  const buttonDisplayClass = 'block'

  if (properties.length === 0) {
    return (
      <div className="col-span-2 md:col-span-2 lg:col-span-3 text-center py-10 text-gray-500 w-full">
        Belum ada properti yang tersedia.
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-primary-black mb-2">
            {q ? `Hasil Pencarian: "${q}"` : 'Properti Unggulan'}
          </h2>
          <p className="text-gray-500">
            {q ? `Menemukan ${properties.length} properti yang sesuai.` : 'Koleksi properti terbaik kami bulan ini.'}
          </p>
        </div>
        {showButton && (
          <button 
            onClick={() => setShowAll(true)} 
            className="text-accent-gold font-medium hover:underline text-sm tracking-wide hidden md:block cursor-pointer"
          >
            Lihat Semua →
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full">
        {properties.map((prop, index) => {
          // Visibility logic:
          // Index 0-2: always visible
          // Index 3+: hidden everywhere (unless showAll)
          let visibilityClass = ''
          if (!showAll) {
            if (index >= 3) {
              visibilityClass = 'hidden' // hidden everywhere
            }
          }

          return (
            <Link 
              key={prop.id} 
              href={generateSlug(prop.nama_property, prop.id)} 
              className={`bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group flex-col cursor-pointer ${visibilityClass ? visibilityClass : 'flex'}`}
            >
              <div className="h-40 sm:h-64 bg-gray-200 overflow-hidden relative flex items-center justify-center">
                <Image 
                  src={`/premium_prop_${(prop.id.charCodeAt(0) % 3) + 1}.png`} 
                  alt={prop.nama_property} 
                  fill 
                  className="object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
              <div className="p-3 sm:p-6 flex flex-col flex-1">
                <div className="flex flex-col xl:flex-row justify-between items-start mb-1 sm:mb-2 gap-1 xl:gap-0">
                  <h3 className="text-base sm:text-xl font-bold text-primary-black line-clamp-1 group-hover:text-accent-gold transition" title={prop.nama_property}>{prop.nama_property}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${prop.status === 'in_stock' ? 'bg-green-100 text-green-800' : 'bg-[#B33A3A] text-white'}`}>
                    {prop.status === 'in_stock' ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-4 flex items-center gap-1"><MapPin className="w-3 h-3"/> {prop.kawasan} {prop.group ? `(${prop.group})` : ''}</div>
                
                <div className="flex flex-wrap gap-2 sm:gap-4 text-gray-500 text-[10px] sm:text-sm mb-4 sm:mb-6 mt-auto">
                  <div className="flex items-center gap-1 sm:gap-1.5" title="Tipe & Tingkat">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-accent-gold" />
                    <span>{prop.tipe} <span className="hidden sm:inline">({prop.tingkat} Lt)</span></span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5" title="Dimensi">
                    <Maximize className="w-3 h-3 sm:w-4 sm:h-4 text-accent-gold" />
                    <span>{prop.lebar}x{prop.panjang}m</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5" title="Arah Hadap">
                    <Compass className="w-3 h-3 sm:w-4 sm:h-4 text-accent-gold" />
                    <span className="truncate max-w-[60px] sm:max-w-none">{prop.hadap}</span>
                  </div>
                </div>
                
                <div className="font-bold text-sm sm:text-xl text-primary-black">
                  {formatRupiah(prop.price)}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {showButton && (
        <div className={`mt-10 text-center w-full ${buttonDisplayClass}`}>
          <button 
            onClick={() => setShowAll(true)} 
            className="inline-block border border-accent-gold text-accent-gold font-bold px-8 py-3 rounded-full hover:bg-accent-gold hover:text-primary-black transition cursor-pointer"
          >
            Lihat Semua Properti
          </button>
        </div>
      )}
    </>
  )
}
