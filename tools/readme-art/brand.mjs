// Writes the monochrome marks, tile icons and app icons (png + ico) for Pilot, MAS, Bat and the profile.
// AFK keeps its own "Night shift" mark and is not touched here.
import { Resvg } from '@resvg/resvg-js'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = 'C:/Users/paylo_c3fu1jj/OneDrive/'
const REPOS = {
  opsor: ROOT + 'Documents/GitHub/opsor',
  pilot: ROOT + 'Documents/GitHub/pilot',
  mas: ROOT + 'Desktop/mas',
  bat: ROOT + 'Documents/GitHub/bat',
  add: ROOT + 'Documents/GitHub/add',
  trade: ROOT + 'Documents/GitHub/trade',
}

// Marks are drawn in a 64 x 64 box, white, like AFK's logo.svg.
const MARKS = {
  pilot: {
    // three chevrons, fading downward: the layers of a build
    inner: `<g transform="scale(2.6667)">
    <polygon points="12,2.9 20,9.9 20,12.4 12,5.4 4,12.4 4,9.9" fill="#fff"/>
    <polygon points="12,7.1 20,14.1 20,16.6 12,9.6 4,16.6 4,14.1" fill="#fff" fill-opacity="0.56"/>
    <polygon points="12,11.3 20,18.3 20,20.8 12,13.8 4,20.8 4,18.3" fill="#fff" fill-opacity="0.26"/>
  </g>`,
    shift: [0, 0.4],
  },
  mas: {
    // three rising candlesticks: a terminal for timed moves
    inner: `<g fill="#fff">
    <rect x="15" y="34" width="2" height="22" rx="1"/><rect x="11" y="40" width="10" height="10" rx="2.5"/>
    <rect x="31" y="22" width="2" height="30" rx="1"/><rect x="27" y="30" width="10" height="16" rx="2.5"/>
    <rect x="47" y="10" width="2" height="34" rx="1"/><rect x="43" y="18" width="10" height="20" rx="2.5"/>
  </g>`,
    shift: [0, -1],
  },
  bat: {
    // a geometric bat with two eye cut-outs
    inner: `<path fill-rule="evenodd" fill="#fff" transform="translate(32 32) scale(0.32) translate(-128 -116)" d="M128 100 L137 78 L144 98 C172 90 204 92 226 108 L192 126 L172 146 L150 132 L128 154 L106 132 L84 146 L64 126 L30 108 C52 92 84 90 112 98 L119 78 Z M121 113 m-3.6 0 a3.6 3.6 0 1 0 7.2 0 a3.6 3.6 0 1 0 -7.2 0 M135 113 m-3.6 0 a3.6 3.6 0 1 0 7.2 0 a3.6 3.6 0 1 0 -7.2 0"/>`,
    shift: [0, 0],
  },
  add: {
    // four slots: three components plugged in, one waiting
    inner: `<g fill="#fff"><rect x="11" y="11" width="17" height="17" rx="4.5"/><rect x="36" y="11" width="17" height="17" rx="4.5"/><rect x="11" y="36" width="17" height="17" rx="4.5"/></g>
  <rect x="37.2" y="37.2" width="14.6" height="14.6" rx="4" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="3.6 3"/>`,
    shift: [0, 0],
  },
  trade: {
    // grid levels crossed by a price line
    inner: `<g stroke="#fff" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round"><line x1="9" y1="17" x2="55" y2="17"/><line x1="9" y1="32" x2="55" y2="32"/><line x1="9" y1="47" x2="55" y2="47"/></g>
  <polyline points="10,43 21,22 33,38 45,16 55,27" fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    shift: [0, 0],
  },
  opsor: {
    // a ring, a core and one orbiting node: the operator and its systems
    inner: `<circle cx="32" cy="32" r="15.5" fill="none" stroke="#fff" stroke-width="3.6"/>
  <circle cx="32" cy="32" r="6.2" fill="#fff"/>
  <circle cx="43.4" cy="20.6" r="4" fill="#fff" stroke="#09090b" stroke-width="2"/>`,
    shift: [0, 0],
  },
}

const markSvg = (m) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" role="img">
  ${m.inner}
</svg>
`

const iconSvg = (key, m) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" fill="none">
  <!-- app icon: the white ${key} mark on a dark tile, same construction as AFK -->
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1c1c1f"/>
      <stop offset="1" stop-color="#09090b"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.04"/>
    </linearGradient>
  </defs>
  <rect x="8" y="8" width="240" height="240" rx="56" fill="url(#tile)"/>
  <rect x="9" y="9" width="238" height="238" rx="55" stroke="url(#edge)" stroke-width="2"/>
  <g transform="translate(${48 + m.shift[0] * 2.5} ${48 + m.shift[1] * 2.5}) scale(2.5)">
    ${m.inner}
  </g>
</svg>
`

const render = (svg, size) => new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng()

function ico(svg, sizes = [256, 128, 64, 48, 32, 16]) {
  const images = sizes.map((s) => render(svg, s))
  const head = Buffer.alloc(6)
  head.writeUInt16LE(1, 2)
  head.writeUInt16LE(sizes.length, 4)
  let offset = 6 + 16 * sizes.length
  const entries = sizes.map((s, i) => {
    const e = Buffer.alloc(16)
    e[0] = s === 256 ? 0 : s
    e[1] = s === 256 ? 0 : s
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(images[i].length, 8)
    e.writeUInt32LE(offset, 12)
    offset += images[i].length
    return e
  })
  return Buffer.concat([head, ...entries, ...images])
}

for (const [key, m] of Object.entries(MARKS)) {
  const repo = REPOS[key]
  const brand = key === 'opsor' ? path.join(repo, 'assets') : path.join(repo, 'docs/brand')
  fs.mkdirSync(brand, { recursive: true })
  const icon = iconSvg(key, m)
  if (key === 'opsor') {
    fs.writeFileSync(path.join(brand, 'mark.svg'), icon)
  } else {
    fs.writeFileSync(path.join(brand, 'logo.svg'), key === 'add' || key === 'trade' ? icon : markSvg(m)) // their icon scripts render logo.svg
    fs.writeFileSync(path.join(brand, 'icon.svg'), icon)
    if (key !== 'add' && key !== 'trade') {
      const assets = path.join(repo, 'desktop/assets')
      fs.writeFileSync(path.join(assets, 'icon.png'), render(icon, 256))
      fs.writeFileSync(path.join(assets, 'icon.ico'), ico(icon))
    }
    // copies for the profile page
    fs.writeFileSync(path.join(REPOS.opsor, `assets/logo-${key}.svg`), icon)
  }
  console.log('brand', key)
}
