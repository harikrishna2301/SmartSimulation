import requests
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def download_file(file_id, destination):
    URL = "https://drive.google.com/uc?export=download"

    session = requests.Session()

    response = session.get(URL, params={"id": file_id}, stream=True)

    # Handle large file confirmation
    for key, value in response.cookies.items():
        if key.startswith("download_warning"):
            params = {"id": file_id, "confirm": value}
            response = session.get(URL, params=params, stream=True)
            break

    if os.path.exists(destination):
        os.remove(destination)

    # Save file
    with open(destination, "wb") as f:
        for chunk in response.iter_content(32768):
            if chunk:
                f.write(chunk)

    print(f"✅ Downloaded {destination}")


# create folders
os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)

# download files
download_file("1nzwfUSxRU54csv5Qlu8hbQMWBGGvvv4g", os.path.join(BASE_DIR, "models/traffic_model.pkl"))
download_file("1JwNLPW3Wf4n_qShj84N3TjIYAaZsFzBe", os.path.join(BASE_DIR, "models/pollution_model.pkl"))
download_file("1ijuOLQx-1vgS2kHvkIZ_00apNNtfav7L", os.path.join(BASE_DIR, "data/final_dataset.csv"))