import os
import requests

def download_file(url, path):
    if not os.path.exists(path):
        print(f"Downloading {path}...")
        r = requests.get(url)
        with open(path, "wb") as f:
            f.write(r.content)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)

# Traffic Model
download_file(
    "https://drive.google.com/uc?id=1nzwfUSxRU54csv5Qlu8hbQMWBGGvvv4g",
    os.path.join(BASE_DIR, "models/traffic_model.pkl")
)

# Pollution Model
download_file(
    "https://drive.google.com/uc?id=1JwNLPW3Wf4n_qShj84N3TjIYAaZsFzBe",
    os.path.join(BASE_DIR, "models/pollution_model.pkl")
)

# Dataset
download_file(
    "https://drive.google.com/uc?id=1ijuOLQx-1vgS2kHvkIZ_00apNNtfav7L",
    os.path.join(BASE_DIR, "data/final_dataset.csv")
)