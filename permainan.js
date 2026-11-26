/* =========================================================
   Petani Cilik — isi permainan Level 1–5.
   Setiap level menerima "alat" dari app.js (arena, bicara, seret, bunyi, …)
   dan mengembalikan janji (Promise) yang selesai saat anak menyelesaikan level.
   Semua posisi memakai piksel panggung 1600 × 900.
   ========================================================= */
const buat = (induk, html) => { induk.insertAdjacentHTML('beforeend', html); return induk.lastElementChild; };
const acak = (daftar) => { const a = [...daftar]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const goyang = (el) => el.animate([{ rotate: '0deg' }, { rotate: '-9deg' }, { rotate: '8deg' }, { rotate: '-5deg' }, { rotate: '0deg' }], { duration: 450, easing: 'ease-in-out' });
let tumpukan = 20; // agar benda yang sedang dipegang selalu paling depan

const PERMAINAN = {
  // ---------- LEVEL 1: geser biji ke lubang; tiap biji masuk muncul angka & Justin menghitung ----------
  1(a) {
    return new Promise((selesai) => {
      const L = a.arena;
      buat(L, '<div class="nampan"></div>');
      buat(L, '<div class="bedeng"></div>');
      const LUBANG = [330, 580, 830, 1080, 1330].map((x) => ({ x, y: 650, isi: false }));
      LUBANG.forEach((h) => {
        h.el = buat(L, `<div class="lubang" style="left:${h.x}px;top:${h.y}px"><div class="tunas-kecil">${GAMBAR.tunas()}</div><div class="gundukan"></div></div>`);
      });
      let jumlah = 0;
      for (let i = 0; i < 5; i++) {
        const bx = 620 + i * 90, by = 250; // titik tengah biji di nampan
        const b = buat(L, `<div class="biji" style="left:${bx - 35}px;top:${by - 40}px" aria-label="Biji apel">${GAMBAR.biji()}</div>`);
        a.seret(b, {
          mulai: () => { b.style.zIndex = ++tumpukan; },
          lepas: async (p, dx, dy) => {
            const cx = bx + dx, cy = by + dy;
            const dekat = LUBANG.filter((l) => !l.isi).map((l) => ({ l, d: Math.hypot(l.x - cx, l.y - cy) })).sort((u, v) => u.d - v.d)[0];
            if (!dekat || dekat.d > 150) { a.geser(b, 0, 0); return; }
            // Biji masuk lubang, tertutup tanah, angka muncul, Justin menghitung
            const h = dekat.l;
            h.isi = true;
            b.dataset.kunci = 1;
            a.geser(b, h.x - bx, h.y - by - 8);
            b.classList.add('masuk');
            setTimeout(() => b.remove(), 900);
            h.el.classList.add('terisi');
            jumlah++;
            a.Bunyi.tanam();
            buat(L, `<div class="angka-gelembung" style="left:${h.x}px;top:${h.y - 225}px">${jumlah}</div>`);
            const n = jumlah;
            const ucapan = a.bicara({ s: 'justin', t: a.naskah.hitung[n - 1] });
            if (n === 5) {
              await ucapan;
              await a.tunggu(300);
              L.classList.add('tumbuh'); // semua bibit bertunas
              a.Bunyi.pas();
              await a.tunggu(1100);
              selesai();
            }
          },
        });
      }
    });
  },

  // ---------- LEVEL 2: pilih karung pupuk (bergambar tanaman) ----------
  2(a) {
    return new Promise((selesai) => {
      const L = a.arena;
      const petak = buat(L, `<div class="petak">${[0, 1, 2, 3, 4].map((i) => `<div class="tunas-petak" style="left:${28 + i * 96}px">${GAMBAR.tunas()}</div>`).join('')}</div>`);
      const LABEL = { pupuk: 'Karung bergambar tanaman', pakan: 'Karung bergambar ayam', tepung: 'Karung bergambar gandum' };
      let beres = false;
      acak(['pupuk', 'pakan', 'tepung']).forEach((j, i) => {
        const cx = 450 + i * 350;
        const k = buat(L, `<button class="karung" style="left:${cx - 135}px" aria-label="${LABEL[j]}">${GAMBAR.karung(j)}</button>`);
        k.onclick = async () => {
          if (beres) return;
          if (j !== 'pupuk') { a.Bunyi.salah(); goyang(k); a.bicara(a.naskah[j]); return; }
          beres = true;
          a.Bunyi.pas();
          k.classList.add('benar');
          L.querySelectorAll('.karung').forEach((x) => { if (x !== k) x.classList.add('pudar'); });
          // Butiran pupuk ditaburkan ke tunas, lalu tunas tumbuh subur
          for (let n = 0; n < 26; n++) {
            const btr = buat(L, `<i class="butir" style="left:${cx}px;top:470px"></i>`);
            const tx = 590 + Math.random() * 420, ty = 650 + Math.random() * 40;
            btr.animate([{ translate: '0 0', opacity: 1 }, { translate: `${(tx - cx) * 0.5}px -120px`, offset: 0.4 }, { translate: `${tx - cx}px ${ty - 470}px`, opacity: 1 }],
              { duration: 900 + Math.random() * 300, delay: n * 35, easing: 'ease-in', fill: 'forwards' }).finished.then(() => btr.remove());
          }
          setTimeout(() => petak.classList.add('subur'), 1100);
          await a.tunggu(600);
          await a.bicara(a.naskah.benar);
          selesai();
        };
      });
    });
  },

  // ---------- LEVEL 3: puzzle teko penyiram 6 potong (tiap potongan berbentuk beda) ----------
  3(a) {
    return new Promise((selesai) => {
      const L = a.arena;
      const BX = 500, BY = 188; // papan 600 × 450
      // Batas potongan sengaja tidak lurus & tidak sama, jadi tiap potongan hanya cocok di satu tempat
      const KEPING = [
        [[0, 0], [200, 0], [210, 80], [170, 110], [175, 150], [215, 170], [200, 250], [150, 240], [130, 205], [90, 205], [70, 240], [0, 240]],
        [[200, 0], [400, 0], [390, 90], [430, 100], [440, 140], [405, 155], [400, 250], [340, 255], [320, 295], [280, 295], [260, 255], [200, 250], [215, 170], [175, 150], [170, 110], [210, 80]],
        [[400, 0], [600, 0], [600, 250], [550, 230], [500, 270], [450, 230], [400, 250], [405, 155], [440, 140], [430, 100], [390, 90]],
        [[0, 240], [70, 240], [90, 205], [130, 205], [150, 240], [200, 250], [190, 320], [235, 345], [230, 385], [195, 400], [200, 450], [0, 450]],
        [[200, 250], [260, 255], [280, 295], [320, 295], [340, 255], [400, 250], [420, 330], [370, 350], [365, 390], [410, 400], [400, 450], [200, 450], [195, 400], [230, 385], [235, 345], [190, 320]],
        [[400, 250], [450, 230], [500, 270], [550, 230], [600, 250], [600, 450], [400, 450], [410, 400], [365, 390], [370, 350], [420, 330]],
      ];
      buat(L, `<div class="papan" style="left:${BX}px;top:${BY}px">${GAMBAR.teko(true)}
        <svg class="garis-keping" viewBox="0 0 600 450">${KEPING.map((k) => `<polygon points="${k.map((t) => t.join(',')).join(' ')}"/>`).join('')}</svg></div>`);
      const SEBAR = acak([[330, 290], [330, 600], [1270, 290], [1270, 600], [660, 755], [960, 755]]);
      const tekoPenuh = GAMBAR.teko();
      let terpasang = 0;
      KEPING.forEach((poli, i) => {
        const cx = poli.reduce((s, t) => s + t[0], 0) / poli.length;
        const cy = poli.reduce((s, t) => s + t[1], 0) / poli.length;
        const w = buat(L, `<div class="keping" style="left:${BX}px;top:${BY}px;transform-origin:${cx}px ${cy}px">
          <div class="isi-keping" style="clip-path:polygon(${poli.map(([x, y]) => `${x}px ${y}px`).join(',')})">${tekoPenuh}</div></div>`);
        const ax = SEBAR[i][0] - (BX + cx), ay = SEBAR[i][1] - (BY + cy);
        a.geser(w, ax, ay);
        a.seret(w, {
          pegangan: w.firstElementChild,
          mulai: () => { w.style.zIndex = ++tumpukan; w.classList.add('angkat'); },
          lepas: (p, dx, dy) => {
            w.classList.remove('angkat');
            if (Math.hypot(dx, dy) > 75) { a.geser(w, ax, ay); return; }
            a.geser(w, 0, 0);
            w.dataset.kunci = 1;
            w.classList.add('pas');
            a.Bunyi.pas();
            if (++terpasang === 6) menang();
          },
        });
      });

      async function menang() {
        await a.tunggu(500);
        // Teko utuh terangkat, miring, lalu menyiram
        const t = buat(L, `<div class="teko-jadi" style="left:${BX}px;top:${BY}px">${tekoPenuh}</div>`);
        L.querySelectorAll('.keping, .papan').forEach((x) => x.classList.add('hilang'));
        await t.animate([{ translate: '0 0', rotate: '0deg' }, { translate: '0 -60px', rotate: '0deg', offset: 0.4 }, { translate: '0 -60px', rotate: '-25deg' }],
          { duration: 1100, easing: 'ease-in-out', fill: 'forwards' }).finished;
        a.Bunyi.air();
        for (let n = 0; n < 18; n++) {
          const d = buat(L, `<div class="tetes" style="left:${BX + 40 + Math.random() * 40}px;top:${BY + 180}px">${GAMBAR.tetes()}</div>`);
          d.animate([{ translate: '0 0', opacity: 1 }, { translate: `${-30 + Math.random() * 40}px ${300 + Math.random() * 120}px`, opacity: 0 }],
            { duration: 800, delay: n * 70, easing: 'ease-in', fill: 'forwards' }).finished.then(() => d.remove());
        }
        await a.tunggu(1600);
        selesai();
      }
    });
  },

  // ---------- LEVEL 4: cocokkan akar, batang, daun, bunga, buah ke sketsa pohon ----------
  4(a) {
    return new Promise((selesai) => {
      const L = a.arena;
      // Sketsa 640 × 720 ditampilkan 560 × 630 di (300, 150) → skala 0,875
      const SX = 300, SY = 150, SK = 0.875;
      const keStage = (x, y) => [SX + x * SK, SY + y * SK];
      buat(L, `<div class="sketsa" style="left:${SX}px;top:${SY}px">${GAMBAR.sketsaPohon()}</div>`);
      // Kepingan berbentuk persis bagian sketsanya; titik tengah kepingan = titik tengah tempatnya di sketsa
      const pusat = (id) => { const [x, y, w, h] = GAMBAR.keping[id].kotak; return keStage(x + w / 2, y + h / 2); };
      const ZONA = Object.fromEntries(['akar', 'batang', 'daun', 'bunga', 'buah'].map((id) => [id, pusat(id)]));
      // Lingkaran "?" daun di bagian atas tajuk, agar tidak bertumpuk dengan lingkaran buah
      const TANDA = { ...ZONA, daun: keStage(300, 150) };
      const BATAS = { daun: 170, batang: 100, akar: 100, bunga: 90, buah: 90 }; // seberapa dekat boleh dilepas
      const NAMA = { akar: 'Akar', batang: 'Batang', daun: 'Daun', bunga: 'Bunga', buah: 'Buah' };
      const zonaEl = {};
      Object.entries(TANDA).forEach(([id, [x, y]]) => { zonaEl[id] = buat(L, `<div class="zona" style="left:${x}px;top:${y}px"></div>`); });
      // Tempat awal kepingan di kanan: tajuk daun di atas, empat kepingan kecil diacak di bawahnya
      const TEMPAT = { daun: [1200, 330] };
      acak([[1010, 640], [1160, 640], [1300, 620], [1090, 790], [1250, 790]]).slice(0, 4)
        .forEach((t, i) => { TEMPAT[['akar', 'batang', 'bunga', 'buah'][i]] = t; });
      let benar = 0;
      Object.keys(ZONA).forEach((id) => {
        const [kx, ky] = TEMPAT[id]; // titik tengah kepingan
        const [, , w, h] = GAMBAR.keping[id].kotak;
        const lw = w * SK, lh = h * SK;
        const k = buat(L, `<div class="keping-bagian ${id}" style="left:${kx - lw / 2}px;top:${ky - lh / 2}px;width:${lw}px;height:${lh}px">
          <div class="gbr">${GAMBAR.gambarKeping(id)}</div><b>${NAMA[id]}</b></div>`);
        a.seret(k, {
          mulai: () => { k.style.zIndex = ++tumpukan; },
          lepas: (p, dx, dy) => {
            const cx = kx + dx, cy = ky + dy;
            const kena = Object.keys(ZONA).filter((z) => !zonaEl[z].classList.contains('terisi'))
              .map((z) => ({ z, d: Math.hypot(ZONA[z][0] - cx, ZONA[z][1] - cy) - (z === id ? 25 : 0) }))
              .sort((u, v) => u.d - v.d)[0];
            if (!kena || kena.d > BATAS[kena.z]) { a.geser(k, 0, 0); return; }
            if (kena.z !== id) { a.Bunyi.salah(); a.geser(k, 0, 0); a.bicara(a.naskah.salah); return; }
            a.geser(k, ZONA[id][0] - kx, ZONA[id][1] - ky);
            k.dataset.kunci = 1;
            k.classList.add('terpasang');
            k.style.zIndex = id === 'daun' ? 2 : 4; // tajuk di bawah bunga & buah
            zonaEl[id].classList.add('terisi');
            a.Bunyi.pas();
            const ucapan = a.bicara({ s: 'nenek', t: a.naskah.bagian[id] });
            if (++benar === 5) ucapan.then(async () => { await a.tunggu(400); selesai(); });
          },
        });
      });
    });
  },

  // ---------- LEVEL 5: petik apel merah ke keranjang; apel hijau belum matang ----------
  5(a) {
    return new Promise((selesai) => {
      const L = a.arena;
      const PX = 250, PY = 110, PS = 0.95; // pohon 900 × 760 diperkecil
      buat(L, `<div class="pohon" style="left:${PX}px;top:${PY}px">${GAMBAR.pohon()}</div>`);
      const KX = 1080, KY = 600; // keranjang 340 × 260
      buat(L, `<div class="kb-belakang" style="left:${KX}px;top:${KY}px">${GAMBAR.keranjangBelakang()}</div>`);
      buat(L, `<div class="kb-depan" style="left:${KX}px;top:${KY}px">${GAMBAR.keranjangDepan()}</div>`);
      const TITIK = [[220, 200], [340, 110], [480, 80], [610, 140], [720, 250], [290, 330], [500, 250], [630, 360]];
      const WARNA = acak(['merah', 'merah', 'merah', 'merah', 'merah', 'hijau', 'hijau', 'hijau']);
      const SLOT = [[80, 70], [170, 62], [260, 70], [125, 40], [215, 40]].map(([x, y]) => [KX + x, KY + y]);
      let panen = 0;
      TITIK.forEach(([tx, ty], i) => {
        const x = PX + tx * PS, y = PY + ty * PS, w = WARNA[i];
        const ap = buat(L, `<div class="apel ${w}" style="left:${x - 45}px;top:${y - 45}px" aria-label="Apel ${w}">${GAMBAR.apel(w)}</div>`);
        if (w === 'hijau') {
          ap.addEventListener('pointerdown', () => { a.Bunyi.salah(); goyang(ap); a.bicara(a.naskah.hijau); });
          return;
        }
        a.seret(ap, {
          mulai: () => { ap.style.zIndex = ++tumpukan; a.Bunyi.petik(); },
          lepas: (p, dx, dy) => {
            const cx = x + dx, cy = y + dy;
            const diKeranjang = cx > KX - 30 && cx < KX + 370 && cy > KY - 90 && cy < KY + 260;
            if (!diKeranjang) { a.geser(ap, 0, 0); return; }
            const [sx, sy] = SLOT[panen];
            a.geser(ap, sx - x, sy - y);
            ap.dataset.kunci = 1;
            ap.classList.add('dipanen');
            ap.style.zIndex = '';
            a.Bunyi.pas();
            const ucapan = a.bicara(a.naskah.matang);
            if (++panen === 5) ucapan.then(async () => { await a.tunggu(300); selesai(); });
          },
        });
      });
    });
  },
};
