import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const superadminPassword = await bcrypt.hash('superadmin123', 10)
  const adminPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      passwordHash: superadminPassword,
      role: 'SUPERADMIN',
    },
  })

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  // 1. Villa Mungil (Harga di bawah 1M, Siap Kosong, Tanpa Carport)
  const prop1 = await prisma.property.create({
    data: {
      nama_property: "Villa Anggrek Minimalis",
      group: null,
      lebar: 6.0,
      panjang: 12.0,
      hadap: "Selatan",
      tipe: "Villa",
      tingkat: 1.0,
      price: 850000000n,
      carport: false,
      status: "in_stock",
      siap: "siap_kosong",
      maps_link: "https://google.com/maps",
      kawasan: "Tembung",
      unit: "Blok C No. 4"
    }
  });
  console.log(`Berhasil membuat properti: ${prop1.nama_property}`);

  // 2. Ruko Komersial Premium (Harga Tinggi, Multi-Kawasan, Butuh Renovasi)
  const prop2 = await prisma.property.create({
    data: {
      nama_property: "Gading Square Commercial",
      group: "Gading Square",
      lebar: 8.0,
      panjang: 25.0,
      hadap: "Utara, Timur",
      tipe: "Ruko",
      tingkat: 4.5,
      price: 6750000000n,
      carport: true,
      status: "in_stock",
      siap: "siap_huni_renovasi",
      maps_link: null,
      kawasan: "Krakatau, Pancing",
      unit: "Hook Utama"
    }
  });
  console.log(`Berhasil membuat properti: ${prop2.nama_property}`);

  // 3. Villa Mewah / Mansion (Sudah Terjual, Luas Bangunan Ekstra)
  const prop3 = await prisma.property.create({
    data: {
      nama_property: "Senopati Signature",
      group: "Senopati Estate",
      lebar: 15.0,
      panjang: 30.0,
      hadap: "Timur",
      tipe: "Villa",
      tingkat: 3.0,
      price: 12500000000n,
      carport: true,
      status: "sold_out",
      siap: "siap_huni",
      maps_link: "https://google.com/maps",
      kawasan: "Cemara Asri",
      unit: "Penthouse Type"
    }
  });
  console.log(`Berhasil membuat properti: ${prop3.nama_property}`);

  // 4. Ruko Standar (Harga Menengah, In Stock)
  const prop4 = await prisma.property.create({
    data: {
      nama_property: "Ruko Setia Budi Bisnis",
      group: "Setia Budi Center",
      lebar: 4.0,
      panjang: 16.0,
      hadap: "Barat",
      tipe: "Ruko",
      tingkat: 2.5,
      price: 1850000000n,
      carport: true,
      status: "in_stock",
      siap: "siap_huni",
      maps_link: "https://google.com/maps",
      kawasan: "Setia Budi",
      unit: "Blok A2"
    }
  });
  console.log(`Berhasil membuat properti: ${prop4.nama_property}`);

  // 5. Villa Sedang (Kosong, Posisi Hook)
  const prop5 = await prisma.property.create({
    data: {
      nama_property: "Johor Asri Residence",
      group: "Johor Asri",
      lebar: 9.0,
      panjang: 15.0,
      hadap: "Selatan, Barat",
      tipe: "Villa",
      tingkat: 2.0,
      price: 2100000000n,
      carport: true,
      status: "in_stock",
      siap: "siap_kosong",
      maps_link: null,
      kawasan: "Medan Johor",
      unit: "Hook Selatan"
    }
  });
  console.log(`Berhasil membuat properti: ${prop5.nama_property}`);

  // 6. Ruko Tua (Butuh Renovasi, Murah)
  const prop6 = await prisma.property.create({
    data: {
      nama_property: "Ruko Lama Brayan",
      group: null,
      lebar: 4.0,
      panjang: 20.0,
      hadap: "Utara",
      tipe: "Ruko",
      tingkat: 2.0,
      price: 950000000n,
      carport: false,
      status: "in_stock",
      siap: "siap_huni_renovasi",
      maps_link: "https://google.com/maps",
      kawasan: "Brayan",
      unit: null
    }
  });
  console.log(`Berhasil membuat properti: ${prop6.nama_property}`);

  // 7. Villa Premium (Sold Out, Menghadap Timur)
  const prop7 = await prisma.property.create({
    data: {
      nama_property: "Ringroad Royal Villa",
      group: "Royal Ringroad",
      lebar: 10.0,
      panjang: 22.0,
      hadap: "Timur",
      tipe: "Villa",
      tingkat: 2.5,
      price: 4800000000n,
      carport: true,
      status: "sold_out",
      siap: "siap_huni",
      maps_link: "https://google.com/maps",
      kawasan: "Ringroad",
      unit: "Blok VIP 1"
    }
  });
  console.log(`Berhasil membuat properti: ${prop7.nama_property}`);

  // 8. Ruko Besar (3 Lantai, Multi-Kawasan)
  const prop8 = await prisma.property.create({
    data: {
      nama_property: "Gatot Subroto Plaza",
      group: "Gatsu Plaza",
      lebar: 5.0,
      panjang: 18.0,
      hadap: "Selatan",
      tipe: "Ruko",
      tingkat: 3.0,
      price: 3200000000n,
      carport: true,
      status: "in_stock",
      siap: "siap_kosong",
      maps_link: null,
      kawasan: "Gatot Subroto, Medan Petisah",
      unit: "Nomor 88"
    }
  });
  console.log(`Berhasil membuat properti: ${prop8.nama_property}`);

  // 9. Villa Sudut (Butuh Renovasi, Sold Out)
  const prop9 = await prisma.property.create({
    data: {
      nama_property: "Tasbi Corner",
      group: "Setia Budi Indah",
      lebar: 12.0,
      panjang: 20.0,
      hadap: "Utara, Timur",
      tipe: "Villa",
      tingkat: 2.0,
      price: 3500000000n,
      carport: true,
      status: "sold_out",
      siap: "siap_huni_renovasi",
      maps_link: "https://google.com/maps",
      kawasan: "Setia Budi",
      unit: "Blok E No 1"
    }
  });
  console.log(`Berhasil membuat properti: ${prop9.nama_property}`);

  // 10. Ruko Mungil (Tanpa Carport, In Stock)
  const prop10 = await prisma.property.create({
    data: {
      nama_property: "Pancing Trade Center",
      group: "PTC",
      lebar: 4.0,
      panjang: 14.0,
      hadap: "Barat",
      tipe: "Ruko",
      tingkat: 2.0,
      price: 1100000000n,
      carport: false,
      status: "in_stock",
      siap: "siap_huni",
      maps_link: "https://google.com/maps",
      kawasan: "Pancing",
      unit: "Blok F"
    }
  });
  console.log(`Berhasil membuat properti: ${prop10.nama_property}`);

  // 11. Villa Eksklusif (Siap Huni, Sangat Luas)
  const prop11 = await prisma.property.create({
    data: {
      nama_property: "Polonia Riverview",
      group: null,
      lebar: 14.0,
      panjang: 28.0,
      hadap: "Timur",
      tipe: "Villa",
      tingkat: 3.0,
      price: 8900000000n,
      carport: true,
      status: "in_stock",
      siap: "siap_huni",
      maps_link: "https://google.com/maps",
      kawasan: "Polonia",
      unit: "River View 1"
    }
  });
  console.log(`Berhasil membuat properti: ${prop11.nama_property}`);

  // 12. Ruko Hook (Sold Out, Kosong)
  const prop12 = await prisma.property.create({
    data: {
      nama_property: "Cemara Commercial Hook",
      group: "Cemara Asri",
      lebar: 6.0,
      panjang: 16.0,
      hadap: "Selatan, Timur",
      tipe: "Ruko",
      tingkat: 3.5,
      price: 4100000000n,
      carport: true,
      status: "sold_out",
      siap: "siap_kosong",
      maps_link: null,
      kawasan: "Cemara Asri, Krakatau",
      unit: "Boulevard Hook"
    }
  });
  console.log(`Berhasil membuat properti: ${prop12.nama_property}`);

  console.log('Seed data inserted.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
