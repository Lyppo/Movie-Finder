console.groupCollapsed("🟢 Initialisation..."); // Message de débogage
load(); // Charge les cookies
setupUI(); // Initialise l'interface utilisateur
setupTest(); // Initialise les tests
verifyLoginStatus(); // Vérifie l'état de connexion
console.log("🟢 Initialisation terminée."); // Message de débogage
console.groupEnd(); // Fin du groupe de logs