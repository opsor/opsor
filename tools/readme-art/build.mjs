// Renders hero banners and flow diagrams for the opsor READMEs.
// Usage: npm install && npm run build
import { Resvg } from '@resvg/resvg-js'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = 'C:/Users/paylo_c3fu1jj/OneDrive/'
const REPOS = {
  opsor: ROOT + 'Documents/GitHub/opsor',
  afk: ROOT + 'Documents/GitHub/afk',
  pilot: ROOT + 'Documents/GitHub/pilot',
  mas: ROOT + 'Desktop/mas',
  bat: ROOT + 'Documents/GitHub/bat',
}

const FONT = "Segoe UI, Inter, Arial, sans-serif"
const MONO = "Cascadia Mono, Consolas, monospace"
const W = 1280
const H = 440

const THEMES = {
  opsor: { accent: '#d4d4d8', dark: '#18181b', light: '#fafafa', label: '#09090b' },
  afk: { accent: '#d4d4d8', dark: '#18181b', light: '#fafafa', label: '#09090b' },
  pilot: { accent: '#d4d4d8', dark: '#18181b', light: '#fafafa', label: '#09090b' },
  mas: { accent: '#d4d4d8', dark: '#18181b', light: '#fafafa', label: '#09090b' },
  bat: { accent: '#d4d4d8', dark: '#18181b', light: '#fafafa', label: '#09090b' },
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function logoAt(file, x, y, size) {
  const svg = fs.readFileSync(file, 'utf8')
  const vb = svg.match(/viewBox="([^"]+)"/)[1]
  const inner = svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'))
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${vb}">${inner}</svg>`
}

function pills(t, items, x, y) {
  let cx = x
  return items
    .map((label) => {
      const w = Math.round(label.length * 9.2 + 34)
      const out = `<g transform="translate(${cx} ${y})"><rect width="${w}" height="32" rx="9" fill="${t.dark}" stroke="${t.accent}" stroke-opacity="0.45"/><text x="${w / 2}" y="21" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="1.2" fill="${t.light}">${esc(label)}</text></g>`
      cx += w + 12
      return out
    })
    .join('')
}

function lines(arr, x, y0, size, fill, weight = 400, gap = 1.45) {
  return arr
    .map((l, i) => `<text x="${x}" y="${y0 + i * size * gap}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(l)}</text>`)
    .join('')
}

function heroFrame(t, cfg, art, glowX = 1000) {
  const { title, tagline, sub, pillItems, logo } = cfg
  const tagY = 252
  const subY = tagY + tagline.length * 24 * 1.4 + 14
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#ffffff" fill-opacity="0.07"/></pattern>
    <radialGradient id="glow" cx="${glowX}" cy="220" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="26"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="#000"/>
    <rect width="${W}" height="${H}" fill="url(#dots)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect x="0" y="0" width="6" height="${H}" fill="${t.accent}"/>
    ${art}
    ${cfg.noRing ? "" : `<circle cx="108" cy="92" r="45" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="2"/>`}
    ${logoAt(logo, 64, 48, 88)}
    <text x="62" y="212" font-family="${FONT}" font-size="78" font-weight="700" letter-spacing="-2" fill="#ffffff">${esc(title)}</text>
    ${lines(tagline, 66, tagY, 24, t.accent, 600, 1.4)}
    ${lines(sub, 66, subY, 18, '#8c8c8c', 400, 1.45)}
    ${pills(t, pillItems, 64, 388)}
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="25.5" fill="none" stroke="#262626"/>
</svg>`
}

// ---------- art ----------
function artAfk(t) {
  const AFK = REPOS.afk + '/docs/screenshots/'
  const img = (f) => fs.readFileSync(AFK + f).toString('base64')
  const panel = (id, file, x, y, w, ar, op) => {
    const h = Math.round(w * ar)
    return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/></clipPath>
    <image x="${x}" y="${y}" width="${w}" height="${h}" clip-path="url(#${id})" opacity="${op}" preserveAspectRatio="none" href="data:image/png;base64,${img(file)}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" stroke="#3a3a3f" stroke-width="1.5"/>`
  }
  return `<g>
    ${panel('shotA', 'home.png', 850, 40, 380, 835 / 1424, 0.9)}
    <rect x="684" y="136" width="532" height="292" rx="20" fill="#000" opacity="0.6"/>
    ${panel('shotB', 'monitor.png', 700, 148, 500, 1015 / 1904, 1)}
  </g>`
}

