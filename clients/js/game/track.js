// ============================================================================
// TRACK.JS - Circuit de course (Low Poly)
// ============================================================================

class Track {
    constructor(scene) {
        this.scene = scene;
        this.trackMesh = null;
    }

    create() {
        console.log('🏁 Création de la piste...');
        
        // Sol du désert (sable)
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xf4a460,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Piste ovale
        this.createOvalTrack();
        
        // Décorations du désert
        this.createDesertDecorations();
        
        // Ligne de départ/arrivée
        this.createStartLine();
        
        console.log('✅ Piste créée !');
    }

    createOvalTrack() {
        // Paramètres de la piste
        const trackWidth = 10;
        const radiusX = 30;
        const radiusZ = 50;
        const segments = 64;
        
        // Créer le chemin de la piste
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radiusX;
            const z = Math.sin(angle) * radiusZ;
            points.push(new THREE.Vector2(x, z));
        }
        
        // Créer la forme de la piste
        const trackShape = new THREE.Shape();
        points.forEach((point, i) => {
            if (i === 0) {
                trackShape.moveTo(point.x, point.y);
            } else {
                trackShape.lineTo(point.x, point.y);
            }
        });
        
        // Géométrie de la piste
        const trackGeometry = new THREE.ShapeGeometry(trackShape);
        const trackMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8b7355,
            side: THREE.DoubleSide
        });
        
        const track = new THREE.Mesh(trackGeometry, trackMaterial);
        track.rotation.x = -Math.PI / 2;
        track.position.y = 0.05;
        track.receiveShadow = true;
        this.scene.add(track);
        
        // Bordures de la piste
        this.createTrackBorders(radiusX, radiusZ, segments, trackWidth);
    }

    createTrackBorders(radiusX, radiusZ, segments, trackWidth) {
        const borderMaterial = new THREE.MeshLambertMaterial({ color: 0xdc143c });
        const borderHeight = 0.5;
        const borderGeometry = new THREE.BoxGeometry(1, borderHeight, 1);
        
        // Bordure extérieure
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * (radiusX + trackWidth / 2);
            const z = Math.sin(angle) * (radiusZ + trackWidth / 2);
            
            const border = new THREE.Mesh(borderGeometry, borderMaterial);
            border.position.set(x, borderHeight / 2, z);
            border.castShadow = true;
            border.receiveShadow = true;
            this.scene.add(border);
        }
        
        // Bordure intérieure
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * (radiusX - trackWidth / 2);
            const z = Math.sin(angle) * (radiusZ - trackWidth / 2);
            
            const border = new THREE.Mesh(borderGeometry, borderMaterial);
            border.position.set(x, borderHeight / 2, z);
            border.castShadow = true;
            border.receiveShadow = true;
            this.scene.add(border);
        }
    }

    createStartLine() {
        // Ligne de départ (damier noir et blanc)
        const lineWidth = 10;
        const lineDepth = 2;
        const squares = 10;
        
        for (let i = 0; i < squares; i++) {
            const color = i % 2 === 0 ? 0xffffff : 0x000000;
            const squareGeometry = new THREE.BoxGeometry(
                lineWidth / squares, 
                0.1, 
                lineDepth
            );
            const squareMaterial = new THREE.MeshBasicMaterial({ color });
            const square = new THREE.Mesh(squareGeometry, squareMaterial);
            
            square.position.set(
                -lineWidth / 2 + (i * lineWidth / squares) + (lineWidth / squares / 2),
                0.06,
                0
            );
            
            this.scene.add(square);
        }
        
        // Portique de départ
        this.createStartGate();
    }

    createStartGate() {
        const gateMaterial = new THREE.MeshLambertMaterial({ color: 0xff6347 });
        
        // Pilier gauche
        const pillarGeometry = new THREE.BoxGeometry(0.5, 4, 0.5);
        const leftPillar = new THREE.Mesh(pillarGeometry, gateMaterial);
        leftPillar.position.set(-6, 2, 0);
        leftPillar.castShadow = true;
        this.scene.add(leftPillar);
        
        // Pilier droit
        const rightPillar = new THREE.Mesh(pillarGeometry, gateMaterial);
        rightPillar.position.set(6, 2, 0);
        rightPillar.castShadow = true;
        this.scene.add(rightPillar);
        
        // Barre horizontale
        const barGeometry = new THREE.BoxGeometry(13, 0.5, 0.5);
        const bar = new THREE.Mesh(barGeometry, gateMaterial);
        bar.position.set(0, 4, 0);
        bar.castShadow = true;
        this.scene.add(bar);
        
        // Panneau "START"
        const panelGeometry = new THREE.BoxGeometry(8, 1.5, 0.2);
        const panelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(0, 3.5, 0);
        this.scene.add(panel);
    }

    createDesertDecorations() {
        // Cactus aléatoires autour de la piste
        const cactusMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
        
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 40;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            // Corps du cactus
            const cactusHeight = 2 + Math.random() * 2;
            const cactusGeometry = new THREE.BoxGeometry(0.5, cactusHeight, 0.5);
            const cactus = new THREE.Mesh(cactusGeometry, cactusMaterial);
            cactus.position.set(x, cactusHeight / 2, z);
            cactus.castShadow = true;
            this.scene.add(cactus);
            
            // Bras du cactus
            if (Math.random() > 0.5) {
                const armGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.4);
                const arm = new THREE.Mesh(armGeometry, cactusMaterial);
                arm.position.set(x, cactusHeight * 0.7, z);
                arm.castShadow = true;
                this.scene.add(arm);
            }
        }
        
        // Rochers
        const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
        
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 55 + Math.random() * 35;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            const rockSize = 1 + Math.random() * 2;
            const rockGeometry = new THREE.SphereGeometry(rockSize, 6, 6);
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.position.set(x, rockSize * 0.5, z);
            rock.scale.set(1, 0.6, 1);
            rock.castShadow = true;
            rock.receiveShadow = true;
            this.scene.add(rock);
        }
    }
}