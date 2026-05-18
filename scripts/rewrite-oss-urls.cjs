'use strict'
/**
 * 构建后脚本：将 /oss-* 代理路径替换为完整 OSS URL
 * 用于 GitHub Pages 等静态部署环境
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const distDir = path.join(root, 'dist')

// 代理路径 -> 完整 OSS URL 映射
const OSS_REWRITE_MAP = {
  '/oss-videos/': 'https://qxc-oss.oss-cn-hangzhou.aliyuncs.com/portfolio-videos/',
  '/oss-houqi/':  'https://qxc-oss.oss-cn-hangzhou.aliyuncs.com/houqi_video/',
  '/oss-manju/':  'https://qxc-oss.oss-cn-hangzhou.aliyuncs.com/manjuvideo/',
  '/oss-aivideo/':'https://qxc-oss.oss-cn-hangzhou.aliyuncs.com/AIvideozhanshi/',
}

if (!fs.existsSync(distDir)) {
  process.stderr.write('[rewrite-oss] dist/ not found, skipping.\n')
  process.exit(0)
}

// 查找所有 HTML 文件
function findHtmlFiles(dir) {
  const results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(full))
    } else if (entry.name.endsWith('.html')) {
      results.push(full)
    }
  }
  return results
}

const htmlFiles = findHtmlFiles(distDir)
let totalReplacements = 0

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let modified = false

  for (const [proxyPath, ossUrl] of Object.entries(OSS_REWRITE_MAP)) {
    if (content.includes(proxyPath)) {
      const before = content
      // 使用 split/join 替代 replaceAll 以兼容旧版 Node
      content = content.split(proxyPath).join(ossUrl)
      const count = (before.length - content.length) / (ossUrl.length - proxyPath.length)
      totalReplacements += Math.abs(Math.round(count))
      modified = true
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8')
    const rel = path.relative(distDir, filePath)
    process.stdout.write(`[rewrite-oss] ✓ ${rel}\n`)
  }
}

process.stdout.write(`[rewrite-oss] Done. Total replacements: ${totalReplacements}\n`)
process.exit(0)
