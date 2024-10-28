// définition d'un event source qui permet de recevoir un flux continuel d'information unidirectionnel (ici user vers admin)
const eventSource = new EventSource('https://cachoupss.github.io/delirium/geodezic-app/pages/admin.html');

// définition de la carte centrée par défaut sur Chagnon
const map = L.map('map').setView(['45.533329', '4.55'], 13);

// Ajouter une couche de carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// configuration du comportement souhaité lorsque l'event source reçoit un message (de l'user)
eventSource.onmessage = function(event) {
    // Vérifiez si le message est un Blob
    if (event.data instanceof Blob) {
        console.log("message is a BLOB")
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const location = JSON.parse(event.data);
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
                console.error('Message reçu:', event.data); // Ajouté pour le débogage
            }
        };
        reader.readAsText(event.data);
    } else {
        console.log("message is not a BLOB")
        const messageDiv = document.getElementById('message');
        messageDiv.innerHTML += `<p>${event.data}</p>`; // Afficher le message reçu
    }
};

// gestion d'erreur liée à l'event source
eventSource.onerror = function(event) {
    console.error("Erreur de connexion avec le serveur SSE");
};