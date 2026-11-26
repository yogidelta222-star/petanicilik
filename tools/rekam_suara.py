"""Merekam suara Petani Cilik dengan ElevenLabs (eleven_v3), lalu memeriksanya.

Pemakaian (dari folder petani-cilik):
    python tools/daftar_kalimat.py                 # susun tools/kalimat.json dari NASKAH.md
    python tools/rekam_suara.py --hitung            # hitung kalimat & huruf yang belum direkam
    python tools/rekam_suara.py                     # rekam semua yang belum ada
    python tools/rekam_suara.py --ulang a.json      # rekam ulang kalimat tertentu
    python tools/rekam_suara.py --nada-saja         # ubah nada Justin ulang dari rekaman asli (tanpa kredit)

Cara kerja tiap kalimat:
  1. Rekam dengan eleven_v3 + "[Indonesian accent]" (logat Indonesia), hingga 6 versi.
  2. Ambil versi pertama yang UJUNGNYA UTUH (meredup, tidak berhenti mendadak) dan
     KATA-KATANYA BENAR menurut Whisper. Bila tidak ada, versi terbaik dipakai dan
     ujungnya dihaluskan (meredup 80 ms + hening 250 ms).
  3. Bila UBAH_NADA diisi, nada tokoh itu digeser (filter rubberband). Rekaman aslinya
     selalu disimpan di suara/asli/, jadi nada bisa diubah/dikembalikan tanpa merekam ulang.
Hasil: suara/<kode>.mp3 dan suara/daftar.js (kalimat → [berkas, detik selesai, detik mulai]).
API key: tools/.elevenlabs-key (jangan dibagikan; sudah di .gitignore).
"""
import argparse
import difflib
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import imageio_ffmpeg
import numpy as np

AKAR = Path(__file__).resolve().parent.parent
SUARA = AKAR / 'suara'
ASLI = SUARA / 'asli'
KUNCI = AKAR / 'tools' / '.elevenlabs-key'
WAKTU = AKAR / 'tools' / 'waktu-suara.json'
HASIL = AKAR / 'tools' / 'hasil-rekam.json'
FF = imageio_ffmpeg.get_ffmpeg_exe()
MODEL_WHISPER = r'C:/Users/ACER/AppData/Local/Temp/claude/dade6b2694032f4d/312f7c64-7efa-4e1b-aad2-b90edf845c53/scratchpad/whisper'

SUARA_TOKOH = {
    'nenek': 'hNbh1PL2BQ5XtGBJqEiu',   # Devi
    'justin': 'XjGYkUkzth8BPs29fmcV',  # Teddy Twinkle
    'ayah': 'X8n8hOy3e8VLQnHTUcc5',    # Bram (pilihan klien 26 Nov)
    'ibu': 'WQ4h6sgS9p2XXvLsESBT',     # Selina
    'pencerita': 'gmnazjXOFoOcWA59sd5m',  # Kira
}
UBAH_NADA = {'justin': (-1, 'preserved')}  # (semitone, formant). Pilihan klien: variasi B = nada turun 1, warna suara anak tetap
PENGATURAN = {'stability': 0.5, 'similarity_boost': 0.75, 'use_speaker_boost': True}
BATAS_UJUNG = -38   # dB (20 ms terakhir dibanding suara utama): di bawah ini = meredup wajar
MAKS_VERSI = 3   # hemat kredit (paket hampir habis); bila tetap terpotong, ujungnya dihaluskan


def nama_berkas(kunci: str) -> str:
    return hashlib.md5(kunci.encode('utf-8')).hexdigest()[:12] + '.mp3'


