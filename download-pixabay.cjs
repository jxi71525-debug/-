const fs = require('fs');
const path = require('path');

const urls = {
  'lofi-desk.png': 'https://cdn.pixabay.com/photo/2023/10/24/01/42/art-8337311_1280.png',
  'rainy-window.png': 'https://cdn.pixabay.com/photo/2023/12/08/05/38/cat-8436843_1280.png',
  'cafe-corner.png': 'https://cdn.pixabay.com/photo/2023/10/19/21/08/sunset-8327637_1280.png',
  'forest-cabin.png': 'https://cdn.pixabay.com/photo/2023/08/19/13/28/nature-8200465_1280.png',
  'night-city.png': 'https://cdn.pixabay.com/photo/2023/11/10/02/30/woman-8378634_1280.png',
  'ocean-train.png': 'https://cdn.pixabay.com/photo/2023/12/12/16/09/anime-8445507_1280.png'
};

const dir = 'd:/trae projects/individual project/public/backgrounds';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function download() {
  for (const [name, url] of Object.entries(urls)) {
    console.log('Downloading ' + name + '...');
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': 'https://pixabay.com/'
        }
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(path.join(dir, name), Buffer.from(buffer));
      console.log('Saved ' + name);
    } catch (e) {
      console.error('Failed ' + name + ':', e.message);
    }
  }
}
download();
