'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { getArchivedProperties, restoreProperty } from '@/app/actions/property'
import { Search, ChevronLeft, ChevronRight, RotateCcw, ArrowUpDown } from 'lucide-react'
import { showConfirm, showSuccessToast, showErrorAlert } from '@/lib/swal'

interface PropertyData {
  id: string;
  nama_property: string;
  kawasan: string;
  tipe: string;
  price: string;
  status: string;
  deletedAt: Date;
}

export default function ArsipClient({ initialSearch }: { initialSearch: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [data, setData] = useState<PropertyData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(initialSearch || '')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [sortBy, setSortBy] = useState<string>('deletedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getArchivedProperties('')
      setData(result as unknown as PropertyData[])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const handler = setTimeout(() => {
      const current = new URLSearchParams()
      if (search) current.set('search', search)
      const searchStr = current.toString()
      const query = searchStr ? `?${searchStr}` : ''
      router.push(`${pathname}${query}`, { scroll: false })
      setPage(1)
    }, 300)
    return () => clearTimeout(handler)
  }, [search, router, pathname])

  const filteredAndSortedData = useMemo(() => {
    let result = [...data]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p => p.nama_property.toLowerCase().includes(q) || p.kawasan.toLowerCase().includes(q))
    }

    result.sort((a, b) => {
      let valA: any = a[sortBy as keyof PropertyData]
      let valB: any = b[sortBy as keyof PropertyData]
      if (sortBy === 'price') {
        valA = Number(a.price)
        valB = Number(b.price)
      } else if (sortBy === 'deletedAt') {
        valA = new Date(a.deletedAt).getTime()
        valB = new Date(b.deletedAt).getTime()
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return result
  }, [data, search, sortBy, sortOrder])

  const totalItems = filteredAndSortedData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedData = filteredAndSortedData.slice((page - 1) * pageSize, page * pageSize)

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const formatRupiah = (priceStr: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(priceStr))
  }

  const handleRestore = async (id: string, name: string) => {
    if (await showConfirm('Konfirmasi Pemulihan', `Yakin ingin memulihkan properti ${name}? Properti akan kembali ke daftar utama.`)) {
      try {
        await restoreProperty(id)
        showSuccessToast('Properti berhasil dipulihkan!')
        fetchData()
      } catch (e: any) {
        showErrorAlert(e.message || 'Gagal memulihkan')
      }
    }
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 text-gray-300 inline-block ml-1" />
    return sortOrder === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 bg-white">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input 
            type="text" 
            placeholder="Cari properti arsip..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-accent-gold transition"
          />
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              <th className="px-4 py-3 w-10">No.</th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('nama_property')}>
                Nama Properti {renderSortIcon('nama_property')}
              </th>
              <th className="px-4 py-3">Kawasan</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('price')}>
                Harga {renderSortIcon('price')}
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('deletedAt')}>
                Tgl Dihapus {renderSortIcon('deletedAt')}
              </th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500 text-sm">Memuat data arsip...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500 text-sm">Tidak ada properti di arsip.</td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition text-sm">
                  <td className="px-4 py-3 text-gray-500">{(page - 1) * pageSize + index + 1}</td>
                  <td className="px-4 py-3 font-semibold text-primary-black">{item.nama_property}</td>
                  <td className="px-4 py-3 text-gray-600">{item.kawasan}</td>
                  <td className="px-4 py-3 text-gray-600">{item.tipe}</td>
                  <td className="px-4 py-3 font-bold text-primary-black">{formatRupiah(item.price)}</td>
                  <td className="px-4 py-3 text-[#B33A3A] font-medium text-xs">
                    {new Intl.DateTimeFormat('id-ID', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(item.deletedAt))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => handleRestore(item.id, item.nama_property)}
                      className="inline-flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded text-xs font-bold transition"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Tampilkan:</span>
          <select 
            value={pageSize} 
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-accent-gold"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-xs text-gray-500 ml-2">
            Total {totalItems} properti arsip
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-gray-600 mx-2">
            Halaman {page} dari {totalPages || 1}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
