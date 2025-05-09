// script.js
;(function(){
    console.debug('[Dashboard] Init…');
    const grid     = document.getElementById('grid');
    const searchIn = document.getElementById('search');
    const sortBtn  = document.getElementById('sortBtn');
    const themeBtn = document.getElementById('themeBtn');
  
    let asc = true;
  
    // ◼ Hard-coded list of every page in your project, plus a funky emoji
    const pages = [
      { file: 'hossein/index.html',   title: 'Hosein',   emoji: '🧙‍♂️' },
      { file: 'matin/index.html',   title: 'M@tinGG',   emoji: '⚗️' },
      { file: 'roghayeh/index.html',  title: 'Roghayeh',  emoji: '🪔' },
      { file: 'reihaneh/index.html',  title: 'Reihoon',  emoji: '🐦‍' },
    ];
    console.debug('[Dashboard] Pages to list:', pages);
  
    // Initial render
    render();
  
    function render() {
      const term = searchIn.value.toLowerCase();
      let list = pages
        .filter(p =>
          p.title.toLowerCase().includes(term) ||
          p.file.toLowerCase().includes(term)
        )
        .sort((a, b) =>
          asc
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        );
  
      grid.innerHTML = '';
      if (!list.length) {
        grid.innerHTML = `<p><em>No pages match “${searchIn.value}”.</em></p>`;
        return;
      }
  
      for (const p of list) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h2>${p.emoji} ${p.title}</h2>
          <a href="${p.file}" target="_blank">Open ›</a>
        `;
        grid.appendChild(card);
      }
    }
  
    // Wire up search & sort
    searchIn.addEventListener('input', () => {
      console.debug('[Dashboard] Search:', searchIn.value);
      render();
    });
    sortBtn.addEventListener('click', () => {
      asc = !asc;
      sortBtn.textContent = asc ? 'Sort: A→Z' : 'Sort: Z→A';
      console.debug('[Dashboard] Sort order:', asc ? 'asc' : 'desc');
      render();
    });
  
    // Theme toggle
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
    }
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const now = document.body.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', now);
      console.debug('[Dashboard] Theme set to', now);
    });
  
    console.debug('[Dashboard] Ready.');
  })();
  