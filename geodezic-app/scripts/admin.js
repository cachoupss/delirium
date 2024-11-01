const socket = new WebSocket('wss://delirium-s0kn.onrender.com/admin');

const map = L.map('map').setView(['45.533329', '4.55'], 13);
// Ajouter une couche de carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fonction pour gérer les messages de localisation
function handleLocationMessage(data) {
    try {
        console.log('data being parsed = ', data);
        const location = JSON.parse(data);
        // Accéder aux champs du JSON
        if (location.latitude && location.longitude) {
            // Créer la carte et centrer sur les coordonnées
            map.setView([location.latitude, location.longitude], map.getZoom()); // 13 est le niveau de zoom                     
            // Supprimer les anciens marqueurs
            if (window.currentMarker) {
                map.removeLayer(window.currentMarker);
            }
            // Créer un nouveau marqueur rouge
            const redMarker = L.circleMarker([location.latitude, location.longitude], {
                color: 'red',        // Couleur du cercle
                radius: 6,           // Taille du cercle
                fillOpacity: 1       // Opacité de remplissage
            });
            // Ajouter le marqueur à la carte
            redMarker.addTo(map);
            // Stocker le marqueur actuel pour pouvoir le supprimer plus tard
            window.currentMarker = redMarker;
        } else {
            console.log('Format de message invalide');
        }
    } catch (error) {
        console.error('Erreur de parsing JSON :', error);
        console.error('Message reçu:', data); // Ajouté pour le débogage
    }
}

socket.addEventListener('message', function(event) {
    // Vérifiez si le message est un Blob
    if (event.data instanceof Blob) {
        console.log("message is a BLOB")
        const reader = new FileReader();
        reader.onload = function(e) {
            const jsonLocation = e.target.result
            console.log("jsonLocation", jsonLocation);
            handleLocationMessage(jsonLocation);
        };
        reader.readAsText(event.data);
    } else {
        console.log("message is not a BLOB")
        handleLocationMessage(event.data);
    }
});
