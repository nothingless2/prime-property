import { Suspense } from 'react'
import DashboardClient from './DashboardClient'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { getProperties } from '@/app/actions/property'

export const dynamic = 'force-dynamic'

export default async function DashboardPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : ''
  const tipe = typeof searchParams.tipe === 'string' ? searchParams.tipe : ''

  const propertiesData = await getProperties(search, tipe)

  const session = await getSession()
  const isSuperadmin = session?.role === 'SUPERADMIN'

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-black">Daftar Properti</h1>
          <p className="text-gray-500 mt-2">Kelola dan pantau portofolio properti dengan mudah.</p>
        </div>
      </div>

      {isSuperadmin && (
        <div className="mb-6">
          <Link href="/agent/properties/create" className="inline-flex bg-primary-black text-white px-6 py-2 rounded font-bold text-sm hover:bg-gray-800 items-center gap-2 transition shadow-lg w-max">
            <Plus className="w-4 h-4" /> Tambah Properti
          </Link>
        </div>
      )}

      <Suspense fallback={<div className="text-center py-10">Memuat data...</div>}>
        <DashboardClient initialSearch={search} initialTipe={tipe} initialData={propertiesData} />
      </Suspense>
    </div>
  )
}
