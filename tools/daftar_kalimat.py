"""Menyusun daftar kalimat yang direkam dari NASKAH.md.

Jalankan:  python tools/daftar_kalimat.py
Hasil:     tools/kalimat.json  → ["nenek|Kalimat.", "justin|Kalimat.", ...]

Setiap baris tabel naskah (No | Tokoh | Kalimat) dipecah per kalimat, karena
rekaman dibuat per kalimat (lebih mudah diperiksa dan diulang bila ada yang jelek).
Beberapa kalimat dalam satu sel dipisah dengan " · " (mis. "Satu! · Dua!").
"""
import json
import re
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent


def pecah_kalimat(teks: str) -> list[str]:
    bersih = re.sub(r'\s+', ' ', teks).strip()
    return [k.strip() for k in re.findall(r'[^.!?]+[.!?]*', bersih) if k.strip()]


def utama():
    naskah = (AKAR / 'NASKAH.md').read_text(encoding='utf-8')
    hasil = []
    for baris in naskah.splitlines():
        kolom = [k.strip() for k in baris.strip().strip('|').split('|')]
        if len(kolom) != 3 or kolom[1] not in ('Nenek', 'Justin'):
            continue
        tokoh = kolom[1].lower()
        teks = re.sub(r'\*\*\(baru[^)]*\)\*\*', '', kolom[2])  # buang tanda "(baru)"
        for bagian in teks.split(' · '):
            for k in pecah_kalimat(bagian):
                kunci = f'{tokoh}|{k}'
                if kunci not in hasil:
                    hasil.append(kunci)
    (AKAR / 'tools' / 'kalimat.json').write_text(json.dumps(hasil, ensure_ascii=False, indent=1), encoding='utf-8')
    huruf = sum(len(k.split('|', 1)[1]) for k in hasil)
    print(f'{len(hasil)} kalimat, {huruf} huruf →', 'tools/kalimat.json')
    for t in ('nenek', 'justin'):
        print(' ', t, sum(1 for k in hasil if k.startswith(t + '|')))


if __name__ == '__main__':
    utama()