function artMas(t) {
  const rows = [
    ['target_01', '00:12:48.250', 'ARMED', t.light, t.dark],
    ['target_02', '01:04:09.000', 'QUEUED', '#9a9a9a', '#161616'],
    ['target_03', '02:30:00.000', 'WATCH', '#9a9a9a', '#161616'],
    ['target_04', '04:48:30.500', 'WATCH', '#9a9a9a', '#161616'],
  ]
  const rowSvg = rows
    .map(([n, c, s, fg, bg], i) => {
      const y = 134 + i * 40
      return `<text x="752" y="${y}" font-family="${MONO}" font-size="15" fill="#e6e6e6">${n}</text>
      <text x="920" y="${y}" font-family="${MONO}" font-size="15" fill="${i === 0 ? t.light : '#9a9a9a'}">${c}</text>
      <rect x="1088" y="${y - 17}" width="84" height="24" rx="12" fill="${bg}" stroke="${fg}" stroke-opacity="0.5"/>
      <text x="1130" y="${y - 1}" text-anchor="middle" font-family="${MONO}" font-size="11" font-weight="700" letter-spacing="1" fill="${fg}">${s}</text>
      <line x1="740" y1="${y + 14}" x2="1204" y2="${y + 14}" stroke="#1a1a1a"/>`
    })
    .join('')
  const heights = [34, 52, 44, 66, 58, 80, 70, 92, 84, 62, 78, 96, 88, 108]
  const candles = heights
    .map((h, i) => {
      const x = 760 + i * 31
      const base = 392
      const h2 = h * 0.6
      const top = base - h2
      const up = i % 3 !== 1
      return `<line x1="${x + 8}" y1="${top - 8}" x2="${x + 8}" y2="${base + 4}" stroke="${up ? t.accent : '#3a3a3a'}" stroke-width="2"/>
      <rect x="${x}" y="${top}" width="16" height="${Math.max(12, h2 * 0.55)}" rx="3" fill="${up ? t.accent : '#2a2a2a'}"/>`
    })
    .join('')
  return `<g>
    <rect x="724" y="34" width="500" height="372" rx="20" fill="#0a0a0a" stroke="#262626"/>
    <line x1="724" y1="78" x2="1224" y2="78" stroke="#1a1a1a"/>
    <text x="752" y="62" font-family="${MONO}" font-size="14" fill="#8c8c8c">MAS · Sniper Ops</text>
    <text x="1112" y="62" text-anchor="end" font-family="${MONO}" font-size="12" fill="#6a6a6a">NTP +0.4 ms</text>
    <rect x="1128" y="46" width="76" height="24" rx="12" fill="${t.dark}" stroke="${t.accent}" stroke-opacity="0.6"/>
    <circle cx="1146" cy="58" r="4" fill="${t.light}"/>
    <text x="1180" y="62" text-anchor="middle" font-family="${MONO}" font-size="11" font-weight="700" letter-spacing="1" fill="${t.light}">LIVE</text>
    <text x="752" y="108" font-family="${MONO}" font-size="11" letter-spacing="1.4" fill="#6a6a6a">TARGET</text>
    <text x="920" y="108" font-family="${MONO}" font-size="11" letter-spacing="1.4" fill="#6a6a6a">DROPS IN</text>
    <text x="1088" y="108" font-family="${MONO}" font-size="11" letter-spacing="1.4" fill="#6a6a6a">STATE</text>
    ${rowSvg}
    <line x1="740" y1="318" x2="1204" y2="318" stroke="#1a1a1a"/>
    
    ${candles}
  </g>`
}

