# Product Requirements Document (PRD) - Prime Property

## 1. Overview
Prime Property adalah platform manajemen listing properti yang terdiri dari Web Platform (halaman publik) dan Internal Agent Portal[cite: 2]. Sistem ini dirancang dengan fokus pada efisiensi manajerial data properti tabular melalui sistem Role-Based Access Control (RBAC) yang ketat[cite: 2].

## 2. Core Features & Scope
*   **Halaman Publik (Statis & Premium):** Terdiri dari Landing Page, About Us, dan Contact Us[cite: 2]. Menggunakan gambar statis (*hardcoded*) untuk memberikan visualisasi premium tanpa memerlukan infrastruktur *cloud storage* atau fitur *upload*.
*   **Autentikasi Internal:** Login khusus *agent* di route `/agent/login` menggunakan sistem berbasis httpOnly cookie dan SameSite=Lax[cite: 2].
*   **Dashboard Internal:** Sistem manajemen data properti berbasis tabel kompak (tanpa gambar) dengan fitur pencarian dan filter *real-time*[cite: 2].

## 3. Role-Based Access Control (RBAC)
Otorisasi wajib dicek di *backend* untuk setiap *endpoint* API[cite: 2].
*   **Admin:** Hanya memiliki hak akses *Read-Only* (Melihat listing, filter, search, dan detail properti)[cite: 2].
*   **Superadmin:** Memiliki hak akses penuh (Full CRUD properti, manajemen akun admin, dan melihat audit log)[cite: 2].

## 4. Data Schema (Properti)
Setiap entri properti wajib memiliki struktur data berikut[cite: 2]:
*   `nama_property` (String, 3-100 karakter)
*   `group` (String, nullable)
*   `lebar`, `panjang`, `tingkat` (Decimal)
*   `hadap` (Enum/Multi: Utara, Selatan, Timur, Barat)
*   `tipe` (Enum: Ruko, Villa)
*   `price` (BigInt/Integer - disimpan dalam bentuk nilai penuh, ditambilkan dengan separator titik)
*   `carport` (Boolean)
*   `status` (Enum: in_stock, sold_out)
*   `siap` (Enum: siap_huni, siap_kosong, siap_huni_renovasi)
*   `maps_link` (String URL, opsional)
*   `kawasan` (String multi-tag)
*   `unit` (String, nullable)

## 5. Security & Performance (Non-Functional)
*   **Keamanan:** Wajib mengimplementasikan CSRF protection pada mutasi data, input sanitization untuk XSS/SQL Injection, hashing password dengan bcrypt, dan *rate limiting* (100 req/menit/IP global; 10 req/menit/IP untuk auth)[cite: 2].
*   **Performa:** Response filter < 500ms dan Time to First Contentful Paint (FCP) < 1.5s[cite: 2].

## 6. Workflow & Deployment
*   **Stack:** Next.js, Tailwind CSS, PostgreSQL (via Prisma), dan Server Actions[cite: 2].
*   **Deployment:** Wajib menggunakan GitHub Actions untuk CI/CD dengan minimal 2 environment (Staging & Production)[cite: 2].
*   **Development Setup:** Menggunakan file `.env.example` dan variabel lingkungan di `.env` serta `.env.local` yang harus didefinisikan di GitHub Secrets. Database harus dimigrasikan menggunakan `prisma.config.ts` sebelum *deployment* ke database eksternal.

## 7. Technical Constraints & System Design
*   **Single Codebase:** Semua fitur (Frontend & Backend) harus berada dalam satu repositori Next.js[cite: 2].
*   **Frontend-Driven Architecture:** Pengelolaan Data & State di sisi client (React State), bukan di halaman statis[cite: 2].
*   **Styling:** Menggunakan TailwindCSS dan dikategorikan menjadi desain "Premium" (Public Pages) dan "Minimalis/Tabular" (Agent Portal)[cite: 2].
*   **Routing:** Memanfaatkan struktur folder Next.js (App Router) dan menggunakan `searchParams` untuk mengelola filter dinamis di dashboard[cite: 2].