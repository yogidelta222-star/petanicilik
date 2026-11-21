# Petani Cilik — Rancangan Game

Game edukasi PAUD bertema **perkebunan**. Justin (cucu laki-laki kecil) berlibur ke kebun Nenek dan membantu Nenek menanam **apel** dari bibit sampai panen. Berdiri sendiri (tidak terkait Taman Ceria).

- Gaya gambar: **kartun 2D cerah** (garis tegas, warna terang, seperti buku cerita anak). Gambar & suara dibuat di **ElevenLabs** (paket aktif sampai **6 Desember 2026** — semua suara harus direkam sebelum itu).
- **Orientasi: LANDSCAPE (layar tidur).** Semua gambar adegan 16:9; tata letak tiap layar dirancang lebar. HP yang dipegang tegak menampilkan layar "Putar HP-mu ke posisi tidur, ya!" (gambar HP berputar). Di Android, tombol "Ayo Main!" juga masuk layar penuh dan mengunci posisi lanskap (iPhone tidak mendukung kunci ini dari browser).
- Tokoh yang berbicara: **Nenek** dan **Justin**. Ayah dan Ibu hanya tampil di gambar.
- Contoh tampilan dari pemilik proyek: video intro game pertanian (layar komik terbelah, percakapan, layar "Level baru!"). Gaya penyajiannya boleh ditiru, **gambar dan tokohnya buatan sendiri**.

## Urutan layar

1. **Loading** — logo "Petani Cilik", gambar Nenek & Justin di kebun, bilah loading dengan tulisan lucu yang berganti ("Menyiram bibit…", "Memetik apel…"). Sambil loading, gambar dan suara disiapkan.
2. **Intro komik** (dibacakan Justin sebagai pencerita):
   1. Ruang keluarga — Justin berdiri di kiri, Ayah dan Ibu duduk di sofa. Bel tukang pos berbunyi, Ibu mengambil surat.
   2. Layar belah 2 (miring) — kiri: ruang keluarga · kanan: tangan Ibu memegang surat dari Nenek + foto Nenek. Surat berisi undangan berlibur ke kebun Nenek.
   3. Layar belah 3 — ditambah panel bus yang melaju menuju kebun.
   4. Bus tiba di kebun, Nenek menyambut.
3. **Percakapan Nenek – Justin** — keduanya berdiri seluruh badan di kiri & kanan; yang bicara berwarna, yang mendengar abu-abu; gelembung dengan label nama kuning; "Ketuk di mana saja untuk melanjutkan" + tombol "Lewati >>".
4. **Layar "LEVEL 1"** — bintang besar dengan angka level, pita "LEVEL 1" / "LEVEL BARU!", ikon kegiatan berlabel "BARU", imbalan berupa bintang, tombol hijau "Ayo Main!". Muncul juga setiap naik level.
5. **Peta permainan** — jalan setapak di kebun dengan 5 titik level; level berikutnya terbuka setelah level sebelumnya selesai.
6. **Level 1–5**, lalu **Penutup**.

## Naskah intro (dari pemilik proyek)

1. Pada suatu hari Ayah, Ibu, dan Justin berkumpul di ruang keluarga. Tiba-tiba terdengar suara tukang pos mengirimkan surat, lalu Ibu mengambilnya.
2. Setelah dibaca, ternyata surat itu dari Nenek. Nenek mengundang kami berkunjung ke pertaniannya sekaligus menghabiskan waktu liburan bersama di sana.
3. Kemudian kami pergi menggunakan bus ke pertanian Nenek.
4. Percakapan:
   - Nenek: Oh, Justin! Akhirnya kamu datang juga. Bagaimana perjalananmu bersama Ibu dan Ayah?
   - Justin: Perjalanan kami menyenangkan, Nek! Aku senang sekali bisa berlibur di sini.
   - Nenek: Nenek juga senang kalian datang. Kebetulan, Nenek ingin menanam beberapa jenis buah di pertanian ini. Bagaimana kalau kamu membantu Nenek menanamnya?
   - Justin: Tentu saja, Nek! Aku mau membantu. Apa yang harus aku lakukan?
   - Nenek: Ayo, kita siapkan bibit dan mulai menanam bersama!

