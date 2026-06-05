const https = require('https');
https.get('https://unsplash.com/napi/search/photos?query=lofi+anime&per_page=20', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      json.results.forEach(p => console.log(p.urls.raw + '&q=80&w=1080  -- ' + p.alt_description));
    } catch(e) { console.error('Parse error'); }
  });
});
