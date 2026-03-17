import requests
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

files = {
    os.path.join(BASE_DIR, "data/final_dataset.csv"):
    "https://drive.google.com/uc?id=1ijuOLQx-1vgS2kHvkIZ_00apNNtfav7L",

    os.path.join(BASE_DIR, "models/traffic_model.pkl"):
    "https://drive.google.com/uc?id=1nzwfUSxRU54csv5Qlu8hbQMWBGGvvv4g",

    os.path.join(BASE_DIR, "models/pollution_model.pkl"):
    "https://drive.google.com/uc?id=1JwNLPW3Wf4n_qShj84N3TjIYAaZsFzBe"
}

for path, url in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)

    if not os.path.exists(path):
        print(f"Downloading {path}...")

        r = requests.get(url)
        with open(path, "wb") as f:
            f.write(r.content)

        print(f"Downloaded {path}")