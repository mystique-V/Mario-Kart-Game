// ============================================================================
// CAMEL.JS - Modèle 3D du chameau (Low Poly)
// ============================================================================

class Camel {
    constructor(scene, color) {
        this.scene = scene;
        this.color = color;
        this.mesh = null;
        this.group = new THREE.Group();
        
        // Physique
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = 0.1;
        this.maxSpeed = 2;
        this.friction = 0.95;
        this.turnSpeed = 0.05;
    }

    create() {
        console.log('🐪 Création du chameau...');
        
        // Groupe principal
        this.group = new THREE.Group();
        
        // Corps du chameau
        const bodyGeometry = new THREE.BoxGeometry(1.5, 1, 2);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: this.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        body.castShadow = true;
        body.receiveShadow = true;
        this.group.add(body);
        
        // Bosse 1
        const hump1Geometry = new THREE.SphereGeometry(0.6, 8, 8);
        const hump1 = new THREE.Mesh(hump1Geometry, bodyMaterial);
        hump1.position.set(0, 1.3, -0.3);
        hump1.scale.set(1, 1.2, 0.8);
        hump1.castShadow = true;
        this.group.add(hump1);
        
        // Bosse 2
        const hump2 = new THREE.Mesh(hump1Geometry, bodyMaterial);
        hump2.position.set(0, 1.2, 0.4);
        hump2.scale.set(0.9, 1.1, 0.8);
        hump2.castShadow = true;
        this.group.add(hump2);
        
        // Tête
        const headGeometry = new THREE.BoxGeometry(0.6, 0.7, 0.8);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0, 1, 1.5);
        head.castShadow = true;
        this.group.add(head);
        
        // Museau
        const snoutGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.5);
        const snout = new THREE.Mesh(snoutGeometry, bodyMaterial);
        snout.position.set(0, 0.9, 1.9);
        snout.castShadow = true;
        this.group.add(snout);
        
        // Oreilles
        const earGeometry = new THREE.ConeGeometry(0.15, 0.4, 4);
        const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
        leftEar.position.set(-0.3, 1.5, 1.5);
        leftEar.castShadow = true;
        this.group.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
        rightEar.position.set(0.3, 1.5, 1.5);
        rightEar.castShadow = true;
        this.group.add(rightEar);
        
        // Yeux
        const eyeGeometry = new THREE.SphereGeometry(0.1, 6, 6);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.2, 1.1, 1.8);
        this.group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.2, 1.1, 1.8);
        this.group.add(rightEye);
        
        // Pattes (4 pattes)
        const legGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
        const legMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color(this.color).multiplyScalar(0.8) 
        });
        
        // Positions des pattes
        const legPositions = [
            [-0.5, -0.5, 0.8],  // Avant gauche
            [0.5, -0.5, 0.8],   // Avant droite
            [-0.5, -0.5, -0.8], // Arrière gauche
            [0.5, -0.5, -0.8]   // Arrière droite
        ];
        
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            this.group.add(leg);
        });
        
        // Queue
        const tailGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.8);
        const tail = new THREE.Mesh(tailGeometry, legMaterial);
        tail.position.set(0, 0.8, -1.5);
        tail.rotation.x = -0.5;
        tail.castShadow = true;
        this.group.add(tail);
        
        // Ajouter le groupe à la scène
        this.scene.add(this.group);
        this.mesh = this.group;
        
        console.log('✅ Chameau créé !');
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    getPosition() {
        return this.group.position.clone();
    }

    setRotation(y) {
        this.group.rotation.y = y;
    }

    getRotation() {
        return this.group.rotation.y;
    }

    moveForward() {
        this.velocity.z -= this.acceleration;
        this.velocity.z = Math.max(this.velocity.z, -this.maxSpeed);
    }

    moveBackward() {
        this.velocity.z += this.acceleration * 0.5;
        this.velocity.z = Math.min(this.velocity.z, this.maxSpeed * 0.5);
    }

    turnLeft() {
        this.group.rotation.y += this.turnSpeed;
    }

    turnRight() {
        this.group.rotation.y -= this.turnSpeed;
    }

    update() {
        // Appliquer la friction
        this.velocity.multiplyScalar(this.friction);
        
        // Déplacer le chameau
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(this.group.quaternion);
        forward.multiplyScalar(this.velocity.z);
        
        this.group.position.add(forward);
        
        // Animation de rebond pendant le mouvement
        if (Math.abs(this.velocity.z) > 0.1) {
            const bounce = Math.sin(Date.now() * 0.01) * 0.1;
            this.group.position.y = 1 + bounce;
        }
    }

    remove() {
        this.scene.remove(this.group);
    }
}