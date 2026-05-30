import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import ContactForm from './ContactForm'
import { siteConfig } from '@/config/site'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero_bg.png" 
            alt="Contact Prime Property" 
            fill 
            className="object-cover"
            priority 
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70 z-10"></div>
        </div>

        <div className="relative z-10 text-center px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto mt-8 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-white mb-4 sm:mb-6 leading-tight">
            Mari Berdiskusi Mengenai Hunian <br className="hidden sm:block" /> Impian Anda
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto">
            Tim ahli kami siap membantu Anda menemukan properti eksklusif yang sesuai dengan standar dan gaya hidup Anda.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-24">
          {/* Kirim Pesan Form */}
          <div className="lg:w-7/12">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary-black mb-6 sm:mb-8">Kirim Pesan</h3>
            <ContactForm />
          </div>

          {/* Informasi Kontak */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-2xl p-6 sm:p-10 h-full border border-gray-100 shadow-xl">
              <h3 className="text-2xl sm:text-3xl font-bold text-primary-black mb-4 sm:mb-6">Informasi Kontak</h3>
              <p className="text-gray-500 text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed">
                Hubungi kami untuk menjadwalkan sesi konsultasi eksklusif dengan konsultan properti kami.
              </p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-accent-gold shadow-sm mr-5 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Telepon</div>
                    <div className="font-medium text-lg text-primary-black">{siteConfig.contact.phone}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-green-600 shadow-sm mr-5 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">WhatsApp</div>
                    <a href={`https://wa.me/${siteConfig.contact.whatsapp.number}?text=${encodeURIComponent(siteConfig.contact.whatsapp.message)}`} target="_blank" rel="noopener noreferrer" className="font-medium text-lg text-primary-black hover:text-green-600 transition">
                      {siteConfig.contact.whatsapp.display}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-accent-gold shadow-sm mr-5 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</div>
                    <div className="font-medium text-lg text-primary-black">{siteConfig.contact.email}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-accent-gold shadow-sm mr-5 shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kantor Pusat</div>
                    <div className="font-medium text-base text-primary-black leading-relaxed mb-2">
                      Jl. Meteorologi Raya, Komplek Jewel Garden Ruko A29<br />Medan
                    </div>
                    <a href="https://maps.app.goo.gl/ky2jDMiSkvMAykr16" target="_blank" rel="noopener noreferrer" className="text-accent-gold text-sm font-bold hover:underline">
                      Lihat di Google Maps &rarr;
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                <h4 className="text-lg font-bold text-primary-black mb-4">Jam Operasional</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="font-medium">Senin - Jumat</span>
                    <span>09.00 - 17.00</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="font-medium">Sabtu</span>
                    <span>09.00 - 15.00</span>
                  </li>
                  <li className="flex justify-between text-red-500 font-medium">
                    <span>Minggu & Hari Libur</span>
                    <span>Tutup</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jaringan Kantor Kami Section */}
      <section className="py-16 sm:py-24 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 text-center border-t border-gray-100">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-black mb-12 sm:mb-20 relative inline-block">
          Jaringan Kantor Kami
          <span className="absolute -bottom-3 sm:-bottom-5 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 sm:h-1.5 bg-accent-gold rounded-full"></span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {/* Kiri: Google Map */}
          <div className="lg:col-span-2 h-[400px] lg:h-[500px] min-h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.996173003028!2d98.71077751086052!3d3.611181250275811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131002df3fc73%3A0x86c8f6ea4f9c5d1b!2sKomplek%20Jewel%20Garden!5e0!3m2!1sid!2sid!4v1717013840333!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Kanan: Foto Kantor */}
          <div className="lg:col-span-1 h-[400px] lg:h-[500px] rounded-3xl overflow-hidden relative group shadow-2xl cursor-pointer">
            <div className="absolute inset-0 bg-black/50 z-10 group-hover:bg-accent-gold/70 transition-all duration-500"></div>
            <Image 
              src="/office_medan.png" 
              alt="Medan Office" 
              fill
              className="object-cover group-hover:scale-110 transition duration-[1500ms]" 
              sizes="(max-width: 1024px) 100vw, 33vw"
              unoptimized
            />
            <div className="absolute bottom-10 left-8 right-8 z-20 text-left transition-transform duration-500 group-hover:-translate-y-2">
              <h3 className="text-4xl font-bold text-neutral-white mb-2 drop-shadow-md">Medan</h3>
              <p className="text-white text-lg font-medium tracking-wide drop-shadow">Kantor Pusat</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
