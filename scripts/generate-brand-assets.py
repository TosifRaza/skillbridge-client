"""Create platform-sized copies of the supplied SkillBridge logo image."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "images" / "skillbridge-brand-logo.png"
ANDROID_RES = ROOT / "android" / "app" / "src" / "main" / "res"


def save_png(path: Path, image: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", optimize=True)


with Image.open(SOURCE) as original:
    logo = original.convert("RGBA")

if logo.width != logo.height:
    raise ValueError(f"Expected a square source logo, got {logo.size}")

# Web, PWA, and home-screen icon variants are only resampled from the exact
# supplied image. No alternate mark, crop, overlay, or recoloring is applied.
for size in (32, 180, 192, 512):
    output = logo.resize((size, size), Image.Resampling.LANCZOS)
    if size == 32:
        save_png(ROOT / "public" / "favicon.png", output)
    save_png(ROOT / "public" / "icons" / f"skillbridge-{size}.png", output)

# Adaptive Android icons use the supplied image as their complete background;
# the transparent foreground leaves that artwork unchanged under the launcher mask.
for density, size in (("mdpi", 108), ("hdpi", 162), ("xhdpi", 216), ("xxhdpi", 324), ("xxxhdpi", 432)):
    output = logo.resize((size, size), Image.Resampling.LANCZOS)
    save_png(ANDROID_RES / f"mipmap-{density}" / "ic_launcher.png", output)
    save_png(ANDROID_RES / f"mipmap-{density}" / "ic_launcher_round.png", output)
    save_png(ANDROID_RES / f"mipmap-{density}" / "ic_launcher_foreground.png", Image.new("RGBA", (size, size), (0, 0, 0, 0)))

def splash(width: int, height: int) -> Image.Image:
    background_color = logo.getpixel((0, 0))
    image = Image.new("RGBA", (width, height), background_color)
    size = round(min(width, height) * 0.78)
    mark = logo.resize((size, size), Image.Resampling.LANCZOS)
    image.alpha_composite(mark, ((width - size) // 2, round(height * 0.28)))

    font_size = round(min(width, height) * 0.075)
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except OSError:
        font = ImageFont.load_default(size=font_size)
    draw = ImageDraw.Draw(image)
    label = "SkillBridge"
    bounds = draw.textbbox((0, 0), label, font=font)
    label_y = round(height * 0.28) + size + round(height * 0.035)
    draw.text(((width - (bounds[2] - bounds[0])) / 2, label_y), label, font=font, fill=(26, 22, 44, 255))
    return image.convert("RGB")


splash_sizes = {
    "drawable/splash.png": (480, 320),
    "drawable-port-mdpi/splash.png": (320, 480),
    "drawable-port-hdpi/splash.png": (480, 800),
    "drawable-port-xhdpi/splash.png": (720, 1280),
    "drawable-port-xxhdpi/splash.png": (960, 1600),
    "drawable-port-xxxhdpi/splash.png": (1280, 1920),
    "drawable-land-mdpi/splash.png": (480, 320),
    "drawable-land-hdpi/splash.png": (800, 480),
    "drawable-land-xhdpi/splash.png": (1280, 720),
    "drawable-land-xxhdpi/splash.png": (1600, 960),
    "drawable-land-xxxhdpi/splash.png": (1920, 1280),
}

for relative_path, dimensions in splash_sizes.items():
    save_png(ANDROID_RES / relative_path, splash(*dimensions))
