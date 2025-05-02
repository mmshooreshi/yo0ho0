// script.js
(async function() {
    const game = document.getElementById('game');
    const scoreEl = document.getElementById('score');
    let score = 0;
    let total = 0;
  
    function updateScore() {
      scoreEl.textContent = `Found: ${score}/${total}`;
      if (score === total) {
        setTimeout(() => alert('🎉 You found all the pages! 🎉'), 100);
      }
    }
  
    try {
      const resp = await fetch('.');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
      const dom = new DOMParser().parseFromString(text, 'text/html');
      const files = Array.from(dom.querySelectorAll('a'))
        .map(a => a.getAttribute('href'))
        .filter(h => h && h.endsWith('.html') && h !== 'index.html');
  
      total = files.length;
      updateScore();
  
      const { innerWidth: W, innerHeight: H } = window;
      files.forEach(file => {
        const chest = document.createElement('div');
        chest.className = 'chest';
        chest.style.top  = `${Math.random() * (H - 220) + 60}px`;
        chest.style.left = `${Math.random() * (W - 120) + 60}px`;
  
        chest.innerHTML = `
          <div class="face front"></div>
          <div class="face back">
            <a href="${file}" target="_blank">${file}</a>
          </div>`;
  
        chest.addEventListener('click', () => {
          if (!chest.classList.contains('flipped')) {
            chest.classList.add('flipped');
            score++;
            updateScore();
          }
        });
  
        game.appendChild(chest);
      });
  
    } catch (e) {
      console.error(e);
      game.innerHTML = `<p style="color:#f66; text-align:center; margin-top:2rem;">
        Error loading pages: ${e.message}
      </p>`;
    }
  })();
  