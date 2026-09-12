# {{MODULE_TITLE}}

{{MODULE_DESCRIPTION}}

Plain ES module — no build step, no dependencies — with a Dockerised Foundry dev server and a tag-driven release pipeline.

## Setup

```bash
cp .env.example .env      # add your foundryvtt.com credentials
```

## Development

```bash
docker compose up -d      # Foundry at http://localhost:30000
docker compose logs -f    # tail server logs
```

`./source` is bind-mounted into the container as your module, so edits are live.
CSS/HBS/lang changes hot-reload; JS changes need a browser refresh (F5).

Change `FOUNDRY_VERSION` in `.env` (e.g. `12`, `13`) to test other Foundry versions.
Delete `./foundry-data` for a fresh install.

## Releasing

```bash
git tag v0.1.0 && git push --tags
```

The workflow stamps the version into `module.json`, zips `source/`, and publishes to a GitHub Release.

Install URL: `https://github.com/{{GITHUB_USER}}/{{REPO}}/releases/latest/download/module.json`
