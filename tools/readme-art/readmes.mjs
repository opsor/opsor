// Generates the five README.md files from one structure.
// Usage: node readmes.mjs   (after `npm run build` has produced docs/brand/hero.png and flow.png)
import fs from 'node:fs'

const ROOT = 'C:/Users/paylo_c3fu1jj/OneDrive/'
const REPOS = {
  opsor: ROOT + 'Documents/GitHub/opsor',
  afk: ROOT + 'Documents/GitHub/afk',
  pilot: ROOT + 'Documents/GitHub/pilot',
  mas: ROOT + 'Desktop/mas',
  bat: ROOT + 'Documents/GitHub/bat',
}

const T = {
  opsor: { c: '4f9fd0', dark: '0f2d45', light: '8fc9ee', label: '0b1f2a' },
  afk: { c: 'd4d4d8', dark: '18181b', light: 'fafafa', label: '09090b' },
  pilot: { c: 'e0a030', dark: '3a2a0c', light: 'f2cf84', label: '241a07' },
  mas: { c: '8b7cf6', dark: '221a4a', light: 'c3bbfb', label: '150f33' },
  bat: { c: 'e05d6f', dark: '3d1019', light: 'f4a3ad', label: '240a10' },
}

const icon = (t, name, size = 28) => `<img src="https://api.iconify.design/ph/${name}-bold.svg?color=%23${t.c}" width="${size}" />`
const h2 = (t, name, text, id) => `<h2${id ? ` id="${id}"` : ''}><img src="https://api.iconify.design/ph/${name}-bold.svg?color=%23${t.c}" width="26" align="absmiddle" />&nbsp; ${text}</h2>`
const badge = (t, label, value, logo) =>
  `<img src="https://img.shields.io/badge/${encodeURIComponent(label).replace(/-/g, '--')}-${encodeURIComponent(value).replace(/-/g, '--')}-${t.dark}?style=for-the-badge&labelColor=${t.label}${logo ? `&logo=${logo}&logoColor=${t.light}` : ''}" />`

function cards(t, items, cols = 3) {
  const w = Math.floor(100 / cols)
  const rows = []
  for (let i = 0; i < items.length; i += cols) {
    const tds = items.slice(i, i + cols).map(([ic, title, text]) => `<td width="${w}%" valign="top">\n${icon(t, ic)}<br />\n<b>${title}</b><br />\n<sub>${text}</sub>\n</td>`)
    rows.push(`<tr>\n${tds.join('\n')}\n</tr>`)
  }
  return `<table width="100%">\n${rows.join('\n')}\n</table>`
}

function stats(items) {
  const tds = items.map(([v, l]) => `<td align="center" width="${Math.floor(100 / items.length)}%"><h2>${v}</h2><sub>${l}</sub></td>`)
  return `<table width="100%">\n<tr>\n${tds.join('\n')}\n</tr>\n</table>`
}

function faq(items) {
  return items.map(([q, a]) => `<details>\n<summary><b>${q}</b></summary>\n<br />\n${a}\n</details>`).join('\n\n')
}

const extra = (t) => (e) => `${h2(t, e.icon, e.title, e.id)}\n\n${e.body}\n\n<br />\n\n`
const read = (f) => fs.readFileSync(new URL('./content/' + f, import.meta.url), 'utf8').trim()

