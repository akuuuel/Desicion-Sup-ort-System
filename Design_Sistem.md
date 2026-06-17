# DESIGN SISTEM
## InternRank - Sistem Pendukung Keputusan Pemilihan Tempat Magang Terbaik bagi Mahasiswa Menggunakan Metode AHP dan SAW

---

# 1. INFORMASI PROYEK

## Nama Sistem
InternRank

## Jenis Sistem
Sistem Pendukung Keputusan (SPK)

## Metode
- Analytical Hierarchy Process (AHP)
- Simple Additive Weighting (SAW)

## Platform
Web Application

## Tujuan

Membantu mahasiswa menentukan tempat magang terbaik berdasarkan sejumlah kriteria yang telah ditentukan secara objektif dan terukur menggunakan metode AHP dan SAW.

---

# 2. LATAR BELAKANG

Mahasiswa sering mengalami kesulitan dalam memilih tempat magang yang sesuai karena banyaknya alternatif dan berbagai faktor yang harus dipertimbangkan.

Faktor seperti lokasi, fasilitas, uang saku, pengalaman kerja, dan peluang direkrut memiliki tingkat kepentingan yang berbeda sehingga dibutuhkan sistem yang mampu memberikan rekomendasi secara sistematis.

Untuk menyelesaikan permasalahan tersebut digunakan metode AHP untuk menentukan bobot kriteria dan metode SAW untuk melakukan perangkingan alternatif.

---

# 3. TUJUAN SISTEM

- Membantu proses pemilihan tempat magang.
- Mengurangi subjektivitas dalam pengambilan keputusan.
- Menghasilkan ranking tempat magang terbaik.
- Menampilkan proses perhitungan secara transparan.

---

# 4. AKTOR SISTEM

## Administrator

Hak akses:

- Login
- Kelola Kriteria
- Kelola Alternatif
- Input Matriks AHP
- Input Penilaian Alternatif
- Melihat Hasil Perhitungan
- Mengunduh Laporan

---

# 5. KRITERIA PENILAIAN

| Kode | Kriteria | Jenis |
|--------|--------|--------|
| C1 | Lokasi | Cost |
| C2 | Fasilitas | Benefit |
| C3 | Uang Saku | Benefit |
| C4 | Pengalaman Kerja | Benefit |
| C5 | Peluang Direkrut | Benefit |

---

# 6. ALTERNATIF

| Kode | Nama |
|--------|--------|
| A1 | PT Telkom Indonesia |
| A2 | PT PLN |
| A3 | Bank Mandiri |
| A4 | Diskominfo Kota Bekasi |
| A5 | PT Astra International |

---

# 7. ALUR BISNIS SISTEM

1. Administrator memasukkan data kriteria.
2. Administrator memasukkan data alternatif.
3. Administrator melakukan perbandingan berpasangan antar kriteria.
4. Sistem menghitung bobot menggunakan AHP.
5. Administrator menginput nilai alternatif.
6. Sistem melakukan normalisasi SAW.
7. Sistem melakukan pembobotan menggunakan hasil AHP.
8. Sistem menghitung nilai preferensi.
9. Sistem menghasilkan ranking akhir.
10. Sistem menghasilkan laporan.

---

# 8. FITUR SISTEM

## Dashboard
- Total Kriteria
- Total Alternatif
- Ranking Terbaik
- Status Konsistensi AHP

## Manajemen Kriteria
- Tambah Kriteria
- Edit Kriteria
- Hapus Kriteria

## Manajemen Tempat Magang
- Tambah Alternatif
- Edit Alternatif
- Hapus Alternatif

## Matriks AHP
- Input nilai perbandingan berpasangan
- Menampilkan matriks perbandingan

## Hasil Perhitungan AHP
- Matriks Awal
- Matriks Normalisasi
- Priority Vector
- Eigen Value
- Consistency Index (CI)
- Consistency Ratio (CR)

## Penilaian Alternatif
- Input nilai setiap alternatif terhadap setiap kriteria

## Perhitungan SAW
- Matriks Keputusan
- Matriks Normalisasi
- Pembobotan
- Nilai Preferensi

## Ranking
- Ranking Tempat Magang
- Nilai Akhir
- Grafik Ranking

## Laporan
- Export PDF

---

# 9. ARSITEKTUR SISTEM

Frontend → Next.js → Server Actions → Supabase PostgreSQL → Perhitungan AHP & SAW → Hasil Ranking

---

# 10. TECH STACK

## Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn UI

## Backend
- Next.js Server Actions

## Database
- Supabase PostgreSQL

## Hosting
- Vercel

---

# 11. LIBRARY YANG DIGUNAKAN

## Core
- next
- react
- typescript

## Styling
- tailwindcss
- shadcn/ui
- lucide-react

## Database
- @supabase/supabase-js

## Form Validation
- react-hook-form
- zod

## Table
- @tanstack/react-table

## Chart
- recharts

## PDF
- jspdf
- jspdf-autotable

## Utility
- clsx
- date-fns

---

# 12. STRUKTUR DATABASE

## kriteria
id, kode, nama, tipe, created_at

## alternatif
id, kode, nama, alamat, created_at

## matriks_ahp
id, kriteria_1_id, kriteria_2_id, nilai

## penilaian
id, alternatif_id, kriteria_id, nilai

---

# 13. STRUKTUR FOLDER

src/
- app/
- components/
- lib/
- types/
- hooks/

---

# 14. MODUL AHP

- calculatePairwiseMatrix()
- normalizeMatrix()
- calculatePriorityVector()
- calculateEigenValue()
- calculateCI()
- calculateCR()

Output: Bobot Kriteria

---

# 15. MODUL SAW

- normalizeBenefit()
- normalizeCost()
- calculatePreference()
- generateRanking()

Output: Ranking Tempat Magang

---

# 16. KRITERIA KEBERHASILAN

- Semua CRUD berjalan.
- Perhitungan AHP berjalan.
- Consistency Ratio ditampilkan.
- Perhitungan SAW berjalan.
- Ranking ditampilkan.
- Laporan PDF dapat diunduh.
- Aplikasi dapat diakses melalui Vercel.

---

# 17. ROADMAP PENGEMBANGAN

1. Setup Project
2. Setup Supabase
3. CRUD Kriteria
4. CRUD Alternatif
5. Implementasi AHP
6. Implementasi SAW
7. Dashboard dan Grafik
8. Export PDF
9. Deployment Vercel

---

END OF DOCUMENT
