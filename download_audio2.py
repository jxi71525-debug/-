import urllib.request
import os

def download_audio(url, filename):
    req = urllib.request.Request(
        url, 
        data=None, 
        headers={
            'User-Agent': 'Mozilla/5.0'
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response, open(filename, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Success: {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

os.makedirs('public/audio', exist_ok=True)

urls = {
    'rainy-window.mp3': 'https://downsc.chinaz.net/Files/DownLoad/sound1/201808/10419.mp3',
    'cafe-corner.mp3': 'https://downsc.chinaz.net/Files/DownLoad/sound1/202103/14064.mp3',
    'forest-cabin.mp3': 'https://downsc.chinaz.net/Files/DownLoad/sound1/202111/15104.mp3',
    'night-city.mp3': 'https://downsc.chinaz.net/Files/DownLoad/sound1/201912/12316.mp3',
    'ocean-train.mp3': 'https://downsc.chinaz.net/Files/DownLoad/sound1/201808/10443.mp3'
}

for name, url in urls.items():
    download_audio(url, os.path.join('public/audio', name))
