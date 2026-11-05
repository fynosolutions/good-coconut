"""Create web-sized copies of the ten supplied photographs; keep originals untouched."""
from pathlib import Path
import argparse
import json
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', type=Path, required=True, help='Directory containing the ten original PNG files')
source = parser.parse_args().source
output = root / 'public/assets/moments'
output.mkdir(parents=True, exist_ok=True)
photos = {
    'dessert-bowl': '52b232d3-2cb8-4eee-900c-be3f82fcb09f.png',
    'coconut-drink-trio': '47cadfe6-8054-4cea-bfa4-2073e3d0b76b.png',
    'waffle-and-coconut': 'a751224a-3336-437b-b62b-3db08a6180f6.png',
    'fruit-pudding-jars': 'ab8ec268-011a-4c59-8f42-104bc15bfc06.png',
    'whole-coconut-fruit': '96e8770d-8e36-4c9a-a333-e574b7d3f49d.png',
    'waffles-to-go': 'e6fdab1c-0eb5-4406-8332-9c5bafb93191.png',
    'autumn-coconut-pair': '26c998d2-d00b-42c0-8973-8875165278cc.png',
    'festive-dessert': '35bad323-6483-444d-891f-798b78faf4ce.png',
    'fruit-counter': '52abd303-b10d-48d9-8536-6a4e707723f5.png',
    'dessert-bowl-friends': '70e5b450-62f5-4a3d-9043-7f38c94b19a9.png',
}
manifest = []
for name, filename in photos.items():
    with Image.open(source / filename) as original:
        img = ImageOps.exif_transpose(original).convert('RGB')
        img.thumbnail((1200, 1600))
        destination = output / f'{name}.webp'
        img.save(destination, 'WEBP', quality=88, method=6)
        manifest.append({'source': filename, 'output': destination.relative_to(root).as_posix(),
                         'width': img.width, 'height': img.height, 'bytes': destination.stat().st_size})
manifest_path = root / 'qa/real-media/photo-manifest.json'
manifest_path.parent.mkdir(parents=True, exist_ok=True)
manifest_path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(json.dumps(manifest, indent=2))
