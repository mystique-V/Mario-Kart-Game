// ============================================================================
// NETWORK.JS - Gestion de la communication WebSocket
// ============================================================================

class NetworkManager {
    constructor(game) {
        this.game = game;
        this.socket = null;
        this.connected = false;
        this.serverUrl = 'http://localhost:5000'; // URL du serveur Python
        this.playerId = null;
        this.otherPlayers = {};
        this.updateRate = 60; // Envois par seconde
        this.lastUpdate = 0;
    }

    async connect() {
        console.log('🌐 Connexion au serveur...');
        
        try {
            // TODO: Décommenter quand Socket.IO sera chargé
            // this.socket = io(this.serverUrl);
            
            // Simuler la connexion pour le moment
            this.connected = true;
            this.playerId = 'player_' + Date.now();
            
            console.log('✅ Connecté au serveur! ID:', this.playerId);
            
            // Envoyer les données du joueur
            this.sendPlayerJoin();
            
            // Configurer les listeners
            // this.setupListeners();
            
        } catch (error) {
            console.error('❌ Erreur de connexion:', error);
            this.connected = false;
        }
    }

    setupListeners() {
        if (!this.socket) return;

        // Événement: Connexion réussie
        this.socket.on('connect', () => {
            console.log('✅ Connecté au serveur WebSocket');
            this.connected = true;
        });

        // Événement: Déconnexion
        this.socket.on('disconnect', () => {
            console.log('❌ Déconnecté du serveur');
            this.connected = false;
        });

        // Événement: Nouveau joueur rejoint
        this.socket.on('player_joined', (data) => {
            console.log('👋 Nouveau joueur:', data.pseudo);
            this.addOtherPlayer(data);
        });

        // Événement: Joueur quitte
        this.socket.on('player_left', (playerId) => {
            console.log('👋 Joueur parti:', playerId);
            this.removeOtherPlayer(playerId);
        });

        // Événement: Mise à jour des positions
        this.socket.on('update_positions', (data) => {
            this.updateOtherPlayers(data);
        });

        // Événement: État complet du jeu
        this.socket.on('game_state', (state) => {
            this.updateGameState(state);
        });
    }

    sendPlayerJoin() {
        const playerData = {
            id: this.playerId,
            pseudo: this.game.playerData.pseudo,
            color: this.game.playerData.color,
            position: this.game.camel.getPosition(),
            rotation: this.game.camel.getRotation()
        };

        console.log('📤 Envoi des données joueur:', playerData);

        // TODO: Décommenter quand Socket.IO sera prêt
        // if (this.socket) {
        //     this.socket.emit('join_game', playerData);
        // }
    }

    sendPlayerMove() {
        if (!this.connected) return;

        const now = Date.now();
        if (now - this.lastUpdate < 1000 / this.updateRate) {
            return; // Limiter le taux d'envoi
        }

        const moveData = {
            id: this.playerId,
            position: {
                x: this.game.camel.group.position.x,
                y: this.game.camel.group.position.y,
                z: this.game.camel.group.position.z
            },
            rotation: this.game.camel.group.rotation.y,
            velocity: {
                x: this.game.camel.velocity.x,
                y: this.game.camel.velocity.y,
                z: this.game.camel.velocity.z
            }
        };

        // TODO: Décommenter quand Socket.IO sera prêt
        // if (this.socket) {
        //     this.socket.emit('player_move', moveData);
        // }

        this.lastUpdate = now;
    }

    addOtherPlayer(playerData) {
        // Créer un chameau pour l'autre joueur
        const otherCamel = new Camel(this.game.scene, playerData.color);
        otherCamel.create();
        
        if (playerData.position) {
            otherCamel.setPosition(
                playerData.position.x,
                playerData.position.y,
                playerData.position.z
            );
        }
        
        if (playerData.rotation) {
            otherCamel.setRotation(playerData.rotation);
        }

        // Ajouter un label avec le pseudo
        this.addPlayerLabel(otherCamel, playerData.pseudo);

        this.otherPlayers[playerData.id] = {
            camel: otherCamel,
            pseudo: playerData.pseudo,
            color: playerData.color,
            lastUpdate: Date.now()
        };

        // Mettre à jour le nombre total de joueurs
        this.game.totalPlayers = Object.keys(this.otherPlayers).length + 1;
        this.game.updateHUD();
    }

    removeOtherPlayer(playerId) {
        if (this.otherPlayers[playerId]) {
            this.otherPlayers[playerId].camel.remove();
            delete this.otherPlayers[playerId];

            // Mettre à jour le nombre total de joueurs
            this.game.totalPlayers = Object.keys(this.otherPlayers).length + 1;
            this.game.updateHUD();
        }
    }

    updateOtherPlayers(positions) {
        Object.keys(positions).forEach(playerId => {
            if (playerId === this.playerId) return; // Ignorer notre propre joueur

            const data = positions[playerId];
            
            if (this.otherPlayers[playerId]) {
                const player = this.otherPlayers[playerId];
                
                // Interpolation de position pour un mouvement fluide
                if (data.position) {
                    player.camel.group.position.lerp(
                        new THREE.Vector3(data.position.x, data.position.y, data.position.z),
                        0.3
                    );
                }
                
                // Interpolation de rotation
                if (data.rotation !== undefined) {
                    player.camel.group.rotation.y = data.rotation;
                }

                player.lastUpdate = Date.now();
            } else {
                // Nouveau joueur détecté
                this.addOtherPlayer(data);
            }
        });
    }

    updateGameState(state) {
        // Mettre à jour l'état global du jeu
        if (state.lap) {
            this.game.currentLap = state.lap;
        }
        if (state.position) {
            this.game.position = state.position;
        }
        if (state.totalPlayers) {
            this.game.totalPlayers = state.totalPlayers;
        }
        
        this.game.updateHUD();
    }

    addPlayerLabel(camel, pseudo) {
        // TODO: Ajouter un sprite de texte au-dessus du chameau
        // pour afficher le pseudo (nécessite Canvas ou Sprite)
    }

    update() {
        if (!this.connected) return;

        // Envoyer notre position régulièrement
        this.sendPlayerMove();

        // Vérifier les joueurs inactifs (timeout)
        const now = Date.now();
        Object.keys(this.otherPlayers).forEach(playerId => {
            const player = this.otherPlayers[playerId];
            if (now - player.lastUpdate > 5000) {
                // Joueur inactif depuis 5 secondes
                this.removeOtherPlayer(playerId);
            }
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
        this.connected = false;
        console.log('🔌 Déconnecté du serveur');
    }
}