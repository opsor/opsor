// Gives every guide and doc page the same look as the READMEs: a centred header with the project's icon,
// icons on section headings, and a footer. The text itself is never changed, and every heading keeps the
// anchor GitHub gave it, so existing links keep working. Safe to run twice (marker in the header).
// Usage: node docs.mjs [repo ...]
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = 'C:/Users/paylo_c3fu1jj/OneDrive/'
const REPOS = {
  afk: ROOT + 'Documents/GitHub/afk',
  pilot: ROOT + 'Documents/GitHub/pilot',
  mas: ROOT + 'Desktop/mas',
  bat: ROOT + 'Documents/GitHub/bat',
  add: ROOT + 'Documents/GitHub/add',
  trade: ROOT + 'Documents/GitHub/trade',
}
const MARK = '<!-- opsor-doc -->'
const COLOR = 'a1a1aa'

const SKIP = [/^README\.md$/i, /^sync-mod\//, /^\.design-sync\//, /^(desktop|frontend|packages|plugins|src|test|scripts)\//, /node_modules/]
const KEEP_NESTED = [/^docs\/README\.md$/]

const ICONS = [
  [/install|setup|download/, 'download'],
  [/quick start|getting started|first start|first run|start here/, 'rocket-launch'],
  [/requirement|dependenc/, 'package'],
  [/deploy|raspberry|pi\b|host|server/, 'hard-drives'],
  [/config|setting|option|preference|tuning|knob/, 'sliders-horizontal'],
  [/faq|question|troubleshoot|problem|trouble|common/, 'question'],
  [/secur|privacy|auth|permission|safety|licen[cs]e key|trust/, 'lock'],
  [/test|check|verif|lab|proven|measured|benchmark/, 'flask'],
  [/architect|layout|structure|overview|how it|design|model|internals|fits together/, 'tree-structure'],
  [/\bapi\b|endpoint|interface|protocol|contract|websocket|http|event/, 'plugs-connected'],
  [/licen[cs]e/, 'scroll'],
  [/roadmap|next|plan|future/, 'path'],
  [/changelog|release|version|what.s new|history|^\d+\.\d+/, 'tag'],
  [/command|order|cli|script|develop|build|code|component|plugin|extend/, 'terminal-window'],
  [/alert|notif|message/, 'bell-ringing'],
  [/limit|known|caveat|warning|not built/, 'warning'],
  [/example|usage|recipe/, 'code'],
  [/phone|mobile/, 'device-mobile'],
  [/fight|pvp|combat|spar|code (red|green|blue|brown|orange|yellow|purple|black|white)/, 'sword'],
  [/flight|fly/, 'airplane'],
]
const iconFor = (text) => {
  const t = text.toLowerCase()
  for (const [re, name] of ICONS) if (re.test(t)) return name
  return 'bookmark-simple'
}

const esc = (s) => s.replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const plain = (s) => s.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').replace(/[`*_~]/g, (m) => (m === '_' ? '_' : '')).replace(/&nbsp;/g, ' ')
const slugOf = (s) => plain(s).trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-')
const html = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

function listDocs(repoDir) {
  const out = execSync('git ls-files -- "*.md"', { cwd: repoDir, encoding: 'utf8' }).split('\n').filter(Boolean)
  return out.filter((f) => KEEP_NESTED.some((re) => re.test(f)) || !SKIP.some((re) => re.test(f)))
}

function restyle(repoDir, rel) {
  const file = path.join(repoDir, rel)
  const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
  if (src.includes(MARK)) return { rel, status: 'already styled' }
  const dir = path.posix.dirname(rel)
  const to = (target) => path.posix.relative(dir === '.' ? '' : dir, target) || path.basename(target)
  if (!fs.existsSync(path.join(repoDir, 'docs/brand/icon.svg'))) return { rel, status: 'no icon, skipped' }

  const lines = src.split('\n')
  let fence = null
  let title = null
  const ids = new Map()
  const aliases = []
  const out = []
  let skipNextBack = false
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    const f = line.match(/^\s*(```|~~~)/)
    if (f) {
      if (!fence) fence = f[1]
      else if (f[1] === fence) fence = null
      out.push(line)
      continue
    }
    if (fence) { out.push(line); continue }

    if (title === null && /^# /.test(line)) {
      title = plain(line.replace(/^#\s+/, '').replace(/<img[^>]*>\s*/g, '')).trim()
      skipNextBack = true
      out.push('\u0000HEADER\u0000')
      continue
    }
    if (skipNextBack) {
      if (/^\s*$/.test(line)) { continue }
      if (/^\[Back to README\]/i.test(line)) { skipNextBack = false; continue }
      skipNextBack = false
    }

    const h = line.match(/^## (.+?)\s*#*\s*$/)
    if (h) {
      const raw = h[1]
      const hadIcon = /<img/.test(raw) || /^&nbsp;/.test(raw)
      const cleaned = raw.replace(/<img[^>]*>\s*/g, '').replace(/^(&nbsp;|\s)+/, '').trim()
      let slug = slugOf(cleaned)
      const n = ids.get(slug) || 0
      ids.set(slug, n + 1)
      const id = n ? `${slug}-${n}` : slug
      if (hadIcon) aliases.push(['-' + id, id])
      out.push(`<h2 id="${id}"><img src="https://api.iconify.design/ph/${iconFor(cleaned)}-bold.svg?color=%23${COLOR}" width="22" align="absmiddle" />&nbsp; ${html(cleaned)}</h2>`)
      continue
    }
    out.push(line)
  }

  const icon = to('docs/brand/icon.svg')
  const links = [`<a href="${to('README.md')}">README</a>`]
  if (rel !== 'docs/GUIDE.md' && fs.existsSync(path.join(repoDir, 'docs/GUIDE.md'))) links.push(`<a href="${to('docs/GUIDE.md')}">Guide</a>`)
  if (rel !== 'docs/README.md' && fs.existsSync(path.join(repoDir, 'docs/README.md'))) links.push(`<a href="${to('docs/README.md')}">Docs index</a>`)
  const name = path.basename(repoDir)
  const headTitle = title || path.basename(rel, '.md')
  const header = `${MARK}\n<div align="center">\n\n<img src="${icon}" width="56" alt="${esc(name)}" />\n\n# ${headTitle}\n\n<sub>${links.join(' &nbsp;·&nbsp; ')}</sub>\n\n</div>`
  let body = out.join('\n')
  body = title === null ? header + '\n\n' + body : body.replace('\u0000HEADER\u0000', header)

  // old coloured icons inside the page bodies become the neutral grey
  body = body.replace(/(api\.iconify\.design\/[a-z]+\/[a-z0-9-]+\.svg\?color=%23)[0-9a-fA-F]{6}/g, (m, p) => p + COLOR)

  // keep links that pointed at the old icon-prefixed anchors alive
  const present = new Set(ids.keys())
  const linked = [...body.matchAll(/\]\(#([^)\s]+)\)/g)].map((m) => m[1])
  const unresolved = []
  for (const t of new Set(linked)) {
    if (present.has(t) || [...ids.keys()].some((k) => t === k || new RegExp(`^${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+$`).test(t))) continue
    const a = aliases.find(([alias]) => alias === t)
    if (a) body = body.replace(`<h2 id="${a[1]}">`, `<a id="${a[0]}"></a>\n<h2 id="${a[1]}">`)
    else unresolved.push(t)
  }

  // raw HTML blocks must be followed by a blank line, or the text under them is not rendered as markdown
  body = body.replace(/<\/div>\n(?=\S)/, '</div>\n\n').replace(/(<\/h2>)\n(?=\S)/g, '$1\n\n')
  const footer = `\n\n---\n\n<div align="center">\n<sub>Made by <a href="https://github.com/opsor"><b>opsor</b></a> &nbsp;·&nbsp; <a href="${to('README.md')}">Back to README</a></sub>\n</div>\n`
  body = body.replace(/\s+$/, '') + footer
  fs.writeFileSync(file, body)
  return { rel, status: 'styled', headings: ids.size, unresolved }
}

const only = process.argv.slice(2)
const targets = Object.keys(REPOS).filter((k) => !only.length || only.includes(k))
for (const key of targets) {
  const dir = REPOS[key]
  console.log(`== ${key}`)
  for (const rel of listDocs(dir)) {
    const r = restyle(dir, rel)
    console.log(`  ${r.status.padEnd(15)} ${rel}${r.headings ? `  (${r.headings} sections)` : ''}${r.unresolved?.length ? `  UNRESOLVED LINKS: ${r.unresolved.join(', ')}` : ''}`)
  }
}
