// script.js
;(async function(){
    console.debug('[Dashboard] Init…');
    const grid     = document.getElementById('grid');
    const searchIn = document.getElementById('search');
    const sortBtn  = document.getElementById('sortBtn');
    const themeBtn = document.getElementById('themeBtn');
  
    let pages = [];
    let asc = true;
  
    // 1️⃣ Load directory listing
    try {
      console.debug('[Dashboard] Fetching directory list…');
      const resp = await fetch('.');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
  
      // 2️⃣ Parse out .html links
      const dom = new DOMParser().parseFromString(text, 'text/html');
      const hrefs = Array.from(dom.querySelectorAll('a'))
        .map(a => a.getAttribute('href'))
        .filter(h => h && h.endsWith('.html') && h !== 'index.html');
      console.debug('[Dashboard] Found pages:', hrefs);
  
      // 3️⃣ For each, fetch and parse title
      const promises = hrefs.map(async file => {
        try {
          const r = await fetch(file);
          const t = await r.text();
          const d = new DOMParser().parseFromString(t, 'text/html');
          const title = d.querySelector('title')?.textContent.trim() || file;

          return { file, title };
        } catch {
          return { file, title: file };
        }
      });
      pages = await Promise.all(promises);
      console.debug('[Dashboard] Pages with titles:', pages);
  
      // initial render
      render();
    } catch (err) {
      console.error('[Dashboard] ERROR:', err);
      grid.innerHTML = `<p style="color:tomato;">Failed to load pages: ${err.message}</p>`;
    }
  
    // Render function
    function render() {
      // filter & sort
      const term = searchIn.value.toLowerCase();
      let list = pages.filter(p => p.title.toLowerCase().includes(term) || p.file.toLowerCase().includes(term));
      list.sort((a,b) => asc 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title)
      );
  
      // generate cards
      grid.innerHTML = '';
      if (!list.length) {
        grid.innerHTML = `<p><em>No pages match “${searchIn.value}”.</em></p>`;
        return;
      }
      for (const p of list) {
        const c = document.createElement('div');
        c.className = 'card';
        c.innerHTML = `
          <h2>${p.title}</h2>
          <a href="${p.file}" target="_blank">Open ›</a>
        `;
        grid.appendChild(c);
      }
    }
  
    // 4️⃣ Wire up search & sort
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
  
    // 5️⃣ Theme toggle
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.body.classList.add('dark');
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const now = document.body.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', now);
      console.debug('[Dashboard] Theme set to', now);
    });
  
    console.debug('[Dashboard] Ready.');
  })();
  