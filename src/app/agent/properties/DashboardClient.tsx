'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { getProperties, deleteProperty } from '@/app/actions/property'
import { getCurrentRole } from '@/app/actions/auth'
import { Search, ChevronLeft, ChevronRight, X, ArrowUpDown } from 'lucide-react'
import MultiSelect from '@/components/MultiSelect'
import PropertyDetailDrawer from './PropertyDetailDrawer'
import Toast from '@/components/Toast'
import { showConfirm, showSuccessToast, showErrorAlert } from '@/lib/swal'

interface PropertyData {
  id: string;
  nama_property: string;
  group: string | null;
  lebar: number;
  panjang: number;
  tingkat: number;
  hadap: string;
  tipe: string;
  price: string;
  carport: boolean;
  status: string;
  siap: string;
  kawasan: string;
  unit: string | null;
  maps_link?: string | null;
  createdAt: Date;
}

const KAWASAN_OPTIONS = [
  { label: 'Krakatau', value: 'Krakatau' },
  { label: 'Pancing', value: 'Pancing' },
  { label: 'Tembung', value: 'Tembung' },
  { label: 'Helvetia', value: 'Helvetia' },
  { label: 'Cemara', value: 'Cemara' },
  { label: 'Setia Budi', value: 'Setia Budi' },
]

const HADAP_OPTIONS = [
  { label: 'Utara', value: 'Utara' },
  { label: 'Selatan', value: 'Selatan' },
  { label: 'Timur', value: 'Timur' },
  { label: 'Barat', value: 'Barat' },
]

const SIAP_OPTIONS = [
  { label: 'Siap Huni', value: 'siap_huni' },
  { label: 'Siap Kosong', value: 'siap_kosong' },
  { label: 'Siap Huni Renovasi', value: 'siap_huni_renovasi' },
]

