import '../styles/main.css'
import { renderNavbar } from '../components/navbar.js'
import { renderFooter } from '../components/footer.js'
import { ParticleEngine } from './particles.js'

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar('navbar');
    renderFooter('footer');
    
    // 初始化粒子引擎
    const engine = new ParticleEngine('webgl-container');
});
