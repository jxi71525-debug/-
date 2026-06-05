async function get() {
  const res = await fetch('https://api.github.com/search/repositories?q=anime+wallpapers&sort=stars', {headers: {'User-Agent': 'node'}});
  const data = await res.json();
  data.items.slice(0, 5).forEach(i => console.log(i.full_name, i.default_branch));
}
get();
