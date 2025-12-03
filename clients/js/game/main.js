// ============================================================================
// MAIN.JS - Point d'entrée du jeu
// ============================================================================

class Game {
    constructor() {
        this.isLoaded = false;
        this.playerData = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.track = null;
        this.camel = null;
        this.controls = null;
        this.cameraController = null;
        this.network = null;
        this.otherPlayers = {};
        
        // Stats du jeu
        this.currentLap = 1;
        this.totalLaps = 3;
        this.position = 1;
        this.totalPlayers = 1;
        this.speed = 0;
    }

    async init() {
        console.log('🐪 Initialisation du jeu...');
        
        // Récupérer les données du joueur
        this.loadPlayerData();
        
        // Afficher l'écran de chargement
        this.updateLoadingScreen(10, 'Création de la scène...');
        
        // Initialiser la scène Three.js
        this.scene = new GameScene();
        await this.scene.init();
        this.updateLoadingScreen(30, 'Chargement de la piste...');
        
        // Créer la piste
        this.track = new Track(this.scene);
        this.track.create();
        this.updateLoadingScreen(50, 'Préparation de votre chameau...');
        
        // Créer le chameau du joueur
        this.camel = new Camel(this.scene, this.playerData.color);
        this.camel.create();
        this.camel.setPosition(0, 1, 0);
        this.updateLoadingScreen(70, 'Configuration des contrôles...');
        
        // Initialiser les contrôles
        this.controls = new Controls(this.camel);
        this.controls.init();
        this.updateLoadingScreen(85, 'Configuration de la caméra...');
        
        // Initialiser la caméra
        this.cameraController = new CameraController(
            this.scene.camera,
            this.camel
        );
        this.updateLoadingScreen(95, 'Connexion au serveur...');
        
        // Initialiser le réseau (WebSocket)
        this.network = new NetworkManager(this);
        // TODO: Décommenter quand le serveur sera prêt
        // await this.network.connect();
        
        this.updateLoadingScreen(100, 'Prêt !');
        
        // Masquer l'écran de chargement
        setTimeout(() => {
            this.hideLoadingScreen();
            this.isLoaded = true;
            this.start();
        }, 500);
    }

    loadPlayerData() {
        const savedData = localStorage.getItem('camelKartPlayer');
        if (savedData) {
            this.playerData = JSON.parse(savedData);
            console.log('📦 Données joueur:', this.playerData);
            
            // Mettre à jour le HUD
            document.getElementById('playerName').textContent = this.playerData.pseudo;
            document.getElementById('playerColor').style.backgroundColor = this.playerData.color;
        } else {
            // Données par défaut si pas de sauvegarde
            this.playerData = {
                pseudo: 'Joueur',
                color: '#8B4513',
                timestamp: Date.now()
            };
        }
    }

    updateLoadingScreen(progress, text) {
        document.getElementById('loadingProgress').style.width = progress + '%';
        document.getElementById('loadingText').textContent = text;
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }

    start() {
        console.log('🏁 Démarrage de la course !');
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.isLoaded) return;
        
        // Mettre à jour les contrôles
        this.controls.update();
        
        // Mettre à jour la caméra
        this.cameraController.update();
        
        // Mettre à jour la vitesse affichée
        this.speed = Math.abs(this.camel.velocity.z * 10).toFixed(0);
        document.getElementById('speed').textContent = this.speed;
        
        // Mettre à jour les autres joueurs
        if (this.network) {
            this.network.update();
        }
        
        // Rendu de la scène
        this.scene.render();
    }

    updateHUD() {
        document.getElementById('currentLap').textContent = this.currentLap;
        document.getElementById('totalLaps').textContent = this.totalLaps;
        document.getElementById('position').textContent = this.position;
        document.getElementById('totalPlayers').textContent = this.totalPlayers;
    }
}

// ============================================================================
// DÉMARRAGE DU JEU
// ============================================================================

let game;

window.addEventListener('load', () => {
    game = new Game();
    game.init();
});

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    if (game && game.scene) {
        game.scene.onWindowResize();
    }
});