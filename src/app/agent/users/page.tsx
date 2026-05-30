import { getUsers } from '@/app/actions/user'
import UsersClient from './UsersClient'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const session = await getSession()
  
  if (!session || session.role !== 'SUPERADMIN') {
    redirect('/agent/dashboard')
  }

  const users = await getUsers()
  
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-black">Manajemen Pengguna</h1>
          <p className="text-gray-500 mt-2">Kelola akun Admin dan Superadmin.</p>
        </div>
      </div>
      
      <UsersClient initialUsers={users} />
    </div>
  )
}
