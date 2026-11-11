# Catatan perubahan Tiny Farm Life

## Tahap 1 — Rancangan
- Menetapkan GDD: menang 1.500 koin sebelum akhir Hari 20, kalah bila waktu habis atau buntu.
- Tanaman Carrot, Wheat, Tomato, plus Daisy untuk mekanisme Harmony Garden.
- Struktur folder modular (ES modules), resolusi internal 480x270, tile 16x16.
- Sprite digambar lewat kode, audio nanti dibuat sintetis.

## Tahap 2 — Menu, peta, karakter, kamera, HUD
- Main Menu, Pengaturan (FPS), Kredit, Pause.
- Peta 40x30: rumah, jalan setapak, lahan, pagar, kolam beranimasi, pohon.
- Karakter petani beranimasi 4 arah, kamera halus yang berhenti di tepi peta.
- HUD: koin, hari dan jam, energi, hotbar, penunjuk alat, notifikasi.
- Layout landscape, skala bilangan bulat, safe area, layar "putar perangkat", joystick sentuh.

## Tahap 3 — Gerak, tabrakan, interaksi
- Tabrakan dengan air, batang pohon, rumah, pagar, dan tepi peta; karakter meluncur di dinding.
- Penunjuk tile target dan tombol Aksi (Spasi/Enter/F/klik, tombol AKSI di HP).
- Ganti alat: angka, roda mouse, Q, tombol ALAT di HP.

## Tahap 4 — Sistem pertanian
- Cangkul tanah, tanam benih, siram, tanaman tumbuh per hari, panen.
- 4 tahap visual tiap tanaman; tanah dicangkul dan tanah basah berbeda tampilan.
- Inventory dasar (benih awal dan hasil panen), jumlah benih tampil di hotbar.
- Energi mulai berkurang tiap aksi (cangkul 2, lainnya 1).
- Label target menunjukkan status petak (dicangkul, kering/disiram, siap panen).
- Aksi pada rumah = tidur: ganti hari, pulihkan energi.
- Kode baru: Farming.js, Inventory.js, data/crops.js. Diubah: Sprites, World, HUD, Interaction, main, config, items.

## Tahap 5 — Inventory, toko, ekonomi
- Kios toko di peta (sebelah kanan rumah). Aksi di kios membuka panel toko: beli benih, jual satu atau semua hasil panen.
- Panel tas (E atau tombol TAS): daftar benih, hasil panen, dan koin.
- Economy.js mengurus jual-beli dan memastikan koin tidak negatif; Daisy tidak bisa dijual.
- Warna pohon diganti ke hijau tua kebiruan dengan garis tepi gelap agar tidak menyatu dengan rumput.
- Kode baru: Economy.js, Shop.js, InventoryPanel.js. Diubah: Sprites, World, Interaction, main, crops, HTML, CSS.

## Tahap 6 — Waktu, energi, Harmony Garden, menang dan kalah
- Jam berjalan (1 hari = 240 detik), suasana pagi/siang/senja/malam, HUD menampilkan Hari x/20 dan koin x/1500.
- Pingsan saat energi 0 atau tengah malam (energi 60%); tidur di rumah memulihkan energi penuh. Peralihan hari dengan layar memudar.
- Harmony Garden: bonus tetangga baik, hasil Harmoni dari Daisy (+15% harga), level Harmoni 1-3, kupu-kupu, kunang-kunang, bunga liar, rumput lebih hijau.
- Layar Kemenangan dan Game Over (waktu habis atau buntu).
- Kode baru: Harmony.js, TimeSystem.js, Energy.js, Rules.js. Diubah: Farming, Economy, Shop, InventoryPanel, HUD, Sprites, World, main, config, HTML.

## Tahap 7 — Audio, animasi dan efek, penyimpanan
- Audio sintetis (Web Audio API, tanpa file): 14 efek suara (langkah, cangkul, tanam, siram, panen, koin, beli, tidur, pingsan, naik level Harmoni, menang, kalah, klik, kesalahan) dan musik latar acak yang lebih tenang saat malam.
- Pengaturan Musik dan Efek suara (hidup/mati), tersimpan.
- Efek visual: debu tanah saat mencangkul, percikan saat menyiram, kilau dan teks "+1" saat panen, kilau pada tanaman yang tumbuh saat hari baru, daun jatuh di siang hari.
- Animasi ayun alat pada karakter saat bekerja.
- Penyimpanan: simpan otomatis (saat jeda, menutup toko/tas, hari baru, menutup tab), tombol Simpan Game, Lanjutkan, Hapus Simpanan. Penulisan dua langkah dengan cadangan, validasi ketat saat memuat, penanganan data rusak dan penyimpanan penuh.
- Kode baru: Audio.js, Effects.js, Save.js. Diubah: Farming, Player, Menus, Shop, main, HTML.

