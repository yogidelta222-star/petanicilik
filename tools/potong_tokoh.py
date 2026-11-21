"""Memotong tokoh dari gambar (menghapus latar) untuk dipakai di game.

Pemakaian:  python tools/potong_tokoh.py bahan/tokoh/justin.png [bahan/tokoh/nenek2.jpg ...]
Hasil:      gambar/tokoh/<nama>.webp (latar transparan, dipangkas rapat)

Selain menghapus latar (rembg, model birefnet-general-lite), bagian dalam tokoh yang
ikut terhapus karena warnanya mirip latar (mis. putih mata, kancing putih) diisi
kembali: setiap lubang transparan yang tidak tersambung ke tepi gambar dianggap
bagian tokoh dan diberi warna aslinya.
Butuh: U2NET_HOME menunjuk folder model, dan NUMBA_DISABLE_JIT=1 di Windows.
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter
from rembg import new_session, remove

AKAR = Path(__file__).resolve().parent.parent
KELUAR = AKAR / 'gambar' / 'tokoh'
TINGGI = 900  # piksel; cukup tajam untuk layar lebar


def potong(sesi, asal: Path) -> Image.Image:
    asli = Image.open(asal).convert('RGBA')
    hasil = remove(asli.convert('RGB'), session=sesi)
    a = hasil.getchannel('A')
    tokoh = a.point(lambda v: 255 if v > 20 else 0)
    # lubang = bagian transparan yang tidak tersambung ke tepi
    w, h = tokoh.size
    pad = Image.new('L', (w + 2, h + 2), 255)
    pad.paste(ImageChops.invert(tokoh), (1, 1))
    ImageDraw.floodfill(pad, (0, 0), 0)
    lubang = pad.crop((1, 1, w + 1, h + 1)).point(lambda v: 255 if v == 255 else 0)
    # Seluruh bagian DALAM siluet tokoh dibuat padat (alpha penuh, warna asli), termasuk
    # bagian yang tadinya setengah tembus (putih mata dsb.). Hanya tepi luar (± 3 px) yang
    # tetap memakai alpha halus dari rembg agar pinggirnya tidak bergerigi.
    siluet = ImageChops.lighter(tokoh, lubang)
    dalam = siluet.filter(ImageFilter.MinFilter(7))
    alpha = ImageChops.lighter(a, dalam)
    gabung = Image.composite(asli, hasil, dalam)
    gabung.putalpha(alpha)
    bb = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
    gabung = gabung.crop(bb)
    if gabung.height > TINGGI:
        gabung = gabung.resize((round(gabung.width * TINGGI / gabung.height), TINGGI), Image.LANCZOS)
    return gabung


def utama():
    KELUAR.mkdir(parents=True, exist_ok=True)
    sesi = new_session('birefnet-general-lite')
    for p in sys.argv[1:]:
        asal = Path(p)
        nama = asal.stem.replace('2', '')
        g = potong(sesi, asal)
        tujuan = KELUAR / f'{nama}.webp'
        g.save(tujuan, quality=90, method=6)
        print(f'{asal.name} -> {tujuan.relative_to(AKAR)} {g.size}')


if __name__ == '__main__':
    utama()
