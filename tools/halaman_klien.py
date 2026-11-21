"""Membuat halaman "Periksa Suara Petani Cilik" untuk diterbitkan sebagai tautan bagi klien.

Jalankan:  python tools/halaman_klien.py
Hasil:     klien/periksa-suara.html  (+ suara/*.mp3 diterbitkan bersamanya)

Penilaian (✅/❌ + catatan) disimpan di database halaman: dokumen penilaian/<id penilai>.
"""
import json
import re
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent


def pecah(teks):
    return [k.strip() for k in re.findall(r'[^.!?]+[.!?]*', re.sub(r'\s+', ' ', teks).strip()) if k.strip()]


src = (AKAR / 'suara' / 'daftar.js').read_text(encoding='utf-8')
peta = json.loads(src[src.index('=') + 1:].strip().rstrip(';'))
hasil = json.loads((AKAR / 'tools' / 'hasil-rekam.json').read_text(encoding='utf-8'))

# Kelompokkan per bagian naskah (judul "## X. ...")
bagian, sekarang, sudah = [], None, set()
for baris in (AKAR / 'NASKAH.md').read_text(encoding='utf-8').splitlines():
    m = re.match(r'##\s+[A-Z]\.\s+(.+)', baris)
    if m:
        sekarang = {'judul': m.group(1).strip(), 'isi': []}
        bagian.append(sekarang)
        continue
    kol = [k.strip() for k in baris.strip().strip('|').split('|')]
    if sekarang is None or len(kol) != 3 or kol[1] not in ('Nenek', 'Justin'):
        continue
    teks = re.sub(r'\*\*\(baru[^)]*\)\*\*', '', kol[2])
    for potong in teks.split(' · '):
        for k in pecah(potong):
            kunci = f'{kol[1].lower()}|{k}'
            if kunci in peta and kunci not in sudah:
                sudah.add(kunci)
                h = hasil.get(kunci, {})
                catatan = []
                if h.get('cocok', 1) < 0.85:
                    catatan.append(f'Pemeriksa otomatis mendengar “{h.get("dengar", "")}”')
                if 'dihaluskan' in h.get('cara', ''):
                    catatan.append('Ujung kalimat dihaluskan; dengarkan apakah terdengar wajar')
                sekarang['isi'].append({'id': peta[kunci][0][:12], 't': kol[1].lower(), 'teks': k,
                                        'f': 'suara/' + peta[kunci][0], 'cek': ' · '.join(catatan)})
bagian = [b for b in bagian if b['isi']]
jumlah = sum(len(b['isi']) for b in bagian)