## Tahap 7, revisi 1 — Efek tanaman tumbuh
- Masalah: saat bangun tidur kamera mengikuti karakter di depan rumah, sehingga lahan ada di tepi bawah layar (tertutup hotbar) dan kilau tidak terlihat. Kilaunya juga hanya titik 1 piksel.
- Perbaikan: kamera menoleh ke tanaman yang tumbuh selama 2,2 detik lalu kembali pelan-pelan; tile yang tumbuh diberi sinar berdenyut (emas bila siap panen) dan bintang yang naik; bunyi chime; notifikasi "N tanaman tumbuh, M siap panen". Kilau panen juga diubah menjadi bintang.
- Diverifikasi dengan tangkapan layar hasil render nyata pada kanvas tiruan.

## Tahap 8 — Optimasi, pengujian akhir, rilis (v1.0.0)
- Gerbang pagar diperlebar menjadi 2 tile, dan ditambah koreksi sudut: karakter yang terhalang tepat di tepi celah digeser otomatis (maks 6 px), sehingga joystick sentuh tidak perlu presisi.
- Optimasi gambar: lapisan rumput/tanah digambar sekali ke kanvas cadangan lalu disalin per frame. Panggilan gambar turun dari sekitar 687 menjadi 126 per frame, dan hasilnya terbukti identik piksel demi piksel (satu-satunya selisih adalah potongan pagar gerbang yang sengaja dibuang).
- Penghematan baterai: saat menu, jeda, toko, atau tas terbuka, gambar diperbarui 30 kali per detik.
- Mengurangi pembuatan array dan teks berulang tiap frame (efek daun, koordinat petak).
- Skala layar: bilangan bulat untuk piksel tajam; bila area lebih kecil dari 480x270 dipakai skala pecahan agar tetap muat. Ukuran area dipantau lewat ResizeObserver (lebih andal saat rotasi dan safe area).
- Tombol Layar penuh di Pengaturan (hanya tampil bila didukung browser).
- Pesan kesalahan tampil di layar (ketuk untuk menutup) agar mudah dilaporkan; peringatan jelas bila index.html dibuka langsung (file://).
- Nomor versi di menu, ikon situs, meta untuk HP.
- Pengujian: skala layar, gerbang dan koreksi sudut (30 jelajah acak, 24.000 langkah), menang, kalah (hari habis dan buntu), pingsan, tengah malam, simpanan rusak, dan regresi semua sistem. Pemeriksaan visual siang/senja/malam dengan Harmoni level 3.
- Paket itch.io dan panduan di docs/ITCHIO.md, daftar uji perangkat di docs/UJI_PERANGKAT.md.

## Perbedaan dari rencana awal (sudah disetujui)
- Mekanisme tidur di rumah ditambahkan lebih awal dari rencana, supaya tanaman bisa diuji tumbuh sebelum sistem waktu (Tahap 6). Setelah Tahap 6 hari juga berganti otomatis.
- Pengurangan energi dimajukan ke Tahap 4. Pingsan dan aturan lengkapnya tetap di Tahap 6.
- Hotbar berisi 6 slot (2 alat dan 4 benih), bukan 9. Slot bertambah bila ada item baru.
- Toko berupa kios di peta, bukan menu terpisah, supaya terasa seperti bagian dunia permainan.
- Bonus tetangga baik diubah dari 25% menjadi 1,5x pertumbuhan per hari penyiraman. Alasannya: dengan waktu tumbuh 2-4 hari bulat, bonus 25% tidak pernah mempercepat panen. Angkanya ada di HARMONY.growthBonus (config.js).
- Aturan "energi habis" diubah dari menolak aksi (Tahap 4) menjadi pingsan, sesuai GDD awal.
- Level Harmoni dihitung dari pasangan yang sedang terbentuk, bukan total sepanjang permainan, sehingga level turun bila tanaman dipanen.
- Simpanan dihapus otomatis saat menang atau kalah (permainan selesai), jadi Lanjutkan hanya untuk permainan yang belum selesai.
- Game Baru saat ada simpanan meminta konfirmasi dua ketukan agar simpanan tidak tertimpa tidak sengaja.
- Musik latar dibuat acak lewat kode (bukan lagu jadi). Bila nanti ingin lagu sungguhan, tambahkan dari sumber bebas lisensi dan catat atribusinya di CREDITS.md.

## Belum dikerjakan
- Tidak ada. Ide pengembangan lanjutan: panduan bermain, tingkat kesulitan, ringkasan akhir hari, cuaca, perluasan lahan, pesanan pelanggan.
