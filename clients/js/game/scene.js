// ============================================================================
// SCENE.JS - Configuration de la scène Three.js
// ============================================================================

class GameScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
    }

    async init() {
        console.log('🎬 Création de la scène Three.js...');
        
        // Container
        this.container = document.getElementById('game-container');
        
        // Scène
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Ciel bleu
        this.scene.fog = new THREE.Fog(0x87ceeb, 50, 200); // Brouillard pour effet de profondeur
        
        // Caméra
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Lumières
        this.setupLights();
        
        console.log('✅ Scène créée !');
    }

    setupLights() {
        // Lumière ambiante (éclairage global)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Lumière directionnelle (soleil du désert)
        const sunLight = new THREE.DirectionalLight(0xfff4e6, 0.8);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        
        // Configuration des ombres
        sunLight.shadow.camera.left = -100;
        sunLight.shadow.camera.right = 100;
        sunLight.shadow.camera.top = 100;
        sunLight.shadow.camera.bottom = -100;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        
        this.scene.add(sunLight);
        
        // Lumière d'appoint
        const fillLight = new THREE.DirectionalLight(0xffa500, 0.3);
        fillLight.position.set(-50, 50, -50);
        this.scene.add(fillLight);
    }

    add(object) {
        this.scene.add(object);
    }

    remove(object) {
        this.scene.remove(object);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Méthode utilitaire pour obtenir la scène Three.js
    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }
}