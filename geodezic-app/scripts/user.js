const socket = new WebSocket('wss://delirium-s0kn.onrender.com/admin');

let locating = false;

while (locating) {
    if ("geolocation" in navigator) {
        // Suivre la position de l'utilisateur
        const getPosition = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    const locationJSON = JSON.stringify(location);
                    socket.send(locationJSON);
                    console.log('send message :', locationJSON);
                    // TEST
                    // const messages = [
                    //     JSON.stringify({ latitude: 48.8566, longitude: 2.3522 }),
                    //     JSON.stringify({ latitude: 49.8566, longitude: 3.3522 }),
                    //     JSON.stringify({ latitude: 50.8566, longitude: 4.3522 }),
                    // ];
                
                    // messages.forEach((msg, index) => {
                    //     // Attendre un court instant entre les messages (facultatif)
                    //     setTimeout(() => {
                    //         socket.send(msg);
                    //     }, index * 1000); // Envoie chaque message avec un intervalle de 1 seconde
                    // });
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
        };

        // Appeler getPosition toutes les secondes
        setInterval(getPosition, 1000);
    } else {
        socket.send("geolocation unsupported");
    }
}

document.getElementById('toggleLocating').addEventListener('click', function() {
    locating = !locating;
    console.log(locating);
});

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

