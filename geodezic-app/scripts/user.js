const socket = new WebSocket('https://c71e-2a02-842b-8050-a201-ab07-a7dd-b4e9-63c8.ngrok-free.app/');

document.getElementById('sendMessageBtn').addEventListener('click', function() {
    console.log('button press');
    if ("geolocation" in navigator) {
        // Suivre la position de l'utilisateur
        const getPosition = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    socket.send(location);
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
        const intervalId = setInterval(getPosition, 1000);
    } else {
        socket.send("geolocation unsupported");
    }
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

