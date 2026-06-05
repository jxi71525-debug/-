async function get() {
  const res = await fetch('https://api.github.com/repos/dharmx/walls/git/trees/main?recursive=1', {headers: {'User-Agent': 'node'}});
  const data = await res.json();
  const jpgs = data.tree.filter(t => t.path.includes('anime') && (t.path.endsWith('.jpg') || t.path.endsWith('.png'))).map(t => t.path);
  
  console.log('night:', jpgs.filter(p => p.includes('night')));
  console.log('cafe:', jpgs.filter(p => p.includes('shop') || p.includes('cafe')));
}
get();
