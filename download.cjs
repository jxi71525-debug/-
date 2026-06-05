const fs = require('fs');
const path = require('path');

const urls = {
  'lofi-desk.jpg': 'https://image.pollinations.ai/prompt/anime%20lofi%20study%20room%20desk%20with%20computer%20and%20coffee%20sunset?width=1080&height=1920&nologo=true&seed=42',
  'rainy-window.jpg': 'https://image.pollinations.ai/prompt/anime%20lofi%20rainy%20window%20city%20view%20at%20night?width=1080&height=1920&nologo=true&seed=42',
  'cafe-corner.jpg': 'https://image.pollinations.ai/prompt/anime%20lofi%20cozy%20cafe%20interior%20coffee%20cup%20sunset?width=1080&height=1920&nologo=true&seed=42',
  'forest-cabin.jpg': 'https://image.pollinations.ai/prompt/anime%20lofi%20cozy%20wooden%20cabin%20in%20dark%20forest%20with%20warm%20glowing%20lights%20night?width=1080&height=1920&nologo=true&seed=42',
  'night-city.jpg': 'https://image.pollinations.ai/prompt/anime%20lofi%20cyberpunk%20city%20street%20night%20lights?width=1080&height=1920&nologo=true&seed=42',
  'ocean-train.jpg': 'https://image.pollinations.ai/prompt/anime%20lofi%20inside%20train%20cabin%20looking%20out%20at%20ocean%20sunset%20window%20view?width=1080&height=1920&nologo=true&seed=42'
};

const dir = 'd:/trae projects/individual project/public/backgrounds';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function download() {
  for (const [name, url] of Object.entries(urls)) {
    console.log('Downloading ' + name + '...');
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
