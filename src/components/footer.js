export function renderFooter(containerId = 'footer') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const currentYear = new Date().getFullYear();
    
    container.innerHTML = `
        <footer class="fixed bottom-0 left-0 w-full z-50 px-[var(--layout-padding)] lg:px-[var(--layout-padding-lg)] py-4">
            <div class="flex justify-between items-center">
                <span class="text-xs text-[var(--color-text-dark)] font-mono">&copy; ${currentYear}</span>
            </div>
        </footer>
    `;
}
