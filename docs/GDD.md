# Tiny Farm Life — GDD ringkas
Tujuan menang: 1.500 koin sebelum akhir Hari 20. Kalah: Hari 20 berakhir tanpa target, atau buntu.
Resolusi internal 480x270, tile 16x16. 1 hari = 4 menit nyata (06:00-24:00). Modal awal 100 koin.
Tanaman: Carrot (10/25, 2 hari), Wheat (15/40, 3 hari), Tomato (25/70, 4 hari), Daisy (5, dekoratif, 2 hari).
Harmony Garden: tetangga baik tumbuh +25%; Daisy di sebelah tanaman: +15% harga jual dan kupu-kupu; level Harmoni 1-3.
Energi maks 100: cangkul 2, tanam 1, siram 1, panen 1.

## Pembaruan Tahap 4
- Lahan hanya bisa dicangkul pada tanah cokelat. Rumput tidak bisa diolah.
- Tanaman tumbuh 1 hari hanya jika disiram. Tahap: benih, tunas, muda, siap panen.
- Aksi pada rumah = tidur: hari berganti, tanaman yang disiram tumbuh, energi pulih penuh.
- (Diganti di Tahap 6) Energi habis sekarang membuat karakter pingsan, lihat bagian Tahap 6.

## Pembaruan Tahap 5
- Toko berupa kios di sebelah kanan rumah. Aksi di kios membuka panel beli benih dan jual hasil panen.
- Harga mengikuti tabel tanaman. Daisy bisa dibeli tetapi hasil panennya tidak dijual.
- Tas (tombol E atau TAS di HP) menampilkan benih, hasil panen, dan koin.

## Pembaruan Tahap 6
- Waktu: 1 hari = 240 detik nyata (06:00-24:00). Jam berhenti saat jeda, toko, atau tas terbuka.
- Suasana: pagi hangat, siang normal, senja jingga, malam biru gelap.
- Tengah malam atau energi 0: karakter pingsan, hari berganti, energi 60%, tanaman yang belum disiram tidak tumbuh. Tidur di rumah: energi 100%.
- Harmony Garden:
  1. Tetangga baik (Carrot-Tomato, Tomato-Wheat): tumbuh 1,5x per hari penyiraman (usulan awal 25% tidak terasa karena waktu tumbuh bulat).
  2. Daisy bersebelahan dengan tanaman lain: hasil panen menjadi "Harmoni" dan harganya +15%. Kupu-kupu muncul.
  3. Level dari jumlah pasangan yang sedang terbentuk: 3 pasangan = Mekar, 6 pasangan = Harmonis. Level 3: rumput lebih hijau, kunang-kunang saat senja, harga jual semua tanaman +5%.
- Menang: koin mencapai 1.500 kapan saja. Kalah: Hari 20 berakhir tanpa target, atau buntu.
- Buntu: koin kurang dari harga benih termurah yang bisa dijual, dan tidak ada benih, hasil panen, atau tanaman yang bisa dijual.

## Pembaruan Tahap 7
- Simpan otomatis ke localStorage: koin, hari, jam, energi, posisi, inventory, kondisi tanaman. Level Harmoni dihitung ulang dari tanaman.
- Simpanan dihapus saat permainan berakhir (menang/kalah).
- Audio sepenuhnya sintetis; efek visual: debu, percikan air, kilau panen dan pertumbuhan, daun jatuh.

## Versi 1.0.0 (Tahap 8)
- Gerbang pagar 2 tile + koreksi sudut gerak. Optimasi gambar dan penghematan baterai saat jeda. Paket itch.io tersedia.
