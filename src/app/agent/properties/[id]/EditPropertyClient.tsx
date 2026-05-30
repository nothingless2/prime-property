'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import { updateProperty } from '@/app/actions/property'
import { showSuccessToast, showErrorAlert } from '@/lib/swal'

export default function EditPropertyClient({ initialData }: { initialData: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form State
  const initialFormState = useMemo(() => ({
    nama_property: initialData.nama_property || '',
    group: initialData.group || '',
    kawasan: initialData.kawasan || '',
    tipe: initialData.tipe || 'Ruko',
    hadap: initialData.hadap || '',
    unit: initialData.unit || '',
    lebar: initialData.lebar?.toString() || '',
    panjang: initialData.panjang?.toString() || '',
    tingkat: initialData.tingkat?.toString() || '',
    price: initialData.price?.toString() || '',
    status: initialData.status || 'in_stock',
    siap: initialData.siap || 'siap_huni',
    carport: initialData.carport || false,
    maps_link: initialData.maps_link || ''
  }), [initialData])

  const [formData, setFormData] = useState(initialFormState)

  const getInputClass = (name: keyof typeof formData) => {
    const dirty = formData[name] !== initialFormState[name]
    const err = errors[name]
    const base = "w-full rounded-md px-4 py-3 focus:outline-none transition text-sm border"
    if (err) return `${base} border-[#B33A3A] bg-red-50`
    if (dirty) return `${base} bg-yellow-50 border-yellow-300 focus:border-yellow-400`
    return `${base} bg-gray-50 border-gray-200 focus:border-accent-gold`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (formData.nama_property.length < 3 || formData.nama_property.length > 100) {
      newErrors.nama_property = 'Nama properti harus 3-100 karakter'
    }
    if (!formData.kawasan) {
      newErrors.kawasan = 'Kawasan wajib diisi'
    }
    const lebar = parseFloat(formData.lebar)
    if (isNaN(lebar) || lebar <= 0) {
      newErrors.lebar = 'Lebar harus lebih dari 0'
    }
    const panjang = parseFloat(formData.panjang)
    if (isNaN(panjang) || panjang <= 0) {
      newErrors.panjang = 'Panjang harus lebih dari 0'
    }
    const tingkat = parseFloat(formData.tingkat)
    if (isNaN(tingkat) || tingkat < 1 || tingkat > 10) {
      newErrors.tingkat = 'Tingkat harus antara 1-10'
    }
    const price = formData.price.replace(/\D/g, '')
    if (!price || parseInt(price) <= 0) {
      newErrors.price = 'Harga harus lebih dari 0'
    }
    if (formData.maps_link && !formData.maps_link.includes('google.com/maps') && !formData.maps_link.includes('maps.app.goo.gl')) {
      newErrors.maps_link = 'URL harus berisi domain google.com/maps'
    }
    if (!formData.hadap) {
      newErrors.hadap = 'Hadap wajib diisi'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setLoading(true)
    try {
      const payload = {
        ...formData,
        price: formData.price.replace(/\D/g, '')
      }
      await updateProperty(initialData.id, payload)
      showSuccessToast('Properti berhasil diperbarui!')
      router.push('/agent/properties')
    } catch (e: any) {
      if (e.message?.includes('Forbidden') || e.status === 403) {
        showErrorAlert('403 Forbidden: Anda tidak memiliki akses Superadmin untuk mengubah properti.')
      } else {
        showErrorAlert(e.message || 'Terjadi kesalahan')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (val: string) => {
    const number = val.replace(/\D/g, '')
    if (!number) return ''
    return new Intl.NumberFormat('id-ID').format(parseInt(number))
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col h-full bg-white">
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/agent/properties" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-primary-black">Edit Properti</h2>
            <p className="text-sm text-gray-500 mt-1">Perbarui detail untuk {initialData.nama_property}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/agent/properties" className="px-6 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
            <X className="w-4 h-4" /> Batal
          </Link>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-primary-black text-white rounded-md text-sm font-semibold hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      <div className="p-8 flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-primary-black">Informasi Dasar</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Properti <span className="text-red-500">*</span></label>
                <input type="text" name="nama_property" value={formData.nama_property} onChange={handleChange} className={getInputClass('nama_property')} />
                {errors.nama_property && <p className="text-xs text-[#B33A3A] mt-1">{errors.nama_property}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Group</label>
                <input type="text" name="group" value={formData.group} onChange={handleChange} className={getInputClass('group')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kawasan <span className="text-red-500">*</span></label>
                <input type="text" name="kawasan" value={formData.kawasan} onChange={handleChange} className={getInputClass('kawasan')} />
                {errors.kawasan && <p className="text-xs text-[#B33A3A] mt-1">{errors.kawasan}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Harga (Rp) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 text-sm">Rp</span>
                  <input type="text" name="price" value={formatRupiah(formData.price)} onChange={e => setFormData({...formData, price: e.target.value.replace(/\D/g, '')})} className={`pl-10 ${getInputClass('price')}`} />
                </div>
                {errors.price && <p className="text-xs text-[#B33A3A] mt-1">{errors.price}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipe</label>
                <select name="tipe" value={formData.tipe} onChange={handleChange} className={`${getInputClass('tipe')} bg-white`}>
                  <option value="Ruko">Ruko</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={`${getInputClass('status')} bg-white`}>
                  <option value="in_stock">In Stock</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kondisi Siap</label>
                <select name="siap" value={formData.siap} onChange={handleChange} className={`${getInputClass('siap')} bg-white`}>
                  <option value="siap_huni">Siap Huni</option>
                  <option value="siap_kosong">Siap Kosong</option>
                  <option value="siap_huni_renovasi">Siap Huni Renovasi</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-y border-gray-100 bg-gray-50/50 mt-4">
            <h3 className="text-lg font-bold text-primary-black">Spesifikasi Teknis</h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lebar <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" name="lebar" value={formData.lebar} onChange={handleChange} className={getInputClass('lebar')} />
                {errors.lebar && <p className="text-xs text-[#B33A3A] mt-1">{errors.lebar}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Panjang <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" name="panjang" value={formData.panjang} onChange={handleChange} className={getInputClass('panjang')} />
                {errors.panjang && <p className="text-xs text-[#B33A3A] mt-1">{errors.panjang}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tingkat <span className="text-red-500">*</span></label>
                <input type="number" step="0.1" name="tingkat" value={formData.tingkat} onChange={handleChange} className={getInputClass('tingkat')} />
                {errors.tingkat && <p className="text-xs text-[#B33A3A] mt-1">{errors.tingkat}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hadap <span className="text-red-500">*</span></label>
                <input type="text" name="hadap" value={formData.hadap} onChange={handleChange} className={getInputClass('hadap')} />
                {errors.hadap && <p className="text-xs text-[#B33A3A] mt-1">{errors.hadap}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Link Maps</label>
                <input type="text" name="maps_link" value={formData.maps_link} onChange={handleChange} className={getInputClass('maps_link')} />
                {errors.maps_link && <p className="text-xs text-[#B33A3A] mt-1">{errors.maps_link}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit/Detail Tambahan</label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} className={getInputClass('unit')} />
              </div>
            </div>

            <div className="flex items-center gap-3 py-4">
              <input type="checkbox" id="carport" name="carport" checked={formData.carport} onChange={handleChange} className={`w-5 h-5 rounded text-accent-gold focus:ring-accent-gold transition ${formData.carport !== initialFormState.carport ? 'border-yellow-400 border-2 bg-yellow-50' : 'border-gray-300'}`} />
              <label htmlFor="carport" className="text-sm font-medium text-gray-700 cursor-pointer">Dilengkapi Carport</label>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
