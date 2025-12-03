// ============================================================================
// CAMERA.JS - Caméra 3ème personne
// ============================================================================

class CameraController {
    constructor(camera, camel) {
        this.camera = camera;
        this.camel = camel;
        
        // Paramètres de la caméra
        this.distance = 12;        // Distance derrière le chameau
        this.height = 5;           // Hauteur au-dessus du chameau
        this.lookAheadDistance = 3; // Distance devant le chameau où la caméra regarde
        
        // Interpolation pour un mouvement fluide
        this.smoothness = 0.1;
        this.currentPosition = new THREE.Vector3();
        this.currentLookAt = new THREE.Vector3();
        
        // Mode de caméra
        this.mode = 'follow'; // 'follow', 'fixed', 'cinematic'
    }

    update() {
        const camelPos = this.camel.getPosition();
        const camelRot = this.camel.getRotation();
        
        // Calculer la position cible de la caméra (derrière le chameau)
        const targetPosition = new THREE.Vector3(
            camelPos.x - Math.sin(camelRot) * this.distance,
            camelPos.y + this.height,
            camelPos.z - Math.cos(camelRot) * this.distance
        );
        
        // Calculer le point cible où la caméra regarde (devant le chameau)
        const targetLookAt = new THREE.Vector3(
            camelPos.x + Math.sin(camelRot) * this.lookAheadDistance,
            camelPos.y + 1,
            camelPos.z + Math.cos(camelRot) * this.lookAheadDistance
        );
        
        // Interpolation linéaire pour un mouvement fluide (lerp)
        this.currentPosition.lerp(targetPosition, this.smoothness);
        this.currentLookAt.lerp(targetLookAt, this.smoothness);
        
        // Appliquer la position et la rotation à la caméra
        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookAt);
    }

    setMode(mode) {
        this.mode = mode;
        
        switch(mode) {
            case 'follow':
                this.distance = 12;
                this.height = 5;
                this.lookAheadDistance = 3;
                this.smoothness = 0.1;
                break;
            
            case 'close':
                this.distance = 8;
                this.height = 3;
                this.lookAheadDistance = 2;
                this.smoothness = 0.15;
                break;
            
            case 'far':
                this.distance = 18;
                this.height = 8;
                this.lookAheadDistance = 5;
                this.smoothness = 0.08;
                break;
            
            case 'cinematic':
                this.distance = 15;
                this.height = 6;
                this.lookAheadDistance = 4;
                this.smoothness = 0.05;
                break;
        }
    }

    // Effet de secousse de la caméra (pour collisions, boost, etc.)
    shake(intensity = 1, duration = 200) {
        const startTime = Date.now();
        const originalPosition = this.camera.position.clone();
        
        const shakeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed >= duration) {
                clearInterval(shakeInterval);
                return;
            }
            
            const progress = 1 - (elapsed / duration);
            const shakeAmount = intensity * progress;
            
            this.camera.position.x = originalPosition.x + (Math.random() - 0.5) * shakeAmount;
            this.camera.position.y = originalPosition.y + (Math.random() - 0.5) * shakeAmount;
            this.camera.position.z = originalPosition.z + (Math.random() - 0.5) * shakeAmount;
        }, 16); // ~60 FPS
    }

    // Réinitialiser la caméra
    reset() {
        const camelPos = this.camel.getPosition();
        this.currentPosition.set(camelPos.x, camelPos.y + this.height, camelPos.z + this.distance);
        this.currentLookAt.copy(camelPos);
        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookAt);
    }
}