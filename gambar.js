/* =========================================================
   Petani Cilik — gambar benda permainan (SVG buatan kode).
   Gaya kartun: garis coklat tua tegas, warna cerah.
   Bisa diganti gambar ElevenLabs nanti tanpa mengubah logika permainan.
   ========================================================= */
const GARIS = '#4a2c14';

const GAMBAR = {
  // Biji apel: tetes coklat mengilap
  biji: () => `<svg viewBox="-40 -45 80 90" width="100%" height="100%">
    <path d="M0,-36 C24,-14 26,16 0,34 C-26,16 -24,-14 0,-36Z" fill="#8a5426" stroke="${GARIS}" stroke-width="5"/>
    <path d="M-8,-14 C-12,-4 -12,6 -8,14" stroke="#c98a4e" stroke-width="6" fill="none" stroke-linecap="round"/>
  </svg>`,

  // Tunas kecil yang tumbuh dari gundukan tanah
  tunas: () => `<svg viewBox="-60 -90 120 100" width="100%" height="100%">
    <path d="M0,0 C0,-20 2,-40 0,-56" stroke="#3f8a24" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M0,-50 C-10,-78 -44,-80 -52,-62 C-38,-48 -14,-46 0,-50Z" fill="#7ccf4a" stroke="#2f6b1a" stroke-width="5" stroke-linejoin="round"/>
    <path d="M0,-56 C12,-84 46,-84 52,-66 C38,-52 14,-50 0,-56Z" fill="#8edb5a" stroke="#2f6b1a" stroke-width="5" stroke-linejoin="round"/>
  </svg>`,

  // Karung: pupuk (gambar tanaman), pakan ayam (gambar ayam), tepung (gambar gandum)
  karung(jenis) {
    const warna = { pupuk: ['#c79a5b', '#a77a3e'], pakan: ['#e2b65f', '#c4923a'], tepung: ['#f6f1e4', '#d9cfb8'] }[jenis];
    const ikon = {
      pupuk: `<path d="M0,40 C0,20 0,0 0,-14" stroke="#3f8a24" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M0,-6 C-12,-38 -52,-40 -60,-18 C-44,-2 -16,-2 0,-6Z" fill="#7ccf4a" stroke="#2f6b1a" stroke-width="5"/>
        <path d="M0,-14 C14,-46 54,-46 60,-24 C44,-8 16,-8 0,-14Z" fill="#8edb5a" stroke="#2f6b1a" stroke-width="5"/>
        <path d="M-52,48 Q0,22 52,48Z" fill="#7a4a22" stroke="${GARIS}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M-26,-22 Q-36,-26 -44,-20 M26,-30 Q36,-34 44,-28" stroke="#2f6b1a" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      pakan: `<path d="M-6,48 l-4,14 M-10,62 l-8,4 M-10,62 l6,4 M14,48 l2,14 M16,62 l-7,4 M16,62 l8,3" stroke="#f08c1a" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M34,-4 C46,-30 66,-22 58,-2 C72,-8 74,14 56,18 C52,42 28,54 2,50 C-26,46 -40,28 -36,4 C-38,-16 -30,-28 -22,-34 Z" fill="#fff" stroke="${GARIS}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M-8,14 C4,32 26,32 36,16 C26,22 10,20 -8,14Z" fill="#f1ece0" stroke="${GARIS}" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="-22" cy="-30" r="22" fill="#fff" stroke="${GARIS}" stroke-width="5"/>
        <path d="M-36,-48 q2,-16 12,-6 q4,-16 13,-3 q9,-10 9,6" fill="#e8402a" stroke="${GARIS}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M-42,-32 l-18,6 l17,7Z" fill="#ffb02e" stroke="${GARIS}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M-40,-18 q-6,12 4,14 q4,-6 0,-14" fill="#e8402a" stroke="${GARIS}" stroke-width="3"/>
        <circle cx="-25" cy="-34" r="4.5" fill="${GARIS}"/><circle cx="-23.5" cy="-35.5" r="1.5" fill="#fff"/>`,
      tepung: `<path d="M0,52 C0,20 0,-10 0,-50" stroke="#c2902f" stroke-width="7" fill="none" stroke-linecap="round"/>
        ${[-36, -18, 0, 18].map((y) => `<ellipse cx="-14" cy="${y}" rx="9" ry="16" transform="rotate(-30 -14 ${y})" fill="#f2c14e" stroke="#9a6a14" stroke-width="4"/>
        <ellipse cx="14" cy="${y}" rx="9" ry="16" transform="rotate(30 14 ${y})" fill="#f2c14e" stroke="#9a6a14" stroke-width="4"/>`).join('')}
        <ellipse cx="0" cy="-56" rx="8" ry="15" fill="#f2c14e" stroke="#9a6a14" stroke-width="4"/>`,
    }[jenis];
    // Isi karung yang terlihat di bukaan atas: butiran pupuk, jagung pakan, bubuk tepung
    const isi = {
      pupuk: { dasar: '#5b3a1f', butir: ['#3b2412', '#7a5232', '#4a2e17'], r: [5, 8] },
      pakan: { dasar: '#e9a92a', butir: ['#f7c948', '#e08a17', '#fbd96a', '#c97a12'], r: [6, 9] },
      tepung: { dasar: '#fbfaf5', butir: ['#ffffff', '#ece7da'], r: [7, 13] },
    }[jenis];
    let benih = { pupuk: 7, pakan: 13, tepung: 29 }[jenis];
    const acakTetap = () => { benih = (benih * 9301 + 49297) % 233280; return benih / 233280; }; // sama setiap kali digambar
    const butir = [];
    for (let n = 0; n < 90 && butir.length < 46; n++) {
      const x = -96 + acakTetap() * 192, y = -142 + acakTetap() * 62;
      const atas = -144 + 50 * (x / 112) ** 2, bawah = -80 - 18 * (1 - (x / 124) ** 2);
      if (y < atas + 6 || y > bawah + 4) continue;
      const r = isi.r[0] + acakTetap() * (isi.r[1] - isi.r[0]);
      const w = isi.butir[Math.floor(acakTetap() * isi.butir.length)];
      butir.push(jenis === 'pakan'
        ? `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 0.75).toFixed(1)}" transform="rotate(${Math.round(acakTetap() * 180)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${w}" stroke="#a5600c" stroke-width="1.5"/>`
        : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${w}"/>`);
    }
    const kain = { pupuk: ['#c9a06a', '#a47b45', '#e3c08c'], pakan: ['#f1e7c8', '#cdbd8f', '#fffaf0'], tepung: ['#f3eee2', '#d6ccb5', '#ffffff'] }[jenis];
    const pitaLabel = { pupuk: '#43a047', pakan: '#ef8a1f', tepung: '#3b8fd9' }[jenis];
    const id = `k-${jenis}`;
    const badan = 'M-112,-92 C-134,-10 -140,108 -118,160 Q-60,186 0,184 Q60,186 118,160 C140,108 134,-10 112,-92 Z';
    return `<svg viewBox="-150 -200 300 400" width="100%" height="100%">
      <defs>
        <pattern id="${id}-anyam" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0,4 H8 M4,0 V8" stroke="rgba(60,35,10,.10)" stroke-width="2"/></pattern>
        <linearGradient id="${id}-bayang" x1="0" x2="1">
          <stop offset="0" stop-color="rgba(40,20,0,.28)"/><stop offset=".28" stop-color="rgba(40,20,0,0)"/>
          <stop offset=".42" stop-color="rgba(255,255,255,.22)"/><stop offset=".6" stop-color="rgba(255,255,255,0)"/>
          <stop offset="1" stop-color="rgba(40,20,0,.32)"/>
        </linearGradient>
        <radialGradient id="${id}-tumpuk" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="rgba(255,255,255,.35)"/><stop offset="1" stop-color="rgba(0,0,0,.15)"/></radialGradient>
      </defs>
      <ellipse cx="0" cy="184" rx="128" ry="14" fill="rgba(0,0,0,.2)"/>
      <!-- badan karung: warna kain + anyaman + bayangan -->
      <path d="${badan}" fill="${kain[0]}"/>
      <path d="${badan}" fill="url(#${id}-anyam)"/>
      <path d="${badan}" fill="url(#${id}-bayang)"/>
      <path d="${badan}" fill="none" stroke="${GARIS}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M-78,-36 C-66,0 -88,40 -76,76 M84,-30 C72,4 92,44 80,84 M-96,120 Q-70,108 -48,124 M58,128 Q80,112 100,124" stroke="rgba(60,35,10,.28)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M-112,150 Q0,176 112,150" stroke="rgba(60,35,10,.45)" stroke-width="3" stroke-dasharray="7 6" fill="none"/>
      <!-- bukaan atas: lipatan belakang, isi menggunung, lipatan depan -->
      <ellipse cx="0" cy="-98" rx="122" ry="32" fill="${kain[1]}" stroke="${GARIS}" stroke-width="6"/>
      <path d="M-112,-96 C-90,-134 -40,-148 0,-148 C40,-148 90,-134 112,-96 Q0,-70 -112,-96Z" fill="${isi.dasar}"/>
      ${butir.join('')}
      <path d="M-112,-96 C-90,-134 -40,-148 0,-148 C40,-148 90,-134 112,-96 Q0,-70 -112,-96Z" fill="url(#${id}-tumpuk)" stroke="${GARIS}" stroke-width="5"/>
      <path d="M-126,-100 Q0,-54 126,-100 L121,-60 Q0,-16 -121,-60 Z" fill="${kain[2]}"/>
      <path d="M-126,-100 Q0,-54 126,-100 L121,-60 Q0,-16 -121,-60 Z" fill="url(#${id}-anyam)"/>
      <path d="M-126,-100 Q0,-54 126,-100 L121,-60 Q0,-16 -121,-60 Z" fill="none" stroke="${GARIS}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-116,-76 Q0,-32 116,-76" stroke="rgba(60,35,10,.35)" stroke-width="3" stroke-dasharray="7 6" fill="none"/>
      <!-- label jahit dengan gambar -->
      <rect x="-80" y="-6" width="160" height="150" rx="24" fill="#fffaf0" stroke="${GARIS}" stroke-width="5"/>
      <rect x="-70" y="4" width="140" height="130" rx="18" fill="none" stroke="${pitaLabel}" stroke-width="4" stroke-dasharray="9 6"/>
      <g transform="translate(0,72) scale(.92)">${ikon}</g>
      ${jenis === 'tepung' ? '<g fill="#fff" opacity=".9"><circle cx="-96" cy="20" r="6"/><circle cx="-88" cy="40" r="4"/><circle cx="98" cy="-20" r="5"/><circle cx="104" cy="120" r="7"/><circle cx="-50" cy="-150" r="5"/><circle cx="40" cy="-156" r="4"/></g>' : ''}
    </svg>`;
  },

  // Teko penyiram hijau (600 × 450) untuk puzzle; sketsa = garis putus-putus saja
  teko(sketsa = false) {
    const isi = (w) => (sketsa ? 'none' : w);
    const gr = sketsa ? '#b9a27c' : GARIS;
    const tebal = sketsa ? 5 : 8;
    const putus = sketsa ? 'stroke-dasharray="14 10"' : '';
    return `<svg viewBox="0 0 600 450" width="100%" height="100%">
      <path d="M420,170 C420,60 560,60 556,180 C552,262 486,288 470,318" fill="none" stroke="${gr}" stroke-width="${sketsa ? tebal : 44}" stroke-linecap="round" ${putus}/>
      ${sketsa ? '' : '<path d="M420,170 C420,60 560,60 556,180 C552,262 486,288 470,318" fill="none" stroke="#4caf50" stroke-width="28" stroke-linecap="round"/>'}
      <path d="M182,312 L66,160 L96,140 L196,262Z" fill="${isi('#43a047')}" stroke="${gr}" stroke-width="${tebal}" stroke-linejoin="round" ${putus}/>
      <ellipse cx="66" cy="140" rx="44" ry="28" transform="rotate(-38 66 140)" fill="${isi('#66bb6a')}" stroke="${gr}" stroke-width="${tebal}" ${putus}/>
      ${sketsa ? '' : '<g fill="#2e7d32"><circle cx="58" cy="132" r="5"/><circle cx="74" cy="146" r="5"/><circle cx="50" cy="150" r="5"/><circle cx="80" cy="126" r="5"/></g>'}
      <path d="M200,150 L440,150 Q462,150 464,172 L484,382 Q486,414 452,414 L188,414 Q154,414 156,382 L176,172 Q178,150 200,150Z" fill="${isi('#4caf50')}" stroke="${gr}" stroke-width="${tebal}" stroke-linejoin="round" ${putus}/>
      ${sketsa ? '' : `<path d="M168,262 L472,262 L478,316 L162,316Z" fill="#fff59d" stroke="${GARIS}" stroke-width="6"/>
        <g transform="translate(320,289)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-15" rx="10" ry="15" transform="rotate(${a})" fill="#ff8a80" stroke="${GARIS}" stroke-width="3"/>`).join('')}<circle r="9" fill="#ffd54f" stroke="${GARIS}" stroke-width="3"/></g>
        <circle cx="236" cy="289" r="9" fill="#ff8a80" stroke="${GARIS}" stroke-width="3"/><circle cx="404" cy="289" r="9" fill="#ff8a80" stroke="${GARIS}" stroke-width="3"/>
        <path d="M206,190 Q200,230 204,240" stroke="#a5d6a7" stroke-width="12" fill="none" stroke-linecap="round"/>`}
      <ellipse cx="320" cy="152" rx="126" ry="24" fill="${isi('#2e7d32')}" stroke="${gr}" stroke-width="${tebal}" ${putus}/>
      ${sketsa ? '' : '<ellipse cx="320" cy="154" rx="104" ry="14" fill="#1b5e20"/>'}
    </svg>`;
  },

  // Gambar bagian tanaman untuk kartu Level 4
  bagian: {
    akar: `<svg viewBox="-60 -60 120 120" width="100%" height="100%"><path d="M0,-50 V0 M0,0 C-10,18 -30,24 -40,44 M0,0 C10,20 28,26 36,46 M0,6 V50 M-20,22 C-30,26 -42,22 -50,28 M18,24 C30,28 40,26 50,32" stroke="#8d5a2b" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M0,-50 V0 M0,0 C-10,18 -30,24 -40,44 M0,0 C10,20 28,26 36,46 M0,6 V50" stroke="#c48a52" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    batang: `<svg viewBox="-60 -60 120 120" width="100%" height="100%"><path d="M-22,-54 Q-16,0 -26,54 L26,54 Q16,0 22,-54Z" fill="#9b6533" stroke="${GARIS}" stroke-width="6" stroke-linejoin="round"/><path d="M-6,-36 q6,10 0,20 M8,0 q-6,12 2,24 M-8,20 q4,8 0,14" stroke="#6d4320" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
    daun: `<svg viewBox="-60 -60 120 120" width="100%" height="100%"><path d="M-44,44 C-50,-10 -10,-48 46,-46 C46,10 10,48 -44,44Z" fill="#6cc24a" stroke="#2f6b1a" stroke-width="6" stroke-linejoin="round"/><path d="M-44,44 L30,-30 M-14,14 L-14,-14 M-14,14 L14,14 M8,-8 L8,-26 M8,-8 L26,-8" stroke="#2f6b1a" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
    bunga: `<svg viewBox="-60 -60 120 120" width="100%" height="100%">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-26" rx="20" ry="27" transform="rotate(${a})" fill="#ffe3ee" stroke="#c2577f" stroke-width="5"/>`).join('')}<circle r="16" fill="#ffd54f" stroke="#b07d00" stroke-width="5"/><circle cx="-5" cy="-4" r="3" fill="#b07d00"/><circle cx="6" cy="3" r="3" fill="#b07d00"/></svg>`,
    buah: `<svg viewBox="-60 -60 120 120" width="100%" height="100%"><path d="M0,-30 C-30,-48 -56,-24 -50,8 C-44,40 -18,54 0,44 C18,54 44,40 50,8 C56,-24 30,-48 0,-30Z" fill="#e53935" stroke="#7f1d1d" stroke-width="6" stroke-linejoin="round"/><path d="M-30,-14 Q-36,4 -30,16" stroke="#ff8a80" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M0,-30 Q2,-44 8,-52" stroke="${GARIS}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M6,-44 C16,-60 38,-58 40,-48 C30,-38 14,-38 6,-44Z" fill="#6cc24a" stroke="#2f6b1a" stroke-width="4"/></svg>`,
  },

  // Sketsa pohon apel (garis saja) untuk Level 4: 640 × 720, tanah di y 520
  sketsaPohon: () => `<svg viewBox="0 0 640 720" width="100%" height="100%">
    <rect x="0" y="520" width="640" height="200" rx="24" fill="#c9a06a" opacity=".55"/>
    <path d="M0,524 Q160,508 320,522 T640,520" stroke="#8d6a3e" stroke-width="6" fill="none"/>
    <path d="M320,520 V580 M320,560 C300,590 260,600 240,640 M320,560 C340,592 380,602 400,642 M320,580 V680 M290,600 C270,610 250,606 230,616" stroke="#8a7656" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="12 9"/>
    <path d="M290,520 Q300,420 292,330 L348,330 Q340,420 350,520Z" fill="none" stroke="#8a7656" stroke-width="7" stroke-dasharray="12 9" stroke-linejoin="round"/>
    <path d="M300,340 C250,300 210,300 180,290 M340,340 C390,300 430,300 460,280" stroke="#8a7656" stroke-width="7" fill="none" stroke-dasharray="12 9" stroke-linecap="round"/>
    <path d="M150,300 C80,300 60,220 110,180 C90,110 170,60 230,90 C260,30 380,30 410,90 C470,60 550,110 530,180 C590,220 560,310 490,300 C470,340 400,350 360,320 C330,350 280,350 250,320 C210,350 160,340 150,300Z" fill="rgba(170,215,140,.35)" stroke="#8a7656" stroke-width="7" stroke-dasharray="12 9" stroke-linejoin="round"/>
    <g fill="none" stroke="#8a7656" stroke-width="5" stroke-dasharray="9 7" stroke-linejoin="round">
      <g transform="translate(499,120)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-22" rx="16" ry="22" transform="rotate(${a})"/>`).join('')}<circle r="12"/></g>
      <path d="M390,256 C364,240 340,262 346,290 C352,318 374,330 390,322 C406,330 428,318 434,290 C440,262 416,240 390,256Z"/>
    </g>
  </svg>`,

  // Kepingan Level 4 yang bentuk & ukurannya PERSIS sketsa pohon (koordinat sketsa 640 × 720),
  // tanpa kartu putih: kotak = [x, y, lebar, tinggi] bagian sketsa yang ditutupi kepingan.
  keping: {
    daun: { kotak: [50, 20, 550, 340], isi: `
      <path d="M150,300 C80,300 60,220 110,180 C90,110 170,60 230,90 C260,30 380,30 410,90 C470,60 550,110 530,180 C590,220 560,310 490,300 C470,340 400,350 360,320 C330,350 280,350 250,320 C210,350 160,340 150,300Z"
            fill="#5cb83c" stroke="#2f6b1a" stroke-width="8" stroke-linejoin="round"/>
      <path d="M160,170 C180,146 214,146 230,162 M330,100 C352,84 386,86 400,106 M250,230 C272,214 304,216 318,232 M430,210 C452,196 482,200 494,218 M120,250 C134,236 156,236 166,246"
            stroke="#8edb5a" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M200,280 C214,268 232,268 242,280 M380,270 C394,258 412,258 422,270" stroke="#3f9a2c" stroke-width="8" fill="none" stroke-linecap="round"/>` },
    batang: { kotak: [282, 322, 76, 206], isi: `
      <path d="M290,520 Q300,420 292,330 L348,330 Q340,420 350,520Z" fill="#9b6533" stroke="${GARIS}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M310,370 q8,14 0,28 M332,440 q-8,16 2,32 M312,480 q6,10 0,20" stroke="#6d4320" stroke-width="5" fill="none" stroke-linecap="round"/>` },
    akar: { kotak: [220, 512, 196, 180], isi: `
      <path d="M320,520 V580 M320,560 C300,590 260,600 240,640 M320,560 C340,592 380,602 400,642 M320,580 V680 M290,600 C270,610 250,606 230,616"
            stroke="#8d5a2b" stroke-width="13" fill="none" stroke-linecap="round"/>
      <path d="M320,520 V580 M320,560 C300,590 260,600 240,640 M320,560 C340,592 380,602 400,642 M320,580 V680"
            stroke="#c48a52" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    bunga: { kotak: [453, 74, 92, 92], isi: `<g transform="translate(499,120)">
      ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-22" rx="16" ry="22" transform="rotate(${a})" fill="#ffe3ee" stroke="#c2577f" stroke-width="5"/>`).join('')}
      <circle r="12" fill="#ffd54f" stroke="#b07d00" stroke-width="4"/></g>` },
    buah: { kotak: [338, 226, 104, 108], isi: `
      <path d="M390,256 C364,240 340,262 346,290 C352,318 374,330 390,322 C406,330 428,318 434,290 C440,262 416,240 390,256Z" fill="#e53935" stroke="#7f1d1d" stroke-width="6" stroke-linejoin="round"/>
      <path d="M364,272 Q358,288 364,300" stroke="#ff8a80" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M390,256 Q392,242 398,232" stroke="${GARIS}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M396,240 C404,228 422,228 426,236 C418,246 404,246 396,240Z" fill="#6cc24a" stroke="#2f6b1a" stroke-width="3"/>` },
  },
  gambarKeping(id) {
    const [x, y, w, h] = this.keping[id].kotak;
    return `<svg viewBox="${x} ${y} ${w} ${h}" width="100%" height="100%" overflow="visible">${this.keping[id].isi}</svg>`;
  },

  // Apel untuk Level 5 (merah = matang, hijau = belum)
  apel(warna) {
    const w = warna === 'merah' ? ['#e53935', '#7f1d1d', '#ff8a80'] : ['#8bc34a', '#33691e', '#c5e1a5'];
    return `<svg viewBox="-60 -66 120 120" width="100%" height="100%"><path d="M0,-30 C-30,-48 -56,-24 -50,8 C-44,40 -18,54 0,44 C18,54 44,40 50,8 C56,-24 30,-48 0,-30Z" fill="${w[0]}" stroke="${w[1]}" stroke-width="6" stroke-linejoin="round"/><path d="M-30,-14 Q-36,4 -30,16" stroke="${w[2]}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M0,-30 Q2,-44 8,-54" stroke="${GARIS}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M6,-46 C16,-62 38,-60 40,-50 C30,-40 14,-40 6,-46Z" fill="#6cc24a" stroke="#2f6b1a" stroke-width="4"/></svg>`;
  },

  // Pohon apel besar untuk Level 5 (900 × 760)
  pohon: () => `<svg viewBox="0 0 900 760" width="100%" height="100%">
    <ellipse cx="450" cy="740" rx="300" ry="22" fill="rgba(40,60,10,.25)"/>
    <path d="M410,740 Q430,560 404,420 L496,420 Q470,560 494,740Z" fill="#9b6533" stroke="${GARIS}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M420,470 C360,420 300,420 260,400 M480,470 C540,420 600,420 640,390" stroke="${GARIS}" stroke-width="30" fill="none" stroke-linecap="round"/>
    <path d="M420,470 C360,420 300,420 260,400 M480,470 C540,420 600,420 640,390" stroke="#9b6533" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M440,600 q10,24 0,48 M462,500 q-8,20 2,40" stroke="#6d4320" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M170,410 C60,410 30,290 110,240 C70,140 190,50 290,100 C330,10 560,10 610,100 C710,50 830,140 790,240 C870,290 840,410 730,410 C700,470 590,480 540,440 C500,480 400,480 360,440 C310,480 200,470 170,410Z" fill="#5cb83c" stroke="#2f6b1a" stroke-width="9" stroke-linejoin="round"/>
    <path d="M230,200 C260,170 300,170 320,190 M560,140 C590,120 630,124 650,150 M380,330 C410,310 450,312 470,330 M620,330 C650,310 690,316 700,340" stroke="#8edb5a" stroke-width="12" fill="none" stroke-linecap="round"/>
  </svg>`,

  // Keranjang anyaman: bagian belakang (lubang gelap) dan depan (anyaman)
  keranjangBelakang: () => `<svg viewBox="0 0 340 260" width="100%" height="100%">
    <path d="M60,90 C60,-10 280,-10 280,90" stroke="${GARIS}" stroke-width="22" fill="none" stroke-linecap="round"/>
    <path d="M60,90 C60,-10 280,-10 280,90" stroke="#c98a4e" stroke-width="12" fill="none" stroke-linecap="round"/>
    <ellipse cx="170" cy="100" rx="160" ry="38" fill="#6d4320" stroke="${GARIS}" stroke-width="7"/>
  </svg>`,
  keranjangDepan: () => `<svg viewBox="0 0 340 260" width="100%" height="100%">
    <path d="M10,100 Q170,150 330,100 L296,236 Q170,262 44,236Z" fill="#d79b5c" stroke="${GARIS}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M24,140 Q170,184 316,140 M34,182 Q170,222 306,182" stroke="#a8692f" stroke-width="7" fill="none"/>
    ${[70, 120, 170, 220, 270].map((x) => `<path d="M${x},${128 + Math.abs(170 - x) * -0.1} L${x + (x - 170) * -0.1},246" stroke="#a8692f" stroke-width="6"/>`).join('')}
    <path d="M10,100 Q170,150 330,100" stroke="#f0c088" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M10,100 Q170,150 330,100" stroke="${GARIS}" stroke-width="4" fill="none"/>
  </svg>`,

  // Tetes air untuk siraman teko
  tetes: () => `<svg viewBox="-20 -28 40 50" width="100%" height="100%"><path d="M0,-24 C12,-6 16,4 16,10 A16,16 0 0 1 -16,10 C-16,4 -12,-6 0,-24Z" fill="#64b5f6" stroke="#1565c0" stroke-width="4"/></svg>`,
};

