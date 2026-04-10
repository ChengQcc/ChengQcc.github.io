import '../styles/main.css'
import { renderNavbar } from '../components/navbar.js'
import { renderFooter } from '../components/footer.js'

// 示例作品数据 (后续可替换为实际数据)
const worksData = [
    {
        id: 1,
        title: 'Particleify 3D 粒子引擎',
        description: '将静态图片转化为交互式 3D 粒子视觉效果',
        category: '3d',
        thumbnail: '/images/placeholder-1.svg',
        type: 'link', // link | image | video
        url: '/ai_studio_code.html',
        tags: ['Three.js', 'WebGL', 'GLSL']
    },
    {
        id: 2,
        title: '作品集网站',
        description: '基于 Vite + Tailwind CSS 构建的个人作品集',
        category: 'web',
        thumbnail: '/images/placeholder-2.svg',
        type: 'link',
        url: '#',
        tags: ['Vite', 'Tailwind', 'JavaScript']
    },
    {
        id: 3,
        title: '创意短片',
        description: '动态视觉艺术短片作品',
        category: 'video',
        thumbnail: '/images/placeholder-3.svg',
        type: 'video',
        url: '#',
        tags: ['视频', '动态设计']
    },
    {
        id: 4,
        title: '数据可视化面板',
        description: '实时数据监控与可视化仪表盘',
        category: 'web',
        thumbnail: '/images/placeholder-4.svg',
        type: 'link',
        url: '#',
        tags: ['D3.js', '数据可视化']
    },
    {
        id: 5,
        title: '3D 产品展示',
        description: '交互式 3D 产品展示页面',
        category: '3d',
        thumbnail: '/images/placeholder-5.svg',
        type: 'link',
        url: '#',
        tags: ['Three.js', '产品设计']
    },
    {
        id: 6,
        title: '品牌宣传片',
        description: '企业品牌视觉宣传视频',
        category: 'video',
        thumbnail: '/images/placeholder-6.svg',
        type: 'video',
        url: '#',
        tags: ['视频', '品牌设计']
    }
];

let currentFilter = 'all';

// 渲染作品卡片
function renderWorks(filter = 'all') {
    const grid = document.getElementById('works-grid');
    const emptyState = document.getElementById('empty-state');
    if (!grid) return;

    const filtered = filter === 'all' 
        ? worksData 
        : worksData.filter(w => w.category === filter);

    if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState?.classList.remove('hidden');
        return;
    }

    emptyState?.classList.add('hidden');

    grid.innerHTML = filtered.map((work, index) => `
        <div class="glass-card group cursor-pointer animate-fade-in" 
             style="animation-delay: ${index * 0.1}s; opacity: 0;"
             data-type="${work.type}" data-url="${work.url}">
            
            <!-- 缩略图区域 -->
            <div class="relative aspect-video rounded-lg overflow-hidden mb-4 bg-[var(--color-bg-secondary)]">
                <div class="w-full h-full flex items-center justify-center text-4xl text-[var(--color-text-dark)]">
                    ${work.type === 'video' ? '🎬' : work.type === 'link' ? '🔗' : '🖼️'}
                </div>
                <!-- hover 遮罩 -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span class="text-[var(--color-primary)] font-bold text-sm">
                        ${work.type === 'video' ? '▶ 播放视频' : work.type === 'link' ? '↗ 查看项目' : '🔍 查看大图'}
                    </span>
                </div>
            </div>
            
            <!-- 信息区域 -->
            <h3 class="works-card-title text-lg font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                ${work.title}
            </h3>
            <p class="works-card-desc text-sm text-[var(--color-text-dark)] mb-4 line-clamp-2">
                ${work.description}
            </p>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2">
                ${work.tags.map(tag => `
                    <span class="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.06)] text-[var(--color-text-muted)]">
                        ${tag}
                    </span>
                `).join('')}
            </div>
        </div>
    `).join('');

    // 绑定卡片点击事件
    grid.querySelectorAll('[data-url]').forEach(card => {
        card.addEventListener('click', () => {
            const url = card.dataset.url;
            const type = card.dataset.type;
            if (url && url !== '#') {
                if (type === 'link') {
                    window.open(url, '_blank');
                } else if (type === 'video') {
                    // 预留视频播放功能
                    console.log('Video player - coming soon');
                } else {
                    // 预留图片灯箱功能
                    console.log('Image lightbox - coming soon');
                }
            }
        });
    });
}

// 筛选标签事件
function initFilters() {
    const tags = document.querySelectorAll('.filter-tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentFilter = tag.dataset.filter;
            renderWorks(currentFilter);
        });
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar('navbar');
    renderFooter('footer');
    renderWorks();
    initFilters();
});
