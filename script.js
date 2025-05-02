// script.js
;(function(){
    console.debug('[Dashboard] Init…');
    const grid     = document.getElementById('grid');
    const searchIn = document.getElementById('search');
    const sortBtn  = document.getElementById('sortBtn');
    const themeBtn = document.getElementById('themeBtn');
  
    let asc = true;
  
    // ◼ Hard-coded list of every file (and folder) in your project
    const files = [
      'Hosein.css',
      'Hosein.html',
      'M@tinGG.css',
      'M@tinGG.html',
      'README.md',
      'Roghayeh.css',
      'Roghayeh.html',
      'chest.gif',
      'chest.html',
      'chest.js',
      'download.jfif',
      'first/hossein',
      'first/matin',
      'first/reihaneh',
      'first/rohayeh',
      'g.webp',
      'img/High_resolution_wallpaper_background_ID_77700413385.webp',
      'index.html',
      'script.js'
    ];
  
    // Build a "pages" array; for .html files we strip the extension as the title,
    // for everything else we just show the filename
    const pages = files.map(file => ({
      file,
      title: file.endsWith('.html')
        ? file.replace(/\.html$/i, '')
        : file
    }));
    console.debug('[Dashboard] Files to list:', pages);
  
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
        grid.innerHTML = `<p><em>No files match “${searchIn.value}”.</em></p>`;
        return;
      }
  
      for (const p of list) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h2>${p.title}</h2>
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
  