// Importation du module http
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Création du serveur
const server = http.createServer((req, res) => {
    // Définir l'en-tête de réponse
    console.log(`requête URL = ${req.url}`);
    let filePath;
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const message = urlParams.get('message');

    if (req.url.startsWith('/admin')) {
        console.log(`Page Admin`);
        filePath = path.join(__dirname, 'pages', 'admin.html');
    } else if (req.url === "/user") {
        console.log(`Page user`);
        filePath = path.join(__dirname, 'pages', 'user.html');
    } else if (req.url.startsWith('/styles/')) { // **Gestion de tous les fichiers dans le répertoire styles/**
        filePath = path.join(__dirname, 'styles', req.url.split('/')[2]); // **Récupère le nom du fichier**
        res.writeHead(200, { 'Content-Type': 'text/css' }); 
    } else if (req.url.startsWith('/scripts/')) { // **Gérer les fichiers JS**
        filePath = path.join(__dirname, 'scripts', req.url.split('/')[2]);
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
    } else {
        console.log(`Page non trouvee`);
        filePath = path.join(__dirname, 'pages', 'notfound.html');
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erreur interne du serveur');
            return;
        }

        if (filePath.endsWith('.html')) {
            res.writeHead(200, { 'Content-Type': 'text/html' }); // **Type MIME pour HTML**
        }

        // Si un message est présent, l'injecter dans la page HTML
        if (message) {
            data = data.replace('<!-- MESSAGE_PLACEHOLDER -->', message);
        } else {
            data = data.replace('<!-- MESSAGE_PLACEHOLDER -->', 'Aucun message reçu.');
        }
        
        res.end(data); // Envoyer le contenu du fichier HTML
    });
});

// Création du serveur WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Un client s\'est connecté');

    ws.on('message', (message) => {
        console.log(`Message reçu: ${message}`);
        // Diffuser le message à tous les clients connectés
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

// Définir le port sur lequel le serveur écoutera
const PORT = 3000;

// Lancer le serveur
server.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
