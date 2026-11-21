# Prompt Gambar Petani Cilik (ElevenLabs Image)

Game ini **landscape**: semua gambar adegan 16:9. Sisa kredit per 20 Nov 2026: 23.476 — **sisihkan ± 10.000 untuk suara** (hanya bisa sampai 6 Desember).

## Pengaturan sebelum Generate (supaya hemat)

Di kotak pembuat gambar ElevenLabs (**Image & Video → Image**):

| Pengaturan | Pilih | Keterangan |
|---|---|---|
| Model | **Seedream 5.5** | |
| Ukuran | **16:9** untuk tokoh & adegan · **1:1** untuk benda | |
| Resolusi | **2K** untuk tokoh & adegan · **1K** untuk benda | Benda kecil cukup 1K, lebih hemat |
| Jumlah (ikon tumpukan) | **1** atau **2**, jangan 4 | 4 = bayar 4 gambar sekaligus |
| Image refs | **Kosong** untuk Langkah 1 · **unggah gambar tokoh** untuk Langkah 2 | Agar wajah & baju tokoh sama |

Sebelum menekan **Generate**, lihat angka kredit di tombolnya.

---

## Langkah 1 — Gambar tokoh (buat paling dulu)

Pengaturan: **16:9 · 2K · jumlah 1–2 · tanpa Image refs**.

Salin prompt ini:

```
Character model sheet of an Indonesian family for a children's farming game, four characters standing side by side in full body, front view, evenly spaced, on a plain pure white background, no text.
From left to right:
1) JUSTIN, a cheerful Indonesian boy about 6 years old, short neat black hair, round face with rosy cheeks, big brown eyes, light tan skin, wearing a yellow t-shirt with a small green leaf print, blue denim overall shorts, white socks and red sneakers, smiling.
2) GRANDMA, a warm Indonesian grandmother about 65 years old, grey hair in a small bun, round glasses, gentle smile with smile lines, wearing a wide straw gardening hat with a green ribbon, a light green long-sleeve blouse, a brown batik long skirt, a cream apron with a front pocket, brown sandals.
3) FATHER, a friendly Indonesian man about 35 years old, short black hair, clean-shaven, wearing a blue checkered short-sleeve shirt and khaki trousers, brown shoes.
4) MOTHER, a kind Indonesian woman about 32 years old, shoulder-length wavy black hair tied back with a small pink hair clip, wearing a light pink long-sleeve blouse and a long navy skirt, flat shoes, gentle smile.
Bright 2D cartoon illustration, children's picture book style, clean bold outlines, soft cel shading, vibrant cheerful colors, friendly rounded proportions, consistent style.
```

**Cek hasilnya:** keempat tokoh terlihat utuh dari kepala sampai kaki, tidak ada yang terpotong, latar putih polos, dan tidak ada tulisan. Kalau sudah bagus, **unduh dan kirim ke saya** sebelum lanjut.

---

## Langkah 2 — Gambar adegan (TANPA ORANG)

Tokoh (gambar pilihan klien, di gambar/tokoh/) ditempel di atas latar oleh kode — JANGAN dimasukkan ke Image refs karena ElevenLabs akan menggambar ulang wajahnya — jadi **semua latar dibuat tanpa orang** dan **tanpa foto berwajah** (agar tidak bergantung pada wajah tokoh). Pengaturan: **16:9 · 2K · jumlah 1 · tongkat ajaib Off**.

### 2a. Ruang keluarga — bingkai diganti lukisan
Image refs: **gambar ruang keluarga kosong** yang sudah dibuat.
```
The same empty living room as @Image 1, exactly the same furniture, colors, lighting and layout, no people. Replace the two framed photos on the wall with a framed painting of sunflowers and a framed painting of green hills with an apple tree. No faces anywhere, no text.
```

