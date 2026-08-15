#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

const FIGMA_TOKEN = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY || process.argv[2]

if (!FIGMA_TOKEN || !FILE_KEY) {
  console.error('Missing FIGMA_TOKEN or FIGMA_FILE_KEY.\nSet env vars or pass file key as first argument.')
  process.exit(1)
}

const API = 'https://api.figma.com/v1'
const headers = { 'X-Figma-Token': FIGMA_TOKEN }

async function fetchJson(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  return res.json()
}

function collectIds(node, out) {
  if (!node) return
  if (node.id) out.push(node.id)
  if (node.children && node.children.length) node.children.forEach((c) => collectIds(c, out))
}

async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  console.log('Fetching file metadata...')
  const file = await fetchJson(`${API}/files/${FILE_KEY}`)
  console.log('File:', file.name)

  // Collect candidate node ids (document tree)
  const ids = []
  collectIds(file.document, ids)

  console.log(`Collected ${ids.length} node ids — requesting images endpoint (may skip nodes with no exportable image)`)
  const idsParam = encodeURIComponent(ids.join(','))
  const imagesResp = await fetchJson(`${API}/images/${FILE_KEY}?ids=${idsParam}&format=png`)

  const images = imagesResp.images || {}
  const outDir = path.join(process.cwd(), 'src', 'assets', 'figma_exports')
  await fs.mkdir(outDir, { recursive: true })

  for (const [nodeId, url] of Object.entries(images)) {
    if (!url) continue
    try {
      const buf = await download(url)
      const ext = url.includes('.svg') || url.includes('image/svg+xml') ? 'svg' : 'png'
      const filename = `${nodeId}.${ext}`
      await fs.writeFile(path.join(outDir, filename), buf)
      console.log('Saved', filename)
    } catch (err) {
      console.warn('Skipped', nodeId, err.message)
    }
  }

  console.log('Figma export finished — files saved to src/assets/figma_exports')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
