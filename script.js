

/* script.js */
(() => {
  const $ = (sel) => document.querySelector(sel);
  const grid = $("#grid");
  const searchIn = $("#search");
  const sortBtn = $("#sortBtn");
  const themeBtn = $("#themeBtn");
  const modal = $("#modal");
  const modalTitle = $("#modalTitle");
  const tasksList = $("#tasks-list");
  const modalClose = $("#modalClose");

  let asc = true;
  const applyTheme = (mode) => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("theme", mode);
  };
  applyTheme(localStorage.getItem("theme") || "light");

  const USERS = [
    {
      path: "./We/hossein/index.html",
      title: "Hosein",
      github: "HoseinM89",
      emoji: "🧙‍♂️",
    },
    {
      path: "./We/matin/index.html",
      title: "M@tinGG",
      github: "MatinGG",
      emoji: "⚗️",
    },
    {
      path: "./We/roghayeh/index.html",
      title: "Roghayeh",
      github: "Reihaneh0-0",
      emoji: "🪔",
    },
    {
      path: "./We/reihaneh/index.html",
      title: "Reihaneh",
      github: "Fuxgxugx135",
      emoji: "🐦‍",
    },
  ];

  const QUESTS = [
    {
      title: "Create Repo",
      guide: `Open GitHub \u2192 new repository <code><strong>&lt;username&gt;.github.io</strong></code>. Initialise with README.`,
      code: `gh repo create &lt;username&gt;.github.io --public --source=.`,
    },
    {
      title: "Hero Banner",
      guide: "Add a full-width hero with a headline that pops!",
      code: `<header class=\"h-[60vh] bg-[url('hero.jpg')] bg-cover flex items-center justify-center\">\n  <h1 class=\"text-5xl text-white font-bold drop-shadow\">Hello World</h1>\n</header>`,
    },
    {
      title: "Custom Font",
      guide: "Import a Google Font of your choice and apply site-wide.",
      code: `<link href=\"https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap\" rel=\"stylesheet\">\n<style>body{font-family:'Quicksand',sans-serif}</style>`,
    },
    {
      title: "Live Clock",
      guide: "Show the visitor’s local time updating every second.",
      code: `<div id=\"time\" class=\"text-xl text-center\"></div>\n<script>setInterval(()=>{document.getElementById('time').textContent=new Date().toLocaleTimeString()},1000)</script>`,
    },
    {
      title: "Push &amp; Verify",
      guide: "Commit, push and confirm your page loads at <code>https://&lt;username&gt;.github.io</code>.",
      code: `git add . && git commit -m "🚀 launch" && git push`,
    },
  ];

  // async function getRepoStats(user) {
  //   const homeRepoUrl = `https://api.github.com/repos/${user.github}/${user.github}.github.io`;
  //   const gitUrl = `https://api.github.com/repos/${user.github}/`;

  //   const commitUrl = `${gitUrl}/commits?per_page=1`;

  //   const [gitRes, repoRes, commitRes, pageRes] = await Promise.all([
  //     fetch(gitUrl),
  //     fetch(homeRepoUrl),
  //     fetch(commitUrl),
  //     fetch(`https://${user.github}.github.io`),
  //   ]);

  //   const repoOk = repoRes.ok;
  //   const githubAccountCreated = gitRes.ok;
  //   const commits = commitRes.ok ? await commitRes.json() : [];
  //   const lastDate = commits[0]?.commit?.author?.date?.slice(0, 10) || "-";

  //   return {
  //     githubAccountCreated,
  //     repoOk,
  //     pageOk: pageRes.ok,
  //     commitCount: repoOk ? (await repoRes.json()).open_issues + commits.length : 0,
  //     lastDate,
  //   };
  // }

  async function getRepoStats(user, STATS) {
    const s = STATS[user.github];               // keyed the same way you saved it
    return s
      ? {
          repoOk:            s.exists,
          pageOk:            s.pageOk,          // you may have named it live / ok
          commitCount:       s.commitCount,
          lastDate:          s.lastDate
        }
      : { repoOk:false, pageOk:false, commitCount:0, lastDate:"-" };
  }
  

  function buildQuestList(idx) {
    return QUESTS.map(
      (q, i) => `
      <li class="space-y-1">
        <details class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <summary class="font-semibold cursor-pointer flex items-center gap-2">${
            i + 1
          }. ${q.title} <span id="qstat-${idx}-${i}" class="ml-auto text-sm">⏳</span></summary>
          <p class="mt-2 text-gray-600 dark:text-gray-400">${q.guide}</p>
          <pre class="mt-2 bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto"><code>${q.code.replace(
            /</g,
            "&lt;"
          )}</code></pre>
        </details>
      </li>`
    ).join("");
  }


    /* ----------  build-time stats  ---------- */
    let STATS = {};
    fetch("data/stats.json")               // ↙ whatever path you wrote in the Action
      .then(r => r.json())
      .then(j => { STATS = j; render(); });   // call render again when data arrives
    /* --------------------------------------- */

  
  async function createCard(user, idx) {
    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-gray-700 p-2 rounded-xl shadow-lg transform hover:scale-105 transition animate-fade-up";
    card.style.animationDelay = `${idx * 100}ms`;

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-semibold">${user.emoji} ${user.title}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">@${user.github}</p>
        </div>
        <a href="${user.path}" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800" title="Open local assignment" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 20v-6h4l-6-8v6H4l6 8z"/></svg>
        </a>
      </div>
      <ul class="mt-4 flex flex-col gap-2 text-sm text-gray-800 dark:text-gray-200">
        
        <li id="github-account-${idx}" class="flex gap-1 items-center">⛟ Github account created? ⏳</li>
        <li id="repo-${idx}" class="flex gap-1 items-center">🗄️ Repo: ⏳</li>
        <li id="page-${idx}" class="flex gap-1 items-center">🌐 Page: ⏳</li>
        <li id="commits-${idx}" class="flex gap-1 items-center col-span-2">📦 Commits: …</li>
        <li id="last-${idx}" class="flex gap-1 items-center col-span-2">🕒 Last: …</li>
      </ul>
      <details class="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <summary class="cursor-pointer font-medium">Quest log</summary>
        <ul class="mt-2 space-y-3">${buildQuestList(idx)}</ul>
      </details>`;

    grid.appendChild(card);




    // Fetch stats
    const stats = await getRepoStats(user, STATS);
    $(`#github-account-${idx}`).innerHTML = `⛟ Github:${stats.githubAccountCreated ? "✅" : "❌"}`;
    $(`#repo-${idx}`).innerHTML = `🗄️ Repo: ${stats.repoOk ? "✅" : "❌"}`;
    $(`#page-${idx}`).innerHTML = `🌐 Page: ${stats.pageOk ? "✅" : "❌"}`;
    $(`#commits-${idx}`).textContent = `📦 Commits: ${stats.commitCount}`;
    $(`#last-${idx}`).textContent = `🕒 Last: ${stats.lastDate}`;

    // Random status simulation for quests
    QUESTS.forEach((_, i) => {
      setTimeout(() => {
        $(`#qstat-${idx}-${i}`).textContent = Math.random() > 0.5 ? "✅" : "❌";
      }, 800 + i * 400);
    });

    card.addEventListener("click", () => {
      modalTitle.textContent = `${user.title}'s Quest Guide`;
      tasksList.innerHTML = buildQuestList(idx);
      modal.classList.remove("hidden");
    });
  }

  function render() {
    grid.innerHTML = "";
    const term = searchIn.value.toLowerCase();
    const shown = USERS.filter((u) =>
      u.title.toLowerCase().includes(term) || u.github.toLowerCase().includes(term)
    ).sort((a, b) =>
      asc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    shown.forEach(createCard);
  }

  // listeners
  searchIn.addEventListener("input", render);
  sortBtn.addEventListener("click", () => {
    asc = !asc;
    sortBtn.textContent = `Sort: ${asc ? "A→Z" : "Z→A"}`;
    render();
  });
  themeBtn.addEventListener("click", () => {
    applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
  });
  modalClose.addEventListener("click", () => modal.classList.add("hidden"));

  render();
})();