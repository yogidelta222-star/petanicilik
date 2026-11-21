/* =========================================================
   Petani Cilik — logika game
   Alur: Loading → Intro komik → Tiba di kebun → Percakapan → LEVEL 1
   ========================================================= */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const panggung = $('#panggung');
  const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));
  let giliran = 0; // naik setiap pindah layar; proses lama berhenti sendiri
  const masihAktif = (g) => g === giliran;

  // ================= PANGGUNG 16:9 =================
  // Panggung 1600×900 diskalakan agar pas di layar, selalu di tengah.
  function aturSkala() {
    const s = Math.min(innerWidth / 1600, innerHeight / 900);
    panggung.style.position = 'absolute';
    panggung.style.left = '50%';
    panggung.style.top = '50%';
    panggung.style.transform = `translate(-50%, -50%) scale(${s})`;
    // HP dipegang tegak → minta diputar
    const sentuh = matchMedia('(pointer: coarse)').matches;
    $('#putarHP').hidden = !(sentuh && innerHeight > innerWidth);
  }
  addEventListener('resize', aturSkala);
  addEventListener('orientationchange', () => setTimeout(aturSkala, 200));
  aturSkala();

  // ================= SUARA =================
  // Satu pemutar dipakai untuk semua rekaman. Browser HP (terutama browser mini di dalam
  // WhatsApp dan Safari iPhone) hanya mengizinkan pemutar yang pertama kali diputar saat
  // layar disentuh, jadi pemutar ini "dibuka" pada sentuhan pertama lalu dipakai berulang.
  const KLIP = window.KLIP_SUARA || {};
  const HENING = 'data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA';
  const Pemutar = {
    el: new Audio(), terbuka: false, token: 0,
    buka() {
      if (this.terbuka) return;
      this.terbuka = true;
      const e = this.el;
      if (e.src && !e.paused && !e.ended) return;
      e.src = HENING;
      e.play().catch((err) => { if (err && err.name === 'NotAllowedError') this.terbuka = false; });
    },
    putar(url) {
      const tok = ++this.token;
      const e = this.el;
      return new Promise((selesai) => {
        let beres = false;
        const akhir = () => { if (!beres) { beres = true; clearTimeout(jaga); selesai(tok === this.token); } };
        const jaga = setTimeout(akhir, 15000);
        e.onended = () => { if (tok === this.token) akhir(); };
        e.onerror = () => { if (tok === this.token) akhir(); };
        e.src = url;
        e.play().catch((err) => { if (!err || err.name !== 'AbortError') akhir(); });
      });
    },
    diam() { this.token++; this.el.pause(); },
  };
  ['pointerdown', 'touchend', 'keydown'].forEach((ev) => addEventListener(ev, () => Pemutar.buka(), { capture: true, passive: true }));

  // Harus sama dengan pemecah kalimat di tools/daftar_kalimat.py
  const pecahKalimat = (teks) => (teks.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]*/g) || []).map((k) => k.trim()).filter(Boolean);

  // Ucapkan satu teks (bisa beberapa kalimat) dengan rekaman tokohnya; selesai = true bila tidak disela
  async function ucap(tokoh, teks) {
    const tok = ++ucap.id;
    for (const k of pecahKalimat(teks)) {
      if (tok !== ucap.id) return false;
      const klip = KLIP[`${tokoh}|${k}`];
      if (klip) await Pemutar.putar('suara/' + klip[0]);
      else await tunggu(600 + k.length * 55); // belum ada rekaman: beri waktu baca
      if (tok !== ucap.id) return false;
      await tunggu(220);
    }
    return tok === ucap.id;
  }
  ucap.id = 0;
  const diam = () => { ucap.id++; Pemutar.diam(); };

  // Efek bunyi sederhana (tanpa berkas): bel pintu "ting-tong" dan bunyi menang
  let ctx = null;
  function nada(f, t0, dur, vol = 0.25, tipe = 'sine') {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + t0;
    o.type = tipe; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  const Bunyi = {
    bel() { nada(988, 0, 0.9, 0.3, 'triangle'); nada(784, 0.45, 1.1, 0.3, 'triangle'); },
    pop() { nada(520, 0, 0.12, 0.2); nada(780, 0.06, 0.12, 0.15); },
    menang() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => nada(f, i * 0.12, 0.3, 0.2, 'triangle')); },
    tanam() { nada(260, 0, 0.12, 0.3); nada(150, 0.05, 0.22, 0.35); },          // biji masuk tanah
    salah() { nada(330, 0, 0.16, 0.18, 'triangle'); nada(247, 0.14, 0.26, 0.18, 'triangle'); },
    pas() { nada(1175, 0, 0.07, 0.18, 'triangle'); nada(1568, 0.06, 0.12, 0.16, 'triangle'); }, // potongan terpasang
    air() { for (let i = 0; i < 10; i++) nada(900 + Math.random() * 900, i * 0.09, 0.08, 0.08); },
    petik() { nada(700, 0, 0.08, 0.22); nada(1050, 0.05, 0.1, 0.18); },
  };

  // ================= ALAT BANTU TAMPILAN =================
  function tampil(kelas, html) {
    giliran++;
    diam();
    panggung.className = kelas;
    panggung.innerHTML = html;
    return giliran;
  }
  const gambarTokoh = (id, gaya, kelas = '') =>
    `<div class="tokoh stiker ${kelas}" data-tokoh="${id}" style="${gaya}"><div class="bayangan"></div><img src="${TOKOH[id].gambar}" alt="${TOKOH[id].nama}" onerror="this.closest('.tokoh').remove()"></div>`;
  function konfeti() {
    const warna = ['#ff6b6b', '#ffd43b', '#69db7c', '#4dabf7', '#da77f2', '#ffa94d'];
    for (let i = 0; i < 70; i++) {
      const k = document.createElement('i');
      k.className = 'kf';
      k.style.left = Math.random() * 1600 + 'px';
      k.style.background = warna[i % warna.length];
      k.style.animationDuration = 2 + Math.random() * 2 + 's';
      k.style.animationDelay = Math.random() * 0.6 + 's';
      k.style.setProperty('--r', Math.random() * 720 - 360 + 'deg');
      panggung.appendChild(k);
      setTimeout(() => k.remove(), 5000);
    }
  }
  // Layar penuh + kunci lanskap (Android). iPhone tidak mendukung, jadi diam-diam dilewati.
  function layarPenuh() {
    if (!matchMedia('(pointer: coarse)').matches) return;
    const el = document.documentElement;
    const minta = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!minta) return;
    Promise.resolve(minta.call(el)).then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape')).catch(() => {});
  }

  // ================= 1. LOADING =================
  function semuaBerkas() {
    const gambar = ['gambar/latar/loading.webp', 'gambar/latar/ruang.webp', 'gambar/latar/surat.webp', 'gambar/latar/jalan.webp',
      'gambar/latar/kebun.webp', 'gambar/benda/bus.webp', ...Object.values(TOKOH).map((t) => t.gambar)];
    const suara = new Set();
    [...INTRO, ...PERCAKAPAN, ...Object.values(UCAPAN)].forEach((u) => pecahKalimat(u.t).forEach((k) => {
      const klip = KLIP[`${u.s}|${k}`];
      if (klip) suara.add('suara/' + klip[0]);
    }));
    return { gambar, suara: [...suara] };
  }

  function layarLoading() {
    const g = tampil('loading', `
      <img class="latar" src="gambar/latar/loading.webp" alt="">
      <h1 class="judul-game">Petani <span>Cilik</span></h1>
      <p class="sub-judul">Berkebun apel bersama Nenek</p>
      ${gambarTokoh('justin', 'left:610px;width:170px;bottom:140px', 'napas')}
      ${gambarTokoh('nenek', 'left:800px;width:205px;bottom:140px', 'napas')}
      <div class="bawah"><div class="bilah"><i></i><b>Menyiapkan kebun…</b></div></div>`);
    const isi = $('.bilah i'), tulisan = $('.bilah b');
    let p = 0;
    const ganti = setInterval(() => { if (!masihAktif(g)) return clearInterval(ganti); tulisan.textContent = PESAN_LOADING[p++ % PESAN_LOADING.length]; }, 1100);
    const { gambar, suara } = semuaBerkas();
    const total = gambar.length + suara.length;
    let selesai = 0;
    const maju = () => { selesai++; isi.style.width = Math.round((selesai / total) * 100) + '%'; };
    const muat = [
      ...gambar.map((u) => new Promise((r) => { const im = new Image(); im.onload = im.onerror = () => { maju(); r(); }; im.src = u; })),
      ...suara.map((u) => fetch(u).then((x) => x.blob()).catch(() => {}).finally(maju)),
    ];
    Promise.all([Promise.all(muat), tunggu(1800)]).then(() => {
      if (!masihAktif(g)) return;
      clearInterval(ganti);
      $('.bawah').innerHTML = '<button class="tombol denyut" id="mulai">▶ Ayo Main!</button>';
      // Jalan pintas untuk menguji: alamat diakhiri #level3 langsung ke Level 3, #penutup ke penutup
      const pintas = /#(level([1-5])|penutup)/.exec(location.hash);
      $('#mulai').onclick = () => {
        Bunyi.pop(); layarPenuh();
        // Jalan pintas hanya sekali pakai: alamatnya dibersihkan supaya muat ulang kembali ke awal (intro)
        if (pintas) history.replaceState(null, '', location.pathname + location.search);
        if (!pintas) layarIntro();
        else if (pintas[2]) layarLevel(+pintas[2]);
        else layarPenutup();
      };
    });
  }

  // ================= 2. INTRO KOMIK =================
  // Panel miring seperti komik: 1 panel → belah 2 → belah 3. clip-path dianimasikan.
  const POTONG = {
    1: ['polygon(0 0,100% 0,100% 100%,0 100%)', 'polygon(100% 0,100% 0,100% 100%,100% 100%)', 'polygon(100% 0,100% 0,100% 100%,100% 100%)'],
    2: ['polygon(0 0,58% 0,50% 100%,0 100%)', 'polygon(59.2% 0,100% 0,100% 100%,51.2% 100%)', 'polygon(100% 0,100% 0,100% 100%,100% 100%)'],
    3: ['polygon(0 0,37% 0,30% 100%,0 100%)', 'polygon(38.2% 0,69% 0,62% 100%,31.2% 100%)', 'polygon(70.2% 0,100% 0,100% 100%,63.2% 100%)'],
    4: ['polygon(0 0,0 0,0 100%,0 100%)', 'polygon(0 0,0 0,0 100%,0 100%)', 'polygon(0 0,100% 0,100% 100%,0 100%)'],
  };
  // Geser isi tiap panel agar bagian penting (Justin & sofa, surat, jalan & bus) terlihat di potongannya
  const GESER = {
    1: ['0%', '0%', '0%'], 2: ['-6%', '30%', '0%'], 3: ['-14%', '6%', '30%'], 4: ['-14%', '6%', '0%'],
  };

  // Bus melaju mengikuti titik-titik jalan (posisi roda dalam piksel panggung; elemen bus lebar 300).
  // besar(y): ukuran bus menurut jauh-dekatnya. hadapKiri: gambar bus dibalik agar menghadap kiri.
  function lajukanBus(bus, jalur, besar, { durasi, easing = 'ease-in-out', hadapKiri = false, muncul = false, hilang = false }) {
    bus.style.left = bus.style.top = '0px';
    bus.style.transformOrigin = '50% 100%';
    bus.getAnimations().forEach((a) => a.cancel());
    const jarak = jalur.map((t, i) => (i ? Math.hypot(t[0] - jalur[i - 1][0], t[1] - jalur[i - 1][1]) : 0));
    const total = jarak.reduce((a, b) => a + b, 0) || 1;
    let tempuh = 0;
    return bus.animate(jalur.map(([x, y], i) => {
      tempuh += jarak[i];
      const s = besar(y);
      const terlihat = !((muncul && i === 0) || (hilang && i === jalur.length - 1));
      return { offset: tempuh / total, opacity: terlihat ? 1 : 0, transform: `translate(${x - 150}px, ${y - 162}px) scale(${hadapKiri ? -s : s}, ${s})` };
    }), { duration: durasi, easing, fill: 'forwards' });
  }

  // Jalan desa pada gambar jalan.webp: dari depan-kiri menuju rumah pertanian di kanan
  const JALAN_DESA = [[330, 698], [430, 692], [520, 672], [600, 650], [700, 628], [800, 612], [880, 598], [950, 578], [992, 552]];
  const besarDesa = (y) => 0.45 + (y - 550) * (0.55 / 150);

  async function layarIntro() {
    const g = tampil('komik', `
      <div class="panel" id="p1"><div class="isi">
        <img class="latar" src="gambar/latar/ruang.webp" alt="">
        ${gambarTokoh('ayah', 'left:930px;width:300px;bottom:90px', 'napas')}
        ${gambarTokoh('ibu', 'left:1215px;width:235px;bottom:80px', 'napas')}
        ${gambarTokoh('justin', 'left:150px;width:250px;bottom:70px', 'napas')}
      </div></div>
      <div class="panel" id="p2"><div class="isi"><img class="latar" src="gambar/latar/surat.webp" alt=""></div></div>
      <div class="panel" id="p3"><div class="isi">
        <img class="latar" src="gambar/latar/jalan.webp" alt="">
        <div class="bus" id="bus" style="width:300px;opacity:0"><img src="gambar/benda/bus.webp" alt="Bus"></div>
      </div></div>
      <p class="teks-cerita" id="teks"></p>
      <button class="lewati" id="lewati">Lewati &gt;&gt;</button>`);
    const panel = [$('#p1'), $('#p2'), $('#p3')];
    const isi = panel.map((p) => $('.isi', p));
    isi.forEach((x) => { x.style.position = 'absolute'; x.style.inset = '0'; x.style.transition = 'transform .9s cubic-bezier(.6,0,.25,1)'; });
    const atur = (n) => panel.forEach((p, i) => { p.style.clipPath = POTONG[n][i]; isi[i].style.transform = `translateX(${GESER[n][i]})`; });
    atur(1);
    $('#lewati').onclick = (e) => { e.stopPropagation(); Bunyi.pop(); layarKebun(); };

    let panelKini = 1;
    for (const langkah of INTRO) {
      if (!masihAktif(g)) return;
      if (langkah.panel !== panelKini) {
        panelKini = langkah.panel; atur(panelKini);
        // Panel jalan muncul: bus masuk dari kiri dan melaju di jalan desa (terlihat utuh di panel ketiga)
        if (panelKini === 3) {
          const bus = $('#bus'); bus.style.opacity = '1';
          lajukanBus(bus, JALAN_DESA.slice(0, 6), besarDesa, { durasi: 4200, easing: 'ease-out' });
        }
        await tunggu(900);
      }
      if (langkah.bunyi === 'bel') { Bunyi.bel(); await tunggu(1500); }
      $('#teks').textContent = langkah.t;
      await ucap(langkah.s, langkah.t);
      await tunggu(250);
    }
    if (!masihAktif(g)) return;
    // Panel jalan membesar penuh, lalu bus melaju menuju kebun Nenek
    $('#teks').textContent = '';
    atur(4);
    await tunggu(900);
    // Lanjut dari posisi terakhir, menjauh ke arah rumah pertanian lalu menghilang di tikungan
    const jalan = lajukanBus($('#bus'), JALAN_DESA.slice(5), besarDesa, { durasi: 2600, hilang: true });
    await jalan.finished.catch(() => {});
    await tunggu(300);
    if (masihAktif(g)) layarKebun();
  }

  // ================= 3. TIBA DI KEBUN & PERCAKAPAN =================
  async function layarKebun() {
    const g = tampil('ngobrol', `
      <img class="latar" src="gambar/latar/kebun.webp" alt="">
      <div class="bus" id="bus" style="left:0;top:0;width:300px"><img src="gambar/benda/bus.webp" alt="Bus"></div>
      ${gambarTokoh('justin', 'left:130px;width:290px;bottom:-10px;opacity:0', 'dengar')}
      ${gambarTokoh('nenek', 'left:1150px;width:360px;bottom:-20px;opacity:0', 'dengar')}
      <div class="gelembung" id="gelembung" hidden><span class="nama" id="nama"></span><span id="ucapan"></span></div>
      <p class="ketuk" id="ketuk" hidden>Ketuk di mana saja untuk melanjutkan</p>
      <button class="lewati" id="lewati">Lewati &gt;&gt;</button>`);
    $('#lewati').onclick = (e) => { e.stopPropagation(); Bunyi.pop(); layarLevel(1); };
    // Bus keluar dari gerbang kebun, melaju mengikuti jalan setapak ke arah depan (menghadap kiri-depan),
    // berhenti sebentar menurunkan Justin, lalu pergi keluar layar sebelum percakapan dimulai.
    const bus = $('#bus');
    const JALUR = [[998, 352], [938, 400], [850, 431], [800, 462], [806, 496], [826, 528], [826, 548]];
    const PERGI = [[826, 548], [823, 580], [775, 610], [750, 640], [707, 670], [658, 700], [620, 730], [575, 790], [545, 860], [530, 960], [520, 1150]];
    const besar = (y) => Math.min(1.5, 0.22 + (y - 352) * (0.58 / 196)); // jauh kecil, dekat besar
    const datang = lajukanBus(bus, JALUR, besar, { durasi: 3000, easing: 'ease-out', hadapKiri: true, muncul: true });
    await datang.finished.catch(() => {});
    if (!masihAktif(g)) return;
    bus.classList.add('parkir');
    await tunggu(700);
    if (!masihAktif(g)) return;
    bus.classList.remove('parkir');
    const pergi = lajukanBus(bus, PERGI, besar, { durasi: 1800, easing: 'ease-in', hadapKiri: true });
    await pergi.finished.catch(() => {});
    bus.remove();
    if (!masihAktif(g)) return;
    // Nenek dan Justin masuk dari samping
    const nenek = $('[data-tokoh="nenek"]'), justin = $('[data-tokoh="justin"]');
    nenek.animate([{ transform: 'translateX(420px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'forwards' });
    justin.animate([{ transform: 'translateX(-420px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, delay: 150, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'forwards' });
    await tunggu(900);
    nenek.style.opacity = justin.style.opacity = '1';
    nenek.getAnimations().forEach((a) => a.cancel());
    justin.getAnimations().forEach((a) => a.cancel());

    if (await ngobrolkan(g, PERCAKAPAN, nenek, justin)) layarLevel(1);
  }

  // Percakapan: yang bicara berwarna & bergerak, yang mendengar abu-abu.
  // Lanjut sendiri setelah suara selesai; ketuk layar untuk mempercepat. Hasil: true bila tidak disela pindah layar.
  async function ngobrolkan(g, daftar, nenek, justin) {
    let lompat = null;
    panggung.onclick = () => { if (lompat) lompat(); };
    $('#ketuk').hidden = false;
    for (const baris of daftar) {
      if (!masihAktif(g)) return false;
      [nenek, justin].forEach((t) => {
        const bicara = t.dataset.tokoh === baris.s;
        t.classList.toggle('bicara', bicara);
        t.classList.toggle('dengar', !bicara);
      });
      const gel = $('#gelembung');
      gel.hidden = false;
      gel.classList.toggle('kanan', baris.s === 'nenek');
      gel.classList.remove('pop'); void gel.offsetWidth; gel.classList.add('pop');
      $('#nama').textContent = TOKOH[baris.s].nama;
      $('#ucapan').textContent = baris.t;
      await Promise.race([
        ucap(baris.s, baris.t).then(() => tunggu(700)),
        new Promise((r) => { lompat = r; }),
      ]);
      lompat = null;
      diam();
      [nenek, justin].forEach((t) => t.classList.remove('bicara'));
    }
    panggung.onclick = null;
    $('#ketuk').hidden = true;
    return masihAktif(g);
  }

  // ================= 4. LAYAR LEVEL =================
  async function layarLevel(no) {
    const lv = LEVEL[no - 1];
    const g = tampil('layar-level', `
      <img class="latar" src="gambar/latar/kebun.webp" alt="">
      <div class="gelap"></div>
      <div class="bintang-baris">
        <span class="bintang" style="left:40px;top:120px;animation-delay:.1s">⭐</span>
        <span class="bintang" style="left:200px;top:40px;animation-delay:.2s">⭐</span>
        <span class="bintang besar" style="left:330px;top:-30px">⭐<span class="angka">${no}</span></span>
        <span class="bintang" style="left:600px;top:40px;animation-delay:.2s">⭐</span>
        <span class="bintang" style="left:760px;top:120px;animation-delay:.1s">⭐</span>
      </div>
      <div class="pita">${no === 1 ? 'LEVEL 1' : 'LEVEL BARU!'}</div>
      <div class="kegiatan">
        <div class="kartu-baru">${lv.ikon}<span class="baru">BARU</span><span class="ket">${lv.nama}</span></div>
      </div>
      <button class="tombol denyut" id="main">▶ Ayo Main!</button>`);
    Bunyi.menang();
    konfeti();
    $('#main').onclick = () => { Bunyi.pop(); mulaiLevel(no); };
    // Suara permainan level ini disiapkan lebih dulu agar langsung terdengar
    siapkanSuara(NASKAH_LEVEL[no]);
    await tunggu(700);
    if (masihAktif(g)) await ucap(no === 1 ? UCAPAN.mulai.s : UCAPAN.levelBaru.s, no === 1 ? UCAPAN.mulai.t : UCAPAN.levelBaru.t);
  }

  // Ambil rekaman lebih awal (masuk cache browser) dari objek naskah apa pun
  function siapkanSuara(naskah) {
    const url = new Set();
    const jelajah = (o, s) => {
      if (typeof o === 'string') pecahKalimat(o).forEach((k) => { const kl = KLIP[`${s}|${k}`]; if (kl) url.add('suara/' + kl[0]); });
      else if (Array.isArray(o)) o.forEach((x) => jelajah(x, s));
      else if (o && o.s && o.t) jelajah(o.t, o.s);
      else if (o && typeof o === 'object') Object.values(o).forEach((x) => jelajah(x, s));
    };
    jelajah(naskah, 'nenek'); jelajah(naskah, 'justin');
    url.forEach((u) => fetch(u).catch(() => {}));
  }

  // ================= 5. PERMAINAN =================
  // Kerangka bersama tiap level: latar kebun disamarkan, Nenek pemandu di kiri bawah,
  // gelembung petunjuk di atas (dengan tombol 🔊 dengar lagi). Isi permainan ada di permainan.js.
  const keStage = (e) => {
    const r = panggung.getBoundingClientRect();
    const s = r.width / 1600;
    return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
  };

  // Geser elemen dengan jari/tetikus. Posisi geser memakai properti CSS `translate` (dx, dy dalam piksel panggung).
  // pegangan: bagian yang disentuh (bawaan: elemen itu sendiri). mulai() boleh mengembalikan false untuk menolak.
  function seret(el, { pegangan = el, mulai, lepas }) {
    pegangan.style.touchAction = 'none';
    pegangan.addEventListener('pointerdown', (e) => {
      if (el.dataset.kunci) return;
      e.preventDefault();
      const p0 = keStage(e);
      if (mulai && mulai(p0) === false) return;
      pegangan.setPointerCapture(e.pointerId);
      const dx0 = +el.dataset.dx || 0, dy0 = +el.dataset.dy || 0;
      el.classList.add('diseret');
      el.style.transition = 'none';
      const gerak = (ev) => {
        const p = keStage(ev);
        geser(el, dx0 + p.x - p0.x, dy0 + p.y - p0.y);
      };
      const akhir = (ev) => {
        pegangan.removeEventListener('pointermove', gerak);
        pegangan.removeEventListener('pointerup', akhir);
        pegangan.removeEventListener('pointercancel', akhir);
        el.classList.remove('diseret');
        el.style.transition = '';
        lepas(keStage(ev), +el.dataset.dx || 0, +el.dataset.dy || 0);
      };
      pegangan.addEventListener('pointermove', gerak);
      pegangan.addEventListener('pointerup', akhir);
      pegangan.addEventListener('pointercancel', akhir);
    });
  }
  function geser(el, dx, dy) {
    el.dataset.dx = dx; el.dataset.dy = dy;
    el.style.translate = `${dx}px ${dy}px`;
  }

  async function mulaiLevel(no) {
    const naskah = NASKAH_LEVEL[no];
    const g = tampil(`main main-${no}`, `
      <img class="latar samar" src="gambar/latar/kebun.webp" alt="">
      <div class="lencana">Level ${no}</div>
      <div class="arena" id="arena"></div>
      ${gambarTokoh('nenek', 'left:1420px;width:180px;bottom:-18px', 'pemandu')}
      ${gambarTokoh('justin', 'left:6px;width:160px;bottom:-14px', 'pemandu sembunyi')}
      <div class="petunjuk" id="petunjuk" hidden><span class="nama"></span><span class="isi"></span>
        <button class="ulang" id="ulang" aria-label="Dengar petunjuk lagi">🔊</button></div>`);

    // Tokoh berbicara: gelembung petunjuk berisi kalimatnya, tokohnya bergerak
    const bicara = async (baris) => {
      if (!masihAktif(g)) return false;
      const p = $('#petunjuk');
      p.hidden = false;
      p.classList.toggle('kanan', baris.s === 'nenek');
      p.classList.remove('pop'); void p.offsetWidth; p.classList.add('pop');
      $('.nama', p).textContent = TOKOH[baris.s].nama;
      $('.isi', p).textContent = baris.t;
      panggung.querySelectorAll('.pemandu').forEach((t) => t.classList.remove('bicara'));
      const tokoh = $(`.pemandu[data-tokoh="${baris.s}"]`);
      if (tokoh) { tokoh.classList.remove('sembunyi'); tokoh.classList.add('bicara'); }
      const utuh = await ucap(baris.s, baris.t);
      if (utuh && tokoh) tokoh.classList.remove('bicara');
      return utuh;
    };
    const bicaraBerurutan = async (daftar) => {
      for (const b of daftar) { if (!(await bicara(b))) return false; await tunggu(250); }
      return true;
    };
    $('#ulang').onclick = (e) => { e.stopPropagation(); Bunyi.pop(); bicaraBerurutan(naskah.buka); };

    const alat = {
      arena: $('#arena'), naskah, tunggu, bicara, Bunyi, seret, geser, keStage, konfeti,
      aktif: () => masihAktif(g),
    };
    const main = PERMAINAN[no](alat);   // permainan berjalan; janji selesai saat anak menyelesaikannya
    bicaraBerurutan(naskah.buka);
    await main;
    if (!masihAktif(g)) return;

    // Menang: sorak, konfeti, kalimat penutup level, lalu ke level berikutnya / penutup
    Bunyi.menang();
    konfeti();
    await tunggu(500);
    await bicaraBerurutan(naskah.selesai);
    await tunggu(900);
    if (!masihAktif(g)) return;
    if (no < LEVEL.length) layarLevel(no + 1);
    else layarPenutup();
  }

  // ================= 6. PENUTUP =================
  async function layarPenutup() {
    const g = tampil('ngobrol penutup', `
      <img class="latar" src="gambar/latar/kebun.webp" alt="">
      ${gambarTokoh('justin', 'left:130px;width:290px;bottom:-10px', 'dengar')}
      ${gambarTokoh('nenek', 'left:1150px;width:360px;bottom:-20px', 'dengar')}
      <div class="hasil-panen">
        <div class="kb-belakang">${GAMBAR.keranjangBelakang()}</div>
        ${[[70, 40], [130, 26], [190, 30], [250, 44], [100, 70], [160, 64], [220, 72]].map(([x, y]) => `<div class="apel-isi" style="left:${x}px;top:${y}px">${GAMBAR.apel('merah')}</div>`).join('')}
        <div class="kb-depan">${GAMBAR.keranjangDepan()}</div>
      </div>
      <div class="gelembung" id="gelembung" hidden><span class="nama" id="nama"></span><span id="ucapan"></span></div>
      <p class="ketuk" id="ketuk" hidden>Ketuk di mana saja untuk melanjutkan</p>`);
    siapkanSuara(PENUTUP);
    konfeti();
    Bunyi.menang();
    await tunggu(900);
    const nenek = $('[data-tokoh="nenek"]'), justin = $('[data-tokoh="justin"]');
    if (!(await ngobrolkan(g, PENUTUP, nenek, justin))) return;
    nenek.classList.remove('dengar'); justin.classList.remove('dengar');
    $('#gelembung').hidden = true;
    panggung.insertAdjacentHTML('beforeend', `
      <div class="pita tamat">Petani Cilik Hebat!</div>
      <button class="tombol denyut main-lagi" id="lagi">↻ Main Lagi</button>`);
    Bunyi.menang();
    konfeti();
    $('#lagi').onclick = () => { Bunyi.pop(); layarLevel(1); };
  }

  layarLoading();
})();
