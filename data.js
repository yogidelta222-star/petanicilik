/* =========================================================
   Petani Cilik — data: tokoh, adegan intro, percakapan, level.
   Teks harus sama persis dengan NASKAH.md, karena rekaman suara
   dicari berdasarkan kalimatnya (lihat suara/daftar.js).
   ========================================================= */

const TOKOH = {
  nenek: { nama: 'Nenek', gambar: 'gambar/tokoh/nenek.webp', warna: '#b5562f' },
  justin: { nama: 'Justin', gambar: 'gambar/tokoh/justin.webp', warna: '#2f7fd0' },
  ayah: { nama: 'Ayah', gambar: 'gambar/tokoh/ayah.webp' },
  ibu: { nama: 'Ibu', gambar: 'gambar/tokoh/ibu.webp' },
  pencerita: { nama: 'Pencerita' }, // hanya suara (Kira), tanpa gambar
};

// Tulisan lucu yang berganti di bilah loading
const PESAN_LOADING = [
  'Menyiram bibit…', 'Memetik apel…', 'Memberi makan ayam…', 'Menyiapkan keranjang…',
  'Membangunkan Nenek…', 'Menggemburkan tanah…', 'Mencari cacing…', 'Menjemur topi caping…',
];

// Pembuka di ruang keluarga (dibacakan pencerita, kalimat demi kalimat)
const PEMBUKA = { s: 'pencerita', t: 'Pada suatu hari, Ayah, Ibu, dan Justin sedang duduk bersama di ruang keluarga. Justin terlihat sedang asyik melihat sebuah buku bergambar. Buku tersebut berisi berbagai gambar tanaman yang menarik perhatian Justin. Melihat Justin begitu tertarik, Ayah dan Ibu pun mengajak Justin untuk belajar bersama melalui buku bergambar tersebut. Mereka akan mengenalkan berbagai hal tentang tanaman, mulai dari cara menanam bibit, mengenal pupuk, cara menyiram dan merawat tanaman, hingga mengenal bagian-bagian tanaman serta buah yang sudah matang dan belum matang. Justin pun terlihat semakin bersemangat untuk membuka setiap halaman buku dan belajar bersama Ayah dan Ibu.' };

// Buku bergambar: sampul lalu 5 halaman, selaras dengan Level 1–5.
// gambar = nama gambar di GAMBAR.halaman (gambar.js)
const BUKU = {
  sampul: { judul: 'Mengenal Tanaman', s: 'pencerita', t: 'Ayah dan Ibu mulai membacakan halaman pertama buku bergambar. Yuk, kita ikuti Justin belajar mengenal tanaman!' },
  halaman: [
    { judul: 'Menanam Bibit', ikon: '🌱', gambar: 'bibit', s: 'ibu', t: 'Justin, tahukah kamu bagaimana sebuah tanaman bisa tumbuh? Semuanya berawal dari bibit, lho! Untuk menanamnya, kita perlu menyiapkan tanah terlebih dahulu. Kemudian, buat lubang kecil, masukkan bibit ke dalamnya, dan tutup kembali dengan tanah. Nah, dari bibit kecil inilah tanaman akan mulai tumbuh.' },
    { judul: 'Mengenal Pupuk', ikon: '🍂', gambar: 'pupuk', s: 'ayah', t: 'Justin, agar tanaman tumbuh subur dan sehat, tanaman juga membutuhkan nutrisi. Salah satu caranya adalah dengan memberikan pupuk. Ada pupuk kompos yang dibuat dari daun-daun kering dan sisa bahan alami yang sudah membusuk. Pupuk ini membantu menyuburkan tanah dan memberikan nutrisi bagi tanaman. Wah, ternyata daun kering juga bisa bermanfaat, ya!' },
    { judul: 'Menyiram Tanaman', ikon: '💧', gambar: 'siram', s: 'ibu', t: 'Setelah bibit ditanam, kita tidak boleh lupa merawatnya, Justin. Salah satunya dengan menyiram tanaman secara teratur. Untuk menyiramnya, kita bisa menggunakan teko penyiram tanaman. Caranya mudah, isi teko dengan air, lalu siramkan perlahan ke tanah di sekitar tanaman. Air sangat penting bagi tanaman agar bisa tumbuh dengan baik. Jadi, jangan lupa menyiram tanaman, ya!' },
    { judul: 'Bagian Pohon Apel', ikon: '🌳', gambar: 'pohon', s: 'ayah', t: 'Justin, coba lihat pohon apel ini! Pohon apel memiliki beberapa bagian yang saling membantu agar bisa tumbuh dengan baik. Di bagian bawah ada akar yang menyerap air dan nutrisi dari tanah. Kemudian, ada batang yang menopang pohon agar tetap berdiri tegak. Di sekitar batang tumbuh daun yang membantu pohon membuat makanan. Pohon apel juga memiliki bunga yang nantinya dapat berkembang menjadi buah. Nah, buah inilah yang bisa kita petik dan nikmati ketika sudah matang. Wah, ternyata setiap bagian pohon apel punya kegunaan masing-masing, ya!' },
    { judul: 'Buah Matang & Belum', ikon: '🍎', gambar: 'buah', s: 'ibu', t: 'Nah, Justin, sekarang coba perhatikan kedua buah ini! Warnanya berbeda, ya. Buah yang berwarna merah pada gambar ini sudah matang, sedangkan buah yang berwarna hijau belum matang. Buah yang sudah matang biasanya lebih siap untuk dipanen. Jadi, sebelum memetik buah, kita perlu memperhatikan apakah buah tersebut sudah matang atau belum. Menarik sekali, bukan?' },
  ],
};

