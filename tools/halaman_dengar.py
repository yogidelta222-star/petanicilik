"""Membuat halaman dengar untuk memeriksa rekaman dengan telinga.

Jalankan:  python tools/halaman_dengar.py
Buka:      http://localhost:5500/petani-cilik/dengar/  (saat pratinjau lokal berjalan)
Tiap kalimat bisa diberi ✅ / ❌, lalu "Salin hasil" untuk ditempel di chat.
"""
import json
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent
kalimat = json.loads((AKAR / 'tools' / 'kalimat.json').read_text(encoding='utf-8'))
src = (AKAR / 'suara' / 'daftar.js').read_text(encoding='utf-8')
peta = json.loads(src[src.index('=') + 1:].strip().rstrip(';'))
hasil = json.loads((AKAR / 'tools' / 'hasil-rekam.json').read_text(encoding='utf-8')) if (AKAR / 'tools' / 'hasil-rekam.json').exists() else {}

item = []
for k in kalimat:
    if k not in peta:
        continue
    tokoh, teks = k.split('|', 1)
    h = hasil.get(k, {})
    item.append({'k': k, 't': tokoh, 'teks': teks, 'f': '../suara/' + peta[k][0],
                 'cat': '' if h.get('cocok', 1) >= 0.85 else f"pemeriksa mendengar: “{h.get('dengar', '')}”"})

KELUAR = AKAR / 'dengar'
KELUAR.mkdir(exist_ok=True)
(KELUAR / 'index.html').write_text("""<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Periksa Suara Petani Cilik</title>
<style>
body{font-family:system-ui,sans-serif;max-width:820px;margin:0 auto;padding:16px 16px 90px;background:#f3faf0;color:#22301c}
h1{font-size:23px}.ket{color:#556}.baris{display:flex;align-items:center;gap:10px;background:#fff;border-radius:12px;padding:8px 12px;margin:6px 0;box-shadow:0 1px 4px #0001}
.no{width:26px;color:#889;font-size:13px}.tk{font-size:12px;font-weight:700;border-radius:99px;padding:2px 9px;color:#fff}.nenek{background:#8d5524}.justin{background:#1c7ed6}
.teks{flex:1}.teks small{display:block;color:#c92a2a}.main{border:0;border-radius:50%;width:38px;height:38px;background:#2f9e44;color:#fff;font-size:16px;cursor:pointer}
.nilai button{border:0;border-radius:10px;padding:7px 10px;margin-left:4px;background:#eef3ec;cursor:pointer;font-size:16px}.nilai button.on{background:#ffd43b}
.bawah{position:fixed;left:0;right:0;bottom:0;background:#22301c;color:#fff;display:flex;gap:14px;justify-content:center;align-items:center;padding:12px}
.bawah button{border:0;border-radius:10px;padding:9px 16px;font-weight:700;cursor:pointer}
</style>
<h1>🌱 Periksa Suara Petani Cilik</h1>
<p class="ket">Tekan ▶ untuk mendengar. Beri ✅ bila pas, ❌ bila ada yang salah (salah ucap, terpotong, logat aneh). Selesai? Tekan <b>Salin hasil</b> lalu tempel di chat.
<button id="semua">▶ Putar berurutan</button></p>
<div id="daftar"></div>
<div class="bawah"><span id="hitung"></span><button id="salin">📋 Salin hasil</button></div>
<script>
const DATA = """ + json.dumps(item, ensure_ascii=False) + """;
const nilai = {};
const el = document.getElementById('daftar');
const a = new Audio();
DATA.forEach((d, i) => {
  el.insertAdjacentHTML('beforeend', `<div class="baris" id="b${i}"><span class="no">${i + 1}</span><button class="main" data-i="${i}">▶</button>
    <span class="tk ${d.t}">${d.t === 'nenek' ? 'Nenek' : 'Justin'}</span><span class="teks">${d.teks}${d.cat ? `<small>${d.cat}</small>` : ''}</span>
    <span class="nilai"><button data-i="${i}" data-v="ok">✅</button><button data-i="${i}" data-v="x">❌</button></span></div>`);
});
const putar = (i, lanjut) => { a.src = DATA[i].f; a.onended = lanjut ? () => { if (i + 1 < DATA.length) putar(i + 1, true); } : null; a.play(); document.getElementById('b' + i).scrollIntoView({block: 'center', behavior: 'smooth'}); };
el.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.classList.contains('main')) return putar(+b.dataset.i, false);
  nilai[b.dataset.i] = b.dataset.v;
  b.parentElement.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
  hitung();
});
document.getElementById('semua').onclick = () => putar(0, true);
const hitung = () => { const v = Object.values(nilai); document.getElementById('hitung').textContent = `${v.filter((x) => x === 'ok').length} ✅ · ${v.filter((x) => x === 'x').length} ❌ dari ${DATA.length}`; };
hitung();
document.getElementById('salin').onclick = () => {
  const salah = DATA.filter((d, i) => nilai[i] === 'x').map((d) => `- ${d.t === 'nenek' ? 'Nenek' : 'Justin'}: ${d.teks}`);
  const teks = `HASIL PERIKSA SUARA PETANI CILIK\\nPerlu diperbaiki (${salah.length}):\\n${salah.join('\\n') || '- (tidak ada)'}`;
  navigator.clipboard.writeText(teks).then(() => alert('Hasil disalin. Tempel di chat, ya!'));
};
</script>
""", encoding='utf-8')
print('Halaman dengar dibuat:', len(item), 'kalimat →', KELUAR / 'index.html')
