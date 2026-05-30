import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Gem, Lightbulb, Globe } from 'lucide-react'

export default function AboutPage() {
  const teamMembers = [
    { id: 1, name: 'Ananda Pratama', role: 'Chief Executive Officer', image: '/team_1.png' },
    { id: 2, name: 'Elena Wijaya', role: 'Director of Sales', image: '/team_2.png' },
    { id: 3, name: 'Bima Kusuma', role: 'Head of Acquisition', image: '/team_3.png' },
    { id: 4, name: 'Rani Sari', role: 'Lead Interior Consultant', image: '/team_4.png' },
  ]

  return (
    <div className="min-h-screen bg-neutral-white flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero_bg.png" 
            alt="About Prime Property" 
            fill 
            className="object-cover"
            priority 
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70 z-10"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 sm:px-4 max-w-4xl mx-auto mt-8 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-white mb-4 sm:mb-6 leading-tight">
            Membangun Standar Baru dalam <br className="hidden sm:block"/> Properti Mewah
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto">
            Lebih dari sekadar agen, kami adalah kurator gaya hidup eksklusif Anda.
          </p>
        </div>
      </section>

      {/* Split Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center text-center md:text-left">
          <div className="max-w-xl mx-auto md:mx-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-black mb-4 sm:mb-6">Profil Perusahaan</h2>
            <p className="text-gray-500 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base px-2 sm:px-0 text-justify md:text-left">
              Prime Property hadir bukan sekadar sebagai agen, melainkan sebagai kurator gaya hidup eksklusif. Kami mendedikasikan keahlian dan waktu kami untuk menemukan properti dengan integritas arsitektur, lokasi premium, dan fasilitas kelas dunia bagi klien-klien kami.
            </p>
            
            <h3 className="text-lg sm:text-xl font-bold text-primary-black mb-2 sm:mb-3">Visi Kami</h3>
            <p className="text-gray-500 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base px-2 sm:px-0 text-justify md:text-left">
              Menjadi standar emas dalam industri real estat mewah di Indonesia dengan memberikan layanan kustom dan akses eksklusif yang tidak tertandingi.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-primary-black mb-2 sm:mb-3">Misi Kami</h3>
            <ul className="text-gray-500 mb-8 leading-relaxed text-sm sm:text-base list-none md:list-disc md:pl-5 space-y-2 sm:space-y-3 px-2 sm:px-0 text-left">
              <li><span className="md:hidden text-accent-gold mr-2">•</span>Membangun portofolio properti bernilai tinggi yang dikurasi secara ketat.</li>
              <li><span className="md:hidden text-accent-gold mr-2">•</span>Memberikan panduan investasi cerdas berlandaskan analisis pasar yang tajam.</li>
              <li><span className="md:hidden text-accent-gold mr-2">•</span>Menciptakan pengalaman transaksional yang transparan, aman, dan memuaskan.</li>
            </ul>
          </div>
          <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl group">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src="/about_interior.png" 
               alt="Interior Mewah" 
               className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
             />
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-black mb-10 sm:mb-16">Nilai Perusahaan Kami</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-accent-gold mb-4 sm:mb-6 shadow-sm">
                <Gem className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-primary-black mb-2 sm:mb-4">Kualitas Tanpa Kompromi</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xs">
                Kami menetapkan standar tertinggi dalam setiap aspek, memastikan kepuasan klien.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-accent-gold mb-4 sm:mb-6 shadow-sm">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-primary-black mb-2 sm:mb-4">Inovasi Berkelanjutan</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xs">
                Mengintegrasikan teknologi terkini dalam memasarkan properti untuk hasil optimal.
              </p>
            </div>
            
            <div className="col-span-2 md:col-span-1 flex justify-center md:block mt-4 md:mt-0">
              <div className="flex flex-col items-center w-[85%] sm:w-[60%] md:w-full mx-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-accent-gold mb-4 sm:mb-6 shadow-sm">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-primary-black mb-2 sm:mb-4">Koneksi Global</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xs">
                  Akses eksklusif ke jaringan investor internasional tanpa batas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center border-t border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-black mb-10 sm:mb-16 relative inline-block">
          Tim Ahli Kami
          <span className="absolute -bottom-3 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-10 sm:w-12 h-1 bg-accent-gold"></span>
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="text-center sm:text-left group">
              <div className="h-48 sm:h-80 overflow-hidden rounded-xl mb-3 sm:mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-accent-gold/90 via-accent-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 z-10"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-primary-black">{member.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