// Intro komik setelah buku ditutup. Setiap langkah: tampilan panel + kalimat + tokohnya.
// panel: 1 = ruang keluarga penuh · 2 = layar belah dua (ruang | surat) · 3 = belah tiga (+ jalan & bus)
// bunyiSesudah: bunyi setelah kalimat terakhir · kePintu: Ayah berjalan ke pintu
const INTRO = [
  { panel: 1, s: 'pencerita', t: 'Setelah Ayah dan Ibu selesai menjelaskan isi buku bergambar, Justin kembali memperhatikan setiap gambar yang ada di dalam buku tersebut. Ia melihat kembali gambar bibit, pupuk, cara menyiram tanaman, bagian-bagian pohon apel, hingga buah yang sudah matang dan belum matang. Justin tampak senang karena sekarang ia sudah mengetahui banyak hal tentang tanaman. Saat Justin masih asyik melihat-lihat gambar tersebut bersama Ayah dan Ibu, tiba-tiba terdengar suara bel rumah berbunyi.', bunyiSesudah: 'bel' },
  { panel: 1, s: 'ibu', t: 'Sepertinya ada yang datang, Yah. Coba lihat dulu.' },
  { panel: 1, s: 'pencerita', t: 'Ayah pun membuka pintu. Seorang tukang pos datang mengantarkan sebuah surat.', kePintu: true },
  { panel: 2, s: 'justin', t: 'Ternyata, surat itu dari Nenek!' },
  { panel: 2, s: 'justin', t: 'Nenek mengundang kami berkunjung ke pertaniannya, sekaligus menghabiskan waktu liburan bersama di sana.' },
  { panel: 3, s: 'justin', t: 'Kemudian, kami pergi naik bus ke pertanian Nenek.' },
];

// Percakapan setelah tiba di kebun Nenek
const PERCAKAPAN = [
  { s: 'nenek', t: 'Oh, Justin! Akhirnya kamu datang juga. Bagaimana perjalananmu bersama Ibu dan Ayah?' },
  { s: 'justin', t: 'Perjalanan kami menyenangkan, Nek! Aku senang sekali bisa berlibur di sini.' },
  { s: 'nenek', t: 'Nenek juga senang kalian datang. Kebetulan, Nenek ingin menanam pohon apel di pertanian ini. Bagaimana kalau kamu membantu Nenek menanamnya?' },
  { s: 'justin', t: 'Tentu saja, Nek! Aku mau membantu. Apa yang harus aku lakukan?' },
  { s: 'nenek', t: 'Ayo, kita siapkan bibit dan mulai menanam bersama!' },
];

// Lima level permainan (isi permainannya menyusul)
const LEVEL = [
  { no: 1, nama: 'Menanam Bibit', ikon: '🌱' },
  { no: 2, nama: 'Memilih Pupuk', ikon: '🧺' },
  { no: 3, nama: 'Puzzle Teko', ikon: '🚿' },
  { no: 4, nama: 'Bagian Tanaman', ikon: '🌳' },
  { no: 5, nama: 'Memanen Apel', ikon: '🍎' },
];

