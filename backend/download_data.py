import requests
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

files = {
    os.path.join(BASE_DIR, "data/final_dataset.csv"):
    "https://drive.google.com/uc?export=download&id=1ijuOLQx-1vgS2kHvkIZ_00apNNtfav7L",

    os.path.join(BASE_DIR, "models/traffic_model.pkl"):
    "https://drive.google.com/uc?export=download&id=1nzwfUSxRU54csv5Qlu8hbQMWBGGvvv4g",

    os.path.join(BASE_DIR, "models/pollution_model.pkl"):
    "https://drive.google.com/uc?export=download&id=1JwNLPW3Wf4n_qShj84N3TjIYAaZsFzBe"
}

def download_file(path, url):
    try:
        print(f"📥 Downloading {path}...")

        response = requests.get(url, stream=True, timeout=60)

        if response.status_code != 200:
            raise Exception(f"Failed to download {path}")

        with open(path, "wb") as f:
            for chunk in response.iter_content(8192):
                if chunk:
                    f.write(chunk)

        print(f"✅ Downloaded {path}")

    except Exception as e:
        print(f"❌ Error downloading {path}: {e}")
        raise e


for path, url in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)

    if not os.path.exists(path):
        download_file(path, url)
    else:
        print(f"✔ Already exists: {path}")