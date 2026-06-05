const fs = require('fs');
const path = require('path');

const urls = {
  'lofi-desk.jpg': 'https://raw.githubusercontent.com/dharmx/walls/main/anime/a_room_with_shelves_and_shelves_and_a_light.jpg',
  'rainy-window.jpg': 'https://raw.githubusercontent.com/dharmx/walls/main/anime/a_cartoon_of_a_girl_sitting_on_a_porch_in_the_rain.png',
  'cafe-corner.jpg': 'https://raw.githubusercontent.com/dharmx/walls/main/anime/a_cartoon_of_a_woman_in_a_store.jpg',
  'forest-cabin.jpg': 'https://raw.githubusercontent.com/dharmx/walls/main/anime/a_cartoon_house_on_a_floating_platform.jpg',
  'night-city.jpg': 'https://raw.githubusercontent.com/dharmx/walls/main/anime/a_park_with_benches_and_trees_at_night.jpg',
  'ocean-train.jpg': 'https://raw.githubusercontent.com/dharmx/walls/main/anime/a_train_going_through_a_lake.jpg'
};

const dir = 'd:/trae projects/individual project/public/backgrounds';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function download() {
  for (const [name, url] of Object.entries(urls)) {
    console.log('Downloading ' + name + '...');
    try {
      const res = await fetch(url);
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
