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
};

// Tulisan lucu yang berganti di bilah loading
const PESAN_LOADING = [
  'Menyiram bibit…', 'Memetik apel…', 'Memberi makan ayam…', 'Menyiapkan keranjang…',
  'Membangunkan Nenek…', 'Menggemburkan tanah…', 'Mencari cacing…', 'Menjemur topi caping…',
];

// Intro komik. Setiap langkah: tampilan panel + kalimat yang dibacakan Justin.
// panel: 1 = ruang keluarga penuh · 2 = layar belah dua (ruang | surat) · 3 = belah tiga (+ jalan & bus)
const INTRO = [
  { panel: 1, s: 'justin', t: 'Pada suatu hari, aku, Ayah, dan Ibu sedang berkumpul di ruang keluarga.' },
  { panel: 1, bunyi: 'bel', s: 'justin', t: 'Tiba-tiba, terdengar suara tukang pos mengantarkan surat. Ibu pun segera mengambilnya.' },
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
