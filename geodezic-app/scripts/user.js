const socket = new WebSocket('wss://delirium-s0kn.onrender.com/admin');

let locating = false;
let watchId = null;
let lastSentTime = 0;

document.getElementById('toggleLocating').addEventListener('click', function() {
    locating = !locating;
    console.log(locating);

    if (locating) {
        // Démarrer l'envoi de données de localisation
        startLocating();
    } else {
        // Arrêter l'envoi de données de localisation
        stopLocating();
    }
});

const startLocating = () => {
    console.log("Started locating");
    if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const currentTime = Date.now();
                // Vérifie si une seconde s'est écoulée depuis le dernier envoi
                if (currentTime - lastSentTime >= 1000) {
                    lastSentTime = currentTime; // Met à jour le dernier envoi

                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    const locationJSON = JSON.stringify(location);
                    socket.send(locationJSON);
                    console.log('Sent location:', locationJSON);
                }
            },
            (error) => {
                handleError(error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );
    } else {
        console.log("geolocation unsupported");
    }
};

const stopLocating = () => {
    console.log("Stopped locating");
    clearInterval(intervalId); // Arrête l'envoi de données
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