def rekam(kunci_api: str, kunci: str) -> bytes:
    tokoh, teks = kunci.split('|', 1)
    url = f'https://api.elevenlabs.io/v1/text-to-speech/{SUARA_TOKOH[tokoh]}?output_format=mp3_44100_128'
    badan = json.dumps({'text': '[Indonesian accent] ' + teks, 'model_id': 'eleven_v3', 'language_code': 'id',
                        'voice_settings': PENGATURAN}).encode()
    for coba in range(6):
        try:
            req = urllib.request.Request(url, data=badan, method='POST',
                                         headers={'xi-api-key': kunci_api, 'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504):
                time.sleep(5 * (coba + 1))
                continue
            sys.exit(f'Gagal dari ElevenLabs ({e.code}): {e.read()[:300]!r}')
        except Exception:  # noqa: BLE001
            time.sleep(5 * (coba + 1))
    sys.exit('ElevenLabs sibuk terus, coba lagi nanti.')


def pcm(nama) -> np.ndarray:
    # dibaca dari BERKAS (bukan pipa) agar hening sisipan MP3 di ujung dibuang, sama seperti browser
    return np.frombuffer(subprocess.run([FF, '-v', 'error', '-i', str(nama), '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'],
                                        capture_output=True).stdout, dtype=np.float32)


def ujung(nama) -> float:
    x = pcm(nama)
    n = len(x) // 320
    e = 20 * np.log10(np.sqrt((x[:n * 320].reshape(n, 320) ** 2).mean(1)) + 1e-9)
    return float(e[-1] - np.percentile(e, 90))


def haluskan(nama: str) -> bytes:
    dur = float(re.search(r'Duration: \d+:\d+:([\d.]+)', subprocess.run([FF, '-i', nama], capture_output=True, text=True).stderr).group(1))
    keluar = nama + '.halus.mp3'
    subprocess.run([FF, '-v', 'error', '-y', '-i', nama, '-af', f'afade=t=out:st={max(0, dur - 0.08):.3f}:d=0.08,apad=pad_dur=0.25',
                    '-b:a', '128k', keluar], check=True)
    data = Path(keluar).read_bytes()
    os.unlink(keluar)
    return data


def ubah_nada(asal: Path, tujuan: Path, atur):
    semitone, formant = atur if isinstance(atur, tuple) else (atur, 'shifted')
    subprocess.run([FF, '-v', 'error', '-y', '-i', str(asal), '-af',
                    f'rubberband=pitch={2 ** (semitone / 12):.4f}:formant={formant}:pitchq=quality', '-b:a', '128k', str(tujuan)], check=True)


def batas_ucapan(berkas: Path):
    """Detik awal & akhir ucapan (hening di depan/belakang dilewati pemutar)."""
    keluar = subprocess.run([FF, '-i', str(berkas), '-af', 'silencedetect=noise=-45dB:d=0.1', '-f', 'null', '-'],
                            capture_output=True, text=True).stderr
    d = re.search(r'Duration: (\d+):(\d+):([\d.]+)', keluar)
    total = int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3))
    mulai = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', keluar)]
    selesai = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', keluar)]
    awal = selesai[0] if mulai and mulai[0] <= 0.05 and selesai else 0.0
    akhir = mulai[-1] if mulai and (len(selesai) < len(mulai) or selesai[-1] >= total - 0.05) else total
    return round(max(0.0, awal - 0.05), 3), round(min(total, akhir + 0.15), 3)


