

/* script.js */
(() => {
    console.debug('[Dashboard] Init…');
  
    const $ = sel => document.querySelector(sel);
    const $$ = sel => document.querySelectorAll(sel);
    const grid     = $('#grid');
    const searchIn = $('#search');
    const sortBtn  = $('#sortBtn');
    const themeBtn = $('#themeBtn');
  
    let asc = true;
    const USERS = [
      { path: './We/hossein/index.html',   title: 'Hosein',   github: 'HoseinM89',      emoji: '🧙‍♂️' },
      { path: './We/matin/index.html',     title: 'M@tinGG',   github: 'MatinGG',       emoji: '⚗️' },
      { path: './We/roghayeh/index.html',  title: 'Roghayeh',  github: 'Reihaneh0-0',   emoji: '🪔' },
      { path: './We/reihaneh/index.html',  title: 'Reihaneh',  github: 'Fuxgxugx135',   emoji: '🐦‍' }
    ];
  
    const applyTheme = mode => {
      document.documentElement.classList.toggle('dark', mode === 'dark');
      localStorage.setItem('theme', mode);
    };
    applyTheme(localStorage.getItem('theme') || 'light');
  
    async function checkGitHubPage(user) {
      try {
        const res = await fetch(`https://api.github.com/repos/${user.github}/${user.github}.github.io`);
        return res.ok;
      } catch {
        return false;
      }
    }
  
    async function render() {
      const term = searchIn.value.trim().toLowerCase();
      let list = USERS.filter(({ title, path, github }) =>
          title.toLowerCase().includes(term) || path.toLowerCase().includes(term) || github.toLowerCase().includes(term)
      );
      list.sort((a,b) => asc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
  
      grid.innerHTML = '';
      if (!list.length) {
        grid.innerHTML = `<p class="col-span-full italic">No users match “${searchIn.value}”.</p>`;
        return;
      }
  
      for (let i = 0; i < list.length; i++) {
        const user = list[i];
        const card = document.createElement('div');
        card.className = 'card bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg flex flex-col justify-between transform transition hover:scale-105';
        card.style.animation = `fade-up 0.5s ease-out forwards`; card.style.animationDelay = `${i*100}ms`;
  
        const statusText = document.createElement('span');
        statusText.textContent = 'Checking…';
        statusText.className = 'text-sm text-gray-500 dark:text-gray-400';
  
        const ghLink = document.createElement('a');
        ghLink.href = `https://github.com/${user.github}`;
        ghLink.target = '_blank';
        ghLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800 dark:text-gray-200 hover:text-indigo-500 transition" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.091.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.528 2.341 1.087 2.91.831.091-.647.35-1.087.636-1.338-2.22-.252-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844a9.56 9.56 0 012.5.336c1.909-1.295 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.699 1.03 1.592 1.03 2.683 0 3.843-2.337 4.688-4.566 4.936.358.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.578.687.48A10.013 10.013 0 0022 12c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/></svg>`;
  
        card.innerHTML = `
          <div>
            <h2 class="text-xl font-semibold mb-2">${user.emoji} ${user.title}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">@${user.github}</p>
          </div>`;
        card.appendChild(statusText);
  
        const btnContainer = document.createElement('div');
        btnContainer.className = 'mt-4 flex items-center gap-4';
  
        const pageBtn = document.createElement('a');
        pageBtn.href = user.path;
        pageBtn.target = '_blank';
        pageBtn.textContent = 'View Assignment';
        pageBtn.className = 'px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex-1 text-center';
  
        btnContainer.appendChild(pageBtn);
        btnContainer.appendChild(ghLink);
        card.appendChild(btnContainer);
        grid.appendChild(card);
  
        // Check GitHub Pages
        checkGitHubPage(user).then(ok => {
          statusText.textContent = ok ? '✅ Deployed' : '❌ Not Found';
          statusText.className = ok
            ? 'text-green-600 dark:text-green-400 font-semibold'
            : 'text-red-600 dark:text-red-400 font-semibold';
        });
      }
    }
  
    // Event listeners
    searchIn.addEventListener('input', render);
    sortBtn.addEventListener('click', () => { asc = !asc; sortBtn.textContent = `Sort: ${asc ? 'A→Z' : 'Z→A'}`; render(); });
    themeBtn.addEventListener('click', () => applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark'));
  
    // Initial render
    render();
    console.debug('[Dashboard] Ready.');
  })();