'use strict'
/**
 * Windows 上 Vite 有时 exit code 异常，但 dist 已生成；用子进程跑 vite + 复制，保证 dist/public 一定有内容。
 */
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const viteCli = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const copyScript = path.join(__dirname, 'copy-public-to-dist-public.cjs')
const distDir = path.join(root, 'dist')

if (!fs.existsSync(viteCli)) {
  process.stderr.write('[build] ERROR: node_modules/vite not found. Run npm install.\n')
  process.exit(1)
}

const viteResult = spawnSync(process.execPath, [viteCli, 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
})

const viteStatus = viteResult.status
const viteOk = viteStatus === 0
const distIndex = path.join(distDir, 'index.html')
const distReady = fs.existsSync(distIndex)

let copyOk = true
if (fs.existsSync(distDir)) {
  const copyResult = spawnSync(process.execPath, [copyScript], {
    cwd: root,
    stdio: 'inherit',
  })
  copyOk = copyResult.status === 0
} else if (viteOk) {
  process.stderr.write('[build] ERROR: vite exited 0 but dist/ is missing.\n')
  process.exit(1)
}

if (viteOk && copyOk) {
  process.exit(0)
}

// Windows 上常见：终端显示 built 成功但进程 exit code 非 0；若 dist 完整且复制成功，仍视为构建成功
if (!viteOk && distReady && copyOk) {
  process.stderr.write(
    `[build] warning: vite exit code was ${viteStatus} (dist/index.html exists; copy-public ok — treating as success)\n`,
  )
  process.exit(0)
}

if (!viteOk) {
  process.stderr.write(`[build] vite failed, exit code: ${viteStatus}\n`)
  process.exit(viteStatus === null ? 1 : viteStatus)
}

process.exit(copyOk ? 0 : 1)
