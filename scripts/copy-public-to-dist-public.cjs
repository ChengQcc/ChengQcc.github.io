'use strict'
/**
 * 避免在 Windows 上对大量中文/长路径使用 fs.cpSync 导致进程静默崩溃；
 * 改为逐文件 copyFileSync，并在 win32 上使用 \\?\ 长路径前缀。
 */
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const pub = path.join(root, 'public')
const dest = path.join(root, 'dist', 'public')

function log(msg) {
  process.stderr.write(msg + '\n')
}

/** @param {string} p */
function longPath(p) {
  if (process.platform !== 'win32') return path.resolve(p)
  const r = path.resolve(p)
  if (r.startsWith('\\\\?\\')) return r
  return '\\\\?\\' + r
}

function countFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return 0
  let n = 0
  const walk = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name)
      if (ent.isDirectory()) walk(p)
      else n++
    }
  }
  walk(dir)
  return n
}

/**
 * @param {string} srcDir
 * @param {string} dstDir
 * @param {{ n: number, before: number }} prog
 */
function copyTree(srcDir, dstDir, prog) {
  fs.mkdirSync(dstDir, { recursive: true })
  const ents = fs.readdirSync(srcDir, { withFileTypes: true })
  for (const ent of ents) {
    const s = path.join(srcDir, ent.name)
    const d = path.join(dstDir, ent.name)
    if (ent.isDirectory()) {
      copyTree(s, d, prog)
    } else {
      try {
        if (process.platform === 'win32') {
          fs.copyFileSync(longPath(s), longPath(d))
        } else {
          fs.copyFileSync(s, d)
        }
      } catch (e) {
        throw new Error(`copy failed: ${s} -> ${d}: ${e.message}`)
      }
      prog.n++
      if (prog.n % 40 === 0 || prog.n === prog.before) {
        log(`[copy-public] ... ${prog.n}/${prog.before} files`)
      }
    }
  }
}

log('[copy-public] start — copy public/ → dist/public/ (for /public/... URLs)')

try {
  if (!fs.existsSync(pub)) {
    log('[copy-public] skip: public/ not found')
    process.exit(0)
  }

  const before = countFilesRecursive(pub)
  if (before === 0) {
    log('[copy-public] skip: public/ has no files')
    process.exit(0)
  }

  if (!fs.existsSync(path.join(root, 'dist'))) {
    log('[copy-public] ERROR: dist/ missing — run vite build first')
    process.exit(1)
  }

  log(`[copy-public] ${before} files to copy (file-by-file, Windows-safe)`)
  fs.rmSync(dest, { recursive: true, force: true })
  fs.mkdirSync(dest, { recursive: true })
  copyTree(pub, dest, { n: 0, before })

  const after = countFilesRecursive(dest)
  if (after !== before) {
    log(
      `[copy-public] warning: file count public=${before} vs dist/public=${after}`,
    )
  }
  if (after === 0) {
    log('[copy-public] ERROR: dist/public empty after copy')
    process.exit(1)
  }

  log(`[copy-public] ok: ${after} files → dist/public`)
  process.exit(0)
} catch (e) {
  log('[copy-public] ERROR: ' + (e && e.message ? e.message : String(e)))
  process.exit(1)
}
