import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class ParticleEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        
        this.PARTICLE_COUNT = 40000;
        this.INTERVAL_MS = 8000; 
        this.LERP_FACTOR = 0.025;
        
        this.shapesConfig =[
            { id: 'Lemniscate' },
            { id: 'FluidKnot' },
            { id: 'SpinningTop' },
            { id: 'CrystalBurst' }
        ];
        this.shapesData =[];
        this.currentShapeIndex = -1;

        this.initScene();
        this.precalculateShapes();
        this.initParticles();
        
        this.updateResponsiveState(); 
        this.bindEvents();
        
        this.nextShape();
        this.timer = setInterval(() => this.nextShape(), this.INTERVAL_MS);
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x030305, 0.002);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        const renderScene = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.4, 0.5, 0.15);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = true;     
        this.controls.autoRotateSpeed = 1.0; 
        this.controls.maxDistance = 500;
    }

    updateResponsiveState() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;
        const isMobile = width <= 768;
                    
        // 固定断点缩放 - 与 CSS 断点保持一致
        let screenScale = 1.0;
        if (width >= 3001) {
            screenScale = 5.0; // 4K - 大幅增大粒子尺寸
        } else if (width >= 2400) {
            screenScale = 2.0; // 2K
        }
            
        this.camera.aspect = aspect;
                    
        let targetZ = 300;
        let viewOffsetX = 0;
        
        if (width >= 3001) {
            // 4K 屏幕
            targetZ = 350;
            viewOffsetX = width * -0.15; // 减小偏移，让粒子更居中
        } else if (width >= 2400) {
            // 2K 屏幕
            targetZ = 320;
            viewOffsetX = width * -0.20;
        }
        
        if (aspect < 1.2) {
            targetZ = 300 * (1.2 / aspect); 
        }
        this.camera.position.set(0, 0, targetZ);
            
        if (isMobile) {
            this.camera.setViewOffset(width, height, 0, height * -0.15, width, height);
        } else {
            this.camera.setViewOffset(width, height, viewOffsetX || width * -0.225, 0, width, height);
        }
        this.camera.updateProjectionMatrix();
            
        if (this.customMaterial) {
            this.customMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
            this.customMaterial.uniforms.uScreenScale.value = screenScale;
        }
            
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }

    precalculateShapes() {
        const burstSpikes = Array.from({length: 40}, () => new THREE.Vector3(Math.random()-.5, Math.random()-.5, Math.random()-.5).normalize());
        const colorA = new THREE.Color();
        const colorB = new THREE.Color();

        this.shapesConfig.forEach(config => {
            const pos = new Float32Array(this.PARTICLE_COUNT * 3);
            const col = new Float32Array(this.PARTICLE_COUNT * 3);

            for (let i = 0; i < this.PARTICLE_COUNT; i++) {
                let i3 = i * 3;
                let x = 0, y = 0, z = 0;
                let c = new THREE.Color();

                switch (config.id) {
                    case 'Lemniscate': // 无尽维度 (无限符号)
                        colorA.setHex(0xffaa00); colorB.setHex(0xff0055);
                        let tL = Math.random() * Math.PI * 2;
                        let denom = 1 + Math.pow(Math.sin(tL), 2);
                        let aL = 90 + Math.random() * 30; // 离散的厚度带
                        x = aL * Math.cos(tL) / denom;
                        y = aL * Math.sin(tL) * Math.cos(tL) / denom;
                        z = (Math.random() - 0.5) * 20;
                        c.copy(colorA).lerp(colorB, Math.random());
                        break;
                    case 'FluidKnot':
                        let tk = Math.random() * Math.PI * 2; let Rk = 70; let rk = 35;
                        let cx = (Rk + rk * Math.cos(5 * tk)) * Math.cos(2 * tk); let cy = (Rk + rk * Math.cos(5 * tk)) * Math.sin(2 * tk); let cz = rk * Math.sin(5 * tk);
                        let tubeA = Math.random() * Math.PI * 2; let tubeR = Math.random() * 15;
                        x = cx + tubeR * Math.cos(tubeA); y = cy + tubeR * Math.sin(tubeA); z = cz + tubeR * Math.cos(tubeA + tk);
                        let hl = Math.sin(5 * tk) * Math.cos(2 * tk); c.setHex(0x111122).lerp(new THREE.Color(0x99ccff), (hl + 1) / 2); break;
                    case 'SpinningTop':
                        let yT = (Math.random() * 165) - 63; let rT = 0;
                        if (yT > 13) { rT = 4 + 20 * Math.exp(-(yT - 13)/20); } else if (yT > -30) { rT = 85 * Math.cos((yT + 9) / 21 * (Math.PI / 2)) + 10; } else { rT = 95 * Math.cos((yT + 30) / 33 * (Math.PI / 2)); }
                        rT = Math.max(0.25, rT); let aT = Math.random() * Math.PI * 2;
                        x = rT * Math.cos(aT); z = rT * Math.sin(aT); y = yT;
                        let tilt = 0.35; let xx = x * Math.cos(tilt) - y * Math.sin(tilt); let yy = x * Math.sin(tilt) + y * Math.cos(tilt);
                        x = xx; y = yy;
                        let brush = Math.abs(Math.sin(aT * 2 + yT * 0.06)); 
                        // 【核心修改点】将发光色替换为了亮荧光绿：0x1ed760，并搭配极暗的绿色背景底色形成对比拉丝
                        c.setHex(0x051a05).lerp(new THREE.Color(0x1ed760), brush * brush); 
                        break;
                    case 'CrystalBurst':
                        colorA.setHex(0xccffff); colorB.setHex(0xffccff);
                        if (Math.random() < 0.15) {
                            let p = new THREE.Vector3(Math.random()-.5, Math.random()-.5, Math.random()-.5).normalize().multiplyScalar(30 + Math.random()*5);
                            x = p.x; y = p.y; z = p.z; c.copy(colorA).lerp(new THREE.Color(0x0055ff), Math.random());
                        } else {
                            let spike = burstSpikes[Math.floor(Math.random() * burstSpikes.length)]; let d = 38 + Math.random() * 137;
                            let up = Math.abs(spike.y) > 0.9 ? new THREE.Vector3(1,0,0) : new THREE.Vector3(0,1,0); let right = new THREE.Vector3().crossVectors(spike, up).normalize(); let fwd = new THREE.Vector3().crossVectors(right, spike).normalize();
                            let w = (Math.random() - 0.5) * 15; let h = (Math.random() - 0.5) * 15;
                            let p = spike.clone().multiplyScalar(d).add(right.multiplyScalar(w)).add(fwd.multiplyScalar(h));
                            x = p.x; y = p.y; z = p.z; c.copy(colorA).lerp(colorB, d/175);
                        }
                        break;

                }

                x += (Math.random() - 0.5) * 1.5; y += (Math.random() - 0.5) * 1.5; z += (Math.random() - 0.5) * 1.5;
                
                // 等比例缩放
                const scale = 2.5;
                x *= scale; y *= scale; z *= scale;
                
                pos[i3] = x; pos[i3+1] = y; pos[i3+2] = z;
                col[i3] = c.r; col[i3+1] = c.g; col[i3+2] = c.b;
            }
            this.shapesData.push({ positions: pos, colors: col });
        });
    }

    initParticles() {
        this.geometry = new THREE.BufferGeometry();
        const currentPositions = new Float32Array(this.PARTICLE_COUNT * 3);
        const currentColors = new Float32Array(this.PARTICLE_COUNT * 3);
        
        for(let i=0; i<this.PARTICLE_COUNT*3; i++) {
            currentPositions[i] = (Math.random() - 0.5) * 400; currentColors[i] = 1.0;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(currentColors, 3));

        this.customMaterial = new THREE.ShaderMaterial({
            uniforms: { 
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uScreenScale: { value: 1.0 }
            },
            vertexShader: `
                uniform float uTime; 
                uniform float uPixelRatio;
                uniform float uScreenScale;
                varying vec3 vColor;
                void main() {
                    vColor = color; vec3 pos = position;
                    pos.x += sin(uTime * 1.2 + pos.z * 0.05) * 0.4; pos.y += cos(uTime * 1.5 + pos.x * 0.05) * 0.4;
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = (180.0 * uPixelRatio * uScreenScale / -mvPosition.z) * (1.0 + sin(pos.x * 5.0)*0.2);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    vec2 xy = gl_PointCoord.xy - vec2(0.5); float ll = length(xy);
                    if(ll > 0.5) discard;
                    gl_FragColor = vec4(vColor, (0.5 - ll) * 1.8);
                }
            `,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: true
        });

        this.particles = new THREE.Points(this.geometry, this.customMaterial);
        this.scene.add(this.particles);

        const bgGeo = new THREE.BufferGeometry(); const bgPos = new Float32Array(2000 * 3);
        for(let i=0; i<6000; i++) bgPos[i] = (Math.random() - 0.5) * 1000;
        bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
        this.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({ color: 0x555566, size: 1.0, transparent: true, opacity: 0.3 })));

        this.clock = new THREE.Clock();
    }

    nextShape() {
        this.currentShapeIndex = (this.currentShapeIndex + 1) % this.shapesConfig.length;
        this.targetPositions = this.shapesData[this.currentShapeIndex].positions;
        this.targetColors = this.shapesData[this.currentShapeIndex].colors;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.updateResponsiveState();
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const elapsedTime = this.clock.getElapsedTime();
        const positions = this.geometry.attributes.position.array;
        const colors = this.geometry.attributes.color.array;

        for (let i = 0; i < this.PARTICLE_COUNT * 3; i++) {
            positions[i] += (this.targetPositions[i] - positions[i]) * this.LERP_FACTOR;
            colors[i] += (this.targetColors[i] - colors[i]) * this.LERP_FACTOR;
        }
        
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.customMaterial.uniforms.uTime.value = elapsedTime;

        this.controls.update();
        this.composer.render();
    }
}
