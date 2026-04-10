import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicRoot = path.resolve(__dirname, 'public')

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

/**
 * 项目内资源统一使用 /public/... 路径。
 * Vite 默认会把 public 拷到 dist 根目录（无 public 前缀），这里改为：
 * - dev：/public/* 映射到 ./public/*
 * - build：由 scripts/run-build.cjs 在 vite build 后把 public 复制到 dist/public
 */
function publicUnderPrefix() {
  return {
    name: 'public-under-prefix',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.url?.split('?')[0] ?? ''
        if (!raw.startsWith('/public/')) return next()
        const rel = decodeURIComponent(raw.slice('/public/'.length))
        if (!rel || rel.includes('..')) return next()
        const filePath = path.resolve(publicRoot, rel)
        if (!filePath.startsWith(publicRoot)) return next()
        try {
          const st = fs.statSync(filePath)
          if (!st.isFile()) return next()
        } catch {
          return next()
        }
        const ext = path.extname(filePath).toLowerCase()
        res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
        fs.createReadStream(filePath).pipe(res)
      })
    },
  }
}

export default defineConfig({
  root: '.',
  // 默认拷贝到 dist 根目录（/images/...）；dist/public 由 npm run build → run-build.cjs 负责
  publicDir: 'public',
  plugins: [publicUnderPrefix()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        works: path.resolve(__dirname, 'works.html'),
        about: path.resolve(__dirname, 'about.html'),
        'model-training': path.resolve(__dirname, 'model-training.html'),
        'scroll-reveal': path.resolve(__dirname, 'scroll-reveal.html'),
        'video-showcase': path.resolve(__dirname, 'video-showcase.html'),
        'ai-tool': path.resolve(__dirname, 'ai-tool.html'),
        'ai-manju': path.resolve(__dirname, 'ai-manju.html'),
        'ai-studio-code': path.resolve(__dirname, 'ai_studio_code.html'),
      },
    },
  },
})
