import gdown
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

files = {
    "models/traffic_model.pkl": "1vjz1I3tjEr3SSx-7Rx0egcbjagJOzJWp",
    "models/pollution_model.pkl": "1FBQOQALzE8myHrs9C0rYH5K69txOoFzN",
    "data/final_dataset.csv": "1qAn0ySX-D1uWXeigcnVgimQvXQvaF7op"
}

def download_if_missing():
    for path, file_id in files.items():
        full_path = os.path.join(BASE_DIR, path)

        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        # ✅ ONLY download if missing
        if not os.path.exists(full_path):
            print(f"⬇ Downloading {path}...")

            gdown.download(
                id=file_id,
                output=full_path,
                quiet=False
            )

            print(f"✅ Downloaded {path}")
        else:
            print(f"✔ Already exists: {path}")