# 🐪 TURBO CHAMEAUX.io - Client

## 📁 Structure des fichiers

```
client/
│
├── index.html              ✅ Page du lobby
├── game.html               ✅ Page du jeu 3D
│
├── css/
│   ├── lobby.css          ✅ Styles du lobby
│   └── game.css           ✅ Styles du jeu
│
├── js/
│   ├── lobby.js           ✅ Logique du lobby
│   │
│   ├── game/
│   │   ├── main.js        ✅ Point d'entrée du jeu
│   │   ├── scene.js       ✅ Configuration Three.js
│   │   ├── camel.js       ✅ Modèle 3D du chameau
│   │   ├── track.js       ✅ Circuit de course
│   │   ├── controls.js    ✅ Contrôles clavier
│   │   ├── camera.js      ✅ Caméra 3ème personne
│   │   └── network.js     ✅ Communication WebSocket
│   │
│   └── lib/
│       └── socket.io.min.js  ⏳ À télécharger
│
└── assets/
    ├── sounds/            📂 Sons du jeu (vide)
    └── textures/          📂 Textures (vide)
```

## 🚀 Installation

### 1. Télécharger Socket.IO (optionnel pour l'instant)

# Créer le dossier lib
mkdir -p client/js/lib

# Télécharger Socket.IO
curl -o client/js/lib/socket.io.min.js \
  https://cdn.socket.io/4.5.4/socket.io.min.js

### 2. Tester localement

Ouvrez simplement `client/index.html` dans votre navigateur pour tester le lobby.

**Note**: Le jeu 3D nécessite un serveur HTTP pour fonctionner correctement (à cause de Three.js et des imports de modules).

## 🎮 Fonctionnalités

### ✅ Lobby (index.html)
- Input pseudo (3-15 caractères)
- Sélecteur de couleur pour le chameau
- Sauvegarde dans localStorage
- Validation en temps réel
- Design désert animé

### ✅ Jeu 3D (game.html)
- Rendu Three.js avec chameau low poly
- Circuit ovale avec bordures rouges
- Contrôles clavier (ZQSD / Flèches)
- Caméra 3ème personne fluide
- HUD avec vitesse, position, tours
- Écran de chargement animé
- Décorations du désert (cactus, rochers)

## 🎯 Contrôles du jeu

| Touche | Action |
|--------|--------|
| ↑ / Z / W | Avancer |
| ↓ / S | Reculer |
| ← / Q / A | Tourner à gauche |
| → / D | Tourner à droite |
| Espace | Boost (à venir) |

## 🔧 Architecture technique

### Classes JavaScript

#### `Game` (main.js)
- Gère le cycle de vie du jeu
- Coordonne tous les modules
- Boucle de rendu principale

#### `GameScene` (scene.js)
- Initialise Three.js
- Configure la scène, caméra, renderer
- Gère les lumières

#### `Camel` (camel.js)
- Modèle 3D low poly
- Physique de mouvement
- Animation de rebond

#### `Track` (track.js)
- Circuit ovale
- Bordures et décorations
- Ligne de départ

#### `Controls` (controls.js)
- Gestion du clavier
- Mapping des touches
- État des inputs

#### `CameraController` (camera.js)
- Vue 3ème personne
- Interpolation fluide
- Effet de shake

#### `NetworkManager` (network.js)
- WebSocket (à activer)
- Synchronisation multijoueur
- Gestion des autres joueurs

## 🌐 Intégration serveur

Pour connecter le client au serveur Python :

1. **Dans `lobby.js`**, décommenter la section WebSocket :
// Ligne 72-76
const socket = io('http://localhost:5000');
socket.emit('join_game', playerData);
socket.on('connection_success', () => {
    window.location.href = 'game.html';
});

2. **Dans `network.js`**, décommenter les événements :
// Ligne 24: Connexion Socket.IO
this.socket = io(this.serverUrl);

// Ligne 37: Configuration des listeners
this.setupListeners();

## 📦 Dépendances

- **Three.js r128** : Chargé via CDN dans game.html
- **Socket.IO** : À charger pour le multijoueur (optionnel)

## 🐛 Debug

Ouvrir la console du navigateur (F12) pour voir :
- Logs de chargement
- Positions des joueurs
- Événements réseau
- Erreurs éventuelles

## 🎨 Personnalisation

### Changer les couleurs de la piste
// Dans track.js, ligne 31
const trackMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x8b7355  // Modifier cette valeur
});

### Ajuster la vitesse du chameau
// Dans camel.js, ligne 17-18
this.acceleration = 0.1;  // Accélération
this.maxSpeed = 2;        // Vitesse max

### Modifier la caméra
// Dans camera.js, ligne 9-11
this.distance = 12;        // Distance
this.height = 5;           // Hauteur
this.lookAheadDistance = 3; // Look ahead

## 📝 TODO

- [ ] Télécharger Socket.IO
- [ ] Connecter au serveur Python
- [ ] Ajouter des sons (collision)
- [ ] Implémenter le système de boost
- [ ] Ajouter des items sur la piste
- [ ] Système de tours/checkpoints
- [ ] Écran de fin de course
- [ ] Rejouer / Quitter

## 🆘 Support

Si vous avez des questions :
1. Vérifiez la console du navigateur (F12)
2. Assurez-vous que Three.js est bien chargé
3. Testez d'abord sans serveur (mode solo)
4. Activez le serveur Python pour le multijoueur

---

**Version**: 1.0.0  
**Statut**: ✅ Prêt pour intégration serveur  
**Testé**: Chrome, Firefox, Safari
