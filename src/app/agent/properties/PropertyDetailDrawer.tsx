'use client'

import React from 'react'
import { X, MapPin, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'

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

interface PropertyDetailDrawerProps {
  property: PropertyData | null
  isOpen: boolean
  onClose: () => void
  role: string | null
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function PropertyDetailDrawer({
  property,
  isOpen,
  onClose,
  role,
  onEdit,
  onDelete
}: PropertyDetailDrawerProps) {
  if (!isOpen || !property) return null

  const formatRupiah = (priceStr: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(priceStr))
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'in_stock': return { label: 'In Stock', className: 'bg-green-100 text-green-800' }
      case 'sold_out': return { label: 'Sold Out', className: 'bg-[#B33A3A] text-white' }
      default: return { label: status, className: 'bg-gray-100 text-gray-800' }
    }
  }

  const formatSiap = (siap: string) => {
    switch (siap) {
      case 'siap_huni': return { label: 'SIAP HUNI', className: 'bg-yellow-100 text-yellow-800' }
      case 'siap_kosong': return { label: 'SIAP KOSONG', className: 'bg-purple-100 text-purple-800' }
      case 'siap_huni_renovasi': return { label: 'SIAP HUNI RENOVASI', className: 'bg-orange-100 text-orange-800' }
      default: return { label: siap, className: 'bg-gray-100 text-gray-800' }
    }
  }

  const statusInfo = formatStatus(property.status)
  const siapInfo = formatSiap(property.siap)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl h-full flex flex-col transform transition-transform animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-primary-black">{property.nama_property}</h2>
            <p className="text-sm text-gray-500 mt-1">{property.group || 'Tanpa Group'}</p>
          </div>
          <div className="flex items-center gap-2">
            {role === 'SUPERADMIN' && (
              <>
                <button onClick={() => onEdit(property.id)} className="p-2 text-gray-500 hover:text-accent-gold transition bg-gray-50 rounded-full" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => {
                  onClose();
                  onDelete(property.id);
                }} className="p-2 text-gray-500 hover:text-[#B33A3A] transition bg-gray-50 rounded-full" title="Hapus">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-2" />
              </>
            )}
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-primary-black transition bg-gray-50 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${siapInfo.className}`}>
              {siapInfo.label}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
              {property.tipe}
            </span>
          </div>

          <div className="mb-8">
            <div className="text-3xl font-bold text-accent-gold mb-2">
              {formatRupiah(property.price)}
            </div>
            {property.maps_link && (
              <a 
                href={property.maps_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <MapPin className="w-4 h-4" />
                Buka di Google Maps
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Kawasan</div>
              <div className="font-medium text-primary-black">{property.kawasan}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Unit</div>
              <div className="font-medium text-primary-black">{property.unit || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Dimensi</div>
              <div className="font-medium text-primary-black">{property.lebar} x {property.panjang} m</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Tingkat</div>
              <div className="font-medium text-primary-black">{property.tingkat} Lantai</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Arah Hadap</div>
              <div className="font-medium text-primary-black">{property.hadap}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Carport</div>
              <div className="font-medium text-primary-black">{property.carport ? 'Ada' : 'Tidak Ada'}</div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              Ditambahkan pada: {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(property.createdAt))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