// Kalimat tiap permainan (sama persis dengan NASKAH.md bagian D–I)
const NASKAH_LEVEL = {
  1: {
    buka: [{ s: 'nenek', t: 'Ayo, masukkan bibit ke dalam lubang, dan hitunglah bibitnya!' }],
    hitung: ['Satu!', 'Dua!', 'Tiga!', 'Empat!', 'Lima!'],
    selesai: [{ s: 'justin', t: 'Hore, bibitnya sudah berhasil ditanam!' }],
  },
  2: {
    buka: [{ s: 'nenek', t: 'Ayo, pilih pupuk mana yang digunakan untuk tanaman ini. Manakah pupuk untuk tanaman?' }],
    pakan: { s: 'nenek', t: 'Hmm, itu pakan ayam. Coba pilih yang lain, ya!' },
    tepung: { s: 'nenek', t: 'Hmm, itu tepung. Coba pilih yang lain, ya!' },
    benar: { s: 'nenek', t: 'Betul sekali! Itu pupuk untuk tanaman.' },
    selesai: [{ s: 'justin', t: 'Hore, pupuk yang tepat sudah berhasil dipilih! Yuk, lanjut ke level berikutnya!' }],
  },
  3: {
    buka: [
      { s: 'nenek', t: 'Wah, pintar sekali! Bibit sudah ditanam, dan pupuk juga sudah dipilih.' },
      { s: 'nenek', t: 'Sekarang, tanaman perlu disiram agar bisa tumbuh dengan baik. Tapi, teko penyiraman Nenek belum tersusun.' },
      { s: 'nenek', t: 'Yuk, bantu Nenek menyusun puzzle teko penyiraman terlebih dahulu!' },
    ],
    selesai: [{ s: 'justin', t: 'Hore, teko penyiraman sudah tersusun! Yuk, lanjut ke level berikutnya!' }],
  },
  4: {
    buka: [
      { s: 'nenek', t: 'Wah, tanaman di kebun sudah mulai tumbuh! Yuk, kita kenali bagian-bagian tanaman.' },
      { s: 'nenek', t: 'Ada akar, batang, daun, bunga, dan buah. Cocokkan gambarnya dengan tempat yang benar, ya!' },
    ],
    bagian: { akar: 'Ini akar.', batang: 'Ini batang.', daun: 'Ini daun.', bunga: 'Ini bunga.', buah: 'Ini buah.' },
    salah: { s: 'nenek', t: 'Hmm, belum tepat. Coba tempat yang lain, ya!' },
    selesai: [{ s: 'justin', t: 'Hore, hebat sekali! Yuk, lanjutkan petualangan kita!' }],
  },
  5: {
    buka: [
      { s: 'nenek', t: 'Wah, tanaman di kebun sudah tumbuh dengan baik, dan sekarang buahnya mulai bermunculan!' },
      { s: 'nenek', t: 'Tapi, tidak semua buah sudah siap dipanen. Yuk, bantu Nenek mencari dan memetik buah yang sudah matang. Masukkan ke dalam keranjang, ya!' },
    ],
    matang: { s: 'justin', t: 'Apel ini sudah matang!' },
    hijau: { s: 'nenek', t: 'Apel itu masih hijau, belum matang. Cari apel yang merah, ya!' },
    selesai: [
      { s: 'nenek', t: 'Horeee! Semua buah yang matang berhasil dipanen! Wah, keranjang kita sudah penuh dengan buah-buahan segar.' },
      { s: 'nenek', t: 'Terima kasih sudah membantu Nenek merawat kebun.' },
    ],
  },
};

// Penutup: percakapan terakhir Nenek dan Justin
const PENUTUP = [
  { s: 'nenek', t: 'Wah, Justin! Terima kasih sudah membantu Nenek hari ini. Lihatlah, bibit sudah ditanam, tanaman sudah dirawat, dan buah juga berhasil dipanen.' },
  { s: 'nenek', t: 'Nenek senang sekali kamu mau belajar dan membantu Nenek di pertanian!' },
  { s: 'justin', t: 'Aku juga senang sekali, Nek! Hari ini aku belajar banyak hal.' },
  { s: 'justin', t: 'Aku jadi tahu cara menanam bibit, memilih pupuk, mengenal bagian-bagian tanaman, dan memanen buah.' },
  { s: 'nenek', t: 'Wah, pintar sekali cucu Nenek! Nah, sekarang mari kita nikmati hasil panen bersama.' },
  { s: 'nenek', t: 'Terima kasih sudah menjadi petani cilik yang hebat!' },
  { s: 'justin', t: 'Horeee! Petualangan di pertanian Nenek sangat menyenangkan! Sampai jumpa lagi!' },
];

const UCAPAN = {
  putarHP: { s: 'nenek', t: 'Putar HP-mu ke posisi tidur, ya!' },
  levelBaru: { s: 'justin', t: 'Hore, level baru!' },
  mulai: { s: 'nenek', t: 'Ayo, kita mulai!' },
};
