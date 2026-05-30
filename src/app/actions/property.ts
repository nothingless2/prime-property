'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function checkAuth(requiredRole?: string) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  
  if (requiredRole && session.role !== requiredRole) {
    if (requiredRole === 'SUPERADMIN' && session.role !== 'SUPERADMIN') {
      const error = new Error('Forbidden: Superadmin access required')
      ;(error as any).status = 403
      throw error
    }
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId as string } })
  if (!user || !user.isActive) {
    throw new Error('Akun Anda telah dinonaktifkan.')
  }

  return session
}

export async function getProperties(search?: string, tipe?: string) {
  await checkAuth() // Admin and Superadmin can read

  const where: any = { deletedAt: null }
  
  if (search) {
    where.OR = [
      { nama_property: { contains: search } },
      { kawasan: { contains: search } },
      { group: { contains: search } }
    ]
  }

  if (tipe) {
    where.tipe = tipe
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })
  
  // Convert BigInt to string for client component serialization
  return properties.map(p => ({
    ...p,
    price: p.price.toString()
  }))
}

export async function getProperty(id: string) {
  await checkAuth()
  
  const property = await prisma.property.findUnique({
    where: { id }
  })
  
  if (!property || property.deletedAt) return null
  
  return {
    ...property,
    price: property.price.toString()
  }
}

export async function createProperty(data: any) {
  const session = await checkAuth('SUPERADMIN')
  
  const property = await prisma.property.create({
    data: {
      ...data,
      price: BigInt(data.price),
      lebar: parseFloat(data.lebar),
      panjang: parseFloat(data.panjang),
      tingkat: parseFloat(data.tingkat),
      carport: data.carport === 'true' || data.carport === true,
      created_by: session.userId as string
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: session.userId as string,
      action: 'CREATE',
      entity: 'Property',
      entityId: property.id,
      details: JSON.stringify(data)
    }
  })

  revalidatePath('/agent/properties')
  revalidatePath('/')

  return property
}

export async function updateProperty(id: string, data: any) {
  const session = await checkAuth('SUPERADMIN')

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...data,
      price: data.price ? BigInt(data.price) : undefined,
      lebar: data.lebar ? parseFloat(data.lebar) : undefined,
      panjang: data.panjang ? parseFloat(data.panjang) : undefined,
      tingkat: data.tingkat ? parseFloat(data.tingkat) : undefined,
      carport: data.carport !== undefined ? (data.carport === 'true' || data.carport === true) : undefined
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: session.userId as string,
      action: 'UPDATE',
      entity: 'Property',
      entityId: property.id,
      details: JSON.stringify(data)
    }
  })

  revalidatePath('/agent/properties')
  revalidatePath('/')

  return property
}

export async function deleteProperty(id: string) {
  const session = await checkAuth('SUPERADMIN')
  // Soft delete
  const property = await prisma.property.update({
    where: { id },
    data: { deletedAt: new Date() }
  })

  await prisma.auditLog.create({
    data: {
      userId: session.userId as string,
      action: 'DELETE',
      entity: 'Property',
      entityId: property.id,
      details: JSON.stringify({ deletedAt: property.deletedAt })
    }
  })

  revalidatePath('/agent/properties')
  revalidatePath('/')

  return property
}

export async function getArchivedProperties(search?: string) {
  await checkAuth('SUPERADMIN') // Only Superadmin can read archives

  const where: any = { deletedAt: { not: null } }
  
  if (search) {
    where.OR = [
      { nama_property: { contains: search } },
      { kawasan: { contains: search } },
      { group: { contains: search } }
    ]
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: { deletedAt: 'desc' }
  })
  
  return properties.map(p => ({
    ...p,
    price: p.price.toString()
  }))
}

export async function restoreProperty(id: string) {
  const session = await checkAuth('SUPERADMIN')
  
  const property = await prisma.property.update({
    where: { id },
    data: { deletedAt: null }
  })

  await prisma.auditLog.create({
    data: {
      userId: session.userId as string,
      action: 'RESTORE',
      entity: 'Property',
      entityId: property.id,
      details: JSON.stringify({ deletedAt: null })
    }
  })

  revalidatePath('/agent/properties')
  revalidatePath('/agent/arsip')
  revalidatePath('/')

  return property
}