### 2b. Surat dari Nenek (panel kanan layar belah)
```
Close-up of an opened handwritten letter with a small drawing of a red apple and a little flower on it, lying on a wooden table next to its envelope with a stamp, a small pot of flowers beside it, warm afternoon light. No people, no hands, no faces, no readable text on the letter, only wavy lines.
Bright 2D cartoon illustration, children's picture book style, clean bold outlines, soft cel shading, vibrant cheerful colors.
```

### 2c. Bus menuju kebun — dibuat TERPISAH agar bus bisa dianimasikan (berjalan, memantul, roda berputar)

**Jalan desa tanpa bus** (16:9 · 2K):
```
A winding country road running from left to right through green hills and rice fields, a farm with a red-roofed wooden farmhouse and apple trees in the far distance, fluffy clouds and a blue sky. No vehicles, no people, no text.
Bright 2D cartoon illustration, children's picture book style, clean bold outlines, soft cel shading, vibrant cheerful colors.
```

**Bus saja** (1:1 · 1K, latar putih — nanti dihapus):
```
A cheerful light-blue and yellow minibus, side view facing right, with round wheels clearly visible, windows empty, isolated on a plain pure white background, no people, no text.
Bright 2D cartoon illustration, children's picture book style, clean bold outlines, soft cel shading, vibrant cheerful colors.
```

### 2d. Kebun Nenek (latar percakapan & peta level)
```
Wide view of Grandma's sunny fruit farm: a dirt path winding through green grass, a wooden farmhouse with a red roof, several young apple trees and some apple trees with red apples, a vegetable patch with brown soil rows, a small chicken coop, a wooden fence, a small pond, sunflowers. Bright daylight, no people, no text.
Bright 2D cartoon illustration, children's game background, clean bold outlines, soft cel shading, vibrant cheerful colors.
```

### 2e. Sampul loading (tokoh ditempel oleh kode)
```
Title screen background for a children's farming game: a sunny apple farm with apple trees full of red apples, a red-roofed farmhouse, a basket of apples, chickens, sunflowers and a blue sky. Leave empty space at the top center for a title logo and open grass in the lower middle for characters to stand. No people, no text.
Bright 2D cartoon illustration, children's picture book style, clean bold outlines, soft cel shading, vibrant cheerful colors.
```

---

## Langkah 3 — Benda untuk permainan

Pengaturan: **1:1 · 1K · jumlah 1 · tanpa Image refs**. Latar putihnya nanti saya hapus.

Tambahkan kalimat ini **di akhir setiap prompt** di tabel:
`isolated on a plain pure white background, no text, bright 2D cartoon game icon, clean bold outlines, soft cel shading`

| No | Untuk | Prompt |
|---|---|---|
| 1 | Level 1 – biji apel | `a small brown apple seed, cute and shiny` |
| 2 | Level 1 – tanah | `a patch of brown garden soil seen from slightly above, with five round empty planting holes in a row` |
| 3 | Level 2 – pupuk (jawaban benar) | `a burlap sack of plant fertilizer with a big green plant sprout picture printed on it` |
| 4 | Level 2 – pakan ayam | `a burlap sack of chicken feed with a cute chicken picture printed on it` |
| 5 | Level 2 – tepung | `a white paper sack of flour with a bowl of flour picture printed on it` |
| 6 | Level 3 – teko | `a green metal garden watering can with a long spout, side view, simple and clear shape` |
| 7 | Level 4 – pohon apel | `a young apple tree showing roots under the ground, a brown trunk, green leaves, white apple blossoms and red apples, clear and simple, educational` |
| 8 | Level 5 – apel matang | `one shiny ripe red apple with a leaf` |
| 9 | Level 5 – apel mentah | `one small unripe green apple with a leaf` |
| 10 | Level 5 – keranjang | `an empty woven wicker basket` |

---

## Urutan kerja

1. Langkah 1 → kirim ke saya untuk dicek.
2. Langkah 2 (5 gambar adegan) → kirim.
3. Langkah 3 (10 benda) → kirim.
4. Saya menghapus latar, memotong tokoh, dan memasang semuanya ke game.
