'use client'

import { useState } from 'react'
import { createUser, toggleUserStatus, resetPassword, deleteUser } from '@/app/actions/user'
import { Plus, UserX, UserCheck, KeyRound, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { showConfirm, showSuccessToast, showErrorAlert, showPrompt } from '@/lib/swal'

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [showModal, setShowModal] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('ADMIN')

  // Pagination State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const totalItems = users.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUser({ username: newUsername, passwordHash: newPassword, role: newRole })
      showSuccessToast('User berhasil dibuat!')
      setShowModal(false)
      window.location.reload()
    } catch (e: any) {
      showErrorAlert(e.message)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (await showConfirm('Konfirmasi Status', `Apakah Anda yakin ingin ${currentStatus ? 'menonaktifkan' : 'mengaktifkan'} user ini?`)) {
      try {
        await toggleUserStatus(id, currentStatus)
        showSuccessToast('Status user berhasil diperbarui!')
        window.location.reload()
      } catch (e: any) {
        showErrorAlert(e.message)
      }
    }
  }

  const handleResetPassword = async (id: string) => {
    const newPassword = await showPrompt('Reset Password', 'Masukkan password baru')
    if (newPassword) {
      try {
        await resetPassword(id, newPassword)
        showSuccessToast('Password berhasil direset!')
      } catch (e: any) {
        showErrorAlert(e.message)
      }
    }
  }

  const handleDelete = async (id: string, username: string) => {
    if (await showConfirm('Konfirmasi Hapus', `Apakah Anda yakin ingin menghapus permanen user "${username}"?`)) {
      try {
        await deleteUser(id)
        showSuccessToast('User berhasil dihapus!')
        window.location.reload()
      } catch (e: any) {
        showErrorAlert(e.message)
      }
    }
  }

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => setShowModal(true)} className="bg-primary-black text-white px-6 py-2 rounded font-bold text-sm hover:bg-gray-800 flex items-center gap-2 transition shadow-lg">
          <Plus className="w-4 h-4" /> Tambah User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{user.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.isActive ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleResetPassword(user.id)} className="p-2 text-gray-500 hover:text-accent-gold transition bg-gray-50 rounded" title="Reset Password">
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleStatus(user.id, user.isActive)} className={`p-2 transition bg-gray-50 rounded ${user.isActive ? 'text-gray-500 hover:text-red-500' : 'text-gray-500 hover:text-green-500'}`} title={user.isActive ? 'Nonaktifkan' : 'Aktifkan'}>
                      {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(user.id, user.username)} className="p-2 text-gray-500 hover:text-red-600 transition bg-gray-50 rounded" title="Hapus User">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Belum ada data pengguna.
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
              Total {totalItems} pengguna
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-primary-black">Tambah Akun Baru</h3>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Username</label>
                <input type="text" required value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-accent-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-accent-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Role</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-accent-gold">
                  <option value="ADMIN">ADMIN (Hanya Lihat Properti)</option>
                  <option value="SUPERADMIN">SUPERADMIN (Akses Penuh)</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded font-bold hover:bg-gray-50 transition">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary-black text-white rounded font-bold hover:bg-gray-800 transition shadow-lg">Simpan Akun</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
