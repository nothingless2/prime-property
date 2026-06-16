'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isActive = (path: string) => pathname === path

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang Kami', path: '/about' },
    { name: 'Kontak', path: '/contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-neutral-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logoprime.jpg" alt="Prime Property Logo" width={150} height={40} className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-12 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`relative transition font-semibold text-base group ${isActive(link.path) ? 'text-primary-black' : 'text-gray-500 hover:text-primary-black'}`}
              >
                {link.name}
                <span className={`absolute -bottom-1.5 left-0 w-full h-0.5 bg-accent-gold transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
          </div>

          {/* Desktop Login Button */}
          {/* <div className="hidden md:flex">
            <Link href="/agent/login" className="bg-primary-black text-neutral-white hover:bg-gray-800 transition px-6 py-2.5 rounded-full text-sm font-bold tracking-wide shadow-md hover:shadow-lg">
              Login Agent
            </Link>
          </div> */}

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-primary-black focus:outline-none p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 animate-slide-in-right origin-top">
          <div className="px-4 pt-2 pb-6 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-semibold ${
                  isActive(link.path) 
                    ? 'text-accent-gold bg-gray-50' 
                    : 'text-gray-600 hover:text-primary-black hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-6 px-3">
              <Link 
                href="/agent/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center w-full bg-primary-black text-neutral-white hover:bg-gray-800 transition px-6 py-3 rounded-md text-sm font-bold tracking-wide shadow-md"
              >
                Login Agent
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
