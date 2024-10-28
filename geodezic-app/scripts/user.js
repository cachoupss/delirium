const socket = new WebSocket('wss://delirium-s0kn.onrender.com/admin');

let locating = false;
let watchId = null;

document.getElementById('toggleLocating').addEventListener('click', function() {
    locating = !locating;
    console.log(locating);

    if (locating) {
        // Démarrer la surveillance de la localisation
        startLocating();
    } else {
        // Arrêter la surveillance de la localisation
        stopLocating();
    }
});

const startLocating = () => {
    console.log("Started locating");
    if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                const locationJSON = JSON.stringify(location);
                socket.send(locationJSON);
                console.log('Sent location:', locationJSON);
            },
            (error) => {
                handleError(error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000, // Autoriser les données jusqu'à 10 secondes
                timeout: 5000
            }
        );
    } else {
        console.log("geolocation unsupported");
    }
};

const stopLocating = () => {
    console.log("Stopped locating");
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId); // Arrête la surveillance de la position
        watchId = null; // Réinitialise l'ID de surveillance
    }
};



const handleError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error("Permission de géolocalisation refusée.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("Position non disponible.");
            break;
        case error.TIMEOUT:
            console.error("Demande de position expirée.");
            break;
        case error.UNKNOWN_ERROR:
            console.error("Erreur inconnue.");
            break;
    }
}

