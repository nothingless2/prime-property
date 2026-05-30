'use server'

import { headers } from 'next/headers'
import prisma from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { createSession, deleteSession, getSession } from '@/lib/auth'

export async function login(formData: FormData) {
  try {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
      return { error: 'Username dan Password wajib diisi' }
    }

    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1'

    // Rate Limit / Lockout check
    let attemptRecord = await prisma.loginAttempt.findUnique({
      where: { ip }
    })

    if (attemptRecord) {
      if (attemptRecord.lockUntil && attemptRecord.lockUntil > new Date()) {
        return { error: 'Terlalu banyak percobaan gagal. Silakan coba lagi nanti.' }
      }
    }

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      // Record failed attempt
      const newAttempts = (attemptRecord?.attempts || 0) + 1
      const lockUntil = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null

      await prisma.loginAttempt.upsert({
        where: { ip },
        update: { attempts: newAttempts, lockUntil },
        create: { ip, attempts: 1, lockUntil }
      })

      return { error: 'Username atau password salah' }
    }

    if (!user.isActive) {
      return { error: 'Akun ini telah dinonaktifkan. Silakan hubungi Superadmin.' }
    }

    // Success, reset attempts
    if (attemptRecord) {
      await prisma.loginAttempt.update({
        where: { ip },
        data: { attempts: 0, lockUntil: null }
      })
    }

    await createSession(user.id, user.role)
    return { success: true }
  } catch (error: any) {
    console.error('Login Error:', error)
    return { error: 'Terjadi kesalahan sistem saat login: ' + (error.message || 'Unknown error') }
  }
}

export async function logout() {
  await deleteSession()
}

export async function getCurrentRole() {
  const session = await getSession()
  return session?.role || null
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session || !session.userId) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { username: true, role: true }
  })
  return user
}
