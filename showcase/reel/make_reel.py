"""The minimal site's project reel: two screenshots of each live site, each
floating on a blurred, darkened backdrop drawn from its own colours, pushing
in slowly and crossfading into the next, looping seamlessly.

  python showcase/reel/make_reel.py        # -> public/work/reel.mp4 and reel-poster.jpg

The screenshots in showcase/reel/shots/ were taken from each project's live
site at 1440 x 900; swap any of them and run this again.
"""
import subprocess
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / "public" / "work"
FF = imageio_ffmpeg.get_ffmpeg_exe()
W, H, FPS = 1600, 900, 30
SCENE, FADE = 3.5, 0.6                 # seconds a shot holds, and its crossfade
BOX_W, BOX_H = 1260, 709               # the largest a screen may sit on the canvas
RADIUS = 18
GROUND = (12, 13, 16)                  # the site's near-black, for the backdrop's shade

SHOTS_DIR = Path(__file__).resolve().parent / "shots"
# The screenshots, in the order they play: two of each site, never two of one site in a row.
SHOTS = [
    "verto-1.jpg",        # the two figures
    "scamtrail-1.jpg",    # Investigate before you trust
    "furlio-1.jpg",       # Furniture with a quiet presence
    "applyready-1.jpg",   # Every application, shortlist-ready
    "clinq-1.jpg",        # Healthcare that fits your life
    "honatrix-1.jpg",     # the home page
    "verto-2.jpg",        # HOOD
    "scamtrail-2.jpg",    # Allegations are not findings
    "furlio-2.jpg",       # the lounge chair, drawn front and side
    "applyready-2.jpg",   # the 12-day checklist
    "clinq-2.jpg",        # the patient dashboard
    "honatrix-2.jpg",     # its project pages
]


def rounded_mask(w, h, r):
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=255)
    return m


def fit(aw, ah):
    s = min(BOX_W / aw, BOX_H / ah)
    return round(aw * s), round(ah * s)


def backdrop(frame):
    """The screenshot's own colours, blurred to a soft field and shaded toward the ground."""
    small = frame.resize((48, 27), Image.BILINEAR).filter(ImageFilter.GaussianBlur(3))
    field = small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    return Image.blend(field, Image.new("RGB", (W, H), GROUND), 0.5)


class Scene:
    """One screenshot on its backdrop; frame k pushes the screen in a little further."""

    def __init__(self, name, n):
        self.shot, self.n = Image.open(SHOTS_DIR / name).convert("RGB"), n
        self.size = fit(*self.shot.size)
        self.back = backdrop(self.shot)

    def frame(self, k):
        sw, sh = self.size
        z = 0.955 + 0.045 * (k / max(1, self.n - 1))   # 95.5% to 100% over the shot
        w, h = round(sw * z), round(sh * z)
        x, y = (W - w) // 2, (H - h) // 2
        shadow = Image.new("L", (W, H), 0)
        ImageDraw.Draw(shadow).rounded_rectangle((x + 8, y + 28, x + w - 8, y + h + 28), RADIUS, fill=150)
        shadow = shadow.filter(ImageFilter.GaussianBlur(34))
        canvas = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), self.back, shadow)
        canvas.paste(self.shot.resize((w, h), Image.LANCZOS), (x, y), rounded_mask(w, h, RADIUS))
        return canvas


def main():
    hold, fade = round(SCENE * FPS), round(FADE * FPS)
    dest = WORK / "reel.mp4"
    scenes = [Scene(name, hold) for name in SHOTS]
    proc = subprocess.Popen([FF, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                             "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "26",
                             "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", str(dest)],
                            stdin=subprocess.PIPE)
    write = lambda im: proc.stdin.write(np.asarray(im, dtype=np.uint8).tobytes())  # noqa: E731
    # Each shot plays its middle, then crossfades into the next; the last fades into the
    # first shot's opening frames, and the reel starts just after them, so it loops clean.
    for i, sc in enumerate(scenes):
        nxt = scenes[(i + 1) % len(scenes)]
        for k in range(fade, hold - fade):  # its opening frames played inside the fade before it
            write(sc.frame(k))
        for k in range(fade):
            write(Image.blend(sc.frame(hold - fade + k), nxt.frame(k), (k + 1) / fade))
        print("shot", SHOTS[i], flush=True)
    proc.stdin.close()
    proc.wait()
    scenes[0].frame(hold // 2).save(WORK / "reel-poster.jpg", quality=86)
    print("wrote", dest)


if __name__ == "__main__":
    main()
