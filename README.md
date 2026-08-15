# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Fetching assets from Figma

There's a small helper script to export images from a Figma file into `src/assets/figma_exports`.

- Create a personal access token in Figma (Menu → Settings → Personal access tokens).
- Copy `.env.example` to `.env` and set `FIGMA_TOKEN` and `FIGMA_FILE_KEY` (or pass the file key as an argument).
- Run the script with Node (requires Node 18+ / fetch API available):

```bash
# set env vars (example, PowerShell)
$env:FIGMA_TOKEN = "your_token_here"
$env:FIGMA_FILE_KEY = "figma_file_key"
node scripts/fetch-figma.js

# OR pass the file key as argument
node scripts/fetch-figma.js FILE_KEY
```

Note: Do not paste your token into chat or commit it to the repo. Use environment variables locally.
