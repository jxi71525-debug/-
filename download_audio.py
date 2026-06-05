import urllib.request
import os

def download_audio(url, filename):
    req = urllib.request.Request(
        url, 
        data=None, 
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    )
    try:
        with urllib.request.urlopen(req) as response, open(filename, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Success: {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

os.makedirs('public/audio', exist_ok=True)

urls = {
    'lofi-desk.mp3': 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    'rainy-window.mp3': 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_82c2dc8b93.mp3?filename=light-rain-109591.mp3',
    'cafe-corner.mp3': 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_7d2f9b8827.mp3?filename=coffee-shop-ambience-39045.mp3',
    'forest-cabin.mp3': 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_24e5b7fb58.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3',
    'night-city.mp3': 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_2b20f924fb.mp3?filename=city-traffic-outdoor-6414.mp3',
    'ocean-train.mp3': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_03d987e914.mp3?filename=waves-crashing-on-rock-beach-6813.mp3'
}

for name, url in urls.items():
    download_audio(url, os.path.join('public/audio', name))
