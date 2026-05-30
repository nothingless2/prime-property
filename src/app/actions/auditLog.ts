'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function checkSuperAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'SUPERADMIN') {
    const error = new Error('Forbidden: Superadmin access required')
    ;(error as any).status = 403
    throw error
  }
  return session
}

export async function getAuditLogs() {
  await checkSuperAdmin()
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  // To show usernames and roles, let's fetch users as well
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true }
  })
  const userMap = new Map(users.map(u => [u.id, { username: u.username, role: u.role }]))

  return logs.map(log => {
    const actor = log.userId ? userMap.get(log.userId) : null;
    return {
      ...log,
      username: actor ? actor.username : (log.userId ? 'Unknown' : 'System'),
      role: actor ? actor.role : 'SYSTEM'
    }
  })
}
