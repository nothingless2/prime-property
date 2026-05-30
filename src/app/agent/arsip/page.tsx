import { Suspense } from 'react'
import ArsipClient from './ArsipClient'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ArsipPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : ''
  
  const session = await getSession()
  if (session?.role !== 'SUPERADMIN') {
    redirect('/agent/properties')
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-black">Arsip Properti</h1>
          <p className="text-gray-500 mt-2">Daftar properti yang telah dihapus (soft delete). Anda dapat memulihkannya kembali.</p>
        </div>
      </div>

      <Suspense fallback={<div className="text-center py-10">Memuat data...</div>}>
        <ArsipClient initialSearch={search} />
      </Suspense>
    </div>
  )
}
