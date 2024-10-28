const socket = new WebSocket('wss://delirium-s0kn.onrender.com/admin0');
const map = L.map('map').setView(['45.533329', '4.55'], 13);
// Ajouter une couche de carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

    socket.addEventListener('message', function(event) {
        // Vérifiez si le message est un Blob
        if (event.target.result instanceof Blob) {
            console.log("message is a BLOB")
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const location = JSON.parse(event.target.result);
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
                    console.error('Message reçu:', event.target.result); // Ajouté pour le débogage
                }
            };
            reader.readAsText(event.data);
        } else {
            console.log("message is not a BLOB")
            const messageDiv = document.getElementById('message');
            messageDiv.innerHTML += `<p>${event.data}</p>`; // Afficher le message reçu
        }
    });