/* script.js */
(() => {
  const $ = sel => document.querySelector(sel);
  const grid = $('#grid');
  const searchIn = $('#search');
  const sortBtn = $('#sortBtn');
  const themeBtn = $('#themeBtn');
  const modal = $('#modal');
  const modalList = $('#instruction-list');
  const modalClose = $('#modalClose');

  let asc = true;
  const USERS = [
    { path: './We/hossein/index.html', title: 'Hosein', github: 'HoseinM89', emoji: '🧙‍♂️' },
    { path: './We/matin/index.html', title: 'M@tinGG', github: 'MatinGG', emoji: '⚗️' },
    { path: './We/roghayeh/index.html', title: 'Roghayeh', github: 'Reihaneh0-0', emoji: '🪔' },
    { path: './We/reihaneh/index.html', title: 'Reihaneh', github: 'Fuxgxugx135', emoji: '🐦‍' }
  ];

  const INS = [
    'Show a rotating 3D cube using CSS transforms',
    'Embed a custom font from Google Fonts',
    'Add a CSS hover effect with clip-path',
    'Implement a dark/light mode toggle',
    'Include an animated SVG background',
    'Display current local time with JavaScript',
    'Use a CSS grid layout with named areas',
    'Fetch and display a public API data list',
    'Add a draggable element with JS',
    'Create a custom cursor animation'
  ];

  function applyTheme(mode) {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
  }
  applyTheme(localStorage.getItem('theme') || 'light');

  async function checkRepo(user) {
    try {
      const res = await fetch(`https://api.github.com/repos/${user.github}/${user.github}.github.io`);
      return res.ok;
    } catch { return false; }
  }

  async function checkPage(user) {
    try {
      const res = await fetch(`https://${user.github}.github.io`);
      return res.ok;
    } catch { return false; }
  }

  function randomInstructions() {
    const shuffled = INS.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  async function render() {
    const term = searchIn.value.trim().toLowerCase();
    let list = USERS.filter(u => u.title.toLowerCase().includes(term)
      || u.github.toLowerCase().includes(term));
    list.sort((a, b) => asc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
    grid.innerHTML = '';

    if (!list.length) {
      grid.innerHTML = '<p class="col-span-full italic">No users found.</p>';
      return;
    }

    list.forEach(async (user, i) => {
      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg transform transition hover:scale-105';
      card.style.animation = 'fade-up 0.5s ease-out forwards';
      card.style.animationDelay = `${i * 100}ms`;

      card.innerHTML = `
        <div>
          <h2 class="text-xl font-semibold mb-1">${user.emoji} ${user.title}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">@${user.github}</p>
        </div>
        <details class="mt-4">
          <summary class="font-medium cursor-pointer">Status Checks</summary>
          <ul class="mt-2 space-y-2 text-gray-800 dark:text-gray-200">
            <li id="repo-${i}">🔄 Checking repo...</li>
            <li id="page-${i}">🔄 Checking page...</li>
          </ul>
        </details>
        <div class="mt-4 flex items-center gap-4">
          <a href="${user.path}" target="_blank" class="flex-1 text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">View Assignment</a>
          <a href="https://github.com/${user.github}" target="_blank" class="text-gray-800 dark:text-gray-200 hover:text-indigo-500 transition">
            <!-- GitHub Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.091.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.528 2.341 1.087 2.910.831.091-.647.350-1.087.636-1.338-2.220-.252-4.555-1.110-4.555-4.944 0-1.091.390-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.650 0 0 .840-.269 2.750 1.026A9.564 9.564 0 0112 6.844a9.560 9.560 0 012.500.336c1.909-1.295 2.748-1.026 2.748-1.026.546 1.378.203 2.397.100 2.650.640.699 1.030 1.592 1.030 2.683 0 3.843-2.337 4.688-4.566 4.936.358.310.678.920.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.180.578.687.480A10.013 10.013 0 0022 12c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/></svg>
          </a>
        </div>
      `;
      grid.appendChild(card);

      // Perform checks
      const repoOk = await checkRepo(user);
      $(`#repo-${i}`).textContent = repoOk ? '✅ Repo exists' : '❌ Repo missing';
      const pageOk = await checkPage(user);
      $(`#page-${i}`).textContent = pageOk ? '✅ Page live' : '❌ Page down';

      // Card click opens modal
      card.addEventListener('click', () => {
        const items = randomInstructions();
        modalList.innerHTML = items.map(it => `<li>${it}</li>`).join('');
        modal.classList.remove('hidden');
      });
    });
  }

  // Event bindings
  searchIn.addEventListener('input', render);
  sortBtn.addEventListener('click', () => { asc = !asc; sortBtn.textContent = `Sort: ${asc ? 'A→Z' : 'Z→A'}`; render(); });
  themeBtn.addEventListener('click', () => applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark'));
  modalClose.addEventListener('click', () => modal.classList.add('hidden'));

  // Initial render
  render();
})();
