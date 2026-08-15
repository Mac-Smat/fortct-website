#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

const TOKEN = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'PVYKikPokpjyJs4qHSb7gA'
const API = 'https://api.figma.com/v1'
const headers = { 'X-Figma-Token': TOKEN }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchJson(url, retries = 6) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, { headers, cache: 'no-store' })
    if (res.ok) return res.json()
    if (res.status === 429) {
      console.log(`  [429] retry in ${15 * (i + 1)}s...`)
      await sleep(15000 * (i + 1))
      continue
    }
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  }
  throw new Error('Rate limit persisted')
}

function hex(rgba) {
  if (!rgba || !Array.isArray(rgba)) return null
  const r = Math.round(rgba[0] * 255)
  const g = Math.round(rgba[1] * 255)
  const b = Math.round(rgba[2] * 255)
  const a = rgba[3]
  return a < 1 ? `rgba(${r},${g},${b},${a.toFixed(2)})` : `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase()
}

function summarize(node, depth = 0) {
  const pad = '  '.repeat(depth)
  let line = `${pad}${node.type} "${node.name}" id=${node.id}`
  if (node.absoluteBoundingBox) {
    const b = node.absoluteBoundingBox
    line += ` x=${Math.round(b.x)} y=${Math.round(b.y)} w=${Math.round(b.width)} h=${Math.round(b.height)}`
  }
  const fills = node.fills?.filter((f) => f.type === 'SOLID' && f.visible !== false)
  if (fills?.length) {
    const colors = fills.map((f) => `${hex(f.color)}${f.opacity < 1 ? `/${f.opacity}` : ''}`).join(',')
    line += ` fill=[${colors}]`
  }
  if (node.strokeWeight && node.strokeWeight > 0) line += ` strokeW=${node.strokeWeight}`
  const strokes = node.strokes?.filter((s) => s.type === 'SOLID' && s.visible !== false)
  if (strokes?.length) line += ` stroke=[${strokes.map((s) => hex(s.color)).join(',')}]`
  if (node.type === 'TEXT') {
    line += ` chars=${JSON.stringify(node.characters)}`
    if (node.style) {
      const s = node.style
      line += ` font="${s.fontFamily || ''}" size=${s.fontSize} weight=${s.fontWeight || ''} lh=${s.lineHeightPx || s.lineHeightPercent || ''} ls=${s.letterSpacing || ''}`
    }
  }
  if (node.cornerRadius) line += ` radius=${node.cornerRadius}`
  if (node.effects?.some((e) => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW')) line += ' [shadow]'
  console.log(line)

  if (node.children) {
    for (const c of node.children) summarize(c, depth + 1)
  }
}

async function main() {
  const ids = process.argv[2] || '3:2'
  console.log(`Fetching /nodes ids=${ids} ...`)
  const resp = await fetchJson(`${API}/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids)}`)
  let out = ''
  const oldLog = console.log
  console.log = (...args) => { out += args.join(' ') + '\n'; oldLog(...args) }
  for (const [id, info] of Object.entries(resp.nodes)) {
    console.log(`\n########## NODE ${id} (${info.document.type} "${info.document.name}") ##########`)
    summarize(info.document, 0)
  }

  const dir = path.join(process.cwd(), 'scripts', 'figma_export')
  await fs.mkdir(dir, { recursive: true })
  const file = path.join(dir, `node-${ids.replace(/[^a-zA-Z0-9]/g, '_')}.txt`)
  await fs.writeFile(file, out)
  console.log('\nSaved:', file)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})