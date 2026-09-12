#!/usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin, stdout, argv, exit } from "node:process";
import { cp, mkdir, readdir, readFile, writeFile, rename, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const TEMPLATE_DIR = join(dirname(fileURLToPath(import.meta.url)), "template");
const rl = createInterface({ input: stdin, output: stdout });

const ask = async (q, def) => (await rl.question(def ? `${q} (${def}): ` : `${q}: `)).trim() || def;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const gitUser = () => { try { return execSync("gh api user -q .login", { stdio: "pipe" }).toString().trim(); } catch { return ""; } };
const gitName = () => { try { return execSync("git config user.name", { stdio: "pipe" }).toString().trim(); } catch { return ""; } };

// --- prompts ---------------------------------------------------------------
const title = await ask("Module title", argv[2] ?? "My Module");
const id = await ask("Module id", slug(title));
const description = await ask("Description", "A Foundry VTT module.");
const author = await ask("Author name", gitName() || "Your Name");
const githubUser = await ask("GitHub user/org", gitUser() || "your-username");
const repo = await ask("GitHub repo name", id);
const dir = await ask("Directory", id);
rl.close();

// --- guard -----------------------------------------------------------------
const target = join(process.cwd(), dir);
if (await stat(target).then(() => true, () => false) && (await readdir(target)).length) {
  console.error(`\n✖ ${dir} exists and is not empty.`);
  exit(1);
}

// --- copy + substitute -----------------------------------------------------
const vars = {
  MODULE_ID: id,
  MODULE_TITLE: title,
  MODULE_DESCRIPTION: description,
  AUTHOR: author,
  GITHUB_USER: githubUser,
  REPO: repo,
};

await mkdir(target, { recursive: true });
await cp(TEMPLATE_DIR, target, { recursive: true });
await rename(join(target, "_gitignore"), join(target, ".gitignore"));

for await (const file of walk(target)) {
  const src = await readFile(file, "utf8");
  const out = src.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
  if (out !== src) await writeFile(file, out);
}

// --- done ------------------------------------------------------------------
console.log(`
✔ Created ${title} in ./${dir}

Next steps:
  cd ${dir}
  cp .env.example .env      # add your foundryvtt.com credentials
  docker compose up -d      # Foundry at http://localhost:30000
  git init && git add -A && git commit -m "Initial commit"
`);

async function* walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}
