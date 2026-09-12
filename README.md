# @zuedev/create-foundry-module

Scaffold a zero-build Foundry VTT module — plain ES modules, no dependencies — with a Dockerised Foundry dev server and a tag-driven GitHub release workflow.

## Usage

```bash
npm create @zuedev/foundry-module
npm create @zuedev/foundry-module "Cool Module"   # title as argument
```

You'll be prompted for module title, id, description, author, GitHub user and repo name.

## What you get

```
my-module/
├── .github/workflows/release.yml   # tag v* → zips source/ and publishes a release
├── source/
│   ├── module.json
│   ├── module.js
│   ├── styles/module.css
│   └── lang/en.json
├── .env.example
├── .gitignore
├── docker-compose.yml               # felddy/foundryvtt with source/ bind-mounted
└── README.md
```

## Local development of this scaffolder

```bash
node index.js "Test Module"
```

Files under `template/` are copied verbatim, with `{{MODULE_ID}}`, `{{MODULE_TITLE}}`, `{{MODULE_DESCRIPTION}}`, `{{AUTHOR}}`, `{{GITHUB_USER}}` and `{{REPO}}` substituted. `_gitignore` is renamed to `.gitignore` on copy (npm strips `.gitignore` from published packages).

## Publishing

```bash
npm publish --access public
```

Requires Node ≥ 18.
