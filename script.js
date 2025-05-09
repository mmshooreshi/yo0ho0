

/* script.js */
(() => {
  console.debug('[Dashboard] Init…');

  const $ = sel => document.querySelector(sel);
  const grid     = $('#grid');
  const searchIn = $('#search');
  const sortBtn  = $('#sortBtn');
  const themeBtn = $('#themeBtn');

  let asc = true;
  const PAGES = [
    { path: './We/hossein/index.html',   title: 'Hosein',  github: 'HoseinM89',  emoji: '🧙‍♂️' },
    { path: './We/matin/index.html',     title: 'M@tinGG',  github: 'MatinGG', emoji: '⚗️' },
    { path: './We/roghayeh/index.html',  title: 'Roghayeh', github: 'Reihaneh0-0', emoji: '🪔' },
    { path: './We/reihaneh/index.html',  title: 'Reihaneh', github: 'Fuxgxugx135', emoji: '🐦‍' },
  ];

  // Apply saved or default theme
  const applyTheme = mode => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.body.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
    console.debug('[Dashboard] Theme set to', mode);
  };
  applyTheme(localStorage.getItem('theme') || 'light');

  // Render grid with animations
  const render = () => {
    const term = searchIn.value.trim().toLowerCase();
    const filtered = PAGES
      .filter(({ title, path }) =>
        title.toLowerCase().includes(term) || path.toLowerCase().includes(term)
      )
      .sort((a, b) => asc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));

    grid.innerHTML = filtered.length
      ? filtered.map(({ emoji, title, path }, i) => `
        <div class="card bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg transform transition group cursor-pointer opacity-0" 
             style="animation: fade-up 0.5s ease-out forwards; animation-delay: ${i * 100}ms;">
          <h2 class="text-xl font-semibold mb-4 group-hover:animate-tilt">${emoji} ${title}</h2>
          <a href="${path}" target="_blank"
             class="mt-auto block text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Open ›
          </a>
        </div>`)
        .join('')
      : `<p class="col-span-full italic">No pages match “${searchIn.value}”.</p>`;
  };

  // Event listeners
  searchIn.addEventListener('input', () => render());
  sortBtn.addEventListener('click', () => {
    asc = !asc;
    sortBtn.textContent = `Sort: ${asc ? 'A→Z' : 'Z→A'}`;
    render();
  });
  themeBtn.addEventListener('click', () => {
    const mode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(mode);
  });

  // Initial render
  render();
  console.debug('[Dashboard] Ready.');
})();