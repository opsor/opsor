# readme-art

Generates the hero banners, flow diagrams and README files for the opsor projects.

```bash
npm install
npm run build        # hero.png and flow.png into each repo's docs/brand/
node readmes.mjs     # README.md for every repo, from one shared structure
```

- `build.mjs` draws the artwork as SVG and renders it to PNG with resvg, using local system fonts, so the typography is identical everywhere.
- `readmes.mjs` holds one config per project (features, security, FAQ) and the shared layout.
- `content/` has hand-written blocks reused verbatim (AFK's architecture diagram and tables).

Palettes (icon / badge background / badge logo): blue opsor, neutral AFK, amber Pilot, violet MAS, crimson Bat.
