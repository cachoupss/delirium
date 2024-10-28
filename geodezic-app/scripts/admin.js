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
        if (data instanceof Blob) {
            console.log("message is a BLOB")
            const reader = new FileReader();
            reader.onload = function(event) {
                data = event.target.result;
            };
        }
        console.log('data being parsed = ', data);
        const location = JSON.parse(data);
        // Accéder aux champs du JSON
        if (location.latitude && location.longitude) {
            // Créer la carte et centrer sur les coordonnées
            map.setView([location.latitude, location.longitude], 13); // 13 est le niveau de zoom                     
            // Ajouter un marqueur à la position
            L.marker([location.latitude, location.longitude]).addTo(map)
                .bindPopup('Vous êtes ici!')
                .openPopup();
        } else {
            console.log('Format de message invalide');
        }
    } catch (error) {
        console.error('Erreur de parsing JSON :', error);
        console.error('Message reçu:', data); // Ajouté pour le débogage
    }
}

socket.addEventListener('message', function(event) {
    handleLocationMessage(event.data);
});
