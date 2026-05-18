'use strict'
/**
 * 压缩首页大图：等比缩放到实际显示尺寸的 2 倍 + 80% 质量
 * 处理后直接替换原文件
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public', 'images')

// ===== 压缩配置 =====
const tasks = [
  // 头像 — 页面上显示约 100×100px，Retina 2x = 200
  {
    file: 'touxiang/微信图片_20260323171559_141_1182.png',
    width: 200,
    desc: '头像',
  },
  // 项目封面 — 卡片 16:9，显示宽度约 600px，Retina 2x = 1200
  {
    file: 'manju2/jimeng-2026-04-08-3364-图片1背景改成浅紫色渐变.png',
    width: 1200,
    desc: 'AI直播矩阵素材封面',
  },
  {
    file: 'manju2/jimeng-2026-04-08-2423-这幅画面以黑白水墨风格为主，营造出一种肃杀、神秘且充满力量感的氛围。画面中心是一....png',
    width: 1200,
    desc: 'V5-AI漫剧封面',
  },
  {
    file: 'manju2/jimeng-2026-04-08-2715-这张图片展示了一个充满科技感和节日氛围的3D渲染作品， 画面中心是一个银灰色的长....png',
    width: 1200,
    desc: 'AI创意工坊封面',
  },
  {
    file: 'fengmian/未标题-1.jpg',
    width: 1200,
    desc: '模型训练封面',
  },
  {
    file: 'fengmian/未标题-2.jpg',
    width: 1200,
    desc: 'AI视频封面',
  },
  // 微信二维码 — 显示约 200px，Retina 2x = 400
  {
    file: 'weixin/微信图片_20260409201148_179_118.jpg',
    width: 400,
    desc: '微信二维码',
  },
  // 首页未直接使用但体积很大的图也顺手压掉
  {
    file: 'touxiang/微信图片_20260323171559_141_118.jpg',
    width: 200,
    desc: '头像JPG版',
  },
]

async function compressImage({ file, width, desc }) {
  const inputPath = path.join(publicDir, file)
  if (!fs.existsSync(inputPath)) {
    console.log(`  ⚠ 跳过(不存在): ${file}`)
    return { file, before: 0, after: 0 }
  }

  const beforeSize = fs.statSync(inputPath).size
  const ext = path.extname(file).toLowerCase()

  // Windows 兼容：先读入 Buffer，避免 sharp 直接操作中文路径
  const inputBuffer = fs.readFileSync(inputPath)

  // 先读原图尺寸，避免把小于目标宽度的图放大
  const metadata = await sharp(inputBuffer).metadata()
  const targetWidth = Math.min(width, metadata.width || width)

  // 压缩
  let pipeline = sharp(inputBuffer).resize({ width: targetWidth, withoutEnlargement: true })

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true })
  } else if (ext === '.png') {
    pipeline = pipeline.png({ quality: 80, compressionLevel: 9 })
  }

  const buffer = await pipeline.toBuffer()

  // 备份原文件（加 .bak 后缀）
  const backupPath = inputPath + '.bak'
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath)
  }

  // 写入压缩后的文件
  fs.writeFileSync(inputPath, buffer)

  const afterSize = buffer.length
  const savedPct = ((1 - afterSize / beforeSize) * 100).toFixed(1)
  const beforeKB = (beforeSize / 1024).toFixed(1)
  const afterKB = (afterSize / 1024).toFixed(1)

  console.log(`  ✓ ${desc}: ${beforeKB}KB → ${afterKB}KB (减少 ${savedPct}%)`)
  return { file, before: beforeSize, after: afterSize }
}

async function main() {
  console.log('\n🔧 开始压缩首页大图...\n')

  let totalBefore = 0
  let totalAfter = 0

  for (const task of tasks) {
    const result = await compressImage(task)
    totalBefore += result.before
    totalAfter += result.after
  }

  const totalSavedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)
  const totalSavedPct = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
  const beforeMB = (totalBefore / 1024 / 1024).toFixed(1)

  console.log(`\n📊 总计: ${beforeMB}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB (节省 ${totalSavedMB}MB / ${totalSavedPct}%)`)
  console.log('📁 原文件已备份为 .bak，确认效果后可删除\n')
}

main().catch((err) => {
  console.error('压缩失败:', err)
  process.exit(1)
})
