'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import * as bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache'

async function checkSuperAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'SUPERADMIN') {
    const error = new Error('Forbidden: Superadmin access required')
    ;(error as any).status = 403
    throw error
  }
  
  const user = await prisma.user.findUnique({ where: { id: session.userId as string } })
  if (!user || !user.isActive) {
    throw new Error('Akun Anda telah dinonaktifkan.')
  }
  return session
}

export async function getUsers() {
  await checkSuperAdmin()
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  })
  return users
}

export async function createUser(data: { username: string, passwordHash: string, role: string }) {
  const session = await checkSuperAdmin()
  const hashed = await bcrypt.hash(data.passwordHash, 10)
  
  const user = await prisma.user.create({
    data: {
      username: data.username,
      passwordHash: hashed,
      role: data.role || 'ADMIN',
      isActive: true
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: session.userId as string,
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      details: JSON.stringify({ username: user.username, role: user.role })
    }
  })

  return { success: true }
}

export async function toggleUserStatus(id: string, currentStatus: boolean) {
  const session = await checkSuperAdmin()
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: !currentStatus }
  })

  await prisma.auditLog.create({
    data: {
      userId: session.userId as string,
      action: 'UPDATE_STATUS',
      entity: 'User',
      entityId: user.id,
      details: JSON.stringify({ username: user.username, isActive: !currentStatus })
    }
  })

  return { success: true }
}

export async function resetPassword(id: string, newPasswordHash: string) {
  const session = await checkSuperAdmin()
  const hashed = await bcrypt.hash(newPasswordHash, 10)
  
  const user = await prisma.user.update({
    where: { id },
    data: { passwordHash: hashed }
  })

  await prisma.auditLog.create({
    data: {
      userId: session.userId as string,
      action: 'RESET_PASSWORD',
      entity: 'User',
      entityId: user.id,
      details: JSON.stringify({ username: user.username, action: 'Password Reset' })
    }
  })

  return { success: true }
}

export async function deleteUser(id: string) {
  const session = await checkSuperAdmin()

  if (session.userId === id) {
    throw new Error('Anda tidak dapat menghapus akun Anda sendiri.')
  }

  try {
    const user = await prisma.user.delete({
      where: { id }
    })

    await prisma.auditLog.create({
      data: {
        userId: session.userId as string,
        action: 'DELETE',
        entity: 'User',
        entityId: user.id,
        details: JSON.stringify({ username: user.username })
      }
    })

    revalidatePath('/agent/users')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2003') {
      throw new Error('Gagal menghapus: User ini memiliki properti yang masih terkait di dalam sistem.')
    }
    throw error
  }
}
