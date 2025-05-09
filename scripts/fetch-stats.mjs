// scripts/fetch-stats.mjs
// import fs from "node:fs/promises";
// import fetch from "node-fetch";

const fetch = require("node-fetch")
const fs = require("node:fs/promises");
const users = ["HoseinM89", "MatinGG", "Reihaneh0-0", "Fuxgxugx135"];

const headers = { Authorization: `token ${process.env.TOKEN}` };
const out = {};

for (const u of users) {
  const repo = `${u}/${u}.github.io`;
  const [meta, commits] = await Promise.all([
    fetch(`https://api.github.com/repos/${repo}`, { headers }).then(r => r.json()),
    fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, { headers }).then(r => r.json())
  ]);

  out[u] = {
    exists: !meta.message,
    commits: meta.open_issues + 1,
    last: commits[0]?.commit?.author.date?.slice(0, 10) || "-"
  };
}
await fs.writeFile("data/stats.json", JSON.stringify(out, null, 2));
console.log("stats.json updated ✔");
