'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, X, PlusCircle } from 'lucide-react'
import { createProperty } from '@/app/actions/property'
import Toast from '@/components/Toast'
import { showErrorAlert } from '@/lib/swal'

const initialFormData = {
  nama_property: '',
  group: '',
  kawasan: '',
  tipe: 'Ruko',
  hadap: '',
  unit: '',
  lebar: '',
  panjang: '',
  tingkat: '',
  price: '',
  status: 'in_stock',
  siap: 'siap_huni',
  carport: false,
  maps_link: ''
}

export default function CreatePropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitMode, setSubmitMode] = useState<'simpan' | 'simpan_tambah'>('simpan')
  const [showToast, setShowToast] = useState(false)

  // Form State
  const [formData, setFormData] = useState(initialFormData)



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    // Clear error on type
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
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.lebar)) {
      newErrors.lebar = 'Maksimal 2 angka desimal'
    }

    const panjang = parseFloat(formData.panjang)
    if (isNaN(panjang) || panjang <= 0) {
      newErrors.panjang = 'Panjang harus lebih dari 0'
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.panjang)) {
      newErrors.panjang = 'Maksimal 2 angka desimal'
    }

    const tingkat = parseFloat(formData.tingkat)
    if (isNaN(tingkat) || tingkat < 1 || tingkat > 10) {
      newErrors.tingkat = 'Tingkat harus antara 1-10'
    } else if (!/^\d+(\.\d{1})?$/.test(formData.tingkat)) {
      newErrors.tingkat = 'Maksimal 1 angka desimal'
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
    
    if (!validate()) {
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        price: formData.price.replace(/\D/g, '') // strip non-numeric
      }
      const created = await createProperty(payload)
      
      if (submitMode === 'simpan_tambah') {
        setShowToast(true)
        setFormData(initialFormData)
        setErrors({})
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        router.push(`/agent/properties?success=true&newId=${created.id}`)
      }
    } catch (e: any) {
      if (e.message?.includes('Forbidden') || e.status === 403) {
        showErrorAlert('403 Forbidden: Anda tidak memiliki akses Superadmin untuk membuat properti.')
      } else {
        showErrorAlert(e.message || 'Terjadi kesalahan')
      }
    } finally {
      setLoading(false)
    }
  }

  // Display price as formatted Rupiah
  const formatRupiah = (val: string) => {
    const number = val.replace(/\D/g, '')
    if (!number) return ''
    return new Intl.NumberFormat('id-ID').format(parseInt(number))
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 md:p-8 shrink-0">
        <div className="max-w-7xl mx-auto w-full">
          <Link href="/agent/properties" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-black mb-4 transition font-medium">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-primary-black">Tambah Properti</h2>
            <p className="text-sm text-gray-500 mt-1">Isi detail properti baru untuk ditambahkan ke listing.</p>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <Link href="/agent/properties" className="px-6 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
              <X className="w-4 h-4" />
              Batal
            </Link>
            <button 
              type="submit" 
              onClick={() => setSubmitMode('simpan_tambah')}
              disabled={loading} 
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              {loading && submitMode === 'simpan_tambah' ? 'Menyimpan...' : 'Simpan & Tambah Lagi'}
            </button>
            <button 
              type="submit" 
              onClick={() => setSubmitMode('simpan')}
              disabled={loading} 
              className="px-6 py-2 bg-primary-black text-white rounded-md text-sm font-semibold hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading && submitMode === 'simpan' ? 'Menyimpan...' : 'Simpan Properti'}
            </button>
          </div>
        </div>
      </div>

      <Toast 
        message="Properti berhasil ditambahkan!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      {/* Form Content */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 overflow-y-auto">
        <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-primary-black">Informasi Dasar</h3>
            <p className="text-sm text-gray-500 mt-1">Detail utama yang akan dilihat oleh agen dan publik.</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Properti <span className="text-red-500">*</span></label>
                <input type="text" name="nama_property" value={formData.nama_property} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm" placeholder="Contoh: Aston Villas" />
                {errors.nama_property && <p className="text-xs text-[#B33A3A] mt-1">{errors.nama_property}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Group</label>
                <input type="text" name="group" value={formData.group} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm" placeholder="Contoh: Mentari, Project Ville" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kawasan (Multi-tag) <span className="text-red-500">*</span></label>
                <input type="text" name="kawasan" value={formData.kawasan} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm" placeholder="Pisahkan dengan koma: Krakatau, Pancing" />
                {errors.kawasan && <p className="text-xs text-[#B33A3A] mt-1">{errors.kawasan}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Harga (Rp) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 text-sm">Rp</span>
                  <input type="text" name="price" value={formatRupiah(formData.price)} onChange={e => setFormData({...formData, price: e.target.value.replace(/\D/g, '')})} className="w-full bg-gray-50 border border-gray-200 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm" placeholder="1.500.000.000" />
                </div>
                {errors.price && <p className="text-xs text-[#B33A3A] mt-1">{errors.price}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipe</label>
                <select name="tipe" value={formData.tipe} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm bg-white">
                  <option value="Ruko">Ruko</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm bg-white">
                  <option value="in_stock">In Stock</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kondisi Siap</label>
                <select name="siap" value={formData.siap} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm bg-white">
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lebar (m) <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" name="lebar" value={formData.lebar} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm" placeholder="Misal: 4.5" />
                {errors.lebar && <p className="text-xs text-[#B33A3A] mt-1">{errors.lebar}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Panjang (m) <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" name="panjang" value={formData.panjang} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm" placeholder="Misal: 15" />
                {errors.panjang && <p className="text-xs text-[#B33A3A] mt-1">{errors.panjang}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tingkat <span className="text-red-500">*</span></label>
                <input type="number" step="0.1" name="tingkat" value={formData.tingkat} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm" placeholder="1 - 10" />
                {errors.tingkat && <p className="text-xs text-[#B33A3A] mt-1">{errors.tingkat}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Arah Hadap <span className="text-red-500">*</span></label>
                <input type="text" name="hadap" value={formData.hadap} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm" placeholder="Utara, Selatan..." />
                {errors.hadap && <p className="text-xs text-[#B33A3A] mt-1">{errors.hadap}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Link Google Maps</label>
                <input type="text" name="maps_link" value={formData.maps_link} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm" placeholder="https://maps.app.goo.gl/..." />
                {errors.maps_link && <p className="text-xs text-[#B33A3A] mt-1">{errors.maps_link}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit / Detail Tambahan</label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:border-accent-gold transition text-sm" placeholder="Ready Siap Huni, Lapangan..." />
              </div>
            </div>

            <div className="flex items-center gap-3 py-4">
              <input type="checkbox" id="carport" name="carport" checked={formData.carport} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-accent-gold focus:ring-accent-gold" />
              <label htmlFor="carport" className="text-sm font-medium text-gray-700 cursor-pointer">Dilengkapi Carport</label>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
