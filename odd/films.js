const API_KEY = '299d47a625fc9b9337cf4a44ca7a4405';
const moviePoster = document.getElementById('movie-poster');
const movieTitle = document.getElementById('movie-title');
const watchlistButton = document.getElementById('favorite');
const nextButton = document.getElementById('next');
const loadingContainer = document.getElementById('loading-container');

let movies = [0]; // Contient des films
let shows = [0]; // Contient des séries
let randomSelection = Math.floor(Math.random() * 2); // Sélection aléatoire entre film et série
let watchlistShowIds = [];
let watchlistMovieIds = [];
let watchlist = []; // Stocke la liste de suivi
let useless = []; // Stocke le contenu de useless.json
let FcurrentIndex = 0; // Index pour les films
let ScurrentIndex = 0; // Index pour les séries
let sessionId = null;
let FcurrentPage = 1; // Page actuelle pour les films
let ScurrentPage = 1; // Page actuelle pour les séries
const accountId = '19422603';

// Fonction pour récupérer l'ID de session
async function getSessionId() {
    console.log('Récupération de l\'ID de session...');
    sessionId = localStorage.getItem('session_id');
    if (!sessionId) { 
        console.log('Aucun session_id trouvé, redirection vers index.html...');
        window.location.href = 'index.html'; 
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/api/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        });
        const result = await response.json();
        console.log('Résultat de la récupération de l\'ID de session:', result);
    } catch (error) {
        console.error(`Erreur de session: ${error.message}`);
        window.location.href = 'index.html';
    }
    return sessionId;
}

// Fonction pour récupérer la watchlist (films et séries)
async function fetchWatchlist() {
    console.log('Récupération de la watchlist...');
    try {
        const response = await fetch('http://127.0.0.1:3000/api/favoris');
        if (!response.ok) { 
            console.log('Erreur lors de la récupération de la watchlist, redirection vers index.html...');
            window.location.href = 'index.html'; 
        }

        const favorisData = await response.json();
        favorisData.forEach(item => {
            watchlist.push(item);
            if (item.media_type === 'movie') watchlistMovieIds.push(item.id);
            else if (item.media_type === 'tv') watchlistShowIds.push(item.id);
        });
        console.log('Watchlist récupérée:', watchlist);
    } catch (error) {
        console.error(`Erreur de watchlist: ${error.message}`);
        window.location.href = 'index.html';
    }
}

// Fonction pour récupérer le contenu de useless.json
async function fetchUseless() {
    console.log('Récupération du contenu de useless.json...');
    try {
        const response = await fetch('http://127.0.0.1:3000/api/useless');
        if (!response.ok) { 
            console.log('Erreur lors de la récupération de useless, redirection vers index.html...');
            window.location.href = 'index.html'; 
        }
        useless = await response.json();
        console.log('Contenu de useless.json récupéré:', useless);
    } catch (error) {
        console.error(`Erreur de useless: ${error.message}`);
        window.location.href = 'index.html';
    }
}

// Fonction combinée pour charger films et séries
async function loadMoviesAndShows() {
    console.log('Chargement des films et des séries...');
    try {
        await Promise.all([fetchMovies(), fetchShows()]);
    } catch (error) {
        console.error(`Erreur de chargement: ${error.message}`);
        window.location.href = 'index.html';
    } finally {
        loadingContainer.style.display = 'none';
        moviePoster.classList.remove('hidden');
        next();
    }
}

// Fonction pour récupérer et afficher les films
async function fetchMovies() {
    console.log('Récupération des films...');
    try {
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${FcurrentPage}&language=fr-FR&region=FR&sort_by=popularity.desc`);
        const movieData = await movieResponse.json();
        
        // Filtrer les films déjà dans watchlist et useless
        movies.push(...movieData.results.filter(movie => !watchlistMovieIds.includes(movie.id) && !useless.some(u => u.id === movie.id)));

        console.log('Films récupérés:', movieData.results);
        
        // Charger plus de films si nécessaire
        if (movies.length < 20) {
            FcurrentPage++;
            console.log(`Chargement de plus de films, page actuelle: ${FcurrentPage}`);
            await fetchMovies();
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des films: ${error.message}`);
        window.location.href = 'index.html';
    }
}

// Fonction pour récupérer et afficher les séries
async function fetchShows() {
    console.log('Récupération des séries...');
    try {
        const showResponse = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${ScurrentPage}&language=fr-FR&region=FR&sort_by=popularity.desc`);
        const showData = await showResponse.json();
        
        // Filtrer les séries déjà dans watchlist et useless
        shows.push(...showData.results.filter(show => !watchlistShowIds.includes(show.id) && !useless.some(u => u.id === show.id)));

        console.log('Séries récupérées:', showData.results);
        
        // Charger plus de séries si nécessaire
        if (shows.length < 20) {
            ScurrentPage++;
            console.log(`Chargement de plus de séries, page actuelle: ${ScurrentPage}`);
            await fetchShows();
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des séries: ${error.message}`);
        window.location.href = 'index.html';
    }
}

