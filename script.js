// script.js
(() => {
  console.debug('[Dashboard] Init…');

  const $ = sel => document.querySelector(sel);
  const grid     = $('#grid');
  const searchIn = $('#search');
  const sortBtn  = $('#sortBtn');
  const themeBtn = $('#themeBtn');

  let asc = true;
  const PAGES = [
    { path: './We/hossein/index.html',   title: 'Hosein',   emoji: '🧙‍♂️' },
    { path: './We/matin/index.html',     title: 'M@tinGG',   emoji: '⚗️' },
    { path: './We/roghayeh/index.html',  title: 'Roghayeh',  emoji: '🪔' },
    { path: './We/reihaneh/index.html',  title: 'Reihaneh',  emoji: '🐦‍' },
  ];

  // Apply saved theme
  const applyTheme = mode => {
    document.body.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
    console.debug('[Dashboard] Theme set to', mode);
  };

  // Build the grid
  const render = () => {
    const term = searchIn.value.trim().toLowerCase();
    const filtered = PAGES
      .filter(({ title, path }) =>
        title.toLowerCase().includes(term) ||
        path.toLowerCase().includes(term)
      )
      .sort((a, b) =>
        asc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );

    if (!filtered.length) {
      grid.innerHTML = `<p><em>No pages match “${searchIn.value}”.</em></p>`;
    } else {
      grid.innerHTML = filtered.map(
        ({ emoji, title, path }) => `
        <div class="card">
          <h2>${emoji} ${title}</h2>
          <a href="${path}" target="_blank">Open ›</a>
        </div>`
      ).join('');
    }
  };

  // Event hookups
  searchIn.addEventListener('input', () => {
    console.debug('[Dashboard] Search:', searchIn.value);
    render();
  });

  sortBtn.addEventListener('click', () => {
    asc = !asc;
    sortBtn.textContent = `Sort: ${asc ? 'A→Z' : 'Z→A'}`;
    console.debug('[Dashboard] Sort order:', asc ? 'asc' : 'desc');
    render();
  });

  themeBtn.addEventListener('click', () => {
    const mode = document.body.classList.toggle('dark') ? 'dark' : 'light';
    applyTheme(mode);
  });

  // Initialize
  applyTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
  render();
  console.debug('[Dashboard] Ready.');
})();
