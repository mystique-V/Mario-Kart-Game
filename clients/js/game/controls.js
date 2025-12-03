// ============================================================================
// CONTROLS.JS - Gestion des contrôles clavier
// ============================================================================

class Controls {
    constructor(camel) {
        this.camel = camel;
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            boost: false
        };
        this.enabled = true;
    }

    init() {
        console.log('⌨️ Initialisation des contrôles...');
        
        // Écouter les événements clavier
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        console.log('✅ Contrôles initialisés !');
        console.log('🎮 Contrôles:');
        console.log('  - Flèches ↑↓←→ ou ZQSD pour se déplacer');
        console.log('  - Espace pour le boost (à venir)');
    }

    onKeyDown(event) {
        if (!this.enabled) return;
        
        switch(event.key.toLowerCase()) {
            // Avancer
            case 'arrowup':
            case 'z':
            case 'w':
                this.keys.forward = true;
                event.preventDefault();
                break;
            
            // Reculer
            case 'arrowdown':
            case 's':
                this.keys.backward = true;
                event.preventDefault();
                break;
            
            // Gauche
            case 'arrowleft':
            case 'q':
            case 'a':
                this.keys.left = true;
                event.preventDefault();
                break;
            
            // Droite
            case 'arrowright':
            case 'd':
                this.keys.right = true;
                event.preventDefault();
                break;
            
            // Boost
            case ' ':
            case 'shift':
                this.keys.boost = true;
                event.preventDefault();
                break;
        }
    }

    onKeyUp(event) {
        if (!this.enabled) return;
        
        switch(event.key.toLowerCase()) {
            case 'arrowup':
            case 'z':
            case 'w':
                this.keys.forward = false;
                break;
            
            case 'arrowdown':
            case 's':
                this.keys.backward = false;
                break;
            
            case 'arrowleft':
            case 'q':
            case 'a':
                this.keys.left = false;
                break;
            
            case 'arrowright':
            case 'd':
                this.keys.right = false;
                break;
            
            case ' ':
            case 'shift':
                this.keys.boost = false;
                break;
        }
    }

    update() {
        if (!this.enabled) return;
        
        // Avancer / Reculer
        if (this.keys.forward) {
            this.camel.moveForward();
        }
        if (this.keys.backward) {
            this.camel.moveBackward();
        }
        
        // Tourner (seulement si le chameau bouge)
        if (Math.abs(this.camel.velocity.z) > 0.1) {
            if (this.keys.left) {
                this.camel.turnLeft();
            }
            if (this.keys.right) {
                this.camel.turnRight();
            }
        }
        
        // Boost (à implémenter)
        if (this.keys.boost) {
            // TODO: Ajouter la logique de boost
            // this.camel.boost();
        }
        
        // Mettre à jour la position du chameau
        this.camel.update();
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
        // Réinitialiser toutes les touches
        Object.keys(this.keys).forEach(key => {
            this.keys[key] = false;
        });
    }

    destroy() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }
}