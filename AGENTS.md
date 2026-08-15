# AGENTS.md

## Git workflow (user-mandated)
- **Always commit and push every change to GitHub** after completing any task or update.
- Remote: `origin` at https://github.com/Mac-Smat/fortct-website (branch `master`).
- Commit message style: concise, describes the change (see `git log` for examples).
- `.gitignore` excludes `node_modules`, `dist`, and raw image backups under `assets/**/_source-png/`.

## Asset pipeline
- User drops images as `name.webp.png` (PNGs) into `assets/<Section> Section Images/`.
- Move originals into `<Section>/_source-png/`, convert to WebP:
  `npx -y sharp-cli -i <in> -o <out> -q 82 --effort 6 -f webp` (clean base name, strip `.webp` suffix).
- Import from `src/components/`: `../../assets/<Section>/<file>.webp`; from `src/App.jsx`: `../assets/...`.
- Folder names contain spaces; works in Vite.

## Verify before pushing
- Run `npm run lint` and `npm run build` after every change.
- Browser checks via agent-browser session `fortct-verify` at http://127.0.0.1:4173 (preview server: `npx vite preview --host 127.0.0.1 --port 4173 --strictPort`).