(Catatan untuk dirapikan: kalimat 1 memakai sudut pandang orang ketiga, kalimat 2–3 memakai "kami" — usul: Justin yang bercerita dari awal. "Beberapa jenis buah" → buahnya apel.)

## Level

| Level | Kegiatan | Keputusan |
|---|---|---|
| 1 – Menanam bibit | Biji apel di atas digeser ke lubang tanah di bawah; tiap biji masuk muncul gelembung angka 1, 2, 3, … | Tanpa pertanyaan "ada berapa" di akhir |
| 2 – Memilih pupuk | Satu soal: **"Manakah pupuk untuk tanaman?"** — 3 karung | Benar: karung bergambar tanaman (pupuk). Salah: karung bergambar ayam (pakan ayam), karung tepung |
| 3 – Puzzle teko | Menyusun teko penyiram dari **6 potongan** | Tiap potongan berbentuk **berbeda** sehingga hanya cocok di satu tempat pada sketsa; tanpa petunjuk tambahan |
| 4 – Bagian tanaman | Mencocokkan gambar akar, batang, daun, bunga, buah ke sketsa pohon apel | Kalimat pembuka diucapkan Nenek (belum ada pembicara di naskah) |
| 5 – Memanen | Mencari apel yang matang (merah) dan memasukkannya ke keranjang; apel hijau ditolak dengan lembut | — |

### Naskah level (dari pemilik proyek)

- **Level 1** — Nenek: Ayo masukkan bibit ke lubang dan hitunglah bibit tersebut. · Justin: Hore, bibitnya sudah berhasil ditanam.
- **Level 2** — Nenek: Ayo pilih pupuk mana yang digunakan untuk tanaman ini. · Justin: Hore, pupuk yang tepat sudah berhasil dipilih, yuk lanjut ke level berikutnya!
- **Level 3** — Nenek: Wah, pintar sekali! Bibit sudah ditanam dan pupuk juga sudah dipilih. Sekarang tanaman perlu disiram agar bisa tumbuh dengan baik. Tapi, teko penyiraman Nenek belum tersusun. Yuk, bantu Nenek menyusun puzzle teko penyiraman terlebih dahulu! · Justin: Hore, teko penyiraman sudah disusun, yuk lanjut ke level berikutnya!
- **Level 4** — Nenek: Wah, tanaman di kebun sudah mulai tumbuh! Yuk, kita kenali bagian-bagian tanaman. Ada akar, batang, daun, bunga, dan buah. · Justin: Hore, hebat sekali! Yuk, lanjutkan petualangan kita!
- **Level 5** — Nenek: Wah, tanaman di kebun sudah tumbuh dengan baik dan sekarang buahnya mulai bermunculan! Tapi, tidak semua buah sudah siap dipanen. Yuk, bantu Nenek mencari dan memetik buah yang sudah matang. Masukkan ke dalam keranjang, ya! · Nenek: Horeee! Semua buah yang matang berhasil dipanen! Wah, keranjang kita sudah penuh dengan buah-buahan segar. Terima kasih sudah membantu Nenek merawat kebun.

## Penutup

- Nenek: Wah, Justin! Terima kasih sudah membantu Nenek hari ini. Lihatlah, bibit sudah ditanam, tanaman sudah dirawat, dan buah juga berhasil dipanen. Nenek senang sekali kamu mau belajar dan membantu Nenek di pertanian!
- Justin: Aku juga senang sekali, Nek! Hari ini aku belajar banyak hal. Aku jadi tahu cara menanam bibit, memilih pupuk, mengenal bagian-bagian tanaman, dan memanen buah.
- Nenek: Wah, pintar sekali cucu Nenek! Nah, sekarang mari kita nikmati hasil panen bersama. Terima kasih sudah menjadi petani cilik yang hebat!
- Justin: Horeee! Petualangan di pertanian Nenek sangat menyenangkan! Sampai jumpa lagi!

## Yang dibuat dengan kode (tanpa gambar)

Lubang tanah, gelembung angka, bintang, pita level, potongan puzzle (dipotong dari gambar teko), konfeti, bilah loading.
