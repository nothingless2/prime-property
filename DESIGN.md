# Prime Property Design System

## 1. Color Palette
Gunakan variabel warna berikut di Tailwind config secara presisi[cite: 2]:
*   `primary-black`: `#1A1A1A` (Background hero statis, header, teks utama)
*   `accent-gold`: `#C9A961` (Tombol CTA utama, highlight, outline, badge Siap Huni)
*   `accent-red`: `#B33A3A` (Status urgent, hover state, error validation, badge Sold Out)
*   `neutral-white`: `#FFFFFF` (Background kontainer form/tabel, teks di atas background gelap)
*   `soft-gray`: `#F5F5F5` (Background dashboard internal, background sekunder)

## 2. Typography & Layout
*   **Font:** Inter atau Geist (sans-serif modern)[cite: 2]. Bold untuk heading, Regular untuk body[cite: 2].
*   **Spacing:** Skala grid 4px (4, 8, 16, 24, 32px)[cite: 2].
*   **Breakpoints:** Mobile $\le640px$, Tablet $\le1024px$, Desktop $\ge1024px$[cite: 2].

## 3. Component Architecture
*   **Header (Public):** Sticky navigation. Warna dasar putih atau transparan ke gelap. Urutan: Logo -> Beranda -> Tentang Kami -> Kontak -> [Login Agent (Outline Gold)][cite: 2].
*   **Hero Section:** Background statis elegan berlapis *overlay* gelap `#1A1A1A`. Teks *tagline* di tengah dengan tombol CTA `#C9A961` teks hitam[cite: 2].
*   **Property Cards (Public only):** Desain *card* elegan dengan *cover* gambar statis, menampilkan informasi dasar (Nama, Lokasi, Dimensi, Harga).
*   **Data Table (Internal):** Kompak, ringkas, tanpa gambar[cite: 2]. Status menggunakan *badge* warna: Hijau Muda (In Stock), Merah (Sold Out), Emas (Siap Huni), Ungu Muda (Siap Kosong)[cite: 2].
*   **Contact Form:** Layout *clean* dengan field Nama, Email, Nomor HP, dan Pesan[cite: 2].