function artBat(t) {
  const cx = 1000
  const cy = 220
  const ring = (r, n, off, size, fill, op) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((i / n) * 360 + off) * (Math.PI / 180)
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), size, fill, op }
    })
  const inner = ring(100, 6, -90, 11, t.accent, 1)
  const outer = ring(165, 12, -75, 7, '#52525b', 1)
  const edges = inner.map((p) => `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${t.accent}" stroke-opacity="0.45" stroke-width="1.5"/>`).join('')
  const edges2 = outer
    .map((p, i) => {
      const q = inner[Math.floor(i / 2)]
      return `<line x1="${q.x.toFixed(1)}" y1="${q.y.toFixed(1)}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${t.accent}" stroke-opacity="0.25" stroke-width="1.2"/>`
    })
    .join('')
  const nodes = [...inner, ...outer].map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.size}" fill="${p.fill}"/>`).join('')
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="62" fill="none" stroke="#1f1f1f" stroke-dasharray="3 6"/>
    <circle cx="${cx}" cy="${cy}" r="100" fill="none" stroke="#242424"/>
    <circle cx="${cx}" cy="${cy}" r="165" fill="none" stroke="#1f1f1f" stroke-dasharray="3 6"/>
    <circle cx="${cx}" cy="${cy}" r="195" fill="none" stroke="#181818"/>
    ${edges2}${edges}${nodes}
    <circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="${t.accent}" stroke-opacity="0.5"/>
    <circle cx="${cx}" cy="${cy}" r="24" fill="${t.accent}"/>
    <path d="M${cx - 12} ${cy + 6} l3 -13 l6 7 l3 -9 l3 9 l6 -7 l3 13 z" fill="#000"/>
    <rect x="${cx + 74}" y="52" width="112" height="28" rx="14" fill="${t.dark}" stroke="${t.accent}" stroke-opacity="0.6"/>
    <circle cx="${cx + 92}" cy="66" r="4" fill="${t.light}"/>
    <text x="${cx + 138}" y="70" text-anchor="middle" font-family="${MONO}" font-size="12" font-weight="700" letter-spacing="1.2" fill="${t.light}">CODE RED</text>
    <text x="${cx + 60}" y="392" font-family="${MONO}" font-size="12" letter-spacing="1" fill="#6a6a6a">30 BOTS · ONE ENGINE</text>
  </g>`
}

function artOpsor(t) {
  const cx = 986
  const cy = 220
  const avatar = fs.readFileSync(REPOS.opsor + '/assets/avatar.jpg').toString('base64')
  const orbit = [
    { a: -135, f: 'afk', n: 'AFK' },
    { a: -45, f: 'pilot', n: 'PILOT' },
    { a: 45, f: 'mas', n: 'MAS' },
    { a: 135, f: 'bat', n: 'BAT' },
  ]
  const R = 176
  const sat = orbit
    .map(({ a, f, n }) => {
      const r = (a * Math.PI) / 180
      const x = cx + R * Math.cos(r)
      const y = cy + R * Math.sin(r)
      const file = REPOS.opsor + '/assets/logo-' + f + '.svg'
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${t.accent}" stroke-opacity="0.18"/>
      ${logoAt(file, x - 40, y - 40, 80)}
      <text x="${x.toFixed(1)}" y="${(y + (y > cy ? 62 : -50)).toFixed(1)}" text-anchor="middle" font-family="${MONO}" font-size="12" letter-spacing="1.4" fill="#6a6a6a">${n}</text>`
    })
    .join('')
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#242424" stroke-dasharray="3 7"/>
    <circle cx="${cx}" cy="${cy}" r="${R + 34}" fill="none" stroke="#181818"/>
    <circle cx="${cx}" cy="${cy}" r="126" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="2"/>
    ${sat}
    <clipPath id="av"><circle cx="${cx}" cy="${cy}" r="118"/></clipPath>
    <image x="${cx - 118}" y="${cy - 118}" width="236" height="236" clip-path="url(#av)" preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,${avatar}"/>
  </g>`
}

// ---------- flow diagram ----------
function flow(t, steps) {
  const boxW = 268
  const gap = 52
  const x0 = 26
  const y = 20
  const h = 168
  const parts = steps.map(([title, l1, l2], i) => {
    const x = x0 + i * (boxW + gap)
    const arrow =
      i < steps.length - 1
        ? `<path d="M${x + boxW + 12} ${y + h / 2} h${gap - 24}" stroke="${t.accent}" stroke-width="2.5" stroke-linecap="round"/><path d="M${x + boxW + gap - 20} ${y + h / 2 - 7} l8 7 l-8 7" fill="none" stroke="${t.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`
        : ''
    return `<g>
      <rect x="${x}" y="${y}" width="${boxW}" height="${h}" rx="20" fill="#0a0a0a" stroke="#262626"/>
      <rect x="${x + 28}" y="${y}" width="${boxW - 56}" height="3" rx="1.5" fill="${t.accent}" fill-opacity="0.9"/>
      <circle cx="${x + 44}" cy="${y + 56}" r="22" fill="${t.dark}" stroke="${t.accent}" stroke-opacity="0.6"/>
      <text x="${x + 44}" y="${y + 64}" text-anchor="middle" font-family="${MONO}" font-size="22" font-weight="700" fill="${t.light}">${i + 1}</text>
      <text x="${x + 84}" y="${y + 64}" font-family="${FONT}" font-size="24" font-weight="700" fill="#ffffff">${esc(title)}</text>
      <text x="${x + 28}" y="${y + 112}" font-family="${FONT}" font-size="16" fill="#9a9a9a">${esc(l1)}</text>
      <text x="${x + 28}" y="${y + 136}" font-family="${FONT}" font-size="16" fill="#9a9a9a">${esc(l2)}</text>
    </g>${arrow}`
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 208" width="${W}" height="208"><rect width="${W}" height="208" fill="none"/>${parts.join('')}</svg>`
}

