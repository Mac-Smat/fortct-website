#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

const TOKEN = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'PVYKikPokpjyJs4qHSb7gA'
const API = 'https://api.figma.com/v1'
const headers = { 'X-Figma-Token': TOKEN }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchJson(url, retries = 5) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, { headers, cache: 'no-store' })
    if (res.ok) return res.json()
    if (res.status === 429) {
      const wait = 20000 * (i + 1)
      console.log(`  [429] retry in ${wait / 1000}s...`)
      await sleep(wait)
      continue
    }
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  }
  throw new Error('Rate limit persisted')
}

function flatten(node, out = []) {
  out.push(node)
  if (node.children) node.children.forEach((c) => flatten(c, out))
  return out
}

const dir = path.join(process.cwd(), 'scripts', 'figma_export')
await fs.mkdir(dir, { recursive: true })

const ids = process.argv[2] || '3:323'
console.log(`Fetching /nodes ids=${ids} ...`)
const resp = await fetchJson(`${API}/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids)}`)
for (const id of Object.keys(resp.nodes)) {
  const root = resp.nodes[id].document
  const lines = []
  for (const n of flatten(root)) {
    const rel = (n.absoluteBoundingBox && root.absoluteBoundingBox)
      ? ` x=${Math.round(n.absoluteBoundingBox.x - root.absoluteBoundingBox.x)} y=${Math.round(n.absoluteBoundingBox.y - root.absoluteBoundingBox.y)} w=${Math.round(n.absoluteBoundingBox.width)} h=${Math.round(n.absoluteBoundingBox.height)}`
      : ''
    lines.push(`- ${n.id} ${n.type} "${n.name}"${rel}`)
    if (n.fills) lines.push(`    fills: ${JSON.stringify(n.fills.map((f) => ({ type: f.type, color: f.color, opacity: f.opacity, imageRef: f.imageRef })))}`)
    if (n.strokes?.length) lines.push(`    strokes: ${JSON.stringify(n.strokes.map((f) => ({ type: f.type, color: f.color, opacity: f.opacity, weight: n.strokeWeight })))}`)
    if (n.effects?.length) lines.push(`    effects: ${JSON.stringify(n.effects.map((e) => ({ type: e.type, color: e.color })))}`)
    if (n.type === 'TEXT') lines.push(`    text: ${JSON.stringify(n.characters)} style: ${JSON.stringify(n.style)}`)
  }
  const file = path.join(dir, `raw-${id.replace(/:/g, '_')}.txt`)
  await fs.writeFile(file, lines.join('\n'))
  console.log('Saved:', file)
}