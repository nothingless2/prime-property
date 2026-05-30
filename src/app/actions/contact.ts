'use server'

import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

import nodemailer from 'nodemailer'

export async function submitContact(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const message = formData.get('message') as string

    if (!name || !email || !phone || !message) {
      return { error: 'Semua kolom wajib diisi' }
    }

    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1'

    // Rate Limit: 3 per hour per IP
    const now = new Date()
    
    // Cleanup old limits (optional, but good practice)
    await prisma.rateLimit.deleteMany({
      where: { resetAt: { lt: now } }
    })

    let rateLimit = await prisma.rateLimit.findUnique({
      where: {
        ip_endpoint: {
          ip,
          endpoint: 'contact_submit'
        }
      }
    })

    if (rateLimit) {
      if (rateLimit.count >= 3) {
        return { error: 'Terlalu banyak permintaan. Silakan coba lagi nanti dalam 1 jam.', status: 429 }
      }
      
      await prisma.rateLimit.update({
        where: { id: rateLimit.id },
        data: { count: rateLimit.count + 1 }
      })
    } else {
      await prisma.rateLimit.create({
        data: {
          ip,
          endpoint: 'contact_submit',
          count: 1,
          resetAt: new Date(now.getTime() + 60 * 60 * 1000) // Reset after 1 hour
        }
      })
    }

    // Send email using Nodemailer
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
        replyTo: email,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `Pesan Baru dari ${name} - Prime Property`,
        text: `Nama: ${name}\nEmail: ${email}\nNo HP: ${phone}\n\nPesan:\n${message}`,
        html: `
          <h3>Pesan Baru dari Website Contact Form</h3>
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>No HP:</strong> ${phone}</p>
          <p><strong>Pesan:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `
      })
    } else {
      console.log(`[Email Simulation] Contact message received from ${name} (${email}, ${phone}): ${message}`)
      console.log('Notice: Email was not sent because SMTP environment variables are not configured.')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Contact submit error:', error)
    return { error: 'Gagal mengirim pesan: ' + (error.message || 'Unknown error'), status: 500 }
  }
}

export async function subscribeNewsletter(email: string) {
  try {
    if (!email) return { error: 'Email wajib diisi' }

    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1'

    // Simple rate limiting (5 per hour)
    const now = new Date()
    let rateLimit = await prisma.rateLimit.findUnique({
      where: { ip_endpoint: { ip, endpoint: 'newsletter' } }
    })

    if (rateLimit) {
      if (rateLimit.count >= 5 && rateLimit.resetAt > now) {
        return { error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' }
      }
      if (rateLimit.resetAt <= now) {
        await prisma.rateLimit.update({ where: { id: rateLimit.id }, data: { count: 1, resetAt: new Date(now.getTime() + 60 * 60 * 1000) } })
      } else {
        await prisma.rateLimit.update({ where: { id: rateLimit.id }, data: { count: rateLimit.count + 1 } })
      }
    } else {
      await prisma.rateLimit.create({
        data: { ip, endpoint: 'newsletter', count: 1, resetAt: new Date(now.getTime() + 60 * 60 * 1000) }
      })
    }

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      // Send alert to admin
      await transporter.sendMail({
        from: `"Prime Property Web" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `Pendaftar Newsletter Baru: ${email}`,
        text: `Ada pelanggan baru yang ingin mendapatkan update properti eksklusif:\nEmail: ${email}`,
        html: `<h3>Pendaftar Newsletter Baru</h3><p>Email: <strong>${email}</strong></p>`
      })
    } else {
      console.log(`[Email Simulation] New Newsletter Subscription: ${email}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error)
    return { error: 'Gagal memproses pendaftaran. Silakan coba lagi.' }
  }
}
