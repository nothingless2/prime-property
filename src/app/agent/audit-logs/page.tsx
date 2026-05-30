import { getAuditLogs } from '@/app/actions/auditLog'
import AuditLogsClient from './AuditLogsClient'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AuditLogsPage() {
  const session = await getSession()
  
  if (!session || session.role !== 'SUPERADMIN') {
    redirect('/agent/dashboard')
  }

  const logs = await getAuditLogs()
  
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-black">Audit Log</h1>
          <p className="text-gray-500 mt-2">Pantau seluruh riwayat aktivitas yang terjadi pada sistem.</p>
        </div>
      </div>
      
      <AuditLogsClient initialLogs={logs} />
    </div>
  )
}
