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
      <path d="M106,254 C100,200 140,162 196,164 C196,220 160,258 106,254Z"/>
      <g transform="translate(499,120)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-22" rx="16" ry="22" transform="rotate(${a})"/>`).join('')}<circle r="12"/></g>
      <path d="M390,256 C364,240 340,262 346,290 C352,318 374,330 390,322 C406,330 428,318 434,290 C440,262 416,240 390,256Z"/>
    </g>
  </svg>`,

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
