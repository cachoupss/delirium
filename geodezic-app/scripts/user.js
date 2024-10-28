document.getElementById('sendMessageBtn').addEventListener('click', function() {
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
                    
                    // Envoyer la position à l'API
                    fetch('https://cachoupss.github.io/delirium/geodezic-app/pages/admin.html', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: locationJSON
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de l\'envoi de la position');
                        }
                    })
                    .catch(error => {
                        console.error('Erreur:', error);
                    });

                    console.log('send message :', locationJSON);
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