function project(key, c) {
  const t = T[key]
  const nav = c.nav.map(([l, h]) => `<a href="${h}">${l}</a>`).join(' &nbsp;·&nbsp; ')
  const buttons = c.docs.map(([l, h, ic]) => `<a href="${h}"><img src="https://img.shields.io/badge/${encodeURIComponent(l).replace(/-/g, '--')}-${t.dark}?style=for-the-badge&logo=${ic}&logoColor=${t.light}" /></a>`).join('\n')
  return `<div align="center">

<img src="docs/brand/hero.png" alt="${c.alt}" width="100%" />

<br /><br />

${c.badges.map(([l, v, lg]) => badge(t, l, v, lg)).join('\n')}

<br /><br />

<sub>${nav}</sub>

<br />

</div>

${stats(c.stats)}

<br />

${h2(t, 'diamond', c.whyTitle, 'why')}

${c.why}

<br />

${h2(t, 'rocket-launch', 'Features', 'features')}

${cards(t, c.features)}

<br />

${(c.afterFeatures || []).map(extra(t)).join('')}${h2(t, 'path', 'How it works', 'how-it-works')}

<img src="docs/brand/flow.png" alt="${c.flowAlt}" width="100%" />

<br />

${(c.afterFlow || []).map(extra(t)).join('')}

${h2(t, 'terminal-window', 'Quick start', 'quick-start')}

\`\`\`bash
${c.quick.join('\n')}
\`\`\`

<br />

${h2(t, 'lock', 'Security &amp; privacy', 'security')}

${c.security.map((s) => `- ${s}`).join('\n')}
${c.securityNote ? `\n<sub>${c.securityNote}</sub>\n` : ''}
<br />

${h2(t, 'package', 'Requirements', 'requirements')}

| | |
| :-- | :-- |
${c.requirements.map(([a, b]) => `| **${a}** | ${b} |`).join('\n')}

<br />

${h2(t, 'book-open', 'Documentation', 'docs')}

${c.docsText}

<p align="left">
${buttons}
</p>

<br />

${c.faq && c.faq.length ? `${h2(t, 'question', 'FAQ', 'faq')}\n\n${faq(c.faq)}\n\n<br />\n\n` : ''}<div align="center">

<sub>Made by <a href="https://github.com/opsor"><b>opsor</b></a> &nbsp;·&nbsp; Custom software on request, <a href="https://github.com/opsor">get in touch</a></sub><br />
<sub>${c.footer}</sub>

</div>
`
}

