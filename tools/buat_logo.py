"""Membuat logo web Petani Cilik: apel merah berdaun di atas bukit kebun.

Hasil di gambar/ikon/: logo.svg (favicon tajam), favicon-32/48.png,
apple-touch-icon.png, icon-192/512.png, icon-maskable-512.png.
Gambar dirender dengan Edge headless lalu diperkecil memakai Pillow.
Jalankan: .venv/Scripts/python.exe petani-cilik/tools/buat_logo.py
"""
import os
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

AKAR = Path(__file__).resolve().parent.parent
IKON = AKAR / 'gambar' / 'ikon'
EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
GARIS = '#4a2c14'


def logo(bulat=True, isi=1.0):
    """bulat: sudut membulat (favicon); isi: skala gambar (maskable perlu ruang aman)."""
    sudut = 112 if bulat else 0
    s = isi
    geser = 256 * (1 - s)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="langit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9edcff"/><stop offset="1" stop-color="#fff3c4"/>
    </linearGradient>
    <linearGradient id="bukit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fd35f"/><stop offset="1" stop-color="#4fa83b"/>
    </linearGradient>
    <radialGradient id="merah" cx=".36" cy=".34" r=".75">
      <stop offset="0" stop-color="#ff7a62"/><stop offset=".55" stop-color="#e8322b"/><stop offset="1" stop-color="#a5121a"/>
    </radialGradient>
    <linearGradient id="daun" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#3f9a32"/><stop offset="1" stop-color="#8bd65a"/>
    </linearGradient>
    <clipPath id="kotak"><rect width="512" height="512" rx="{sudut}"/></clipPath>
  </defs>
  <g clip-path="url(#kotak)">
    <rect width="512" height="512" fill="url(#langit)"/>
    <circle cx="420" cy="92" r="58" fill="#ffe066" opacity=".9"/>
    <path d="M0 392 Q140 330 256 352 Q380 372 512 330 V512 H0 Z" fill="url(#bukit)"/>
    <path d="M0 440 Q170 400 300 425 Q420 446 512 420 V512 H0 Z" fill="#3f9532" opacity=".55"/>
  </g>
  <g transform="translate({geser} {geser}) scale({s})">
    <ellipse cx="256" cy="452" rx="128" ry="20" fill="#2f6e22" opacity=".35"/>
    <path d="M256 176 C210 142 118 150 104 252 C92 344 150 446 214 450 C236 451 245 440 256 440
             C267 440 276 451 298 450 C362 446 420 344 408 252 C394 150 302 142 256 176 Z"
          fill="url(#merah)" stroke="{GARIS}" stroke-width="12" stroke-linejoin="round"/>
    <path d="M150 230 C140 270 146 320 166 356" fill="none" stroke="#fff" stroke-width="22"
          stroke-linecap="round" opacity=".55"/>
    <circle cx="176" cy="390" r="9" fill="#fff" opacity=".4"/>
    <path d="M256 182 C250 150 256 118 274 96" fill="none" stroke="{GARIS}" stroke-width="20" stroke-linecap="round"/>
    <path d="M256 182 C250 150 256 118 274 96" fill="none" stroke="#8a5a2b" stroke-width="9" stroke-linecap="round"/>
    <path d="M272 134 C298 82 368 70 404 92 C382 142 318 160 272 134 Z"
          fill="url(#daun)" stroke="{GARIS}" stroke-width="11" stroke-linejoin="round"/>
    <path d="M286 128 C320 112 352 102 382 98" fill="none" stroke="#2f7a25" stroke-width="7" stroke-linecap="round"/>
  </g>
</svg>'''


def render(svg, tujuan):
    with tempfile.TemporaryDirectory() as tmp:
        berkas = Path(tmp) / 'logo.svg'
        berkas.write_text(svg, encoding='utf-8')
        subprocess.run([EDGE, '--headless=new', '--disable-gpu', '--hide-scrollbars',
                        '--default-background-color=00000000', '--window-size=512,512',
                        f'--screenshot={tujuan}', berkas.as_uri()],
                       check=True, capture_output=True, timeout=60)


def main():
    IKON.mkdir(parents=True, exist_ok=True)
    bulat = logo(bulat=True)
    (IKON / 'logo.svg').write_text(bulat, encoding='utf-8')
    with tempfile.TemporaryDirectory() as tmp:
        a, b = Path(tmp) / 'bulat.png', Path(tmp) / 'penuh.png'
        render(bulat, a)
        render(logo(bulat=False, isi=0.8), b)
        gb = Image.open(a).convert('RGBA')
        gp = Image.open(b).convert('RGBA')
        for nama, ukuran, sumber in [('favicon-32.png', 32, gb), ('favicon-48.png', 48, gb),
                                     ('icon-192.png', 192, gb), ('icon-512.png', 512, gb),
                                     ('apple-touch-icon.png', 180, gp),
                                     ('icon-maskable-512.png', 512, gp)]:
            sumber.resize((ukuran, ukuran), Image.LANCZOS).save(IKON / nama, optimize=True)
            print('ok', nama, os.path.getsize(IKON / nama), 'byte')


if __name__ == '__main__':
    main()