export default function DashboardClient({
  initialSearch,
  initialTipe,
  initialData
}: {
  initialSearch?: string,
  initialTipe?: string,
  initialData: PropertyData[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [data, setData] = useState<PropertyData[]>(initialData || [])
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  // Sync data when initialData changes from the server
  useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Detail Drawer State
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null)
  const [showToast, setShowToast] = useState(false)
  const newId = searchParams.get('newId')

  useEffect(() => {
    getCurrentRole().then((role: any) => setRole(role as string | null))
  }, [])

  // Handle success Toast from query param
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowToast(true)
      const current = new URLSearchParams(searchParams.toString())
      current.delete('success')
      // Optional: keep newId in URL for highlight, just remove success to prevent infinite toast
      router.replace(`${pathname}?${current.toString()}`, { scroll: false })
    }
  }, [searchParams, pathname, router])

  // Filter States
  const [search, setSearch] = useState(initialSearch || '')
  const [tipe, setTipe] = useState(initialTipe || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')

  const [kawasan, setKawasan] = useState<string[]>(searchParams.get('kawasan') ? searchParams.get('kawasan')!.split(',') : [])
  const [hadap, setHadap] = useState<string[]>(searchParams.get('hadap') ? searchParams.get('hadap')!.split(',') : [])
  const [siap, setSiap] = useState<string[]>(searchParams.get('siap') ? searchParams.get('siap')!.split(',') : [])

  const [lebarMin, setLebarMin] = useState(searchParams.get('lebarMin') || '')
  const [hargaMax, setHargaMax] = useState(searchParams.get('hargaMax') || '')
  const [carport, setCarport] = useState(searchParams.get('carport') || '')

  // Pagination & Sorting State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getProperties('', '')
      setData(result as unknown as PropertyData[])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  // Sync Filters to URL with Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      const current = new URLSearchParams()

      if (search) current.set('search', search)
      if (tipe) current.set('tipe', tipe)
      if (status) current.set('status', status)
      if (kawasan.length) current.set('kawasan', kawasan.join(','))
      if (hadap.length) current.set('hadap', hadap.join(','))
      if (siap.length) current.set('siap', siap.join(','))
      if (lebarMin) current.set('lebarMin', lebarMin)
      if (hargaMax) current.set('hargaMax', hargaMax)
      if (carport) current.set('carport', carport)

      const searchStr = current.toString()
      const query = searchStr ? `?${searchStr}` : ''

      router.push(`${pathname}${query}`, { scroll: false })
      setPage(1) // Reset page on filter change
    }, 300)

    return () => clearTimeout(handler)
  }, [search, tipe, status, kawasan, hadap, siap, lebarMin, hargaMax, carport, router, pathname])

  // Apply Filters & Sorting
  const filteredAndSortedData = useMemo(() => {
    let result = [...data]

    // Search text
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.nama_property.toLowerCase().includes(q) ||
        (p.group && p.group.toLowerCase().includes(q)) ||
        p.kawasan.toLowerCase().includes(q)
      )
    }

    if (tipe) result = result.filter(p => p.tipe === tipe)
    if (status) result = result.filter(p => p.status === status)
    if (kawasan.length) result = result.filter(p => kawasan.some(k => p.kawasan.toLowerCase().includes(k.toLowerCase())))
    if (hadap.length) result = result.filter(p => hadap.some(h => p.hadap.toLowerCase().includes(h.toLowerCase())))
    if (siap.length) result = result.filter(p => siap.includes(p.siap))

    if (lebarMin) result = result.filter(p => p.lebar >= parseFloat(lebarMin))
    if (hargaMax) result = result.filter(p => Number(p.price) <= Number(hargaMax))
    if (carport) result = result.filter(p => p.carport === (carport === 'true'))

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortBy as keyof PropertyData]
      let valB: any = b[sortBy as keyof PropertyData]

      if (sortBy === 'price') {
        valA = Number(a.price)
        valB = Number(b.price)
      } else if (sortBy === 'createdAt') {
        valA = new Date(a.createdAt).getTime()
        valB = new Date(b.createdAt).getTime()
      } else if (sortBy === 'nama_property') {
        valA = a.nama_property.toLowerCase()
        valB = b.nama_property.toLowerCase()
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [data, search, tipe, status, kawasan, hadap, siap, lebarMin, hargaMax, carport, sortBy, sortOrder])

  // Pagination
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

  const handleDelete = async (id: string) => {
    if (await showConfirm('Konfirmasi Hapus', `Yakin hapus properti ${selectedProperty?.nama_property || ''}? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await deleteProperty(id)
        showSuccessToast('Properti berhasil dihapus')
        setSelectedProperty(null)
        fetchData()
      } catch (e: any) {
        showErrorAlert(e.message || 'Gagal menghapus')
      }
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/agent/properties/${id}`)
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 text-gray-300 inline-block ml-1" />
    return sortOrder === 'asc' ? ' ↑' : ' ↓'
  }

  // Active Filter Chips
  const activeFilters = []
  if (search) activeFilters.push({ label: `Cari: ${search}`, clear: () => setSearch('') })
  if (tipe) activeFilters.push({ label: `Tipe: ${tipe}`, clear: () => setTipe('') })
  if (status) activeFilters.push({ label: `Status: ${status === 'in_stock' ? 'In Stock' : 'Sold Out'}`, clear: () => setStatus('') })
  if (kawasan.length) activeFilters.push({ label: `Kawasan: ${kawasan.length}`, clear: () => setKawasan([]) })
  if (hadap.length) activeFilters.push({ label: `Hadap: ${hadap.length}`, clear: () => setHadap([]) })
  if (siap.length) activeFilters.push({ label: `Siap: ${siap.length}`, clear: () => setSiap([]) })
  if (lebarMin) activeFilters.push({ label: `Lebar ≥ ${lebarMin}m`, clear: () => setLebarMin('') })
  if (hargaMax) activeFilters.push({ label: `Harga ≤ ${formatRupiah(hargaMax)}`, clear: () => setHargaMax('') })
  if (carport) activeFilters.push({ label: `Carport: ${carport === 'true' ? 'Ya' : 'Tidak'}`, clear: () => setCarport('') })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Table Toolbar & Filters */}
      <div className="p-6 border-b border-gray-100 bg-white">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              aria-label="Cari nama properti atau lokasi"
              placeholder="Cari nama properti, kawasan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-accent-gold transition"
            />
          </div>
          <button
            onClick={() => {
              setSearch(''); setTipe(''); setStatus(''); setKawasan([]); setHadap([]); setSiap([]); setLebarMin(''); setHargaMax(''); setCarport('');
            }}
            className="px-4 py-2 text-sm text-gray-500 hover:text-primary-black font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition"
          >
            Reset Filter
          </button>
        </div>

        {/* Detailed Filters row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 relative z-10">
          <MultiSelect options={KAWASAN_OPTIONS} selectedValues={kawasan} onChange={setKawasan} placeholder="Kawasan" />
          <MultiSelect options={HADAP_OPTIONS} selectedValues={hadap} onChange={setHadap} placeholder="Arah Hadap" />
          <MultiSelect options={SIAP_OPTIONS} selectedValues={siap} onChange={setSiap} placeholder="Kondisi" />

          <input type="number" aria-label="Lebar minimal properti" placeholder="Lebar Min (m)" value={lebarMin} onChange={e => setLebarMin(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-accent-gold" />
          <input type="number" aria-label="Harga maksimal properti" placeholder="Harga Max" value={hargaMax} onChange={e => setHargaMax(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-accent-gold" />

          <select value={tipe} onChange={e => setTipe(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-accent-gold bg-white">
            <option value="">Tipe (Semua)</option>
            <option value="Ruko">Ruko</option>
            <option value="Villa">Villa</option>
          </select>

          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-accent-gold bg-white">
            <option value="">Status (Semua)</option>
            <option value="in_stock">In Stock</option>
            <option value="sold_out">Sold Out</option>
          </select>

          <select value={carport} onChange={e => setCarport(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-accent-gold bg-white">
            <option value="">Carport (Semua)</option>
            <option value="true">Ya</option>
            <option value="false">Tidak</option>
          </select>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
            {activeFilters.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-[11px] font-bold">
                {f.label}
                <button onClick={f.clear} className="hover:bg-accent-gold/20 rounded-full p-0.5 transition"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              <th className="px-4 py-3 w-10">No.</th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('nama_property')}>
                Nama Properti {renderSortIcon('nama_property')}
              </th>
              <th className="px-4 py-3">Group</th>
              <th className="px-4 py-3">Kawasan</th>
              <th className="px-4 py-3">Dimensi (L x P)</th>
              <th className="px-4 py-3">Hadap</th>
              <th className="px-4 py-3">Tipe / Tgkt</th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('price')}>
                Harga {renderSortIcon('price')}
              </th>
              <th className="px-4 py-3">C.port</th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                Status {renderSortIcon('status')}
              </th>
              <th className="px-4 py-3">Siap</th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('createdAt')}>
                Tgl Dibuat {renderSortIcon('createdAt')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={12} className="px-4 py-12 text-center text-gray-500 text-sm">Memuat data properti...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-12 text-center text-gray-500 text-sm">Tidak ada properti yang ditemukan.</td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedProperty(item)}
                  className={`transition text-sm cursor-pointer ${item.id === newId ? 'bg-green-50 animate-pulse' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-4 py-3 text-gray-500">{(page - 1) * pageSize + index + 1}</td>
                  <td className="px-4 py-3 font-semibold text-primary-black">{item.nama_property}</td>
                  <td className="px-4 py-3 text-gray-500">{item.group || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{item.kawasan}</td>
                  <td className="px-4 py-3 text-gray-600">{item.lebar} x {item.panjang}m</td>
                  <td className="px-4 py-3 text-gray-600">{item.hadap}</td>
                  <td className="px-4 py-3 text-gray-600">{item.tipe} ({item.tingkat})</td>
                  <td className="px-4 py-3 font-bold text-primary-black">{formatRupiah(item.price)}</td>
                  <td className="px-4 py-3 text-gray-600">{item.carport ? 'Ya' : 'Tidak'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.status === 'in_stock' ? 'bg-green-100 text-green-800' : 'bg-[#B33A3A] text-white'
                      }`}>
                      {item.status === 'in_stock' ? 'In Stock' : 'Sold Out'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.siap === 'siap_huni' ? 'bg-yellow-100 text-yellow-800' :
                        item.siap === 'siap_kosong' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                      {item.siap.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Intl.DateTimeFormat('id-ID', { dateStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(item.createdAt))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
            Total {totalItems} properti
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

      <PropertyDetailDrawer
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        role={role}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Toast
        message="Properti berhasil ditambahkan!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}