// Sisipkan gambar SVG lain ke dalam gambar halaman (x, y, lebar, tinggi dalam satuan halaman)
const sisip = (svg, x, y, w, h) => svg.replace('width="100%" height="100%"', `x="${x}" y="${y}" width="${w}" height="${h}"`);

// Daun kering (untuk halaman pupuk)
const daunKering = (x, y, r, s, warna) => `<g transform="translate(${x},${y}) rotate(${r}) scale(${s})">
  <path d="M-30,0 C-20,-22 14,-24 32,0 C14,24 -20,22 -30,0Z" fill="${warna}" stroke="#6d4320" stroke-width="4" stroke-linejoin="round"/>
  <path d="M-34,0 L26,0 M-6,0 L6,-12 M-6,0 L6,12 M10,0 L18,-8 M10,0 L18,8" stroke="#6d4320" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;

// Gambar utama tiap halaman buku bergambar (480 × 520)
GAMBAR.halaman = {
  // Bingkai halaman: langit lembut + tanah
  langit: (tanahY = 330) => `<defs><linearGradient id="hl-langit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe7ff"/><stop offset="1" stop-color="#f4fbff"/></linearGradient></defs>
    <rect x="6" y="6" width="468" height="508" rx="26" fill="url(#hl-langit)"/>
    <circle cx="410" cy="70" r="36" fill="#ffe066"/>
    <path d="M6,${tanahY} Q120,${tanahY - 14} 240,${tanahY} T474,${tanahY} V488 Q474,514 448,514 H32 Q6,514 6,488Z" fill="#9a6a3c"/>
    <path d="M6,${tanahY} Q120,${tanahY - 14} 240,${tanahY} T474,${tanahY}" stroke="#6cc24a" stroke-width="14" fill="none" stroke-linecap="round"/>`,

  sampul() {
    return `<svg viewBox="0 0 480 520" width="100%" height="100%">${this.langit(400)}
      ${sisip(GAMBAR.pohon(), 40, 60, 400, 338)}
      ${[[150, 190], [250, 150], [330, 210], [200, 250], [300, 120]].map(([x, y]) => sisip(GAMBAR.apel('merah'), x, y, 46, 46)).join('')}
      ${sisip(GAMBAR.tunas(), 50, 360, 90, 75)}${sisip(GAMBAR.tunas(), 360, 362, 80, 68)}
    </svg>`;
  },

  // 1 sekop & lubang · 2 bibit masuk lubang · 3 ditutup tanah, tunas tumbuh
  bibit() {
    const lubang = (x) => `<path d="M${x - 40},334 Q${x - 38},392 ${x},394 Q${x + 38},392 ${x + 40},334Z" fill="#5a3416" stroke="${GARIS}" stroke-width="5"/>`;
    const nomor = (x, n) => `<circle cx="${x}" cy="200" r="26" fill="#fff" stroke="${GARIS}" stroke-width="5"/><text x="${x}" y="212" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="34" fill="${GARIS}">${n}</text>`;
    return `<svg viewBox="0 0 480 520" width="100%" height="100%">${this.langit()}
      ${lubang(90)}${lubang(240)}
      <path d="M346,334 Q390,290 434,334Z" fill="#7a4a22" stroke="${GARIS}" stroke-width="5"/>
      ${sisip(GAMBAR.tunas(), 330, 220, 120, 100)}
      ${sisip(GAMBAR.biji(), 222, 340, 36, 40)}
      ${sisip(GAMBAR.biji(), 222, 248, 36, 40)}
      <path d="M240,296 v22" stroke="${GARIS}" stroke-width="5" stroke-dasharray="6 6" stroke-linecap="round"/>
      <g transform="translate(118,250) rotate(-35)">
        <rect x="-7" y="-110" width="14" height="80" rx="6" fill="#b5793d" stroke="${GARIS}" stroke-width="4"/>
        <path d="M-26,-34 H26 V8 Q0,34 -26,8Z" fill="#b0bec5" stroke="${GARIS}" stroke-width="5" stroke-linejoin="round"/>
      </g>
      ${nomor(90, 1)}${nomor(240, 2)}${nomor(390, 3)}
      <path d="M140,150 q20,-14 40,0 M290,150 q20,-14 40,0" stroke="#8a7656" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M172,142 l10,8 -12,6 M322,142 l10,8 -12,6" stroke="#8a7656" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  },

  // Kotak kompos berisi daun kering & sisa bahan alami, di sampingnya karung pupuk
  pupuk() {
    const warna = ['#d9822b', '#b5651d', '#e0a43a', '#a0522d', '#c97a2a'];
    return `<svg viewBox="0 0 480 520" width="100%" height="100%">${this.langit(400)}
      <path d="M40,250 Q130,214 220,250 L220,260 L40,260Z" fill="#4a2e17"/>
      ${[[70, 236, 20], [110, 222, -30], [150, 226, 60], [190, 238, -10], [128, 244, 100]].map(([x, y, r], i) => daunKering(x, y, r, 0.8, warna[i])).join('')}
      <circle cx="96" cy="246" r="9" fill="#e53935" stroke="${GARIS}" stroke-width="3"/><path d="M168,248 q8,-12 16,0" stroke="#f3e1b0" stroke-width="7" fill="none"/>
      <rect x="34" y="252" width="192" height="160" rx="10" fill="#4a2e17"/>
      ${[264, 304, 344, 384].map((y) => `<rect x="30" y="${y}" width="200" height="30" rx="6" fill="#b07a42" stroke="${GARIS}" stroke-width="5"/>`).join('')}
      <rect x="26" y="248" width="16" height="170" rx="5" fill="#8d5a2b" stroke="${GARIS}" stroke-width="5"/>
      <rect x="218" y="248" width="16" height="170" rx="5" fill="#8d5a2b" stroke="${GARIS}" stroke-width="5"/>
      <text x="130" y="348" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="30" fill="#fff6e0" stroke="${GARIS}" stroke-width="6" paint-order="stroke">KOMPOS</text>
      ${daunKering(70, 120, 30, 0.9, warna[0])}${daunKering(170, 80, -20, 0.8, warna[2])}${daunKering(120, 170, 70, 0.7, warna[3])}
      <path d="M60,150 q-10,20 6,36 M200,120 q14,20 -2,40" stroke="#8a7656" stroke-width="4" fill="none" stroke-dasharray="6 6"/>
      ${sisip(GAMBAR.karung('pupuk'), 250, 150, 200, 266)}
    </svg>`;
  },

  // Teko penyiram menyiram tunas
  siram() {
    return `<svg viewBox="0 0 480 520" width="100%" height="100%">${this.langit(400)}
      <path d="M90,400 Q150,370 210,400Z" fill="#7a4a22" stroke="${GARIS}" stroke-width="5"/>
      ${sisip(GAMBAR.tunas(), 90, 290, 120, 100)}
      <g transform="rotate(-24 330 190)">${sisip(GAMBAR.teko(), 170, 80, 320, 240)}</g>
      ${[[186, 214, .9], [170, 250, .8], [196, 270, .7], [160, 300, .75], [188, 320, .6], [176, 352, .55]].map(([x, y, s]) => sisip(GAMBAR.tetes(), x - 16 * s, y - 20 * s, 32 * s, 40 * s)).join('')}
      <path d="M150,410 q20,10 40,0 M120,420 q30,14 60,0" stroke="#5aa0e0" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
    </svg>`;
  },

  // Pohon apel lengkap dengan akar terlihat; label bagian muncul satu per satu (data-bagian)
  pohon() {
    const label = (bagian, teks, lx, ly, tx, ty) => `<g class="label-bagian" data-bagian="${bagian}">
      <circle class="sorot" cx="${tx}" cy="${ty}" r="30" fill="none" stroke="#ffcf33" stroke-width="7"/>
      <path d="M${lx},${ly} L${tx},${ty}" stroke="${GARIS}" stroke-width="4" stroke-dasharray="7 6"/>
      <rect x="${lx - 62}" y="${ly - 24}" width="124" height="48" rx="24" fill="#fff" stroke="${GARIS}" stroke-width="5"/>
      <text x="${lx}" y="${ly + 11}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="30" fill="${GARIS}">${teks}</text></g>`;
    return `<svg viewBox="0 0 480 520" width="100%" height="100%">${this.langit(380)}
      <path d="M240,384 V420 M240,404 C222,430 190,438 172,470 M240,404 C258,432 292,440 310,474 M240,420 V492 M222,440 C204,448 186,444 168,452 M258,450 C276,456 296,452 312,460"
            stroke="#e8c79a" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M240,384 V420 M240,404 C222,430 190,438 172,470 M240,404 C258,432 292,440 310,474 M240,420 V492 M222,440 C204,448 186,444 168,452 M258,450 C276,456 296,452 312,460"
            stroke="#c48a52" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M214,384 Q226,300 218,230 L262,230 Q254,300 266,384Z" fill="#9b6533" stroke="${GARIS}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M222,262 C190,236 160,236 140,226 M258,262 C290,236 320,236 340,222" stroke="#9b6533" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M100,236 C40,236 26,170 70,140 C50,80 120,30 180,58 C204,6 330,8 352,60 C410,30 470,86 446,146 C484,180 456,240 400,238 C384,266 330,272 300,250 C276,272 214,274 190,250 C160,272 110,264 100,236Z"
            fill="#5cb83c" stroke="#2f6b1a" stroke-width="6" stroke-linejoin="round"/>
      <path d="M130,120 C150,100 180,100 192,114 M300,80 C320,66 350,68 362,86 M230,170 C250,156 280,158 292,170" stroke="#8edb5a" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${sisip(GAMBAR.bagian.daun, 30, 186, 70, 70)}
      ${sisip(GAMBAR.bagian.bunga, 352, 70, 64, 64)}${sisip(GAMBAR.bagian.bunga, 196, 54, 50, 50)}
      ${[[130, 150], [300, 150], [250, 196], [380, 180]].map(([x, y]) => sisip(GAMBAR.apel('merah'), x, y, 50, 50)).join('')}
      ${label('akar', 'Akar', 400, 470, 300, 466)}
      ${label('batang', 'Batang', 370, 330, 262, 320)}
      ${label('daun', 'Daun', 80, 300, 62, 222)}
      ${label('bunga', 'Bunga', 400, 30, 384, 96)}
      ${label('buah', 'Buah', 90, 44, 154, 170)}
    </svg>`;
  },

  // Apel merah (matang) dan apel hijau (belum matang) berdampingan
  buah() {
    const tanda = (x, teks, warna) => `<rect x="${x - 106}" y="404" width="212" height="56" rx="28" fill="${warna}" stroke="${GARIS}" stroke-width="5"/>
      <text x="${x}" y="441" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26" fill="#fff" stroke="${GARIS}" stroke-width="5" paint-order="stroke">${teks}</text>`;
    return `<svg viewBox="0 0 480 520" width="100%" height="100%">${this.langit(470)}
      <path d="M20,96 Q240,60 460,100" stroke="#8d5a2b" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M20,96 Q240,60 460,100" stroke="${GARIS}" stroke-width="4" fill="none"/>
      <path d="M120,86 v40 M360,86 v40" stroke="${GARIS}" stroke-width="6"/>
      ${sisip(GAMBAR.apel('merah'), 20, 110, 200, 200)}
      ${sisip(GAMBAR.apel('hijau'), 260, 110, 200, 200)}
      ${tanda(120, 'Matang ✓', '#e53935')}${tanda(360, 'Belum matang', '#7cb342')}
      <path d="M120,330 v60 M360,330 v60" stroke="#8a7656" stroke-width="5" stroke-dasharray="8 7" stroke-linecap="round"/>
    </svg>`;
  },
};
