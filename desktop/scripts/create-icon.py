from pathlib import Path
from PIL import Image, ImageDraw

size = 1024
image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((64, 64, 960, 960), radius=226, fill=(17, 159, 72, 255))
stroke = 87
points = [(205, 704), (317, 704), (510, 304), (707, 704), (819, 704)]
draw.line(points, fill=(255, 255, 255, 255), width=stroke, joint="curve")
for x, y in (points[0], points[-1]):
    draw.ellipse((x-stroke//2, y-stroke//2, x+stroke//2, y+stroke//2), fill=(255, 255, 255, 255))
icon = image.resize((256, 256), Image.Resampling.LANCZOS)
target = Path(__file__).resolve().parent.parent / "assets" / "icon.ico"
target.parent.mkdir(parents=True, exist_ok=True)
icon.save(target, format="ICO", sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
print(target)
