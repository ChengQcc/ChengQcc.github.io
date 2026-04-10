(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e=`navbar`){let t=document.getElementById(e);if(!t)return;let n=window.location.pathname,r=e=>e===`/`||e===`/index.html`?n===`/`||n===`/index.html`||n.endsWith(`/index.html`):n.includes(e),i=[{name:`首页`,path:`/index.html`},{name:`作品`,path:`/works.html`},{name:`关于`,path:`/about.html`}];t.innerHTML=`
        <nav class="glass-navbar fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <a href="/index.html" class="flex flex-col gap-0.5">
                    <span class="text-xl font-bold flex items-center gap-2">
                        <span class="text-[var(--color-primary)]">⚡</span> Particleify
                    </span>
                    <span class="text-[0.65rem] text-[var(--color-text-dark)] tracking-widest uppercase">Portfolio</span>
                </a>
                
                <!-- 桌面导航 -->
                <div class="hidden md:flex items-center gap-8">
                    ${i.map(e=>`
                        <a href="${e.path}" 
                           class="text-sm transition-colors duration-200 ${r(e.path)?`text-[var(--color-primary)] font-semibold`:`text-[var(--color-text-muted)] hover:text-white`}">
                            ${e.name}
                        </a>
                    `).join(``)}
                </div>
                
                <!-- 移动端汉堡按钮 -->
                <button id="menu-toggle" class="md:hidden text-white text-2xl bg-transparent border-none cursor-pointer" aria-label="Toggle menu">
                    ☰
                </button>
            </div>
            
            <!-- 移动端菜单 -->
            <div id="mobile-menu" class="md:hidden hidden mt-4 pb-4 border-t border-[var(--glass-border)]">
                <div class="flex flex-col gap-4 pt-4 px-2">
                    ${i.map(e=>`
                        <a href="${e.path}" 
                           class="text-base py-2 transition-colors duration-200 ${r(e.path)?`text-[var(--color-primary)] font-semibold`:`text-[var(--color-text-muted)] hover:text-white`}">
                            ${e.name}
                        </a>
                    `).join(``)}
                </div>
            </div>
        </nav>
    `;let a=document.getElementById(`menu-toggle`),o=document.getElementById(`mobile-menu`);a&&o&&a.addEventListener(`click`,()=>{let e=o.classList.contains(`hidden`);o.classList.toggle(`hidden`),a.textContent=e?`✕`:`☰`})}function t(e=`footer`){let t=document.getElementById(e);t&&(t.innerHTML=`
        <footer class="border-t border-[var(--glass-border)] mt-auto">
            <div class="max-w-7xl mx-auto px-6 md:px-12 py-8">
                <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                    <!-- 左侧信息 -->
                    <div class="flex flex-col items-center md:items-start gap-2">
                        <span class="text-lg font-bold flex items-center gap-2">
                            <span class="text-[var(--color-primary)]">⚡</span> Particleify
                        </span>
                        <span class="text-xs text-[var(--color-text-dark)]">
                            &copy; ${new Date().getFullYear()} All rights reserved.
                        </span>
                    </div>
                    
                    <!-- 社交链接 -->
                    <div class="flex items-center gap-3">
                        <a href="#" class="glass-button text-sm flex items-center gap-2" target="_blank" rel="noopener">
                            <span>📖</span> 小红书
                        </a>
                        <a href="#" class="glass-button text-sm flex items-center gap-2" target="_blank" rel="noopener">
                            <span>𝕏</span> Twitter
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    `)}export{e as n,t};