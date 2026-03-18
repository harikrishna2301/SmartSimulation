import gdown
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

files = {
    "models/traffic_model.pkl": "1nzwfUSxRU54csv5Qlu8hbQMWBGGvvv4g",
    "models/pollution_model.pkl": "1JwNLPW3Wf4n_qShj84N3TjIYAaZsFzBe",
    "data/final_dataset.csv": "1ijuOLQx-1vgS2kHvkIZ_00apNNtfav7L"
}

for path, file_id in files.items():
    full_path = os.path.join(BASE_DIR, path)

    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    # delete old corrupted file
    if os.path.exists(full_path):
        os.remove(full_path)

    print(f"⬇ Downloading {path}...")

    gdown.download(
        id=file_id,
        output=full_path,
        quiet=False
    )

    print(f"✅ Downloaded {path}")