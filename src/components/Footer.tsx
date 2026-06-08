import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  return (
    <footer className="bg-primary-black text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-12 sm:gap-16">

        {/* Kolom 1: Informasi Kontak & Logo */}
        <div className="lg:w-1/3">
          <div className="mb-6">
            <Image src="/logoprime.jpg" alt="Prime Property Logo" width={150} height={40} className="h-10 w-auto object-contain rounded-md" unoptimized />
          </div>
          <p className="text-sm leading-relaxed mb-8 text-gray-500 pr-4">
            Didedikasikan untuk menyediakan properti mewah yang dirancang dengan dedikasi, membangun nilai, dan memperkaya pengalaman hidup Anda.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-accent-gold" />
              <span className="text-gray-300">{siteConfig.contact.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-accent-gold" />
              <span className="text-gray-300">{siteConfig.contact.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-accent-gold" />
              <a href={`https://wa.me/${siteConfig.contact.whatsapp.number}?text=${encodeURIComponent(siteConfig.contact.whatsapp.message)}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent-gold transition">
                WhatsApp Kami
              </a>
            </div>
          </div>
        </div>

        {/* Kolom 2: Link Navigasi, Dukungan, & Newsletter */}
        <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-accent-gold text-xs font-bold tracking-widest uppercase mb-6">NAVIGASI</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-neutral-white transition">Beranda</Link></li>
              <li><Link href="#" className="hover:text-neutral-white transition">Properti</Link></li>
              <li><Link href="/about" className="hover:text-neutral-white transition">Tentang Kami</Link></li>
              <li><Link href="/contact" className="hover:text-neutral-white transition">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-accent-gold text-xs font-bold tracking-widest uppercase mb-6">DUKUNGAN</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-neutral-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-neutral-white transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-neutral-white transition">Cookie Settings</Link></li>
              <li><Link href="#" className="hover:text-neutral-white transition">Bantuan</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-accent-gold text-xs font-bold tracking-widest uppercase mb-6">BERLANGGANAN</h4>
            <p className="text-sm text-gray-500 mb-4">
              Dapatkan update eksklusif properti terbaru langsung di inbox Anda.
            </p>
            <NewsletterForm />
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
        <p>&copy; 2026 Prime Property. Semua Hak Dilindungi.</p>
      </div>
    </footer>
  )
}
