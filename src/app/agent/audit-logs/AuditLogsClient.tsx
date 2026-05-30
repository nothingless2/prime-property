'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function AuditLogsClient({ initialLogs }: { initialLogs: any[] }) {
  const [logs] = useState(initialLogs)

  // Pagination State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const totalItems = logs.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedLogs = logs.slice((page - 1) * pageSize, page * pageSize)

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-100 text-green-700'
    if (action.includes('DELETE')) return 'bg-red-100 text-red-700'
    if (action.includes('UPDATE') || action.includes('RESET')) return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-700'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: 'Asia/Jakarta'
    }).format(new Date(date))
  }

  const formatEntity = (entity: string, details: string) => {
    if (entity === 'Property') return entity
    
    try {
      const parsed = JSON.parse(details)
      if (entity === 'User' && parsed.username) return `Aktor: ${parsed.username}`
    } catch (e) {
      // not json or no name
    }
    
    if (entity === 'User') return 'Aktor'
    return entity
  }

  const formatDetails = (details: string) => {
    try {
      const parsed = JSON.parse(details)
      return (
        <ul className="space-y-1">
          {Object.entries(parsed).map(([key, value]) => {
            let displayKey = key.replace(/_/g, ' ')
            if (key.toLowerCase() === 'username') displayKey = 'nama aktor'
            
            return (
              <li key={key} className="text-xs">
                <span className="font-semibold text-gray-700 capitalize">{displayKey}:</span>{' '}
                <span className="text-gray-600">{String(value)}</span>
              </li>
            )
          })}
        </ul>
      )
    } catch (e) {
      return <span className="text-xs text-gray-600">{details}</span>
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Waktu</th>
              <th className="px-6 py-4">Aktor</th>
              <th className="px-6 py-4">Aksi</th>
              <th className="px-6 py-4">Entitas</th>
              <th className="px-6 py-4">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50 transition text-sm">
                <td className="px-6 py-4 text-gray-500">{formatDate(log.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-primary-black">{log.username}</div>
                  {log.username !== 'System' && (
                    <div className="text-xs text-gray-500 font-bold uppercase">{log.role}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-primary-black">
                  {formatEntity(log.entity, log.details)} <br />
                  <span className="text-xs text-gray-400 font-mono" title={log.entityId}>{log.entityId.substring(0, 8)}...</span>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="bg-gray-50/50 rounded-md p-3 border border-gray-100">
                    {formatDetails(log.details)}
                  </div>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Belum ada log aktivitas.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
              Total {totalItems} log aktivitas
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
    </div>
  )
}
