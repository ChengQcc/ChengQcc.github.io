import '../styles/main.css'
import { renderNavbar } from '../components/navbar.js'
import { renderFooter } from '../components/footer.js'

// 初始化公共组件
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar('navbar');
    renderFooter('footer');
});
