'use strict'
/**
 * 压缩图片：目标每张 ≤ 600KB，自适应调整质量
 * 处理后直接替换原文件，原文件备份为 .bak
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public', 'images')

// ===== 压缩配置 =====
const TARGET_KB = 1000
const MIN_QUALITY = 30
const MAX_WIDTH = 1600

const tasks = [
  // ======================== 首页 & 公共 ========================
  { file: 'touxiang/微信图片_20260323171559_141_1182.png', width: 200, desc: '头像' },
  { file: 'manju2/jimeng-2026-04-08-3364-图片1背景改成浅紫色渐变.png', width: 1200, desc: 'AI直播矩阵素材封面' },
  { file: 'manju2/jimeng-2026-04-08-2423-这幅画面以黑白水墨风格为主，营造出一种肃杀、神秘且充满力量感的氛围。画面中心是一....png', width: 1200, desc: 'V5-AI漫剧封面' },
  { file: 'manju2/jimeng-2026-04-08-2715-这张图片展示了一个充满科技感和节日氛围的3D渲染作品， 画面中心是一个银灰色的长....png', width: 1200, desc: 'AI创意工坊封面' },
  { file: 'fengmian/未标题-1.jpg', width: 1200, desc: '模型训练封面' },
  { file: 'fengmian/未标题-2.jpg', width: 1200, desc: 'AI视频封面' },
  { file: 'weixin/微信图片_20260409201148_179_118.jpg', width: 400, desc: '微信二维码' },
  { file: 'touxiang/微信图片_20260323171559_141_118.jpg', width: 200, desc: '头像JPG版' },

  // ======================== AI漫剧 (ai-manju.html) ========================
  { file: 'manju2/驾驶舱.png', width: 1600, desc: 'AI漫剧-驾驶舱' },
  { file: 'manju2/创建剧本.png', width: 1600, desc: 'AI漫剧-创建剧本' },
  { file: 'manju2/角色管理.png', width: 1600, desc: 'AI漫剧-角色管理' },
  { file: 'manju2/分镜列表.png', width: 1600, desc: 'AI漫剧-分镜列表' },
  { file: 'manju2/资源 9@5x.png', width: 1200, desc: 'AI漫剧-流程图1' },
  { file: 'manju2/资源 10@5x.png', width: 800, desc: 'AI漫剧-角色prompts' },
  { file: 'manju2/资源 11@5x.png', width: 800, desc: 'AI漫剧-角色检测' },
  { file: 'manju2/资源 12@5x.png', width: 800, desc: 'AI漫剧-角色更新' },
  { file: 'manju2/资源 14@5x.png', width: 1600, desc: 'AI漫剧-链路设计图2' },
  { file: 'manju2/资源 15@5x.png', width: 1600, desc: 'AI漫剧-链路设计图1' },
  { file: 'manju2/Snipaste_2026-04-08_22-00-33.png', width: 1600, desc: 'AI漫剧-SKILL设计' },
  { file: 'manju/微信图片_2026-04-02_170621_146.png', width: 1600, desc: 'AI漫剧-全局架构' },

  // ======================== AI创意工坊 (ai-tool.html) ========================
  { file: 'AIgongfang/资源 18@5x.png', width: 1600, desc: 'AI创意工坊-系统集成' },
  { file: 'AIgongfang/资源 20@5x.png', width: 1200, desc: 'AI创意工坊-表格1' },
  { file: 'AIgongfang/资源 21@5x.png', width: 1200, desc: 'AI创意工坊-表格3' },
  { file: 'AIgongfang/资源 23@5x.png', width: 1200, desc: 'AI创意工坊-表格2' },
  { file: 'AIgongfang/资源 22@5x.png', width: 1000, desc: 'AI创意工坊-表格5' },
  { file: 'AIgongfang/资源 24@5x.png', width: 1000, desc: 'AI创意工坊-表格4' },
  { file: 'AIgongfang/资源 26@5x.png', width: 1000, desc: 'AI创意工坊-表格6' },

  // ======================== 模型训练 (model-training.html) ========================
  // 万物迁移
  { file: 'comfyui/wanwuqianyi/图层 11@1.25x.png', width: 1600, desc: '模型训练-万物迁移工作流' },
  { file: 'comfyui/wanwuqianyi/组 2@1.25x.png', width: 1200, desc: '模型训练-万物迁移演示1' },
  { file: 'comfyui/wanwuqianyi/组 3@1.25x.png', width: 1200, desc: '模型训练-万物迁移演示2' },
  { file: 'comfyui/wanwuqianyi/组 4@1.25x.png', width: 1200, desc: '模型训练-万物迁移演示3' },
  // 换背景
  { file: 'comfyui/huanbeijing/图层 16.png', width: 1600, desc: '模型训练-换背景工作流' },
  { file: 'comfyui/huanbeijing/ComfyUI_temp_xthfp_00002_.png', width: 1600, desc: '模型训练-换背景案例1后' },
  { file: 'comfyui/huanbeijing/ComfyUI_temp_xthfp_00001_.png', width: 1600, desc: '模型训练-换背景案例2后' },
  { file: 'comfyui/huanbeijing/ComfyUI_temp_pkxmj_00001_.png', width: 1600, desc: '模型训练-换背景示例A后' },
  { file: 'comfyui/huanbeijing/ComfyUI_temp_pkxmj_00003_.png', width: 1600, desc: '模型训练-换背景示例B后' },
  { file: 'comfyui/huanbeijing/d8d2b7ebd9afd4eeb1ebea3f33e07e2bb1f891e0b1d15db4f8da6460749cb399.png', width: 1600, desc: '模型训练-换背景示例C后' },
  { file: 'comfyui/huanbeijing/图层 13@2x.png', width: 800, desc: '模型训练-换背景原图' },
  { file: 'comfyui/huanbeijing/图层 14@2x.png', width: 800, desc: '模型训练-换背景示例A原' },
  { file: 'comfyui/huanbeijing/图层 15@2x.png', width: 800, desc: '模型训练-换背景示例B原' },
  { file: 'comfyui/huanbeijing/d8d2b7ebd9afd4eeb1ebea3f33e07e2bb1f891e0b1d15db4f8da6460749cb399@2x.png', width: 800, desc: '模型训练-换背景示例C原' },
  // 打光溶图
  { file: 'comfyui/daguang/图层-16.jpg', width: 1600, desc: '模型训练-打光溶图工作流' },
  { file: 'comfyui/daguang/4.png', width: 1200, desc: '模型训练-打光溶图案例1' },
  { file: 'comfyui/daguang/5.png', width: 1200, desc: '模型训练-打光溶图案例2' },
  { file: 'comfyui/daguang/1.jpg', width: 1200, desc: '模型训练-打光溶图示例A' },
  { file: 'comfyui/daguang/2.jpg', width: 1200, desc: '模型训练-打光溶图示例B' },
  { file: 'comfyui/daguang/6.jpg', width: 1200, desc: '模型训练-打光溶图示例C' },
  // 品牌营销
  { file: 'model_xunlian/pinpaiyingxiao/Snipaste_2026-04-08_23-43-02.png', width: 1200, desc: '模型训练-品牌营销方案' },
  { file: 'model_xunlian/pinpaiyingxiao/Snipaste_2026-04-08_23-34-26.png', width: 1200, desc: '模型训练-品牌营销训练集' },
  { file: 'model_xunlian/pinpaiyingxiao/Snipaste_2026-04-08_23-34-44.png', width: 1600, desc: '模型训练-品牌营销出图' },
  // 卡数IP
  { file: 'model_xunlian/kashuIP/Snipaste_2026-04-09_00-08-19.png', width: 800, desc: '模型训练-卡数IP训练集' },
  { file: 'model_xunlian/kashuIP/Snipaste_2026-04-09_00-08-27.png', width: 1600, desc: '模型训练-卡数IP出图' },
  // 京东医生
  { file: 'model_xunlian/doctor/Snipaste_2026-04-09_00-35-55.png', width: 1200, desc: '模型训练-京东医生男' },
  { file: 'model_xunlian/doctor/Snipaste_2026-04-09_00-36-52.png', width: 1200, desc: '模型训练-京东医生女' },
  { file: 'model_xunlian/doctor/Snipaste_2026-04-09_00-36-38.png', width: 1200, desc: '模型训练-京东医生护士' },
  // 模型展示
  { file: 'model_xunlian/model_zhanshi/Snipaste_2026-04-09_00-56-47.png', width: 1600, desc: '模型训练-超现实场景' },
  { file: 'model_xunlian/model_zhanshi/Snipaste_2026-04-09_00-52-55.png', width: 1600, desc: '模型训练-CG角色' },
  { file: 'model_xunlian/model_zhanshi/Snipaste_2026-04-09_00-59-35.png', width: 1600, desc: '模型训练-美妆摄影' },
  { file: 'model_xunlian/model_zhanshi/Snipaste_2026-04-09_00-55-46.png', width: 1200, desc: '模型训练-配饰展示' },

  // ======================== AI直播矩阵素材 (scroll-reveal.html) ========================
  { file: 'sop-flow.png', width: 1200, desc: 'AI直播-项目SOP' },
  { file: 'SOP.png', width: 1200, desc: 'AI直播-UGC视频SOP' },
  { file: 'coze.png', width: 1200, desc: 'AI直播-Coze工作流' },
  { file: '代码图2.png', width: 1200, desc: 'AI直播-混剪脚本' },
  { file: '混剪图.png', width: 1200, desc: 'AI直播-混剪效果' },
  { file: 'SKILL.png', width: 1200, desc: 'AI直播-SKILL设计' },

  // ======================== 首页大图 (index.html) ========================
  { file: 'project-preview.png', width: 1600, desc: '首页-项目预览大图' },
  { file: 'jimeng-2026-04-08-2423-这幅画面以黑白水墨风格为主，营造出一种肃杀、神秘且充满力量感的氛围。画面中心是一...png', width: 1200, desc: '首页-漫剧背景图' },

  // ======================== AI漫剧-旧版截图 (manju/) ========================
  { file: 'manju/角色库.png', width: 1600, desc: 'AI漫剧-角色库' },
  { file: 'manju/角色管理.png', width: 1600, desc: 'AI漫剧-角色管理' },
  { file: 'manju/分镜管理.png', width: 1600, desc: 'AI漫剧-分镜管理' },
  { file: 'manju/创建剧本.png', width: 1600, desc: 'AI漫剧-创建剧本' },
  { file: 'manju/图片5.png', width: 1200, desc: 'AI漫剧-图片5' },
]

async function compressImage({ file, width, desc }) {
  const inputPath = path.join(publicDir, file)
  if (!fs.existsSync(inputPath)) {
    console.log(`  ⚠ 跳过(不存在): ${file}`)
    return { file, before: 0, after: 0 }
  }

  const beforeSize = fs.statSync(inputPath).size
  const ext = path.extname(file).toLowerCase()

  // 如果原图已经小于目标大小，跳过
  if (beforeSize <= TARGET_KB * 1024) {
    console.log(`  ✓ ${desc}: ${(beforeSize/1024).toFixed(1)}KB (已在目标内, 跳过)`)
    return { file, before: beforeSize, after: beforeSize }
  }

  // Windows 兼容：先读入 Buffer，避免 sharp 直接操作中文路径
  const inputBuffer = fs.readFileSync(inputPath)

  // 先读原图尺寸
  const metadata = await sharp(inputBuffer).metadata()
  let targetWidth = Math.min(width, metadata.width || width)
  let currentQuality = 80
  let buffer = null
  let attempts = 0

  // 自适应压缩：从高质量开始，逐步降低直到满足目标大小
  while (currentQuality >= MIN_QUALITY && attempts < 10) {
    attempts++
    let pipeline = sharp(inputBuffer)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .withMetadata({})  // 剥离臃肿元数据

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: currentQuality, mozjpeg: true })
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: currentQuality, compressionLevel: 9 })
    }

    buffer = await pipeline.toBuffer()

    if (buffer.length <= TARGET_KB * 1024) break  // 达标！

    // 按差距大小决定降级幅度
    const overshoot = buffer.length / (TARGET_KB * 1024)
    if (overshoot > 3) {
      currentQuality -= 20  // 严重超标，大跳降
    } else if (overshoot > 2) {
      currentQuality -= 12
    } else {
      currentQuality -= 8
    }
  }

  // 如果降质量还不够，再降尺寸
  while (buffer && buffer.length > TARGET_KB * 1024 && targetWidth > 800 && attempts < 15) {
    attempts++
    targetWidth = Math.max(800, targetWidth - 200)
    let pipeline = sharp(inputBuffer)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .withMetadata({})

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: currentQuality, mozjpeg: true })
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: currentQuality, compressionLevel: 9 })
    }
    buffer = await pipeline.toBuffer()
  }

  // 备份原文件
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

  console.log(`  ✓ ${desc}: ${beforeKB}KB → ${afterKB}KB (减少 ${savedPct}%, q=${currentQuality}, w=${targetWidth})`)
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
