// node icon-png.mjs <input.svg> <output.png> [size]  renders an svg to a png (used for app icons)
import { Resvg } from '@resvg/resvg-js'
import fs from 'node:fs'
import path from 'node:path'
const [, , input, output, size = '512'] = process.argv
const png = new Resvg(fs.readFileSync(input, 'utf8'), { fitTo: { mode: 'width', value: Number(size) } }).render().asPng()
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, png)
console.log('wrote', output, size + 'px')
