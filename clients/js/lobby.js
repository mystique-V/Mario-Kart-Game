// ============================================================================
// LOBBY.JS - Gestion du lobby et connexion au jeu
// ============================================================================

// Éléments DOM
const form = document.getElementById('lobbyForm');
const pseudoInput = document.getElementById('pseudo');
const colorInput = document.getElementById('camelColor');
const colorPreview = document.getElementById('colorPreview');
const playButton = document.getElementById('playButton');
const errorMessage = document.getElementById('errorMessage');

// ============================================================================
// GESTION DU COLOR PICKER
// ============================================================================

colorInput.addEventListener('input', (e) => {
    const color = e.target.value.toUpperCase();
    colorPreview.textContent = color;
    colorPreview.style.backgroundColor = color;
    
    // Ajuster la couleur du texte selon la luminosité
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    colorPreview.style.color = brightness > 128 ? '#000' : '#fff';
});

// ============================================================================
// VALIDATION EN TEMPS RÉEL
// ============================================================================

pseudoInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (value.length < 3 && value.length > 0) {
        showError('Le pseudo doit contenir au moins 3 caractères');
    } else {
        hideError();
    }
});

// ============================================================================
// FONCTIONS D'AFFICHAGE DES ERREURS
// ============================================================================

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

// ============================================================================
// SOUMISSION DU FORMULAIRE
// ============================================================================

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const pseudo = pseudoInput.value.trim();
    const color = colorInput.value;

    // Validation
    if (pseudo.length < 3) {
        showError('Le pseudo doit contenir au moins 3 caractères');
        return;
    }

    if (pseudo.length > 15) {
        showError('Le pseudo ne peut pas dépasser 15 caractères');
        return;
    }

    // Désactiver le bouton pendant la connexion
    playButton.disabled = true;
    playButton.textContent = '⏳ CONNEXION...';

    // Données du joueur
    const playerData = {
        pseudo: pseudo,
        color: color,
        timestamp: Date.now()
    };

    // Sauvegarder dans localStorage
    localStorage.setItem('camelKartPlayer', JSON.stringify(playerData));

    // Connexion au serveur
    connectToServer(playerData);
});

// ============================================================================
// CONNEXION AU SERVEUR (À IMPLÉMENTER AVEC WEBSOCKET)
// ============================================================================

function connectToServer(playerData) {
    console.log('🐪 Connexion au serveur...', playerData);
    
    // TODO: Implémenter la connexion WebSocket
    // Exemple:
    // const socket = io('http://localhost:5000');
    // socket.emit('join_game', playerData);
    // socket.on('connection_success', () => {
    //     window.location.href = 'game.html';
    // });

    // Simulation temporaire
    setTimeout(() => {
        console.log('✅ Connexion réussie!');
        alert(`Bienvenue ${playerData.pseudo} ! 🐪\nCouleur: ${playerData.color}\n\n(Redirection vers le jeu...)`);
        
        // Rediriger vers le jeu
        window.location.href = 'game.html';
    }, 1500);
}

// ============================================================================
// CHARGEMENT DES DONNÉES SAUVEGARDÉES
// ============================================================================

window.addEventListener('load', () => {
    const savedData = localStorage.getItem('camelKartPlayer');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            pseudoInput.value = data.pseudo;
            colorInput.value = data.color;
            colorPreview.textContent = data.color.toUpperCase();
            colorPreview.style.backgroundColor = data.color;
            
            // Ajuster la couleur du texte
            const r = parseInt(data.color.substr(1, 2), 16);
            const g = parseInt(data.color.substr(3, 2), 16);
            const b = parseInt(data.color.substr(5, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            colorPreview.style.color = brightness > 128 ? '#000' : '#fff';
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    }
});