"""The minimal site's project reel: two screenshots of each live site, each
floating on a blurred, darkened backdrop drawn from its own colours, pushing
in slowly and crossfading into the next, looping seamlessly.

  python showcase/reel/capture.py          # retake the screenshots at high density (optional)
  python showcase/reel/make_reel.py        # -> public/work/reel-4k.mp4, reel.mp4 and reel-poster.jpg

Rendered at 3840 x 2160 for wide screens, with a 1920 x 1080 cut for phones.
The screenshots in showcase/reel/shots/ come from each project's live site
(capture.py retakes them at 3600 x 2250); swap any and run again.
"""
import subprocess
from multiprocessing import Pool, cpu_count
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / "public" / "work"
FF = imageio_ffmpeg.get_ffmpeg_exe()
W, H, FPS = 3840, 2160, 30
K = W / 1600                           # the layout was drawn at 1600 wide; everything scales by this
SCENE, FADE = 3.5, 0.6                 # seconds a shot holds, and its crossfade
BOX_W, BOX_H = round(1260 * K), round(709 * K)   # the largest a screen may sit on the canvas
RADIUS = round(18 * K)
GROUND = (12, 13, 16)                  # the site's near-black, for the backdrop's shade

SHOTS_DIR = Path(__file__).resolve().parent / "shots"
# The screenshots, in the order they play: two of each site, never two of one site in a row.
SHOTS = [
    "verto-1",        # the two figures
    "scamtrail-1",    # Investigate before you trust
    "furlio-1",       # Furniture with a quiet presence
    "applyready-1",   # Every application, shortlist-ready
    "clinq-1",        # Healthcare that fits your life
    "honatrix-1",     # the home page
    "verto-2",        # HOOD
    "scamtrail-2",    # Allegations are not findings
    "furlio-2",       # the lounge chair, drawn front and side
    "applyready-2",   # the 12-day checklist
    "clinq-2",        # the patient dashboard
    "honatrix-2",     # its project pages
]
HOLD, FADE_N = round(SCENE * FPS), round(FADE * FPS)


def shot_path(name):
    return SHOTS_DIR / f"{name}.jpg"


def fit(aw, ah):
    s = min(BOX_W / aw, BOX_H / ah)
    return round(aw * s), round(ah * s)


def backdrop(frame):
    """The screenshot's own colours, blurred to a soft field and shaded toward the ground."""
    small = frame.resize((48, 27), Image.BILINEAR).filter(ImageFilter.GaussianBlur(3))
    field = small.resize((W // 4, H // 4), Image.BICUBIC).filter(ImageFilter.GaussianBlur(8))
    field = field.resize((W, H), Image.BICUBIC)
    return Image.blend(field, Image.new("RGB", (W, H), GROUND), 0.5)


class Scene:
    """One screenshot on its backdrop; frame k pushes the screen in a little further."""

    def __init__(self, name):
        self.shot = Image.open(shot_path(name)).convert("RGB")
        self.size = fit(*self.shot.size)
        self.back = backdrop(self.shot)

    def frame(self, k):
        sw, sh = self.size
        z = 0.955 + 0.045 * (k / max(1, HOLD - 1))   # 95.5% to 100% over the shot
        w, h = round(sw * z), round(sh * z)
        x, y = (W - w) // 2, (H - h) // 2
        # The shadow is drawn and blurred at a quarter size, then scaled up: same look, far cheaper.
        q = 4
        sm = Image.new("L", (W // q, H // q), 0)
        ImageDraw.Draw(sm).rounded_rectangle(
            ((x + 8 * K) / q, (y + 28 * K) / q, (x + w - 8 * K) / q, (y + h + 28 * K) / q), RADIUS / q, fill=150)
        shadow = sm.filter(ImageFilter.GaussianBlur(34 * K / q)).resize((W, H), Image.BILINEAR)
        canvas = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), self.back, shadow)
        mask = Image.new("L", (w, h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), RADIUS, fill=255)
        canvas.paste(self.shot.resize((w, h), Image.LANCZOS), (x, y), mask)
        # A faint light edge, so a dark screen still reads against its dark backdrop.
        edge = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(edge).rounded_rectangle((x, y, x + w - 1, y + h - 1), RADIUS,
                                               outline=(255, 255, 255, 34), width=max(1, round(K)))
        return Image.alpha_composite(canvas.convert("RGBA"), edge).convert("RGB")


_scenes = {}


def scene(i):
    if i not in _scenes:
        _scenes[i] = Scene(SHOTS[i])
    return _scenes[i]


def render(task):
    """One output frame as raw RGB bytes: a shot's frame, or a crossfade into the next."""
    i, k, fade = task
    a = scene(i).frame(k)
    if fade is not None:
        a = Image.blend(a, scene((i + 1) % len(SHOTS)).frame(fade), (fade + 1) / FADE_N)
    return np.asarray(a, dtype=np.uint8).tobytes()


def tasks():
    # Each shot plays its middle, then crossfades into the next; the last fades into the first
    # shot's opening frames, and the reel starts just after them, so it loops clean.
    for i in range(len(SHOTS)):
        for k in range(FADE_N, HOLD - FADE_N):  # its opening frames played inside the fade before it
            yield (i, k, None)
        for k in range(FADE_N):
            yield (i, HOLD - FADE_N + k, k)


def main():
    big, small = WORK / "reel-4k.mp4", WORK / "reel.mp4"
    proc = subprocess.Popen(
        [FF, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-filter_complex", "[0:v]split=2[a][b];[b]scale=1920:1080:flags=lanczos[s]",
         "-map", "[a]", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
         "-profile:v", "high", "-level", "5.1", "-movflags", "+faststart", "-an", str(big),
         "-map", "[s]", "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", "-an", str(small)],
        stdin=subprocess.PIPE)
    jobs = list(tasks())
    workers = max(1, cpu_count() - 1)
    # In batches, so finished 4K frames (25 MB each) never pile up faster than ffmpeg takes them.
    with Pool(workers) as pool:
        for start in range(0, len(jobs), workers * 2):
            for frame in pool.map(render, jobs[start:start + workers * 2], chunksize=1):
                proc.stdin.write(frame)
            print(f"frame {start}/{len(jobs)}", flush=True)
    proc.stdin.close()
    proc.wait()
    scene(0).frame(HOLD // 2).resize((2560, 1440), Image.LANCZOS).save(WORK / "reel-poster.jpg", quality=88)
    print("wrote", big, small)


if __name__ == "__main__":
    main()
