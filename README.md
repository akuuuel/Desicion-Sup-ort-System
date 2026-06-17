# 🚀 InternRank - Sistem Pendukung Keputusan Magang

**InternRank** adalah aplikasi Sistem Pendukung Keputusan (SPK) modern yang dirancang untuk membantu mahasiswa memilih tempat magang terbaik secara objektif. Menggunakan kolaborasi algoritma **Analytical Hierarchy Process (AHP)** untuk pembobotan kriteria dan **Simple Additive Weighting (SAW)** untuk perankingan akhir.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-emerald?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)

## ✨ Fitur Utama

- 🔐 **Multi-User Authentication**: Mendukung pendaftaran dan login mandiri bagi setiap mahasiswa.
- 🛡️ **Data Isolation**: Data kriteria, alternatif, dan penilaian terisolasi aman antar pengguna.
- 📊 **Metode AHP**: Perhitungan bobot kriteria melalui matriks perbandingan berpasangan.
- 🏆 **Metode SAW**: Perankingan alternatif tempat magang berdasarkan bobot AHP.
- 📑 **Export Report**: Unduh hasil analisis dalam format PDF profesional.
- 🌓 **Modern UI**: Antarmuka responsif dengan desain premium (Dark Mode ready).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Memulai (Local Development)

1. **Clone repositori:**
   ```bash
   git clone https://github.com/username/intern-rank.git
   cd intern-rank
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Buat file `.env.local` dan masukkan kunci Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```

## 📐 Skema Database

Skema SQL lengkap tersedia di file `schema.sql`. Pastikan untuk menerapkan skema tersebut di SQL Editor Supabase Anda sebelum menjalankan aplikasi.

## 📄 Lisensi

Proyek ini dibuat untuk tujuan akademik dan pengembangan pribadi.

---
Dibuat dengan ❤️ untuk Mahasiswa Indonesia.
