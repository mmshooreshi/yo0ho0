// scripts/fetch-stats.mjs
import fs from "node:fs/promises";
import dotenv from "dotenv";
dotenv.config();

const USERS = ["HoseinM89", "MatinGG", "Reihaneh0-0", "Fuxgxugx135"];
const headers = process.env.TOKEN ? { Authorization: `token ${process.env.TOKEN}` } : {};

// time constants
const DAY_MS = 24 * 60 * 60 * 1000;
const now = Date.now();

const finalStats = {};

for (const user of USERS) {
  // endpoints
  const profileUrl   = `https://api.github.com/users/${user}`;
  const reposUrl     = `https://api.github.com/users/${user}/repos?per_page=100`;
  const homeRepoUrl  = `https://api.github.com/repos/${user}/${user}.github.io`;
  const pageUrl      = `https://${user}.github.io`;

  // fetch profile + repos
  const [profile, repos] = await Promise.all([
    fetch(profileUrl, { headers }).then(res => res.ok ? res.json() : null),
    fetch(reposUrl, { headers }).then(res => res.ok ? res.json() : [])
  ]);

  if (!profile) {
    // account does not exist
    finalStats[user] = { exists: false };
    continue;
  }

  // check pages repo + live page
  const homeRepoRes = await fetch(homeRepoUrl, { headers });
  const pageRes     = await fetch(pageUrl).catch(() => ({ ok: false }));
  const homeRepoExists = homeRepoRes.ok;
  const pageExists     = pageRes.ok;

  // get commits on the pages repo (for count+lastDate)
  let commitCount = 0;
  let lastDate    = "-";
  if (homeRepoExists) {
    const commits = await fetch(`${homeRepoUrl}/commits?per_page=1`, { headers })
                         .then(res => res.ok ? res.json() : []);
    commitCount = commits.length;
    lastDate    = commits[0]?.commit?.author?.date.slice(0, 10) || "-";
  }

  // aggregate stars and commit frequencies across all repos
  let commitsToday = 0;
  let commitsWeek  = 0;
  let commitsYear  = 0;
  let totalStars   = 0;
  let repoNames    = repos.map(r => r.name);

  for (const repo of repos) {
    if (repo.stargazers_count) totalStars += repo.stargazers_count;
    const pushed = repo.pushed_at ? new Date(repo.pushed_at).getTime() : 0;

    // fetch up to 100 recent commits to categorize by date
    const commits = await fetch(`https://api.github.com/repos/${user}/${repo.name}/commits?per_page=100`, { headers })
                         .then(res => res.ok ? res.json() : []);

    for (const c of commits) {
      const t = new Date(c.commit.author.date).getTime();
      if (t > now - DAY_MS)       commitsToday++;
      if (t > now - 7 * DAY_MS)   commitsWeek++;
      if (t > now - 365 * DAY_MS) commitsYear++;
    }
  }

  // cold-humor metrics (supports front-end mapping)
  finalStats[user] = {
    exists:        homeRepoExists,  // used as repoOk
    pageOk:        pageExists,
    commitCount,
    lastDate,

    // additional raw stats if needed
    raw: {
      accountCreation: profile.created_at.slice(0,10),
      followers:       profile.followers,
      following:       profile.following,
      publicRepos:     profile.public_repos,
      commitsToday,
      commitsWeek,
      commitsYear,
      totalStars,
      repoCount:       repos.length
    },

    // humorous metrics (4–5 word dry labels)
    metrics: {
      "Coffee Cups / Commit":       commitsYear ? Math.round(200 / commitsYear) : null,
      "Deadline Panic Index":       Math.min(10, commitsWeek),
      "Tab Hoarding Score":         repos.length + profile.following,
      "StackOverflow Visit Count":  commitsToday + Math.floor(Math.random() * 4),
      "Night Push Flag":            new Date(lastDate).getHours() < 6 || false,
      "Star Collector Count":       totalStars,
      "Yearly Commit Volume":       commitsYear,
      "Repo Name List":             repoNames.join(", ")
    },

    updated: new Date().toISOString()
  };
}

// write JSON
await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/stats.json", JSON.stringify(finalStats, null, 2));
console.log("Stats refreshed for", USERS.length, "users.");
