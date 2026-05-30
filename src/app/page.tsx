import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, UserCheck, TrendingUp, Maximize, MapPin, Compass } from 'lucide-react'
import prisma from '@/lib/prisma'
import HeroSearch from '@/components/HeroSearch'
import PropertyGrid from '@/components/PropertyGrid'

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  
  const properties = await prisma.property.findMany({
    where: { 
      deletedAt: null,
      ...(q ? { nama_property: { contains: q } } : {})
    },
    take: 50, // ambil lebih banyak agar bisa ditampilkan ketika 'Lihat Semua' ditekan
    orderBy: { createdAt: 'desc' }
  })

  // Serialize BigInt to string for Client Component
  const serializedProperties = properties.map(p => ({
    ...p,
    price: p.price.toString()
  }))

  const generateSlug = (name: string, id: string) => {
    const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    return `/properties/${slugName}-${id}`
  }

  return (
    <div className="min-h-screen bg-neutral-white flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero_bg.png" 
            alt="Prime Property Luxury Background" 
            fill 
            className="object-cover"
            priority 
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center mt-8 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-neutral-white mb-4 sm:mb-6 leading-tight text-center">
            Temukan Hunian Mewah Impian <br className="hidden sm:block"/> Anda
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-10 text-center font-light max-w-2xl mx-auto">
            Koleksi properti eksklusif yang dikurasi khusus untuk gaya hidup premium dengan standar tertinggi.
          </p>
          
          <HeroSearch defaultValue={q} />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="properti" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-16">
        <PropertyGrid properties={serializedProperties} q={q} />
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-black mb-4">Mengapa Memilih Kami?</h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto mb-10 sm:mb-16">
            Kami memberikan layanan eksklusif dan panduan profesional untuk menemukan properti impian dengan standar tinggi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-12">
            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#fbf5e6] flex items-center justify-center text-accent-gold mb-4 sm:mb-6">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-primary-black mb-2 sm:mb-4">Kurasi Ketat</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Setiap properti dalam portofolio kami melewati proses seleksi ketat untuk memastikan standar kualitas terbaik dan keamanan investasi.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#fbf5e6] flex items-center justify-center text-accent-gold mb-4 sm:mb-6">
                <UserCheck className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-primary-black mb-2 sm:mb-4">Layanan Pramutama</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Layanan personal dari agent profesional yang mendampingi Anda dari pencarian hingga penandatanganan kesepakatan.
              </p>
            </div>
            
            <div className="col-span-2 md:col-span-1 flex justify-center md:block">
              <div className="w-[85%] sm:w-[60%] md:w-full bg-white p-6 sm:p-10 rounded-xl shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#fbf5e6] flex items-center justify-center text-accent-gold mb-4 sm:mb-6">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-primary-black mb-2 sm:mb-4">Investasi Cerdas</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  Pandangan mendalam mengenai pasar properti untuk memastikan investasi Anda memiliki potensi pertumbuhan yang optimal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