const render = (svg, width = W * 2) =>
  new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' },
  })
    .render()
    .asPng()

function out(repo, name, svg, keepSvg = false) {
  const dir = path.join(REPOS[repo], 'docs/brand')
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, name + '.png'), render(svg))
  if (keepSvg) fs.writeFileSync(path.join(dir, name + '.src.svg'), svg)
  console.log('wrote', repo, name)
}

const logo = (r) => REPOS[r] + '/docs/brand/logo.svg'
const only = process.argv[2]

const heroes = {
  afk: heroFrame(THEMES.afk, {
    title: 'AFK',
    tagline: ['Your Minecraft farm accounts keep', 'working while you are away.'],
    sub: ['A Raspberry Pi runs them day and night;', 'your PC and phone show you everything.'],
    pillItems: ['VERSION 4.0.0', 'WINDOWS | PI', 'MIT'],
    logo: REPOS.afk + '/docs/brand/icon.svg',
    noRing: true,
  }, artAfk(THEMES.afk), 1000),
  mas: heroFrame(THEMES.mas, {
    title: 'MAS',
    tagline: ['A terminal for teams that', 'move on a schedule.'],
    sub: ['Watch drops, run executions to the millisecond,', 'keep a tamper-evident audit trail.'],
    pillItems: ['WINDOWS', 'ELECTRON 44', '184 TESTS'],
    logo: REPOS.mas + '/docs/brand/icon.svg',
    noRing: true,
  }, artMas(THEMES.mas), 980),
  bat: heroFrame(THEMES.bat, {
    title: 'Bat',
    tagline: ['One brain.', 'A whole fleet of bots.'],
    sub: ['Fights, flies, spars and parades under', 'a single operator console.'],
    pillItems: ['NODE 20+', '30 BOTS / ENGINE', '11,800 CHECKS'],
    logo: REPOS.bat + '/docs/brand/icon.svg',
    noRing: true,
  }, artBat(THEMES.bat), 1000),
  opsor: heroFrame(THEMES.opsor, {
    title: 'opsor',
    tagline: ['Software that works', 'while you don’t.'],
    sub: ['Quiet, precise automation.', 'Built to run, built to last.'],
    pillItems: ['OPEN FOR COMMISSIONS', '4 PRODUCTS SHIPPED'],
    logo: REPOS.opsor + '/assets/mark.svg',
    noRing: true,
  }, artOpsor(THEMES.opsor), 986),
}

const flows = {
  afk: [['Sign in', 'Microsoft one-time code,', 'no password stored'], ['Run', 'On your PC, or 24/7', 'on a Raspberry Pi'], ['Watch', 'Home, monitor mode and', 'a page on your phone'], ['Alert', 'Urgent to low, never', 'with coordinates']],
  pilot: [['Schematic', 'Drop a .litematic,', 'set its origin'], ['Brain', 'Task queue, leases,', 'sectors per bot'], ['Swarm', 'Bots build, restock', 'and repair together'], ['Seal', 'Every layer read back', 'before the next opens']],
  mas: [['Watch', 'Targets, countdowns', 'and auto-queue rules'], ['Arm', 'NTP-corrected timing,', 'explicit confirmation'], ['Execute', 'Scheduled to the', 'millisecond, per account'], ['Record', 'Results, profit and loss,', 'hash-chained audit']],
  bat: [['Order bar', 'Typed or spoken,', 'English and German'], ['Brain', 'Parser, nine codes,', 'commander bot'], ['Fleet', 'Up to 30 bots on', 'one engine'], ['Console', 'Live 3D map and', 'per-bot fight cards']],
}

for (const k of Object.keys(heroes)) if (!only || only === k) out(k, 'hero', heroes[k])
for (const k of Object.keys(flows)) if (!only || only === k) out(k, 'flow', flow(THEMES[k], flows[k]))

// Pilot keeps its own layered-grid banner as the hero
if (!only || only === 'pilot') {
  const b = fs.readFileSync(REPOS.pilot + '/docs/media/banner.svg', 'utf8').replace(/#e0a030/gi, '#e4e4e7')
  out('pilot', 'hero', b)
}
