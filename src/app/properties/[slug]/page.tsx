import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, TrendingUp, Maximize, Compass, Car, CheckCircle, Map, MessageCircle, ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default async function PropertyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Extract the UUID which is always the last 36 characters of the SEO slug
  const id = slug.length >= 36 ? slug.slice(-36) : slug

  const prop = await prisma.property.findUnique({
    where: { id }
  })

  if (!prop || prop.deletedAt) {
    notFound()
  }

  const formatRupiah = (val: bigint) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(val))
  }

  const formatSiap = (siap: string) => {
    if (siap === 'siap_huni') return 'Siap Huni'
    if (siap === 'siap_kosong') return 'Kosong (Unfurnished)'
    if (siap === 'siap_huni_renovasi') return 'Perlu Renovasi'
    return siap
  }

  // Derive a consistent hero image index based on ID
  const imageIndex = (prop.id.charCodeAt(0) % 3) + 1
  const heroImage = `/premium_prop_${imageIndex}.png`

  // Generate a dynamic description based on available attributes
  const description = `Selamat datang di ${prop.nama_property}, mahakarya hunian berkelas yang terletak di kawasan premium ${prop.kawasan}. ${prop.group ? `Menjadi bagian dari eksklusivitas cluster ${prop.group}, p` : 'P'}roperti tipe ${prop.tipe} ini berdiri megah dengan bangunan ${prop.tingkat} lantai. Menawarkan dimensi lahan seluas ${prop.lebar} x ${prop.panjang} meter, tata ruangnya dirancang optimal untuk menangkap sirkulasi cahaya dan udara terbaik dengan orientasi hadap ${prop.hadap}.

Kondisi properti saat ini adalah ${formatSiap(prop.siap)}${prop.carport ? ' dan telah dilengkapi dengan fasilitas Carport khusus untuk kendaraan Anda' : ''}. Dengan harga penawaran ${formatRupiah(prop.price)}, ini adalah kesempatan investasi maupun hunian yang sangat bernilai tinggi. Hubungi agen representatif kami sekarang untuk mengatur jadwal kunjungan pribadi Anda.`

  const waMessage = `Halo Prime Property, saya tertarik dengan properti ${prop.nama_property} (${formatRupiah(prop.price)}) yang berlokasi di ${prop.kawasan}. Boleh minta info lebih lanjut?`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Navigation */}
        <Link href="/#properti" className="inline-flex items-center text-gray-500 hover:text-accent-gold transition mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Properti
        </Link>

        {/* Hero Banner */}
        <div className="relative w-full h-[40vh] md:h-[60vh] rounded-2xl overflow-hidden shadow-2xl mb-8 group">
          <Image 
            src={heroImage}
            alt={prop.nama_property}
            fill
            className="object-cover group-hover:scale-105 transition duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <span className={`inline-block text-xs md:text-sm px-3 py-1.5 rounded-full font-bold mb-3 ${prop.status === 'in_stock' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-[#B33A3A] text-white shadow-lg shadow-red-500/30'}`}>
                  {prop.status === 'in_stock' ? 'Tersedia (In Stock)' : 'Terjual (Sold Out)'}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{prop.nama_property}</h1>
                <p className="text-gray-200 flex items-center text-sm md:text-lg">
                  <MapPin className="w-5 h-5 mr-2 text-accent-gold" />
                  {prop.kawasan} {prop.group ? `— Cluster ${prop.group}` : ''}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-gray-300 text-sm mb-1 uppercase tracking-widest">Harga Penawaran</p>
                <p className="text-3xl md:text-5xl font-bold text-accent-gold drop-shadow-md">
                  {formatRupiah(prop.price)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Spesifikasi Grid */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-primary-black mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-accent-gold" />
                Spesifikasi Properti
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/> Tipe Bangunan</p>
                  <p className="font-bold text-primary-black text-lg">{prop.tipe}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center gap-1.5"><Maximize className="w-4 h-4"/> Dimensi Lahan</p>
                  <p className="font-bold text-primary-black text-lg">{prop.lebar} x {prop.panjang} m</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/> Jumlah Lantai</p>
                  <p className="font-bold text-primary-black text-lg">{prop.tingkat} Lantai</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center gap-1.5"><Compass className="w-4 h-4"/> Arah Hadap</p>
                  <p className="font-bold text-primary-black text-lg">{prop.hadap}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Kondisi Interior</p>
                  <p className="font-bold text-primary-black text-lg">{formatSiap(prop.siap)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center gap-1.5"><Car className="w-4 h-4"/> Fasilitas Parkir</p>
                  <p className="font-bold text-primary-black text-lg">{prop.carport ? 'Tersedia Carport' : 'Tidak Ada'}</p>
                </div>
              </div>
            </div>

            {/* Deskripsi Penuh */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-primary-black mb-4">Deskripsi Lengkap</h2>
              <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                {description}
              </div>
            </div>

          </div>

          {/* Sticky Sidebar Action (Right 1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-primary-black rounded-2xl p-6 shadow-xl sticky top-24 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-2">Tertarik dengan Properti ini?</h3>
              <p className="text-gray-400 text-sm mb-6">Hubungi representatif kami untuk mendapatkan penawaran terbaik dan jadwal survei lokasi.</p>
              
              <div className="space-y-4">
                <a 
                  href={`https://wa.me/${siteConfig.contact.whatsapp.number}?text=${encodeURIComponent(waMessage)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full bg-accent-gold text-primary-black font-bold py-4 rounded-xl flex items-center justify-center hover:bg-yellow-500 transition shadow-lg shadow-accent-gold/20"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Hubungi via WhatsApp
                </a>
                
                {prop.maps_link ? (
                  <a 
                    href={prop.maps_link}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full bg-transparent border border-gray-600 text-white font-medium py-4 rounded-xl flex items-center justify-center hover:bg-gray-800 hover:border-gray-500 transition"
                  >
                    <Map className="w-5 h-5 mr-2 text-gray-400" />
                    Lihat Peta Lokasi
                  </a>
                ) : (
                  <button disabled className="w-full bg-gray-900 border border-gray-800 text-gray-600 font-medium py-4 rounded-xl flex items-center justify-center cursor-not-allowed">
                    <Map className="w-5 h-5 mr-2 opacity-50" />
                    Peta Belum Tersedia
                  </button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-500 text-center">
                  Ref ID: <span className="font-mono text-gray-400">{prop.id.split('-')[0]}</span><br/>
                  Unit Code: {prop.unit || 'TBA'}
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  )
}
