'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { logout, getCurrentUser } from '@/app/actions/auth'
import { LayoutDashboard, Building, Users, Settings, HelpCircle, LogOut, Plus, ClipboardList, Archive, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{username: string, role: string} | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    getCurrentUser().then(res => {
      if (res) setUser(res as any)
    })
  }, [pathname])
  
  const handleLogout = async () => {
    await logout()
    router.push('/agent/login')
  }

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  if (pathname === '/agent/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col z-50 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-100 flex justify-center items-center">
          <Image src="/logoPrime.png" alt="Prime Property Logo" width={150} height={40} className="h-10 w-auto object-contain" unoptimized />
        </div>
        
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold font-bold text-sm">
            {user ? user.username.substring(0, 2).toUpperCase() : '..'}
          </div>
          <div>
            <div className="font-bold text-sm text-primary-black">{user ? user.username : 'Loading...'}</div>
            <div className="text-xs text-gray-500 capitalize">{user ? user.role.toLowerCase() : ''}</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/agent/properties" className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition ${pathname.startsWith('/agent/properties') && pathname !== '/agent/users' ? 'bg-accent-gold/10 text-accent-gold' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Building className="w-5 h-5" />
            Properties
          </Link>
          {user?.role.toUpperCase() === 'SUPERADMIN' && (
            <>
              <Link href="/agent/users" className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition ${pathname.startsWith('/agent/users') ? 'bg-accent-gold/10 text-accent-gold' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Users className="w-5 h-5" />
                Users
              </Link>
              <Link href="/agent/audit-logs" className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition ${pathname.startsWith('/agent/audit-logs') ? 'bg-accent-gold/10 text-accent-gold' : 'text-gray-600 hover:bg-gray-50'}`}>
                <ClipboardList className="w-5 h-5" />
                Audit Logs
              </Link>
              <Link href="/agent/arsip" className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition ${pathname.startsWith('/agent/arsip') ? 'bg-accent-gold/10 text-accent-gold' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Archive className="w-5 h-5" />
                Arsip Properti
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 transition">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-100 p-4 sticky top-0 z-30">
          <Image src="/logoPrime.png" alt="Prime Property Logo" width={100} height={26} className="h-7 w-auto object-contain" unoptimized />
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
