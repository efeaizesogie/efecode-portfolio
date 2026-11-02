"""Recaptures the reel's screenshots from the live sites at high density.

  python showcase/reel/capture.py [name ...]     # -> showcase/reel/shots/<name>.jpg, replaced

Each shot in shots/ is matched by scrolling its live site at 1440 x 900 and
keeping the scroll position that looks most like it, then retaken at
SCALE x density (3600 x 2250 at 2.5), sharp enough for a 4K reel. A shot
whose site does not load keeps its old capture.
"""
import asyncio
import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from playwright.async_api import async_playwright

HERE = Path(__file__).resolve().parent
SHOTS = HERE / "shots"
SCALE = 2.5
SITES = {
    "verto": "https://verto-orcin-phi.vercel.app/",
    "scamtrail": "https://scamtrail.vercel.app/",
    "furlio": "https://jocular-alpaca-f1859d.netlify.app/",
    "applyready": "https://applyready-gamma.vercel.app/",
    "clinq": "https://clinq-brown.vercel.app/",
    "honatrix": "https://honatrix.com/",
}
SMALL = (180, 112)


def look(img):
    return np.asarray(img.convert("L").resize(SMALL, Image.BILINEAR), dtype=np.float32)


async def settle(page, ms=900):
    await page.wait_for_timeout(ms)


async def score(page, y, target, wait=350):
    await page.evaluate(f"scrollTo(0, {y})")
    await settle(page, wait)
    shot = Image.open(io.BytesIO(await page.screenshot(type="jpeg", quality=60)))
    return float(((look(shot) - target) ** 2).mean()), y


async def find_y(page, target):
    """The scroll position whose view looks most like the target shot: a coarse pass down the
    page, then a fine one around the best of it."""
    height = await page.evaluate("document.documentElement.scrollHeight")
    best = (1e18, 0)
    for y in range(0, max(1, height - 900) + 1, 150):
        best = min(best, await score(page, y, target))
    for y in range(max(0, best[1] - 120), best[1] + 121, 40):
        best = min(best, await score(page, y, target))
    return best


async def main(names):
    async with async_playwright() as pw:
        b = await pw.chromium.launch(channel="msedge")
        scan = await b.new_page(viewport={"width": 1440, "height": 900})
        sharp = await b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=SCALE)
        for name in names:
            site = name.rsplit("-", 1)[0]
            target = look(Image.open(SHOTS / f"{name}.jpg"))
            try:
                # "load", not "networkidle": the 3D sites keep the network busy for good.
                await scan.goto(SITES[site], wait_until="load", timeout=90000)
                await settle(scan, 6000)
                err, y = await find_y(scan, target)
                # Walk the page down to y on the sharp page too, so scroll-driven scenes are in step.
                await sharp.goto(SITES[site], wait_until="load", timeout=90000)
                await settle(sharp, 6000)
                for yy in range(0, y + 1, 150):
                    await sharp.evaluate(f"scrollTo(0, {yy})")
                    await settle(sharp, 120)
                await sharp.evaluate(f"scrollTo(0, {y})")
                await settle(sharp, 3500)
                out = SHOTS / f"{name}.jpg"
                await sharp.screenshot(path=str(out), type="jpeg", quality=92)
                got = look(Image.open(out))
                print(f"{name}: y={y} scan err={err:.0f} sharp err={float(((got - target) ** 2).mean()):.0f}", flush=True)
            except Exception as e:  # keep the old capture
                print(f"{name}: kept the old capture ({type(e).__name__})", flush=True)
        await b.close()


if __name__ == "__main__":
    all_names = sorted(p.stem for p in SHOTS.glob("*.jpg"))
    asyncio.run(main(sys.argv[1:] or all_names))
