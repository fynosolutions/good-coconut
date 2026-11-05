"""Prepare full-length, silent H.264 copies for inline browser playback."""
from pathlib import Path
import subprocess
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / 'instagram-downloads/goodcoconutny'
DEST = ROOT / 'public/assets/reels'
FFMPEG = ROOT.parent / '.tools/ffmpeg/ffmpeg.exe'
FILES = ['20260630_DaMc6xWOuDw', '20260714_Dawsd0yumpW', '20260714_DayYJ-2ANI1',
         '20260717_Da5Sy5WuSNR', '20260812_Db8t5qXMwCC', '20260906_Dc9cy5qskQD', '20261024_De4gy-Bz8Wu']

def convert(stem):
    source = SOURCE / f'{stem}.mp4'
    target = DEST / f'{stem}.mp4'
    subprocess.run([str(FFMPEG), '-y', '-v', 'error', '-i', str(source), '-map', '0:v:0',
        '-vf', 'scale=720:-2,fps=30', '-c:v', 'libx264', '-preset', 'medium', '-crf', '24',
        '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', '-threads', '2', str(target)], check=True)
    subprocess.run([str(FFMPEG), '-y', '-v', 'error', '-ss', '0.5', '-i', str(target),
        '-frames:v', '1', '-vf', 'scale=360:-2', '-q:v', '3', str(DEST / f'{stem}.jpg')], check=True)
    print(f'{stem}: {target.stat().st_size / 1024**2:.2f} MiB', flush=True)

if __name__ == '__main__':
    DEST.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=2) as pool:
        list(pool.map(convert, FILES))
