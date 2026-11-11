# Panduan rilis di itch.io

Tampilan menu itch.io bisa sedikit berbeda dari panduan ini; ikuti istilah yang paling mirip.

## 1. Siapkan paket
Gunakan file `tiny-farm-life-v1.0.0-itchio.zip`. Di dalamnya `index.html` berada langsung di akar ZIP. Jangan membuat ZIP dari folder induk (itu menaruh index.html di dalam subfolder dan game tidak akan terbuka).

## 2. Buat proyek
1. Masuk ke itch.io, pilih Dashboard > Create new project.
2. Kind of project: **HTML**.
3. Upload ZIP, lalu centang **This file will be played in the browser**.
4. Embed options: ukuran viewport **960 x 540**, aktifkan **Fullscreen button**, aktifkan **Mobile friendly** dengan orientasi **Landscape**. Biarkan scrollbars mati.
5. Pricing: Free (atau sesuai keinginan). Visibility: **Draft** dulu.

## 3. Uji sebelum publik
Buka halaman draft lewat tautan pratinjau di PC dan di HP. Jalankan `docs/UJI_PERANGKAT.md`. Baru setelah semua baik, ubah ke Public.

## 4. Teks halaman (salin dan sesuaikan)
**Judul:** Tiny Farm Life
**Tagline:** Grow Small. Dream Big.

**Deskripsi (Indonesia):**
Kamu mewarisi sebuah lahan kecil yang lama terbengkalai. Cangkul tanahnya, tanam benih, siram setiap hari, panen, lalu jual hasilnya di kios. Atur tanaman berpasangan untuk menciptakan Harmony Garden: kebun yang tumbuh lebih cepat, menarik kupu-kupu, dan bercahaya dengan kunang-kunang saat senja.
Tujuanmu: kumpulkan 1.500 koin sebelum Hari 20 berakhir. Jaga energimu, atur waktumu, dan jangan sampai kehabisan modal!

**Description (English):**
You inherit a tiny, long-neglected patch of land. Till the soil, plant seeds, water them every day, harvest, and sell your crops at the market stall. Plant crops in smart pairs to grow a Harmony Garden: faster growth, butterflies by day and fireflies at dusk.
Your goal: earn 1,500 coins before Day 20 ends. Manage your energy and your time, and don't run out of money!

**Kontrol / Controls:**
PC: WASD or arrows to move, Space/Enter/click to act, 1-6 or mouse wheel to change tool, E for bag, Esc to pause.
Mobile (landscape): left-side joystick, ACT / TOOL / BAG buttons on the right.

**Genre:** Simulation. **Tags:** farming, pixel-art, casual, relaxing, 2d, singleplayer, top-down, indie, cozy. **Platform:** Web (HTML5), mobile friendly.

## 5. Gambar
- Cover: minimal 315x250 (disarankan 630x500). Ambil tangkapan layar kebun saat senja.
- 3-5 tangkapan layar: kebun penuh, toko, malam hari, Harmoni level 3, layar menang.
- GIF pendek (5-10 detik) saat panen dan tidur.

## 6. Setelah rilis
- Aktifkan komentar, dan baca masukan pemain: bagian mana yang membingungkan.
- Untuk memperbarui: upload ZIP baru pada proyek yang sama (nomor versi tampil di menu game).
- Pilih lisensi untuk kode sebelum membagikannya (misalnya MIT). Semua aset dibuat sendiri, jadi atribusi hanya untuk Anda (lihat docs/CREDITS.md).