const CFG = {
  afk: {
    alt: 'AFK: your Minecraft farm accounts keep working while you are away',
    badges: [['VERSION', '4.0.0'], ['MINECRAFT JAVA', '1.21.11'], ['RUNS ON', 'Windows · Raspberry Pi', 'windows'], ['LICENSE', 'MIT']],
    nav: [['Why AFK', '#why'], ['Features', '#features'], ['Screens', '#screens'], ['Architecture', '#architecture'], ['Quick start', '#quick-start'], ['Security', '#security'], ['Guide', 'docs/GUIDE.md'], ['Changelog', 'CHANGELOG.md']],
    stats: [['5 weeks', 'of history'], ['24/7', 'on a Raspberry Pi'], ['4', 'alert loudness levels'], ['0', 'passwords stored']],
    whyTitle: 'Why AFK',
    why: 'Every account joins, farms, eats, stays armed and leaves the moment a stranger shows up. A Raspberry Pi runs them day and night while your PC and your phone show you everything: what needs you first, who is making what right now, and how the farm did this week.',
    features: [
      ['sword', 'Works the farm', 'Fights what is in reach, collects the drops, empties chests and hoppers, combines spawners and hands them over on one click.'],
      ['heartbeat', 'Looks after itself', 'Eats in time, wears the best armor, keeps a weapon in hand, goes home after every login and death.'],
      ['siren', 'Stays out of trouble', 'A stranger comes near: it logs out, or takes its spawners first. Kicked again and again: it takes a break.'],
      ['cpu', 'Runs 24/7 on a Pi', 'No window needed. Starts with the Pi, restarts itself, backs up every night, updates from your PC in one click.'],
      ['device-mobile', 'In your pocket', 'Phone alerts that matter, a daily summary, a weekly report, and a phone page to send bots and change settings.'],
      ['chart-line-up', 'Numbers you can trust', 'Spawners per hour and per day, five weeks of history, uptime, kicks and deaths for every account.'],
    ],
    afterFeatures: [{
      icon: 'monitor', title: 'Made for the second screen', id: 'screens',
      body: `<table width="100%">
<tr>
<td width="50%" valign="top"><img src="docs/screenshots/home.png" alt="AFK Home: problems first, today's spawners per bot as a donut with a ranked leaderboard" width="100%" /><br /><sub>Home: problems first, then who is making what right now.</sub></td>
<td width="50%" valign="top"><img src="docs/screenshots/monitor.png" alt="Monitor mode: the numbers, today by hour against yesterday, the leaderboard, every bot and a live feed" width="100%" /><br /><sub>Monitor mode: a control room for a second screen.</sub></td>
</tr>
<tr>
<td width="50%" valign="top"><img src="docs/screenshots/bot.png" alt="A bot page: output today, forecast, history, uptime, kicks and deaths" width="100%" /><br /><sub>Bot page: output, forecast, history and every switch.</sub></td>
<td width="50%" valign="top"><img src="docs/screenshots/history.png" alt="History: spawners per day for 30 days, stacked by bot, with the trend and the best day" width="100%" /><br /><sub>History: 30 days stacked by bot, with the trend.</sub></td>
</tr>
</table>

${read('afk-screen.md')}`,
    }],
    flowAlt: 'Sign in, run, watch, alert',
    afterFlow: [
      { icon: 'tree-structure', title: 'How it fits together', id: 'architecture', body: read('afk-arch.md') },
      { icon: 'bell-ringing', title: 'Alerts that are worth it', id: 'alerts', body: read('afk-alerts.md') },
    ],
    quick: ['npm install', 'npm run dev        # the window, with live reload', 'npm run headless   # the bots without a window (Raspberry Pi)', 'npm run dist       # build the Windows installer'],
    security: ['**No passwords.** Accounts sign in on Microsoft’s own page with a one-time code.', '**Nothing leaves your network** except the game connections and the push messages, and those never contain coordinates.', '**One share code** guards the share link and the phone page; five wrong tries lock the sender out for ten minutes.', '**Updates over SSH** with your PC’s key: no password is typed or stored, nothing is downloaded from elsewhere.', '**Your data stays yours:** logins, settings, numbers and logs live in <code>~/.afk</code> on the Pi (or <code>%APPDATA%\\AFK</code>), with a nightly backup of the last 14 days.'],
    requirements: [['Window', 'Windows 10 or 11'], ['24/7 host (optional)', 'Raspberry Pi 4 or 5 with 64-bit Raspberry Pi OS, no admin rights needed'], ['Accounts', 'One Minecraft: Java Edition account per bot, a server on 1.21.11'], ['Phone (optional)', 'The free ntfy app (iPhone, iPad, Android)']],
    docsText: 'Every feature, the Pi, the phone page, the alerts, the keyboard and the developer commands are in the Guide. What changed when is in the Changelog.',
    docs: [['READ THE GUIDE', 'docs/GUIDE.md', 'readthedocs'], ['CHANGELOG', 'CHANGELOG.md', 'keepachangelog']],
    faq: [
      ['Do I need a Raspberry Pi?', 'No. The same AFK also runs the bots on the PC itself, without a Pi. The Pi is for running them day and night.'],
      ['Is it safe for my account?', 'Not every server welcomes automation. Use AFK where the server’s rules allow it; what your accounts do is your own responsibility.'],
      ['Does it store my Microsoft password?', 'No. Sign-in uses Microsoft’s device code page.'],
    ],
    footer: 'AFK is an independent project, not affiliated with Mojang or Microsoft. Use it where the server’s rules allow it. MIT licensed.',
  },
  pilot: {
    alt: 'pilot: one brain, many bots, one schematic, layer by layer',
    badges: [['WINDOWS', '10 | 11', 'windows'], ['MINECRAFT JAVA', 'AUTO-DETECTED'], ['CHECKS', '357 PASSING']],
    nav: [['Why pilot', '#why'], ['Features', '#features'], ['How it works', '#how-it-works'], ['Quick start', '#quick-start'], ['Security', '#security'], ['FAQ', '#faq'], ['Guide', 'docs/GUIDE.md']],
    stats: [['357', 'checks passing'], ['182k', 'blocks in the soak build'], ['16', 'stand-in bots soak-tested'], ['Auto', 'self-updating app']],
    whyTitle: 'Why pilot',
    why: 'A big build is a lot of standing in the same spot. Drop in a <code>.litematic</code>, say where it goes, assign some bots, and pilot works out the order, hands out the work, keeps bots apart, tells you what they still need to carry and checks the result before it moves up a floor. One window, any number of builds, nothing to count by hand.',
    features: [
      ['stack', 'Layer by layer', 'Surveys, builds, verifies and seals each layer before the next one opens.'],
      ['users-three', 'Swarm coordination', 'Each bot gets its own strip. Work is leased to one bot at a time.'],
      ['cube', 'Materials by the box', 'Counted as full shulker boxes plus one box with its odd items.'],
      ['package', 'Carries and refills', 'Shulker boxes of blocks, own blocks for gaps, refills from supply points.'],
      ['drop', 'Spills and repairs', 'Takes up water and lava, then repairs the layers it touched.'],
      ['bell-ringing', 'Alerts', 'Told when a build finishes or stalls, or a bot runs dry, dies or disconnects.'],
    ],
    flowAlt: 'Schematic, brain, swarm, seal',
    quick: ['npm install', 'npm run dist     # installer and portable app into release/', 'npm run ui && npm start   # engine and console at http://localhost:8430'],
    security: ['**No passwords.** Microsoft sign-in is by code at microsoft.com/link.', '**Local data.** Settings, builds, accounts and sign-ins stay in <code>%APPDATA%\\pilot</code>.', '**Local interface.** It listens on this computer only.', '**Responsible use.** Run bots only on a server that is yours, or whose owner has agreed to them.'],
    requirements: [['System', 'Windows 10 or 11'], ['You need', 'A Minecraft: Java Edition account per bot, or a server in offline mode'], ['Optional', '<code>git</code>, signed in to the repository, for self-updates'], ['Built with', 'Node, Mineflayer, Electron and React']],
    docsText: 'Install steps, settings, what is proven and what is not, and the full developer reference are in the Guide.',
    docs: [['READ THE GUIDE', 'docs/GUIDE.md', 'readthedocs']],
    faq: [
      ['Is it safe for my account?', 'Not every server welcomes automation. Use pilot where the rules allow it; what your accounts do is your own responsibility.'],
      ['Which Minecraft version does it speak?', 'The one the server reports, or the one you enter. It has been run here on 1.21.4.'],
      ['Where are my files?', '<code>%APPDATA%\\pilot</code>: config, accounts, saved sign-ins, one folder per build, logs and the update log.'],
    ],
    footer: 'pilot is an independent project, not affiliated with Mojang or Microsoft. Private and unlicensed.',
  },
  mas: {
    alt: 'MAS: a terminal for teams that move on a schedule',
    badges: [['WINDOWS', '10 | 11', 'windows'], ['ELECTRON', '44', 'electron'], ['REACT', '19', 'react'], ['TESTS', '184']],
    nav: [['Why MAS', '#why'], ['Features', '#features'], ['How it works', '#how-it-works'], ['Quick start', '#quick-start'], ['Security', '#security'], ['FAQ', '#faq'], ['Guide', 'docs/GUIDE.md']],
    stats: [['184', 'automated tests'], ['1 ms', 'scheduling precision'], ['4', 'roles'], ['2', 'runtime dependencies']],
    whyTitle: 'Why MAS',
    why: 'Black, white and minimal: a trading-terminal layout with no colour to decode, a frameless window and monospaced data. Behind it sits a real engine that persists state, encrypts credentials and schedules execution to the millisecond, so a whole team can work from one screen.',
    features: [
      ['chart-line-up', 'Market data', 'Upcoming drops with filters, countdowns, watchlist and auto-queue rules.'],
      ['crosshair', 'Sniper Ops', 'Strategies, a timing panel and an execution console with explicit confirmation.'],
      ['key', 'Account hub', 'Status, notes, labels, import and export, audited password reveal.'],
      ['wallet', 'Portfolio', 'Names held, costs, sale prices and realized profit and loss.'],
      ['scroll', 'Logs and audit', 'Settled executions and a hash-chained ledger you can verify.'],
      ['command', 'Command palette', '<code>Ctrl+K</code> for views, accounts, names and actions.'],
    ],
    flowAlt: 'Watch, arm, execute, record',
    quick: ['npm install', 'npm run app      # build, then open the desktop window', 'npm test          # engine tests and end-to-end suite'],
    security: ['**Encrypted credentials** with the Windows keychain.', '**Hashed sign-in.** Passwords are scrypt hashes; session tokens are stored only as hashes.', '**Roles.** Viewer, operator, admin and owner. Nobody can demote themselves or the last owner.', '**Audited.** Reveals and user changes go to an append-only ledger with the signed-in name.'],
    securityNote: 'Claiming is simulated until you turn live claiming on. Read the documentation before enabling it.',
    requirements: [['System', 'Windows 10 or 11'], ['Install', 'NSIS installer or portable exe from <code>npm run dist</code>'], ['Live claiming', 'Off by default. See <a href="docs/LIVE.md">docs/LIVE.md</a> first'], ['Built with', 'Electron, React and a dependency-free Node engine']],
    docsText: 'What is real, signing in, adding names, sharing lists, shortcuts, updates and testing are in the Guide.',
    docs: [['READ THE GUIDE', 'docs/GUIDE.md', 'readthedocs'], ['ENGINE DOCS', 'docs/ENGINE.md', 'nodedotjs'], ['ROADMAP', 'ROADMAP.md', 'github']],
    faq: [
      ['Is claiming live?', 'No. It is simulated until you turn live claiming on. A real path exists, off by default and never run against the live services.'],
      ['Why does Windows show a SmartScreen warning?', 'Builds are unsigned. Choose <i>More info</i>, then <i>Run anyway</i>. The executable does not change between code updates, so it happens once per installer.'],
      ['Can teammates share target lists?', 'Yes. Point every MAS at one <code>.json</code> file in a folder you can all reach. Accounts and passwords are never in it.'],
    ],
    footer: 'MAS is an independent project, not affiliated with Mojang or Microsoft.',
  },
  bat: {
    alt: 'Bat: one brain, a whole fleet of bots',
    badges: [['NODE', '20+', 'nodedotjs'], ['MINECRAFT JAVA', '1.21.11'], ['CHECKS', '~11,800']],
    nav: [['Why Bat', '#why'], ['Features', '#features'], ['How it works', '#how-it-works'], ['Quick start', '#quick-start'], ['Security', '#security'], ['FAQ', '#faq'], ['Guide', 'docs/GUIDE.md']],
    stats: [['30', 'bots on one engine'], ['170', 'order-bar commands'], ['9', 'tactical codes'], ['11,800', 'offline checks']],
    whyTitle: 'Why Bat',
    why: 'Running one bot is easy. Running thirty that fight, fly and follow orders without tripping over each other is not. Bat puts a single brain in charge: give an order, typed or spoken, and the fleet carries it out together while you watch it on one console, or on a built-in simulator when no server is around.',
    features: [
      ['sword', 'Combat and PvP', 'Elytra dives, wind-charge smashes, crits, shield breaks, cobwebs, pearls and totem play.'],
      ['airplane', 'Flight', 'Angled take-off, low cruise, one arc onto the goal and a fast landing.'],
      ['trophy', 'Sparring', 'Duels, free-for-alls and teams, four levels, a leaderboard and a mercy rule.'],
      ['shield', 'Nine codes', 'Eight tactical codes from Green patrol to Black sweep, plus the Code White parade.'],
      ['crown-simple', 'Commander', 'One bot above the officers who leads, patrols and speaks for the fleet.'],
      ['microphone', 'Order bar', '170 commands read offline, with a local model for loose phrasing.'],
    ],
    flowAlt: 'Order bar, brain, fleet, console',
    quick: ['npm install', 'npm run sim      # whole system on a built-in simulator, console at http://localhost:8420', 'npm run doctor   # real server: check config, ports and credentials', 'npm start        # start the engine'],
    security: ['**No passwords.** Microsoft sign-in is by device code at microsoft.com/link.', '**Encrypted vault.** Bot credentials are protected by your own passphrase (<code>BAT_VAULT_KEY</code>).', '**Local first.** Runs on your machine, or on your own Raspberry Pi.', '**Responsible use.** Use Bat on servers you own or have permission to use it on.'],
    requirements: [['Game', 'Minecraft Java 1.21.11'], ['Runtime', 'Node.js 20 or newer, no native modules'], ['Interfaces', 'Web console, self-updating Windows app, headless mode for a Raspberry Pi']],
    docsText: 'Quick start, the order bar, configuration, architecture, testing and the full manual are in the Guide.',
    docs: [['READ THE GUIDE', 'docs/GUIDE.md', 'readthedocs'], ['MANUAL INDEX', 'docs/README.md', 'bookstack']],
    faq: [
      ['Do I need a Minecraft server to try it?', 'No. <code>npm run sim</code> runs the whole system against a built-in kingdom.'],
      ['Do the bots need to be opped?', 'No. Without an op bot, a bot sees you only within the server’s tracking range, so “come here” works for players a bot can see.'],
      ['Where can I use it?', 'On servers you own or have permission to use it on. Running automated clients is against the rules of many public servers.'],
    ],
    footer: 'Bat is an independent project, not affiliated with Mojang or Microsoft. Private and unlicensed.',
  },
}

