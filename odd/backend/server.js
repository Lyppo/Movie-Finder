import fs from 'fs/promises';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Importation de fetch pour Node.js

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const API_KEY = '299d47a625fc9b9337cf4a44ca7a4405'; // Remplacez par votre clé API
const ACCOUNT_ID = '19422603'; // Remplacez par votre account_id
let sessionId = null; // Remplacez par votre session_id

let uselessData = []; // Variable pour stocker le contenu de useless.json
let favoris = []; // Variable pour stocker le contenu de favoris.json

// Promesse qui sera résolue une fois que sessionId est défini
let sessionPromiseResolve;
const sessionPromise = new Promise((resolve) => {
    sessionPromiseResolve = resolve; // Résoudre la promesse lorsque sessionId est reçu
});

// Route pour recevoir le session_id
app.post('/api/test', (req, res) => {
    const { session_id } = req.body;
    
    if (!sessionId) { // Vérifier si sessionId est déjà défini
        sessionId = session_id;
        sessionPromiseResolve();
        console.log(`Session ID reçu avec succès : ${sessionId}`);
        
        // Retourne un message pour indiquer l'initialisation de sessionId
        res.status(200).json({ 
            message: `Session ID initialisé avec succès : ${sessionId}`,
            status: 'initialisation'
        });
    } else {
        // Retourne un message pour indiquer que le sessionId est déjà défini
        console.log(`Session ID déjà défini, renvoi de sessionId : ${sessionId}`);
        
        res.status(200).json({ 
            message: `Session ID envoyé avec succès : ${sessionId}`,
            status: 'envoi'
        });
    }
});

// Fonction pour charger les données de useless.json au démarrage
async function loadData() {
    try {
        const useless = await fs.readFile('useless.json', 'utf8');
        uselessData = JSON.parse(useless);
        console.log('Données useless.json chargées avec succès:', uselessData.length);
    } catch (error) {
        uselessData = [];
        await fs.writeFile('useless.json', JSON.stringify(uselessData));
        console.log('useless.json créé car il était absent.');
    }
}

// Route pour récupérer le contenu de useless.json
app.get('/api/useless', (req, res) => {
    console.log('Contenu de useless.json récupéré:', uselessData.length);
    res.json(uselessData);
});

// Route pour récupérer le contenu de favoris.json
app.get('/api/favoris', (req, res) => {
    console.log('Contenu de favoris.json récupéré:', favoris.length);
    res.json(favoris);
});

// Fonction pour récupérer la watchlist
async function fetchWatchlist() {
    await sessionPromise; // Attendre que sessionId soit défini via la requête POST (attente indéfinie)
    let page = 1;
    favoris = []; // Réinitialiser favoris à chaque récupération

    try {
        while (true) {
            const [movieResponse, showResponse] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/account/${ACCOUNT_ID}/watchlist/movies?language=fr-FR&api_key=${API_KEY}&session_id=${sessionId}&page=${page}`),
                fetch(`https://api.themoviedb.org/3/account/${ACCOUNT_ID}/watchlist/tv?language=fr-FR&api_key=${API_KEY}&session_id=${sessionId}&page=${page}`)
            ]);

            const [movieData, showData] = await Promise.all([movieResponse.json(), showResponse.json()]);

            favoris.push(...movieData.results, ...showData.results);

            if (page >= movieData.total_pages && page >= showData.total_pages) break;
            page++;
        }
        
        console.log(`Données de des page 1-${page} ajoutées aux favoris avec succès.`);

        await fs.writeFile('favoris.json', JSON.stringify(favoris));
        console.log('Watchlist enregistrée avec succès dans favoris.json');
    } catch (error) {
        console.error('Erreur lors de la récupération de la watchlist:', error.message);
    }
}

// Route pour ajouter un nouvel élément à favoris.json
app.post('/api/favoris', async (req, res) => {
    console.log('Données reçues pour favoris:', req.body); // Log des données reçues

    const newElement = req.body;

    // Vérification des données reçues
    if (!newElement || !newElement.media_type || !newElement.media) {
        console.error('Erreur : Le nouvel élément ne contient pas media_type ou media.');
        return res.status(400).json({ error: 'Le nouvel élément doit contenir media_type et media.' });
    }

    // Ajout de l'élément à la liste des favoris
    favoris.push(newElement);
    
    try {
        await fs.writeFile('favoris.json', JSON.stringify(favoris)); // Écriture dans le fichier
        console.log('Nouvel élément ajouté à favoris.json:', newElement);
        
        // Construction de l'URL pour l'ajout à la watchlist TMDB
        const url = `https://api.themoviedb.org/3/account/${ACCOUNT_ID}/watchlist?api_key=${API_KEY}&session_id=${sessionId}`;
        const body = { media_type: newElement.media_type, media_id: newElement.media.id, watchlist: true };

        // Envoi des données à TMDB
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Erreur lors de l'ajout à la watchlist: ${errorResponse.status_message}`);
        }

        console.log(`Élément ajouté à la watchlist TMDB avec succès : ${JSON.stringify(newElement)}`);
        res.status(201).json({ message: 'Élément ajouté à la watchlist avec succès.' });
    } catch (error) {
        console.error(`Erreur lors de l'ajout à la watchlist TMDB : ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Route pour ajouter un nouvel élément à useless.json
app.post('/api/useless', async (req, res) => {
    const newElement = req.body;

    if (!newElement || !newElement.id || !newElement.name) {
        console.error('Erreur : Le nouvel élément ne contient pas id ou name.');
        return res.status(400).json({ error: 'Le nouvel élément doit contenir id et name.' });
    }

    // Ajout de l'élément aux données inutiles
    uselessData.push(newElement);
    await fs.writeFile('useless.json', JSON.stringify(uselessData));
    console.log('Nouvel élément ajouté à useless.json:', newElement);

    res.status(201).json({ message: 'Élément ajouté à useless.json avec succès.' });
});

// Démarrer le serveur et charger les données
loadData().then(() => {
    app.listen(PORT, () => {
        console.log(`Serveur en cours d'exécution sur http://127.0.0.1:${PORT}`);
        fetchWatchlist();
    });
});