def tulis_daftar(kalimat, waktu):
    peta = {}
    for k in kalimat:
        b = nama_berkas(k)
        if (SUARA / b).exists() and b in waktu:
            awal, akhir = waktu[b]
            peta[k] = [b, akhir, awal]
    (SUARA / 'daftar.js').write_text(
        '// Dibuat otomatis oleh tools/rekam_suara.py, jangan diubah manual.\n'
        '// Isi: "tokoh|kalimat" -> [berkas rekaman, detik ucapan selesai, detik ucapan mulai]\n'
        'window.KLIP_SUARA = ' + json.dumps(peta, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')


def bersih(s):
    return re.sub(r'[^a-z0-9 ]', ' ', s.lower().replace('-', ' ')).split()


def utama():
    ap = argparse.ArgumentParser()
    ap.add_argument('--hitung', action='store_true')
    ap.add_argument('--ulang', help='JSON berisi daftar kunci "tokoh|kalimat" yang direkam ulang')
    ap.add_argument('--nada-saja', action='store_true', help='ubah nada ulang dari suara/asli tanpa merekam')
    ap.add_argument('--serentak', type=int, default=4)
    arg = ap.parse_args()

    kalimat = json.loads((AKAR / 'tools' / 'kalimat.json').read_text(encoding='utf-8'))
    SUARA.mkdir(exist_ok=True)
    ASLI.mkdir(exist_ok=True)
    waktu = json.loads(WAKTU.read_text(encoding='utf-8')) if WAKTU.exists() else {}
    hasil = json.loads(HASIL.read_text(encoding='utf-8')) if HASIL.exists() else {}

    if arg.nada_saja:
        for k in kalimat:
            t = k.split('|')[0]
            b = nama_berkas(k)
            if not (ASLI / b).exists():
                continue
            if t in UBAH_NADA:
                ubah_nada(ASLI / b, SUARA / b, UBAH_NADA[t])
            else:
                (SUARA / b).write_bytes((ASLI / b).read_bytes())
            waktu[b] = list(batas_ucapan(SUARA / b))
        WAKTU.write_text(json.dumps(waktu, indent=0), encoding='utf-8')
        tulis_daftar(kalimat, waktu)
        print('nada diperbarui')
        return

    if arg.ulang:
        ulang = set(json.loads(Path(arg.ulang).read_text(encoding='utf-8')))
        sisa = [k for k in kalimat if k in ulang]
    else:
        sisa = [k for k in kalimat if not (SUARA / nama_berkas(k)).exists()]
    huruf = sum(len(k.split('|', 1)[1]) for k in sisa)
    print(f'{len(sisa)} kalimat, {huruf} huruf (± {huruf * 2}–{huruf * 3} kredit dengan rekam ulang).', flush=True)
    if arg.hitung or not sisa:
        return
    if not KUNCI.exists() or not KUNCI.read_text().strip():
        sys.exit(f'API key belum ada di {KUNCI}')
    kunci_api = KUNCI.read_text().strip()

    from faster_whisper import WhisperModel
    m = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8', download_root=MODEL_WHISPER)
    kunci_whisper = threading.Lock()

    def dengar(nama):
        with kunci_whisper:
            seg, _ = m.transcribe(nama, language='id', beam_size=5, without_timestamps=True)
            return ' '.join(s.text for s in seg).strip()

    def satu(k):
        teks = k.split('|', 1)[1]
        calon = []
        for i in range(MAKS_VERSI):
            data = rekam(kunci_api, k)
            fd, nama = tempfile.mkstemp(suffix='.mp3')
            os.write(fd, data)
            os.close(fd)
            try:
                u = ujung(nama)
                d = dengar(nama)
            finally:
                os.unlink(nama)
            cocok = difflib.SequenceMatcher(None, bersih(teks), bersih(d)).ratio()
            calon.append((cocok >= 0.85, u, cocok, d, data, i + 1))
            if cocok >= 0.85 and u <= BATAS_UJUNG:
                break
        calon.sort(key=lambda x: (not x[0], x[1]))
        benar, u, cocok, d, data, ke = calon[0]
        cara = f'v3 #{ke}'
        if u > BATAS_UJUNG:
            fd, nama = tempfile.mkstemp(suffix='.mp3')
            os.write(fd, data)
            os.close(fd)
            try:
                data = haluskan(nama)
            finally:
                os.unlink(nama)
            cara += ' +dihaluskan'
        b = nama_berkas(k)
        (ASLI / b).write_bytes(data)
        t = k.split('|')[0]
        if t in UBAH_NADA:
            ubah_nada(ASLI / b, SUARA / b, UBAH_NADA[t])
        else:
            (SUARA / b).write_bytes(data)
        return k, {'cara': cara, 'ujung': round(u, 1), 'cocok': round(cocok, 2), 'dengar': d}

    with ThreadPoolExecutor(max_workers=arg.serentak) as kolam:
        for n, tugas in enumerate(as_completed([kolam.submit(satu, k) for k in sisa]), start=1):
            k, h = tugas.result()
            hasil[k] = h
            b = nama_berkas(k)
            waktu[b] = list(batas_ucapan(SUARA / b))
            print(f"{n}/{len(sisa)} {h['cara']:18} cocok={h['cocok']:.2f} {k[:60]}", flush=True)
            if n % 10 == 0:
                WAKTU.write_text(json.dumps(waktu, indent=0), encoding='utf-8')
                HASIL.write_text(json.dumps(hasil, ensure_ascii=False, indent=1), encoding='utf-8')
    WAKTU.write_text(json.dumps(waktu, indent=0), encoding='utf-8')
    HASIL.write_text(json.dumps(hasil, ensure_ascii=False, indent=1), encoding='utf-8')
    tulis_daftar(kalimat, waktu)
    kurang = [k for k in sisa if hasil[k]['cocok'] < 0.85]
    print('SELESAI', len(sisa), '| dihaluskan:', sum('dihaluskan' in hasil[k]['cara'] for k in sisa), '| kata kurang cocok:', kurang)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    utama()