html = r"""<title>Periksa Suara Petani Cilik</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700&display=swap">
<style>
/* Tata letak: satu kolom daftar kalimat per bagian naskah, bilah aksi menempel di bawah. */
:root {
  --bg: #f4f8ef; --kartu: #ffffff; --fg: #26331f; --pudar: #63705a; --garis: #dfe8d6;
  --hijau: #3d8b2f; --hijau-lembut: #e3f2dc; --merah: #c2412d; --merah-lembut: #fbe5e0;
  --nenek: #8a5a2b; --justin: #2f6fb3; --kuning: #f2b632; --bayang: 0 1px 3px rgba(38, 51, 31, .1);
  --judul: "Baloo 2", "Trebuchet MS", sans-serif; --isi: "Nunito", "Segoe UI", sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #161c13; --kartu: #20281b; --fg: #e7efe0; --pudar: #a3b098; --garis: #34412c;
  --hijau: #7cc56a; --hijau-lembut: #24391e; --merah: #f08a73; --merah-lembut: #43231c;
  --nenek: #e0a86e; --justin: #7fb2ea; --kuning: #f2c45a; --bayang: 0 1px 3px rgba(0, 0, 0, .4); color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #161c13; --kartu: #20281b; --fg: #e7efe0; --pudar: #a3b098; --garis: #34412c;
  --hijau: #7cc56a; --hijau-lembut: #24391e; --merah: #f08a73; --merah-lembut: #43231c;
  --nenek: #e0a86e; --justin: #7fb2ea; --kuning: #f2c45a; --bayang: 0 1px 3px rgba(0, 0, 0, .4); color-scheme: dark; }
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--fg); font-family: var(--isi); font-size: 15px; line-height: 1.45; }
.bungkus { max-width: 860px; margin: 0 auto; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 22px 120px; }
h1 { font-family: var(--judul); font-size: clamp(26px, 5vw, 34px); line-height: 1.1; margin: 0 0 6px; text-wrap: balance; }
h2 { font-family: var(--judul); font-size: 19px; margin: 26px 0 8px; color: var(--hijau); }
.ket { color: var(--pudar); margin: 0 0 14px; max-width: 65ch; }
.suara { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 3px 11px; border-radius: 99px; font-weight: 700; font-size: 13px; color: #fff; }
.chip.nenek { background: var(--nenek); } .chip.justin { background: var(--justin); }
.alat { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
button { font: inherit; cursor: pointer; }
.tombol { border: 0; border-radius: 12px; padding: 9px 14px; font-weight: 700; background: var(--hijau); color: #fff; }
.tombol.halus { background: var(--hijau-lembut); color: var(--fg); }
.tombol:focus-visible, .nilai button:focus-visible, .main:focus-visible { outline: 3px solid var(--kuning); outline-offset: 2px; }
.status { color: var(--pudar); font-size: 13px; }
.daftar { display: flex; flex-direction: column; gap: 8px; }
.baris { display: grid; grid-template-columns: auto auto 1fr auto; gap: 6px 12px; align-items: center; background: var(--kartu);
  border: 2px solid var(--garis); border-radius: 14px; padding: 10px 12px; box-shadow: var(--bayang); }
.baris.ok { border-color: var(--hijau); } .baris.x { border-color: var(--merah); }
.baris.putar { box-shadow: 0 0 0 3px var(--kuning); }
.main { width: 40px; height: 40px; border-radius: 50%; border: 0; background: var(--hijau); color: #fff; font-size: 15px; }
.teks { min-width: 0; font-weight: 600; }
.cek { display: block; font-weight: 400; font-size: 13px; color: var(--merah); }
.nilai { display: flex; gap: 6px; }
.nilai button { border: 2px solid var(--garis); background: var(--kartu); border-radius: 10px; padding: 6px 10px; font-size: 16px; line-height: 1; }
.nilai button[aria-pressed="true"].ya { background: var(--hijau-lembut); border-color: var(--hijau); }
.nilai button[aria-pressed="true"].tidak { background: var(--merah-lembut); border-color: var(--merah); }
.catatan { grid-column: 3 / -1; width: 100%; border: 2px solid var(--garis); border-radius: 10px; padding: 7px 10px; font: inherit; background: var(--bg); color: var(--fg); }
.bawah { position: fixed; left: 0; right: 0; bottom: 0; background: var(--kartu); border-top: 2px solid var(--garis);
  padding: 10px max(16px, env(safe-area-inset-right, 0px)) calc(10px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px)); }
.bawah .isi { max-width: 860px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; justify-content: space-between; }
.hitung { font-weight: 700; font-variant-numeric: tabular-nums; }
@media (max-width: 560px) {
  .baris { grid-template-columns: auto 1fr; }
  .baris .chip { grid-column: 2; justify-self: start; }
  .teks { grid-column: 1 / -1; }
  .nilai { grid-column: 1 / -1; }
  .nilai button { flex: 1; }
  .catatan { grid-column: 1 / -1; }
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
</style>
<div class="bungkus">
  <h1>Periksa Suara Petani Cilik</h1>
  <p class="ket">Dengarkan setiap kalimat. Tandai ✅ bila sudah pas, atau ❌ bila ada yang perlu diperbaiki (salah ucap, logat tidak Indonesia, terpotong, kurang ceria) lalu tulis catatannya. Penilaian tersimpan otomatis.</p>
  <div class="suara"><span class="chip nenek">Nenek · suara Devi</span><span class="chip justin">Justin · suara Teddy Twinkle</span></div>
  <div class="alat">
    <button class="tombol" id="putarSemua">▶ Putar berurutan</button>
    <button class="tombol halus" id="berhenti">■ Berhenti</button>
    <span class="status" id="status">Menyiapkan penyimpanan…</span>
  </div>
  <div id="isi"></div>
</div>
<div class="bawah"><div class="isi">
  <span class="hitung" id="hitung"></span>
  <button class="tombol halus" id="salin">📋 Salin daftar perbaikan</button>
</div></div>
<script>
const BAGIAN = __DATA__;
const SEMUA = BAGIAN.flatMap((b) => b.isi);
const nilai = {};     // id -> 'ok' | 'x'
const catatan = {};   // id -> teks
const isi = document.getElementById('isi');
const status = document.getElementById('status');
const pemutar = new Audio();
let urutan = null;

BAGIAN.forEach((b) => {
  const h = document.createElement('h2'); h.textContent = b.judul; isi.appendChild(h);
  const d = document.createElement('div'); d.className = 'daftar'; isi.appendChild(d);
  b.isi.forEach((k) => {
    const el = document.createElement('div');
    el.className = 'baris'; el.id = 'k-' + k.id;
    el.innerHTML = `<button class="main" aria-label="Putar">▶</button>
      <span class="chip ${k.t}">${k.t === 'nenek' ? 'Nenek' : 'Justin'}</span>
      <span class="teks"></span>
      <span class="nilai"><button class="ya" aria-pressed="false" aria-label="Sudah pas">✅</button><button class="tidak" aria-pressed="false" aria-label="Perlu diperbaiki">❌</button></span>
      <input class="catatan" id="c-${k.id}" placeholder="Catatan: apa yang perlu diperbaiki?" hidden>`;
    el.querySelector('.teks').textContent = k.teks;
    if (k.cek) { const c = document.createElement('span'); c.className = 'cek'; c.textContent = k.cek; el.querySelector('.teks').appendChild(c); }
    el.querySelector('.main').onclick = () => { urutan = null; putar(k); };
    el.querySelector('.ya').onclick = () => tandai(k.id, 'ok');
    el.querySelector('.tidak').onclick = () => tandai(k.id, 'x');
    el.querySelector('.catatan').addEventListener('input', (e) => { catatan[k.id] = e.target.value; simpanNanti(); });
    d.appendChild(el);
  });
});

function tampilkan() {
  SEMUA.forEach((k) => {
    const el = document.getElementById('k-' + k.id);
    el.classList.toggle('ok', nilai[k.id] === 'ok');
    el.classList.toggle('x', nilai[k.id] === 'x');
    el.querySelector('.ya').setAttribute('aria-pressed', String(nilai[k.id] === 'ok'));
    el.querySelector('.tidak').setAttribute('aria-pressed', String(nilai[k.id] === 'x'));
    const c = el.querySelector('.catatan');
    c.hidden = nilai[k.id] !== 'x';
    if (document.activeElement !== c) c.value = catatan[k.id] || '';
  });
  const ok = SEMUA.filter((k) => nilai[k.id] === 'ok').length, x = SEMUA.filter((k) => nilai[k.id] === 'x').length;
  document.getElementById('hitung').textContent = `${ok} ✅ · ${x} ❌ · ${SEMUA.length - ok - x} belum dinilai (dari ${SEMUA.length})`;
}

function tandai(id, v) { nilai[id] = nilai[id] === v ? undefined : v; if (!nilai[id]) delete nilai[id]; tampilkan(); simpanNanti(); }

function putar(k) {
  document.querySelectorAll('.baris.putar').forEach((e) => e.classList.remove('putar'));
  const el = document.getElementById('k-' + k.id);
  el.classList.add('putar'); el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  pemutar.src = k.f;
  pemutar.onended = () => {
    el.classList.remove('putar');
    if (urutan === null) return;
    urutan++;
    if (urutan < SEMUA.length) setTimeout(() => putar(SEMUA[urutan]), 350); else urutan = null;
  };
  pemutar.play().catch(() => {});
}
document.getElementById('putarSemua').onclick = () => { urutan = 0; putar(SEMUA[0]); };
document.getElementById('berhenti').onclick = () => { urutan = null; pemutar.pause(); document.querySelectorAll('.baris.putar').forEach((e) => e.classList.remove('putar')); };

// ---------- Penyimpanan: database halaman (bila tersedia), cadangan di browser ----------
let dok = null, menyimpan = false, lagi = false, waktu = null;
function simpanLokal() { try { localStorage.setItem('periksa-suara', JSON.stringify({ nilai, catatan })); } catch (e) {} }
function bacaLokal() { try { const d = JSON.parse(localStorage.getItem('periksa-suara') || 'null'); if (d) { Object.assign(nilai, d.nilai || {}); Object.assign(catatan, d.catatan || {}); } } catch (e) {} }
function simpanNanti() { simpanLokal(); clearTimeout(waktu); waktu = setTimeout(simpan, 700); }
async function simpan() {
  if (!dok) return;
  if (menyimpan) { lagi = true; return; }
  menyimpan = true;
  try { await dok.set({ nilai: { ...nilai }, catatan: { ...catatan }, diubah: new Date().toISOString() }); status.textContent = 'Tersimpan ✓'; }
  catch (e) { status.textContent = 'Belum bisa menyimpan ke server; penilaian tersimpan di browser ini. Pakai "Salin daftar perbaikan".'; dok = null; }
  menyimpan = false;
  if (lagi) { lagi = false; simpan(); }
}
bacaLokal(); tampilkan();
(async () => {
  try {
    const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
    const id = user ? await user.id() : null;
    if (!db || !id) { status.textContent = 'Penilaian tersimpan di browser ini. Setelah selesai, tekan "Salin daftar perbaikan".'; return; }
    dok = db.doc('penilaian/' + id);
    const s = await dok.get();
    if (s.exists) { const d = s.data(); Object.assign(nilai, d.nilai || {}); Object.assign(catatan, d.catatan || {}); tampilkan(); }
    status.textContent = 'Penilaian tersimpan otomatis.';
  } catch (e) { status.textContent = 'Penilaian tersimpan di browser ini. Setelah selesai, tekan "Salin daftar perbaikan".'; }
})();

document.getElementById('salin').onclick = async () => {
  const salah = SEMUA.filter((k) => nilai[k.id] === 'x').map((k) => `- ${k.t === 'nenek' ? 'Nenek' : 'Justin'}: ${k.teks}${catatan[k.id] ? ' → ' + catatan[k.id] : ''}`);
  const teks = `PERIKSA SUARA PETANI CILIK\nPerlu diperbaiki (${salah.length}):\n${salah.join('\n') || '- (tidak ada)'}`;
  try { await navigator.clipboard.writeText(teks); status.textContent = 'Daftar perbaikan disalin. Tempel di chat, ya!'; }
  catch (e) { status.textContent = teks; }
};
</script>
""".replace('__DATA__', json.dumps(bagian, ensure_ascii=False))

KELUAR = AKAR / 'klien'
KELUAR.mkdir(exist_ok=True)
(KELUAR / 'periksa-suara.html').write_text(html, encoding='utf-8')
print('ok', jumlah, 'kalimat dalam', len(bagian), 'bagian')