// Fonction pour afficher le média actuel
function displayMedia() {
    let media = randomSelection === 0 ? movies[FcurrentIndex] : shows[ScurrentIndex];

    if (media) {
        const posterPath = media.poster_path ? `https://image.tmdb.org/t/p/w500/${media.poster_path}` : 'default_poster_path.jpg';
        moviePoster.src = posterPath;
        movieTitle.textContent = media.title || media.name;
        console.log(`Affichage du média: ${media.title || media.name}`);
    } else {
        movieTitle.textContent = 'Aucun média à afficher.';
        moviePoster.src = '';
        console.log('Aucun média à afficher.');
    }
}

// Fonction pour passer au média suivant
async function next() {
    console.log('Passage au média suivant...');
    randomSelection = Math.floor(Math.random() * 2); 
    if (randomSelection === 0 && movies.length > 0) {
        movies.splice(FcurrentIndex, 1); 
        FcurrentIndex = Math.min(FcurrentIndex, movies.length - 1);
        console.log('Film actuel supprimé, nouvel index:', FcurrentIndex);
    } else if (shows.length > 0) {
        shows.splice(ScurrentIndex, 1); 
        ScurrentIndex = Math.min(ScurrentIndex, shows.length - 1);
        console.log('Série actuelle supprimée, nouvel index:', ScurrentIndex);
    }

    // Récupérer plus de films/séries si nécessaire
    if (movies.length < 20 || shows.length < 20) {
        console.log('Chargement de films ou séries supplémentaires...');
        await Promise.all([fetchMovies(), fetchShows()]);
    }

    displayMedia(); 
}

// Fonction pour ajouter des éléments à useless.json
async function addToUseless(entry) {
    console.log('Ajout à useless.json:', entry);
    try {
        useless.push(entry); 
        await fetch('http://127.0.0.1:3000/api/useless', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });
        console.log('Élément ajouté à useless.json avec succès.');
    } catch (error) {
        console.error(`Erreur ajout à useless: ${error.message}`);
        window.location.href = 'index.html';
    }
}

// Fonction pour ajouter un média à la liste de suivi
async function addToWatchlist() {
    console.log('Ajout d\'un média à la watchlist...');
    let media;
    let type;

    // Vérification de la sélection aléatoire pour déterminer le média
    if (randomSelection === 0) {
        if (!sessionId || !movies[FcurrentIndex]) return;
        media = movies[FcurrentIndex]; // Prend le film actuel
        type = "movie";
    } else {
        if (!sessionId || !shows[ScurrentIndex]) return;
        media = shows[ScurrentIndex]; // Prend l'émission actuelle
        type = "tv";
    }

    // Vérifie si le média n'est pas déjà dans la watchlist
    if (!watchlist.some(item => item.id === media.id && item.media_type === type)) {
        watchlist.push({ ...media, media_type: type }); // Ajoute le média entier à la watchlist
    }

    // Prépare l'entrée à envoyer
    const entry = { media_type: type, media: media };

    try {
        // Appel à l'API pour ajouter à favoris
        const response = await fetch('http://127.0.0.1:3000/api/favoris', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry) // Envoie seulement type et id
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout à la watchlist.');
        }

        // Affiche l'élément ajouté dans la console
        console.log('Média ajouté à la watchlist:', media);

        next();
    } catch (error) {
        console.error(error.message);
        window.location.href = 'index.html';
    }
}

// Fonction pour passer au média suivant et l'ajouter à useless
async function suiv() {
    const currentMedia = movies[FcurrentIndex] || shows[ScurrentIndex];
    console.log('Passage au média suivant et ajout à useless:', currentMedia);
    if (currentMedia) {
        await addToUseless(currentMedia);
    }
    next();
}

// Gestion des événements pour les boutons "Favoris" et "Suivant"
watchlistButton.addEventListener('click', () => {
    console.log('Bouton "Favoris" cliqué.');
    addToWatchlist();
});
nextButton.addEventListener('click', () => {
    console.log('Bouton "Suivant" cliqué.');
    suiv();
});

// Fonction principale pour initialiser l'application
async function init() {
    console.log('Initialisation de l\'application...');
    sessionId = await getSessionId();
    await fetchWatchlist();
    await fetchUseless();
    loadMoviesAndShows();

    // Gestion des touches fléchées pour naviguer
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            console.log('Touche fléchée droite pressée.');
            suiv();
        } else if (event.key === 'ArrowLeft') {
            console.log('Touche fléchée gauche pressée.');
            addToWatchlist();
        }
    });
}

// Initialisation de l'application
init();
