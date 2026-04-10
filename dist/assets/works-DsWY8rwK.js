import{n as e,t}from"./footer-CIcIOABB.js";var n=[{id:1,title:`Particleify 3D 粒子引擎`,description:`将静态图片转化为交互式 3D 粒子视觉效果`,category:`3d`,thumbnail:`/images/placeholder-1.svg`,type:`link`,url:`/ai_studio_code.html`,tags:[`Three.js`,`WebGL`,`GLSL`]},{id:2,title:`作品集网站`,description:`基于 Vite + Tailwind CSS 构建的个人作品集`,category:`web`,thumbnail:`/images/placeholder-2.svg`,type:`link`,url:`#`,tags:[`Vite`,`Tailwind`,`JavaScript`]},{id:3,title:`创意短片`,description:`动态视觉艺术短片作品`,category:`video`,thumbnail:`/images/placeholder-3.svg`,type:`video`,url:`#`,tags:[`视频`,`动态设计`]},{id:4,title:`数据可视化面板`,description:`实时数据监控与可视化仪表盘`,category:`web`,thumbnail:`/images/placeholder-4.svg`,type:`link`,url:`#`,tags:[`D3.js`,`数据可视化`]},{id:5,title:`3D 产品展示`,description:`交互式 3D 产品展示页面`,category:`3d`,thumbnail:`/images/placeholder-5.svg`,type:`link`,url:`#`,tags:[`Three.js`,`产品设计`]},{id:6,title:`品牌宣传片`,description:`企业品牌视觉宣传视频`,category:`video`,thumbnail:`/images/placeholder-6.svg`,type:`video`,url:`#`,tags:[`视频`,`品牌设计`]}],r=`all`;function i(e=`all`){let t=document.getElementById(`works-grid`),r=document.getElementById(`empty-state`);if(!t)return;let i=e===`all`?n:n.filter(t=>t.category===e);if(i.length===0){t.innerHTML=``,r?.classList.remove(`hidden`);return}r?.classList.add(`hidden`),t.innerHTML=i.map((e,t)=>`
        <div class="glass-card group cursor-pointer animate-fade-in" 
             style="animation-delay: ${t*.1}s; opacity: 0;"
             data-type="${e.type}" data-url="${e.url}">
            
            <!-- 缩略图区域 -->
            <div class="relative aspect-video rounded-lg overflow-hidden mb-4 bg-[var(--color-bg-secondary)]">
                <div class="w-full h-full flex items-center justify-center text-4xl text-[var(--color-text-dark)]">
                    ${e.type===`video`?`🎬`:e.type===`link`?`🔗`:`🖼️`}
                </div>
                <!-- hover 遮罩 -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span class="text-[var(--color-primary)] font-bold text-sm">
                        ${e.type===`video`?`▶ 播放视频`:e.type===`link`?`↗ 查看项目`:`🔍 查看大图`}
                    </span>
                </div>
            </div>
            
            <!-- 信息区域 -->
            <h3 class="text-lg font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                ${e.title}
            </h3>
            <p class="text-sm text-[var(--color-text-dark)] mb-4 line-clamp-2">
                ${e.description}
            </p>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2">
                ${e.tags.map(e=>`
                    <span class="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.06)] text-[var(--color-text-muted)]">
                        ${e}
                    </span>
                `).join(``)}
            </div>
        </div>
    `).join(``),t.querySelectorAll(`[data-url]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.url,n=e.dataset.type;t&&t!==`#`&&(n===`link`?window.open(t,`_blank`):console.log(n===`video`?`Video player - coming soon`:`Image lightbox - coming soon`))})})}function a(){let e=document.querySelectorAll(`.filter-tag`);e.forEach(t=>{t.addEventListener(`click`,()=>{e.forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),r=t.dataset.filter,i(r)})})}document.addEventListener(`DOMContentLoaded`,()=>{e(`navbar`),t(`footer`),i(),a()});