for (const key of ['afk', 'pilot', 'mas', 'bat']) {
  fs.writeFileSync(REPOS[key] + '/README.md', project(key, { ...CFG[key], whyTitle: CFG[key].whyTitle }))
  console.log('README', key)
}

// ---------------- profile ----------------
{
  const t = T.opsor
  const md = `<div align="center">

<img src="docs/brand/hero.png" alt="opsor: software that works while you don’t" width="100%" />

<br /><br />

<a href="#contact"><img src="https://img.shields.io/badge/START%20A%20PROJECT-DISCORD%20%C2%B7%20opsor-${t.dark}?style=for-the-badge&logo=discord&logoColor=${t.light}" /></a>
<img src="https://img.shields.io/badge/STATUS-OPEN%20FOR%20COMMISSIONS-${t.dark}?style=for-the-badge&labelColor=${t.label}" />

<br /><br />

<sub><a href="#why">Why opsor</a> &nbsp;·&nbsp; <a href="#services">Services</a> &nbsp;·&nbsp; <a href="#products">Products</a> &nbsp;·&nbsp; <a href="#stack">Stack</a> &nbsp;·&nbsp; <a href="#faq">FAQ</a> &nbsp;·&nbsp; <a href="#contact">Contact</a></sub>

<br />

</div>

${stats([['4', 'products shipped'], ['184', 'automated tests in one product'], ['24/7', 'unattended by design'], ['Auto', 'updating desktop apps']])}

<br />

${h2(t, 'diamond', 'Why opsor', 'why')}

Most custom software arrives half-finished: no installer, no error handling, no docs. I build the whole thing, so what you receive is a product you can run, hand to a teammate and trust.

${cards(t, [
    ['infinity', 'Self-running', 'Reconnects, recovers and heals on its own. Nothing to babysit.'],
    ['shield-check', 'Secure', 'Encrypted credentials, official sign-in flows and audit trails.'],
    ['gauge', 'Tested', 'Unit, end-to-end and soak tests, with CI on every change.'],
    ['package', 'Ship-ready', 'Installer, auto-update, documentation and a clean interface.'],
  ], 4)}

<br />

${h2(t, 'briefcase', 'Services', 'services')}

${cards(t, [
    ['robot', 'Automation and bots', 'Real-time clients and multi-account managers with safety logic built in.'],
    ['app-window', 'Desktop applications', 'Windows app with installer, auto-update and a clean UI.'],
    ['graph', 'Orchestration and backends', 'Task queues, worker swarms and APIs that scale.'],
    ['bell-ringing', 'Dashboards and alerts', 'Live status, desktop and phone alerts, Discord and Slack webhooks.'],
  ], 2)}

> **Open to any project**, as long as it is legal and does not break a platform's EULA or terms of service. If it fits, I will build it.

<br />

${h2(t, 'cube', 'Products', 'products')}

| | Product | Type | Highlights |
| :-: | :-- | :-- | :-- |
| <img src="assets/logo-afk.svg" width="44" /> | **AFK** | Multi-account automation | Any number of accounts from one window. Self-care, recovery, safe-logout, instant alerts |
| <img src="assets/logo-pilot.svg" width="44" /> | **Pilot** | Swarm controller | One brain and a lease-based task queue that builds a schematic across many bots |
| <img src="assets/logo-mas.svg" width="44" /> | **MAS** | Team operations terminal | Millisecond scheduling, encrypted credentials, tamper-evident audit ledger, 184 tests |
| <img src="assets/logo-bat.svg" width="44" /> | **Bat** | Fleet command console | Combat and PvP, tactical codes, a commander bot, live 3D map and an offline simulator |
| ${icon(t, 'sparkle', 32)} | **Coming soon** | New project | In development. Details to follow |

<sub>Source is private. Live demos and walkthroughs on request. Bots are for servers you own or have permission to use them on.</sub>

<br />

${h2(t, 'stack', 'Stack', 'stack')}

<p align="left">
${['JavaScript:javascript', 'Node.js:nodedotjs', 'React:react', 'Electron:electron', 'Vite:vite', 'Tailwind:tailwindcss', 'Git:git', 'GitHub%20Actions:githubactions']
    .map((s) => { const [n, l] = s.split(':'); return `<img src="https://img.shields.io/badge/${n}-${t.dark}?style=flat-square&logo=${l}&logoColor=${t.light}" />` })
    .join(' ')}
</p>

<br />

${h2(t, 'question', 'FAQ', 'faq')}

${faq([
    ['What do you take on?', 'Automation tools, bots, backends and Windows desktop apps, and any other project that is legal and respects a platform’s EULA and terms of service.'],
    ['Do I get the source code?', 'Yes, source handover can be part of the delivery. We agree on it in the scope.'],
    ['Is it safe for my accounts?', 'Tools use official sign-in flows wherever one exists, and any stored credentials are encrypted. I flag a platform’s rules before building.'],
  ])}

<br />

${h2(t, 'chat-circle', 'Contact', 'contact')}

Describe what you need and I'll tell you what's feasible, how long it takes and what it costs.

<a href="#contact"><img src="https://img.shields.io/badge/DISCORD-opsor-${t.dark}?style=for-the-badge&logo=discord&logoColor=${t.light}" /></a>

<br /><br />

<div align="center"><sub>Made by <b>opsor</b> &nbsp;·&nbsp; Custom software on request</sub></div>
`
  fs.writeFileSync(REPOS.opsor + '/README.md', md)
  console.log('README opsor')
}
