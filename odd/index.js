const API_KEY = '299d47a625fc9b9337cf4a44ca7a4405';

// Fonction pour récupérer le token de demande et rediriger vers l'URL d'autorisation
async function authenticate() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du token');
        }

        const { request_token } = await response.json();
        const authUrl = `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=http://127.0.0.1:5500/films.html`;
        window.location.href = authUrl;
    } catch (error) {
        console.error('Erreur:', error.message);
    }
}

// Écouteur d'événements pour le bouton de connexion
document.getElementById('connect-button').addEventListener('click', authenticate);