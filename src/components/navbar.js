export function renderNavbar(containerId = 'navbar') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // 响应式计算 - 根据屏幕宽度动态调整
    const getNavPosition = () => {
        const width = window.innerWidth;
        if (width >= 3001) return '530px';      // 4K
        if (width >= 2400) return '430px';      // 2K
        return '310px';                          // 默认
    };
    
    const getNavHeight = () => {
        const width = window.innerWidth;
        if (width >= 3001) return '96px';       // 4K
        if (width >= 2400) return '76px';       // 2K
        return '60px';                           // 默认
    };
    
    const getNavPadding = () => {
        const width = window.innerWidth;
        if (width >= 3001) return '32px 0';     // 4K
        if (width >= 2400) return '24px 0';     // 2K
        return '20px 0';                         // 默认
    };
    
    const getLogoHeight = () => {
        const width = window.innerWidth;
        if (width >= 3001) return '52px';       // 4K
        if (width >= 2400) return '42px';       // 2K
        return '32px';                           // 默认
    };
    
    const getCtaFontSize = () => {
        const width = window.innerWidth;
        if (width >= 3001) return '16px';       // 4K
        if (width >= 2400) return '14px';       // 2K
        return '12px';                           // 默认
    };
    
    const getCtaPadding = () => {
        const width = window.innerWidth;
        if (width >= 3001) return '14px 32px';  // 4K
        if (width >= 2400) return '12px 28px';  // 2K
        return '10px 24px';                      // 默认
    };
    
    const navPosition = getNavPosition();
    const navHeight = getNavHeight();
    const navPadding = getNavPadding();
    const logoHeight = getLogoHeight();
    const ctaFontSize = getCtaFontSize();
    const ctaPadding = getCtaPadding();
    
    // 单页滚动模式：通过锚点导航
    const navLinks = [
        { name: '首页', path: '#hero', section: 'hero' },
        { name: '关于我', path: '#about', section: 'about' },
        { name: '作品集', path: '#works', section: 'works' },
        { name: '联系方式', path: '#contact', section: 'contact' },
    ];
    
    // 检测当前激活的 section (用于初始渲染)
    const getActiveSection = () => {
        const path = window.location.pathname;
        
        // 只有 index.html 或根路径才是首页，需要滚动检测
        if (path.endsWith('index.html') || path.endsWith('/') || path === '' || path === '/') {
            const sections = ['hero', 'about', 'works', 'contact'];
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    if (rect.top <= viewportHeight / 2 && rect.bottom >= viewportHeight / 2) {
                        return id;
                    }
                }
            }
            return 'hero';
        }
        
        // works.html 页面激活作品集
        if (path.includes('works.html')) {
            return 'works';
        }
        // about 页面激活关于我
        if (path.includes('about')) {
            return 'about';
        }
        // 其他项目详情页激活作品集
        return 'works';
    };
    
    const isActive = (section) => getActiveSection() === section;

    // 检测当前页面类型
    const getCurrentPage = () => {
        const path = window.location.pathname;
        // 只有 index.html 或根路径才是首页
        if (path.endsWith('index.html') || path.endsWith('/') || path === '' || path === '/') {
            return 'index';
        }
        // 其他所有页面都是项目详情页
        if (path.includes('works.html')) {
            return 'works';
        }
        if (path.includes('about')) {
            return 'about';
        }
        return 'project'; // 项目详情页
    };

    const currentPage = getCurrentPage();
    
    // 获取导航链接路径（在非首页时跳转回 index.html）
    const getLinkPath = (link) => {
        if (currentPage !== 'index') {
            // 在非首页时，链接指向 index.html 对应的锚点
            return 'index.html' + link.path;
        }
        return link.path;
    };

    container.innerHTML = `
        <!-- 导航栏背景层 - 在粒子下方 -->
        <div class="nav-bg" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: ${navHeight};
            z-index: 1;
            background: rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            pointer-events: none;
        "></div>
        
        <!-- 导航栏内容层 - 在粒子上方 -->
        <nav class="nav-content" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 100;
            padding: ${navPadding};
        "
        >
            <!-- 导航链接居中 -->
            <div class="navbar-links" style="display: flex; align-items: center; justify-content: center; gap: 48px; width: 100%;">
                ${navLinks.map(link => `
                    <a href="${getLinkPath(link)}" 
                       class="navbar-link"
                       data-section="${link.section}"
                       style="
                           font-size: 14px;
                           letter-spacing: 0.05em;
                           color: ${isActive(link.section) ? '#1ED760' : 'rgba(255,255,255,0.6)'};
                           text-decoration: none;
                           transition: color 0.2s;
                       "
                       onmouseover="this.style.color='#ffffffff'"
                       onmouseout="this.style.color='${isActive(link.section) ? '#1ED760' : 'rgba(255,255,255,0.6)'}'">
                        ${link.name}
                    </a>
                `).join('')}
            </div>
            
            <!-- 左侧 Logo 绝对定位 -->
            <a href="${currentPage !== 'index' ? 'index.html#hero' : '#hero'}" style="position: absolute; left: ${navPosition}; top: 50%; transform: translateY(-50%); display: flex; align-items: center; margin: 0; padding: 0; line-height: 0;">
                <img src="/images/logo.png" alt="Logo" style="height: ${logoHeight}; width: auto; display: block;" class="nav-logo">
            </a>
            
            <!-- 右侧按钮 -->
            <a href="#" class="nav-cta" style="
                position: absolute;
                right: ${navPosition};
                top: 50%;
                transform: translateY(-50%);
                padding: ${ctaPadding};
                background: #000000;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 9999px;
                color: #ffffff;
                font-size: ${ctaFontSize};
                font-weight: 600;
                letter-spacing: 0.1em;
                text-decoration: none;
                text-transform: uppercase;
                transition: all 0.3s ease;
            "
            onmouseover="this.style.background='#ffffff'; this.style.color='#000000';"
            onmouseout="this.style.background='#000000'; this.style.color='#ffffff';">
                GET KAST
            </a>
        </nav>
    `;
    
    // 滚动监听 - 更新导航激活状态
    const updateActiveNav = () => {
        // 非首页页面，固定激活作品集
        if (currentPage !== 'index') {
            document.querySelectorAll('.navbar-link').forEach(link => {
                const section = link.getAttribute('data-section');
                link.style.color = section === 'works' ? '#1ED760' : 'rgba(255,255,255,0.6)';
            });
            return;
        }

        // 首页滚动监听逻辑
        const sections = ['hero', 'about', 'works', 'contact'];
        let currentSection = 'hero';
        
        // 获取滚动容器
        const scrollContainer = document.querySelector('.scroll-container');
        const viewportHeight = scrollContainer ? scrollContainer.clientHeight : window.innerHeight;
        
        for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                // 使用滚动容器的视口中心点判断
                const viewportCenter = viewportHeight / 2;
                if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                    currentSection = id;
                    break;
                }
            }
        }
        
        // 更新导航链接颜色
        document.querySelectorAll('.navbar-link').forEach(link => {
            const section = link.getAttribute('data-section');
            if (section === currentSection) {
                link.style.color = '#1ED760';
            } else {
                link.style.color = 'rgba(255,255,255,0.6)';
            }
        });
    };
    
    // 监听滚动事件 - 优先使用 scroll-container
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updateActiveNav, { passive: true });
    } else {
        window.addEventListener('scroll', updateActiveNav, { passive: true });
    }
    
    // 页面加载后立即更新一次状态
    requestAnimationFrame(updateActiveNav);
    
    // 平滑滚动到目标 section（仅首页）
    if (currentPage === 'index') {
        const scrollContainer = document.querySelector('.scroll-container');
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl && scrollContainer) {
                    // 优先使用全局滚动函数（确保与自定义滚动系统同步）
                    if (window.smoothScrollTo) {
                        window.smoothScrollTo(targetEl.offsetTop);
                    } else {
                        scrollContainer.scrollTo({
                            top: targetEl.offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}
