// Auto-discover all client logos from assets/Client Logos/
// Drop a new .webp or .svg into this folder and it appears in the marquee automatically.
// Original PNGs live in _source-png/ (gitignored) — only converted WebP/SVG files are loaded.
const logoModules = import.meta.glob('../../assets/Client Logos/*', {
  eager: true,
  import: 'default',
})

const IMAGE_EXTENSIONS = ['.webp', '.svg']

// Predefined gradients — cycled through in alphabetical filename order
const GRADIENTS = [
  { from: '#668CFF', via: '#0049FF', to: '#003199' },
  { from: '#FFE766', via: '#FFCE00', to: '#B38F00' },
  { from: '#6690F0', via: '#255BE3', to: '#193B99' },
  { from: '#C4C2FF', via: '#9896FF', to: '#5B4DCC' },
  { from: '#FF66A1', via: '#FF007A', to: '#B3005A' },
  { from: '#D9FF5A', via: '#AFFF01', to: '#7A9900' },
  { from: '#8AA7FF', via: '#5F86FF', to: '#3A5ACC' },
  { from: '#67F0D1', via: '#2AE5B9', to: '#1B8F72' },
]

// Turn a filename like "bitqora-logo.webp" → "Bitqora Logo"
// or "client-logo-clerk.svg" → "Clerk"
function filenameToAlt(filename) {
  return filename
    .replace(/\.(webp|svg)$/i, '')
    .replace(/^(client-logo-|logo-)/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export const CLIENT_LOGOS = Object.entries(logoModules)
  .filter(([path]) => {
    const ext = path.slice(path.lastIndexOf('.')).toLowerCase()
    return IMAGE_EXTENSIONS.includes(ext) && !path.includes('_source-png')
  })
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src], index) => {
    const filename = path.split('/').pop()
    const alt = filenameToAlt(filename)
    const gradient = GRADIENTS[index % GRADIENTS.length]
    return { src, alt, gradient }
  })
